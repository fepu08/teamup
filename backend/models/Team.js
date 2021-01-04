const mongoose = require('mongoose');

// Azért kell a schema, mert később a post id-ket is itt tároljuk
const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    admins: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'user'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Team = mongoose.model('team', TeamSchema);