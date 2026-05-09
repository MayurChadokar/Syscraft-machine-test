const Registration = require('../models/Registration');
const Event = require('../models/Event');
const sendEmail = require('../services/emailService');
const { getRegistrationTemplate } = require('../utils/emailTemplates');

const registerForEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { name, email, phone } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({ message: 'Name, email and phone are required' });
        }

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const existing = await Registration.findOne({ email, eventId });
        if (existing) return res.status(400).json({ message: 'You are already registered for this event with this email' });

        const registration = new Registration({ 
            eventId, 
            name, 
            email, 
            phone,
            userId: req.user ? req.user.id : null // Link to user if logged in, otherwise guest
        });
        await registration.save();

        await Event.findByIdAndUpdate(eventId, { $inc: { totalRegistrations: 1 } });

        // Send Email
        const surveyLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/survey/${eventId}?email=${encodeURIComponent(email)}`;
        try {
            await sendEmail({
                email: email,
                subject: `Registration Successful: ${event.title}`,
                message: `Hi ${name}, You have successfully registered for ${event.title}. Complete the survey here: ${surveyLink}`,
                html: getRegistrationTemplate(name, event.title, surveyLink)
            });
        } catch (emailErr) {
            console.error('Email failed to send:', emailErr.message);
        }

        res.status(201).json({ 
            message: 'Registered successfully', 
            registrationId: registration._id,
            surveyLink 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRegistrationsByEvent = async (req, res) => {
    try {
        const registrations = await Registration.find({ eventId: req.params.eventId }).populate('userId', 'name email phone');
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const checkRegistration = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { email } = req.query;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const existing = await Registration.findOne({ email, eventId });
        res.json({ isRegistered: !!existing });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerForEvent, getRegistrationsByEvent, checkRegistration };
