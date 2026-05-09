const Event = require('../models/Event');
const Registration = require('../models/Registration');
const SurveyResponse = require('../models/SurveyResponse');

const getEventReports = async (req, res) => {
    try {
        const events = await Event.find().select('title date mode totalRegistrations totalSurveySubmissions');
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSurveyReports = async (req, res) => {
    try {
        const responses = await SurveyResponse.find()
            .populate('userId', 'name email')
            .populate('eventId', 'title');

        // Fetch guest details from Registration for non-logged in users
        const enrichedResponses = await Promise.all(responses.map(async (resp) => {
            const data = resp.toObject();
            if (!data.userId && data.guestEmail) {
                const reg = await Registration.findOne({ email: data.guestEmail, eventId: data.eventId._id });
                data.guestName = reg ? reg.name : 'Guest';
                data.registeredAt = reg ? reg.registeredAt : null;
            } else if (data.userId) {
                const reg = await Registration.findOne({ userId: data.userId._id, eventId: data.eventId._id });
                data.registeredAt = reg ? reg.registeredAt : null;
            }
            return data;
        }));

        res.json(enrichedResponses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const totalEvents = await Event.countDocuments();
        const totalRegistrations = await Registration.countDocuments();
        const totalResponses = await SurveyResponse.countDocuments();
        
        res.json({ totalEvents, totalRegistrations, totalResponses });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getEventReports, getSurveyReports, getDashboardStats };
