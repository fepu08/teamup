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
    unique: true,
    sparse: true
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
  teams: [
    {
      team_id: {
        type: mongoose.Schema.Types.ObjectId,
      },
      name: {
        type: String
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);