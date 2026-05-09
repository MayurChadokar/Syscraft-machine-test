const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    registeredAt: { type: Date, default: Date.now },
    surveySubmitted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Registration', registrationSchema);
