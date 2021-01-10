const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post('/', [
  check('first_name', 'Name is required').not().isEmpty(),
  check('last_name', 'Name is required').not().isEmpty(),
  check('email', 'Please enter a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({min: 6})
], 
async (request, response) => {
  const errors = validationResult(request);
  if(!errors.isEmpty()){
    return response.status(400).json({errors: errors.array()});
  }
  
  const {first_name, last_name, email, password} = request.body;
  try {
    // See if user exists
    let user = await User.findOne({ email });
    if(user){
      return response.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }
    // Get users gravatar
    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: "mm"
    });

    user = new User({
      name: {
        first_name,
        last_name,
      },
      email,
      avatar,
      password
    });
    // Encrypt password using bcrypt
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save(); // save user in db
    
    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(
      payload, 
      config.get('jwtSecret'),
      {expiresIn: 3600},
      (err, token) => {
        if(err) throw err;
        response.json({token});
      }
    );
  } catch (err) {
    console.error(err.message);
    response.status(500).send('Server error');
  }
});

module.exports = router;