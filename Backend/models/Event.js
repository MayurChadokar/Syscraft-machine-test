const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    mode: { type: String, enum: ['online', 'offline'], required: true },
    location: { type: String },
    surveyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Survey' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    totalRegistrations: { type: Number, default: 0 },
    totalSurveySubmissions: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);
