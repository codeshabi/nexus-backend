const express = require('express');
const { createMeeting, getMeetings, updateMeeting, cancelMeeting } = require('../controllers/meetingController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticate, createMeeting);
router.get('/', authenticate, getMeetings);
router.put('/:id', authenticate, updateMeeting);
router.delete('/:id', authenticate, cancelMeeting);

module.exports = router;