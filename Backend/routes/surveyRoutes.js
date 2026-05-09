const express = require('express');
const { createSurvey, getSurveyByEvent, submitSurvey } = require('../controllers/surveyController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', authMiddleware, adminMiddleware, createSurvey);
router.get('/:eventId', getSurveyByEvent);
router.post('/submit', (req, res, next) => {
    // Optional auth for survey submission
    const { authMiddleware } = require('../middleware/authMiddleware');
    if (req.header('Authorization')) {
        return authMiddleware(req, res, next);
    }
    next();
}, submitSurvey);

module.exports = router;
