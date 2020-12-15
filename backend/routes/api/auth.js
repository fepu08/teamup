const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');

// @route   GET api/auth
// @desc    Test route
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

module.exports = router;