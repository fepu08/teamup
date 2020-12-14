const express = require('express');
const router = express.Router();

// @route   GET api/teams
// @desc    Test route
// @access  Public
router.get('/', (request, response) => response.send('Teams route'));

module.exports = router;