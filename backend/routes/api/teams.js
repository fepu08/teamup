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
        if(err.kind === 'ObjectId') {
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


// @route   DELETE api/teams/:team_id
// @desc    Delete team
// @access  Private
router.delete('/:team_id', auth, async (req, res) => {
        try {
            const team = await Team.findById(req.params.team_id);
            if(!team){
                return res.status(400).json({ error: { msg: 'Team does not exist with this ID' } });
            }

            if (!isOwner(req, team)) {
                return res.status(400).json({error: {msg: 'Only one of the team owners can delete the team'}});
            }

            //TODO: delete from everywhere inside Profile.teams
            //TODO: delete every post
            const posts = await Post.deleteMany({team: req.params.team_id});


            await team.remove();
            res.json({msg: 'Team removed'});
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);


// @route   PUT api/teams/posts/add/:team_id/:post_id
// @desc    Add post to team
// @access  Private
router.put('/posts/add/:team_id/:post_id', auth, async (req, res) => {
    try {
        const team = await Team.findById(req.params.team_id);
        const post = await Post.findById(req.params.post_id);

        const checkResult = canUserAddThisPost(req, team, post)
        if(checkResult) {
            return res.status(400).send(checkResult);
        }

        team.posts.unshift({post: req.params.post_id});
        post.team = req.params.team_id;
        await post.save();
        await team.save();

        res.json(team.posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



function canUserAddThisPost(req, team, post){
    if (!isTeamMember(req,team)) return "This user is not a member of this team.";
    if (postIsAlreadyAdded(req, team)) return "Post is already added to this team";
    if(!(isLoggedInUserAdmin(req, team)) && !(postFromLoggedInUser(req, post))){
        return "To add this post, you should be admin and/or the author of the post";
    }
}

function canUserDeleteThisPost(req, team, post) {
    if (!isTeamMember(req,team)) return "This user is not a member of this team.";
    if (!postIsAlreadyAdded(req, team)) return "Post not found with this ID";
    if(!(isLoggedInUserAdmin(req, team)) && !(postFromLoggedInUser(req, post))){
        return "To remove this post, you should be admin and/or the author of the post";
    }
}

function postIsAlreadyAdded(req, team) {
    return team.posts.filter(post => post.post.toString() === req.params.post_id).length > 0;
}

function isLoggedInUserAdmin(req, team){
    return team.admins.filter(admin => admin.user.toString() === req.user.id).length > 0;
}

function isAdmin(team, user){
    return team.admins.filter(admin => admin.user.toString() === user.id).length > 0;
}

function postFromLoggedInUser(req, post){
    return post.user.id === req.user.id;
}

function isTeamMember(req, team){
    return team.members.filter(member => member.user.toString() === req.user.id).length > 0;
}

function isOwner(req, team){
    return team.owners.filter(owner => owner.user.toString() === req.user.id).length > 0;
}

module.exports = router;