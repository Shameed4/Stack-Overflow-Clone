// Question Document Schema
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }],
    asked_by: { type: String, required: true, default: "Anonymous" },
    ask_date_time: { type: Date, default: Date.now }, // Set default value to current date and time
    views: { type: Number, default: 0 } // Set default value to 0
});

questionSchema.virtual('url').get(function () {
    return '/posts/question/' + this._id;
});

module.exports = mongoose.model('Question', questionSchema);
