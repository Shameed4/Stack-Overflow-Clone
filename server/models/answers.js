// Answer Document Schema
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    text: { type: String, required: true },
    ans_by: { type: String, required: true },
    ans_date_time: { type: Date, default: Date.now } // Set default value to current date and time
});

answerSchema.virtual('url').get(function() {
    return '/posts/answer/' + this._id;
});

module.exports = mongoose.model('Answer', answerSchema);

