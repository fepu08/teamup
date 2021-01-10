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
                owners: {user: owner.id},
                admins: {user: owner.id},
                members: {user: owner.id}
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
            //team.members.map(async (member) => {
            //    const profile = await Profile.findById(member.id);
            //    const removeIndex = profile.teams.map(team => team.team_id).indexOf(team.id);
            //    profile.teams.splice(removeIndex, 1);
            //    await profile.save();
            //});

            // Remove posts contained by team
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

        if(!team) {
            return res.status(404).json({msg: "Team not found"});
        }
        if(!post) {
            return res.status(404).json({msg: "Post not found"});
        }

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


// @route   PUT api/teams/posts/remove/:team_id/:post_id
// @desc    Remove post from team
// @access  Private
router.put('/posts/remove/:team_id/:post_id', auth, async (req, res) => {
    try {
        const team = await Team.findById(req.params.team_id);
        const post = await Post.findById(req.params.post_id);

        const checkResult = canUserDeleteThisPost(req, team, post);
        if(checkResult) {
            return res.status(400).send(checkResult);
        }

        const removeIndex = team.posts.map(post => post.post.toString()).indexOf(post.id);
        team.posts.splice(removeIndex, 1);
        await Post.findByIdAndDelete(req.params.post_id);
        await team.save();
        res.json(team.posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   PUT api/teams/members/add/:team_id/:user_id
// @desc    Add member
// @access  Private
router.put('/member/add/:team_id/:user_id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.user_id).select('-password');
        const team = await Team.findById(req.params.team_id);
        const profile = await Profile.findOne({user: req.params.user_id});

        if(!user) {
            return res.status(404).json({msg: "User does not exist with this ID"});
        }
        if(!team) {
            return res.status(404).json({msg: "Team does not exist with this ID"});
        }
        if(!profile) {
            return res.status(404).json({msg: "This user has no profile"});
        }


        if(!isLoggedInUserAdmin(req, team)) {
            return res.status(403).json({msg: "Access denied"});
        }

        if(isUserTeamMember(team, user)){
            return res.status(400).json({msg: "User is already member"});
        }

        team.members.push({user: user.id});
        await team.save();

        // add team to user's profile
        profile.teams.unshift({team_id: team.id, name: team.name});
        await profile.save();

        return res.status(200).send(team.members);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   PUT api/teams/members/remove/:team_id/:user_id
// @desc    Remove member
// @access  Private
router.put('/members/remove/:team_id/:user_id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.user_id).select('-password');
        const team = await Team.findById(req.params.team_id);
        const profile = await Profile.findOne({user: req.params.user_id});

        if(!user) {
            return res.status(404).json({msg: "User does not exist with this ID"});
        }
        if(!team) {
            return res.status(404).json({msg: "Team does not exist with this ID"});
        }
        if(!profile) {
            return res.status(404).json({msg: "This user has no profile"});
        }

        if(isUserOwner(team, user) && !isLoggedInUserOwner(req, team)){
            return res.status(403).json({msg: "Access denied"});
        }

        const loggedInIsAdmin = isLoggedInUserAdmin(req, team);
        if(!loggedInIsAdmin && user.id !== req.user.id) {
            return res.status(403).json({msg: "Access denied"});
        }

        if(!isUserTeamMember(team, user)){
            return res.status(400).json({msg: "User is not member of this team"});
        }

        // remove team from members profile
        let removeIndex = team.members.map(member => member.id).indexOf(user.id);
        team.members.splice(removeIndex, 1);
        await team.save();

        // remove team from user's profile
        removeIndex = profile.teams.map(team => team.team_id).indexOf(team.id);
        profile.teams.splice(removeIndex, 1);
        await profile.save();

        if(loggedInIsAdmin) {
            return res.status(200).json(team.members);
        }
        return res.status(200).send("User Removed Successfully");
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET api/teams/members/:team_id/:user_id
// @desc    Get member by user_id
// @access  Private
router.get('/members/:team_id/user_id', auth, async (req, res) => {
    try {
        const team = await Team.findById(req.params.team_id);
        const user = await User.findById(req.params.user_id).select('-password');

        if(!team) return res.status(404).json({ msg: 'Team not found'});
        if(!user) return res.status(404).json({ msg: 'User not found'});

        if(!isUserTeamMember(team, user)) return res.status(404).json({msg: 'User is not team member'});

        res.status(200).json({member: user});
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found'});
        }
        res.status(500).send('Server Error');
    }
})


// @route   GET api/teams/members/:team_id/
// @desc    Get members
// @access  Private
router.get('/members/:team_id/', auth, async (req, res) => {
    try {
        const team = await Team.findById(req.params.team_id);

        if(!team) return res.status(404).json({ msg: 'Team not found'});

        const members = [];
        for(let i = 0; i < team.members.length; i++){
            const user = await User.findById(team.members[i].user).select('-password');
            //if(user) members.push(user);
            if(user) {
                const profile = await Profile.findOne({user: user.id.toString()});
                if(!profile) return res.status(404).json({ msg: 'Profile not found'});
                members.push(profile);
            }
        }

        res.status(200).json({members: members});
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found'});
        }
        res.status(500).send('Server Error');
    }
})


// @route   PUT api/teams/admins/add/:team_id/:user_id
// @desc    Add admin
// @access  Private
router.put('/admins/add/:team_id/:user_id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.user_id).select('-password');
        const team = await Team.findById(req.params.team_id);

        if(!user) {
            return res.status(404).json({msg: "User does not exist with this ID"});
        }
        if(!team) {
            return res.status(404).json({msg: "Team does not exist with this ID"});
        }

        if(!isLoggedInUserAdmin(req, team)) {
            return res.status(403).json({msg: "Access denied"});
        }
        if(!isUserTeamMember(team, user)){
            return res.status(400).json({msg: "User must be a team member first!"});
        }
        if(isUserAdmin(team, user)){
            return res.status(400).json({msg: "User is already admin."});
        }

        team.admins.push({user: user.id});
        await team.save();
        return res.status(200).send(team.admins);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/teams/admins/remove/:team_id/:user_id
// @desc    Remove admin
// @access  Private
router.put('/admins/remove/:team_id/:user_id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.user_id).select('-password');
        const team = await Team.findById(req.params.team_id);

        if(!user) {
            return res.status(404).json({msg: "User does not exist with this ID"});
        }
        if(!team) {
            return res.status(404).json({msg: "Team does not exist with this ID"});
        }

        if(isUserOwner(team, user) && !isLoggedInUserOwner(req, team)){
            return res.status(403).json({msg: "Access denied"});
        }
        if(!isLoggedInUserAdmin(req, team)) {
            return res.status(403).json({msg: "Access denied"});
        }
        if(!isUserAdmin(team, user)){
            return res.status(400).json({msg: "User is not admin"});
        }

        // remove team from members profile
        let removeIndex = team.admins.map(admin => admin.id).indexOf(user.id);
        team.admins.splice(removeIndex, 1);
        await team.save();
        return res.status(200).json(team.admins);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET api/teams/admins/:team_id/:user_id
// @desc    Get admin by user_id
// @access  Private
router.get('/admins/:team_id/:user_id', auth, async (req, res) => {
    try {
        const team = await Team.findById(req.params.team_id);
        const user = await User.findById(req.params.user_id).select('-password');

        if(!team) return res.status(404).json({ msg: 'Team not found'});
        if(!user) return res.status(404).json({ msg: 'User not found'});

        if(!isUserTeamMember(team, user)) return res.status(404).json({msg: 'User is not team member'});
        if(!isUserAdmin(team, user)) return res.status(404).json({msg: 'User is not admin'});

        res.status(200).json({admin: user});
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found'});
        }
        res.status(500).send('Server Error');
    }
})


// @route   GET api/teams/admins/:team_id/
// @desc    Get admins
// @access  Private
router.get('/admins/:team_id/', auth, async (req, res) => {
    try {
        const team = await Team.findById(req.params.team_id);

        if(!team) return res.status(404).json({ msg: 'Team not found'});

        if(!isUserTeamMember(team, user)) return res.status(404).json({msg: 'User is not team member'});

        const admins = [];
        for(let i = 0; i < team.members.length; i++){
            const user = await User.findById(team.members[i].user).select('-password');
            if(user) admins.push(user);
        }

        res.status(200).json({admins: admins});
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found'});
        }
        res.status(500).send('Server Error');
    }
})


//TODO: add owner
//TODO: remove owner
//TODO: is owner by id
//TODO: get owners

function canUserAddThisPost(req, team, post){
    if (!isLoggedInUserTeamMember(req,team)) return "This user is not a member of this team.";
    if (postIsAlreadyAdded(req, team)) return "Post is already added to this team";
    if(!(isLoggedInUserAdmin(req, team)) && !(postFromLoggedInUser(req, post))){
        return "To add this post, you should be admin and/or the author of the post";
    }
}

function canUserDeleteThisPost(req, team, post) {
    if (!isLoggedInUserTeamMember(req,team)) return "This user is not a member of this team.";
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

function isUserAdmin(team, user){
    return team.admins.filter(admin => admin.user.toString() === user.id).length > 0;
}

function isUserOwner(team, user) {
    return team.owners.filter(owner => owner.user.toString() === user.id).length > 0;
}

function postFromLoggedInUser(req, post){
    return post.user.id === req.user.id;
}

function isLoggedInUserTeamMember(req, team){
    return team.members.filter(member => member.user.toString() === req.user.id).length > 0;
}

function isLoggedInUserOwner(req, team) {
    return team.owners.filter(owner => owner.user.toString() === req.user.id).length > 0;
}

function isUserTeamMember(team, user) {
    return team.members.filter(member => member.user.toString() === user.id).length > 0;
}

function isOwner(req, team){
    return team.owners.filter(owner => owner.user.toString() === req.user.id).length > 0;
}

module.exports = router;