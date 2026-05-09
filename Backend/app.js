const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const surveyRoutes = require('./routes/surveyRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const reportRoutes = require('./routes/reportRoutes');
const certificateRoutes = require('./routes/certificateRoutes');

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/survey', surveyRoutes);
app.use('/api/register', registrationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/certificate', certificateRoutes);

app.get('/', (req, res) => {
    res.send('Event Survey & Certificate Management API is running...');
});

module.exports = app;
