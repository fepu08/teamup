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

// @route   POST api/teams/
// @desc    Create team
// @access  Private
router.post('/',
    [
        auth,
        [
            check('name', 'Name is required').not().isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        try {
            const owner = await User.findById(req.user.id).select('-password');
            const ownerProfile = await Profile.findOne({user: req.user.id});
            let team = await Team.findOne({name: req.body.name});
            if(team){
                return res.status(400).json({ errors: [{ msg: 'Team already exists with this name' }] });
            }
            team = new Team({
                name: req.body.name,
                owners: {user: owner},
                admins: {user: owner},
                members: {user: owner}
            });
            await team.save();
            ownerProfile.teams.unshift({team_id: team.id, name: req.body.name});
            await ownerProfile.save();
            res.json(team.id);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

module.exports = router;