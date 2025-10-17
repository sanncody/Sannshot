const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: String,
    description: String,
    postImg: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const postModel = mongoose.model('post', postSchema);

module.exports = postModel;