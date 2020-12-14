const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// @route   GET api/users
// @desc    Register user
// @access  Public
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please enter a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({min: 6})
], (request, response) => {
  const errors = validationResult(request);
  if(!errors.isEmpty()){
    return response.status(400).json({errors: errors.array()});
  }
  response.send('User route');

});

module.exports = router;