const Survey = require('../models/Survey');
const Event = require('../models/Event');
const SurveyResponse = require('../models/SurveyResponse');
const Registration = require('../models/Registration');

const createSurvey = async (req, res) => {
    try {
        const { title, eventId, questions } = req.body;
        const survey = new Survey({ title, eventId, questions });
        await survey.save();

        await Event.findByIdAndUpdate(eventId, { surveyId: survey._id });
        res.status(201).json(survey);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSurveyByEvent = async (req, res) => {
    try {
        const survey = await Survey.findOne({ eventId: req.params.eventId });
        if (!survey) return res.status(404).json({ message: 'Survey not found' });
        res.json(survey);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const sendEmail = require('../services/emailService');
const { generateCertificate } = require('../services/certificateService');
const { getCertificateTemplate } = require('../utils/emailTemplates');
const path = require('path');

const submitSurvey = async (req, res) => {
    try {
        console.log('Survey Submit Body:', JSON.stringify(req.body, null, 2));
        const { eventId, answers: rawAnswers, email: guestEmail } = req.body;
        const userId = req.user ? req.user.id : null;
        const email = req.user ? req.user.email : guestEmail;
        const name = req.user ? req.user.name : (await Registration.findOne({ email, eventId }))?.name;

        if (!email) return res.status(400).json({ message: 'Email is required for survey submission' });

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Ensure answers have question text
        const survey = await Survey.findOne({ eventId });
        const answers = rawAnswers.map((ans, idx) => {
            if (ans.question) return ans;
            // Fallback to survey questions if frontend didn't send it
            const qText = survey?.questions[idx]?.question || `Question ${idx + 1}`;
            return { question: qText, answer: ans.answer };
        });

        const response = new SurveyResponse({ 
            userId, 
            eventId, 
            answers,
            guestEmail: req.user ? null : email
        });
        await response.save();

        const registration = await Registration.findOneAndUpdate(
            { email, eventId },
            { surveySubmitted: true },
            { new: true }
        );

        if (!registration) return res.status(404).json({ message: 'Registration not found for this email' });

        await Event.findByIdAndUpdate(eventId, { $inc: { totalSurveySubmissions: 1 } });

        // Generate and Send Certificate Email
        generateCertificate({
            userName: name || 'Participant',
            eventName: event.title,
            date: event.date
        }, async (filePath) => {
            try {
                await sendEmail({
                    email: email,
                    subject: `Certificate of Participation: ${event.title}`,
                    message: `Hi ${name || 'Participant'}, Your certificate for ${event.title} is ready.`,
                    html: getCertificateTemplate(name || 'Participant', event.title),
                    attachments: [
                        {
                            filename: `Certificate_${event.title.replace(/\s+/g, '_')}.pdf`,
                            path: filePath
                        }
                    ]
                });
            } catch (emailErr) {
                console.error('Certificate email failed:', emailErr.message);
            }
        });

        res.status(201).json({ message: 'Survey submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createSurvey, getSurveyByEvent, submitSurvey };
