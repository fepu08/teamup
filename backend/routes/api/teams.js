const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Team = require('../../models/Team');
const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const { check, validationResult } = require('express-validator');

// @route   GET api/teams/
// @desc    Get all teams
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const teams = await Team.find();
        res.json(teams);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route   GET api/teams/:team_id
// @desc    Get team by team ID
// @access  Private
router.get('/:team_id', auth, async (req, res) => {
    try {
        const team = await Team.findById(req.params.team_id);
        if(!team) return res.status(400).json({ msg: 'Team not found'});
        res.json(team);
    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found'});
        }
        res.status(500).send('Server Error');
    }
})

module.exports = router;