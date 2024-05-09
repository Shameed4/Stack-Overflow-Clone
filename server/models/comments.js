// Comments Document Schema
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    com_by: { type: String, required: true },
    com_date_time: { type: Date, default: Date.now }, // Set default value to current date and time
    upvoters: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] },
    downvoters: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] }
});

commentSchema.virtual('url').get(function() {
    return '/posts/comment/' + this._id;
});

module.exports = mongoose.model('Comment', commentSchema);

