const User = require('../models/User');
const Event = require('../models/Event');
const { generateCertificate } = require('../services/certificateService');
const path = require('path');
const fs = require('fs');

const getCertificate = async (req, res) => {
    try {
        const { userId, eventId } = req.params;
        const user = await User.findById(userId);
        const event = await Event.findById(eventId);

        if (!user || !event) return res.status(404).json({ message: 'User or Event not found' });

        generateCertificate({
            userName: user.name,
            eventName: event.title,
            date: event.date
        }, (filePath) => {
            res.download(filePath, (err) => {
                if (err) console.error(err);
                // Optional: Delete file after download
                // fs.unlinkSync(filePath);
            });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCertificate };
