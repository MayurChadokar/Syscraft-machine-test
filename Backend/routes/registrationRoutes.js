const express = require('express');
const { registerForEvent, getRegistrationsByEvent, checkRegistration } = require('../controllers/registrationController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/:eventId', (req, res, next) => {
    // Optional auth: if token is present, populate req.user, otherwise proceed as guest
    const { authMiddleware } = require('../middleware/authMiddleware');
    if (req.header('Authorization')) {
        return authMiddleware(req, res, next);
    }
    next();
}, registerForEvent);
router.get('/check/:eventId', checkRegistration);
router.get('/:eventId', authMiddleware, adminMiddleware, getRegistrationsByEvent);

module.exports = router;
