const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  location: [
    {
      address: {
        type: String
      },
      city: {
        type: String
      },
      country: {
        type: String
      }
    }
  ],
  skills: {
    type: [String],
    required: true
  },
  githubusername: {
    type: String,
    unique: true
  },
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  teams: {
    //FIXME: Should it be the name of teams or the id?
    type:[String]
    // it could be the name of the teams because those are unique
    /*type: mongoose.Schema.Types.ObjectId,
    ref: 'team'*/
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);