const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Team = require('../../models/Team')
const { check, validationResult } = require('express-validator');

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get('/me', auth, async (request, response) => {
  try{
    const profile = await Profile.findOne({
      user: request.user.id
    }).populate('user', ['first_name', 'last_name', 'avatar']);

    if(!profile){
      return response.status(400).json({msg: 'There is no profile for this user'});
    }

    response.json(profile);
  } catch(err){
    console.error(err.message);
    response.status(500).send('Server Error');
  }
});

// @route   POST api/profile/
// @desc    Create or update users profile
// @access  Private
router.post('/',
    [
        auth,
        // if you have required fields you should check them here
        //like
        // check('name', 'Name is required').not().isEmpty()
        check('skills', 'Skills are required').notEmpty()
    ],
    async (request, response) => {
      const errors = validationResult(request);
      if(!errors.isEmpty()){
        return response.status(400).json({errors: errors.array()});
      }


      const {
        address,
        city,
        country,
        skills,
        githubusername,
        youtube,
        twitter,
        facebook,
        linkedin,
        instagram,
        teams
      } = request.body;

      // Build profile object
      const profileFields =  {};
      profileFields.user = request.user.id;
      if(0) profileFields.githubusername = githubusername;
      if(skills) profileFields.skills = skills.split(',').map(skill => skill.trim());

      profileFields.location = {};
      if(address) profileFields.location.address = address;
      if(city) profileFields.location.city = city;
      if(country) profileFields.location.country = country;

      profileFields.social = {};
      if(youtube) profileFields.social.youtube = youtube;
      if(twitter) profileFields.social.twitter = twitter;
      if(facebook) profileFields.social.facebook = facebook;
      if(linkedin) profileFields.social.linkeding = linkedin;
      if(instagram) profileFields.social.instagram = instagram;

      if(teams) profileFields.teams = teams.split(',').map(team => team.trim());

      try {
        //check teams are exist
        let badTeams = [];
        for (const team of profileFields.teams) {
          let actual = await Team.findOne({name: team}).exec();
          if (!actual) badTeams.push(team);
        }
        if (badTeams.length > 0) {
          response.status(400).json({errors: [{msg: "Teams do not exist with name: " + badTeams}]});
          return;
        }

        // Check profile exists
        let profile = await Profile.findOne({user: request.user.id});
        if(profile){
          // Update
          profile = await Profile.findOneAndUpdate(
              {user: request.user.id},
              {$set: profileFields},
              {new: true}
          );
        } else {
          // Create
          let user = await User.findOne({ githubusername });
          if(user) response.status(400).json({ errors: [{ msg: 'User already exists with this github username' }] });
          profile = new Profile(profileFields);
        }
        await profile.save();
        response.json(profile);
      } catch (err) {
        console.error(err.message);
        response.status(500).send('Server Error');
      }
});


// @route   GET api/profile/
// @desc    Get all profiles
// @access  Public
router.get('/', async (request, response) => {
  try {
    const profiles = await Profile.find().populate('user', ['first_name', 'last_name', 'avatar']);
    response.json(profiles);
  } catch (err) {
    console.error(err.message);
    response.status(500).send('Server Error');
  }
})

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', async (request, response) => {
  try {
    const profile = await Profile.findOne({user: request.params.user_id}).populate('user', ['first_name', 'last_name', 'avatar']);
    if(!profile) return response.status(400).json({ msg: 'Profile not found'});
    response.json(profile);
  } catch (err) {
    console.error(err.message);
    if(err.kind == 'ObjectId') {
      return response.status(400).json({ msg: 'Profile not found'});
    }
    response.status(500).send('Server Error');
  }
})

// @route   DELETE api/profile
// @desc    Delete profile and user
// @access  Private
router.delete('/', auth, async (request, response) => {
  try {
    await Profile.findOneAndRemove({user: request.user.id})
    await User.findOneAndRemove({_id: request.user.id})
    response.json({msg: 'User deleted'})
  } catch (err) {
    console.error(err.message);
    response.status(500).send('Server Error');
  }
})

module.exports = router;