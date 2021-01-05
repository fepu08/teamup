const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route   GET api/auth
// @desc    Get user by token
// @access  Public
// By adding auth as second parameter as a request method, make that route protected
router.get('/', auth, async (request, response) => {
  try{
    const user = await User.findById(request.user.id).select('-password');
    response.json(user);
  } catch(err) {
    console.error(err.message);
    response.status(500).send('Server Error');
  } 
});

// @route   POST api/auth
// @desc    Authenticate user and get token
// @access  Public
router.post('/', [
  check('email', 'Please enter a valid email').isEmail(),
  check('password', 'Password is required').exists()
], 
async (request, response) => {
  const errors = validationResult(request);
  if(!errors.isEmpty()){
    return response.status(400).json({errors: errors.array()});
  }
  
  const {email, password} = request.body;
  try {
    // See if user exists
    let user = await User.findOne({email});
    if(!user){
      return response.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return response.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

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