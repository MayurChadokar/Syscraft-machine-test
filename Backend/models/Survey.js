const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    type: { type: String, enum: ['text', 'mcq'], required: true },
    options: [String],
    required: { type: Boolean, default: true }
});

const surveySchema = new mongoose.Schema({
    title: { type: String, required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    questions: [questionSchema],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Survey', surveySchema);
