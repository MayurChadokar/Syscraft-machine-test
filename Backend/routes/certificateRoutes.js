const express = require('express');
const { getCertificate } = require('../controllers/certificateController');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/:userId/:eventId', authMiddleware, getCertificate);

module.exports = router;
