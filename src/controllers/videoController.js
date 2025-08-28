const Meeting = require('../models/Meeting');

const createRoom = async (req, res) => {
  try {
    const { meetingId } = req.params;

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    // Check if user is participant
    const isParticipant = meeting.organizer.toString() === req.user.id || 
                         meeting.participants.includes(req.user.id);

    if (!isParticipant) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ 
      roomId: meeting.roomId,
      meetingId: meeting._id,
      title: meeting.title
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const meeting = await Meeting.findOne({ roomId });
    if (!meeting) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const isParticipant = meeting.organizer.toString() === req.user.id || 
                         meeting.participants.includes(req.user.id);

    if (!isParticipant) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ 
      success: true,
      meeting: {
        id: meeting._id,
        title: meeting.title,
        roomId: meeting.roomId
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createRoom, joinRoom };