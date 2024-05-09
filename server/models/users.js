// User Document Schema
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    since: {type: Date, default: Date.now },
});  // Enable automatic timestamping

userSchema.virtual('url').get(function() {
    return '/posts/user/' + this._id;
});

module.exports = mongoose.model('User', userSchema);
