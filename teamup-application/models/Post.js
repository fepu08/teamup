const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: 'team'
    },
    text: {
        type: String,
        required: true
    },
    // if an user delete his account there's an option
    // to leave his comments
    name: {
        first_name: {
            type: String
        },
        last_name:{
            type: String
        }
    },
    avatar: {
        type: String
    },
    likes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'user'
            }
        }
    ],
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'user'
            },
            text: {
                type: String,
                required: true
            },
            name: {
                first_name: {
                    type: String
                },
                last_name:{
                    type: String
                }
            },
            avatar: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now()
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = Post = mongoose.model('post', PostSchema);