// Answer Document Schema
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    text: { type: String, required: true },
    ans_by: { type: String, required: true },
    ans_date_time: { type: Date, default: Date.now }, // Set default value to current date and time
    upvoters: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] },
    downvoters: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] }
});

answerSchema.virtual('url').get(function() {
    return '/posts/answer/' + this._id;
});

module.exports = mongoose.model('Answer', answerSchema);

