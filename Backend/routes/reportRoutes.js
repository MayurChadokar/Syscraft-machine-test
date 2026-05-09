const express = require('express');
const { getEventReports, getSurveyReports, getDashboardStats } = require('../controllers/reportController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/events', authMiddleware, adminMiddleware, getEventReports);
router.get('/survey', authMiddleware, adminMiddleware, getSurveyReports);
router.get('/stats', authMiddleware, adminMiddleware, getDashboardStats);

module.exports = router;
