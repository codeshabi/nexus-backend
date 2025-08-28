const express = require('express');
const { createRoom, joinRoom } = require('../controllers/videoController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/room/:meetingId', authenticate, createRoom);
router.get('/join/:roomId', authenticate, joinRoom);

module.exports = router;