const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true }
});

const surveyResponseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    guestEmail: { type: String, required: false },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    answers: [answerSchema],
    submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SurveyResponse', surveyResponseSchema);
