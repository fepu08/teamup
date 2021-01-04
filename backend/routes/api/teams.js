const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Team = require('../../models/Team');
const { check, validationResult } = require('express-validator');

// @route   GET api/teams/
// @desc    Get all teams
// @access  Public
router.get('/', async (request, response) => {
    try {
        const teams = await Team.find();
        response.json(teams);
    } catch (err) {
        console.error(err.message);
        response.status(500).send('Server Error');
    }
})

module.exports = router;