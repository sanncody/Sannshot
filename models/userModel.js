const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    profileImage: String,
    boards: {
        type: Array,
        default: []
    }
});

userSchema.plugin(plm);

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;