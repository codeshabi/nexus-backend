const Meeting = require('../models/Meeting');
const { v4: uuidv4 } = require('uuid');

const createMeeting = async (req, res) => {
  try {
    const { title, description, startTime, endTime, participants } = req.body;

    // Check for conflicts
    const conflicts = await Meeting.find({
      $or: [
        { organizer: req.user.id },
        { participants: req.user.id }
      ],
      status: { $ne: 'cancelled' },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (conflicts.length > 0) {
      return res.status(400).json({ message: 'Meeting time conflicts with existing meeting' });
    }

    const meeting = new Meeting({
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      organizer: req.user.id,
      participants,
      roomId: uuidv4()
    });

    await meeting.save();
    await meeting.populate('organizer participants', 'profile.firstName profile.lastName email');

    res.status(201).json({ message: 'Meeting created successfully', meeting });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({
      $or: [
        { organizer: req.user.id },
        { participants: req.user.id }
      ]
    }).populate('organizer participants', 'profile.firstName profile.lastName email')
      .sort({ startTime: 1 });

    res.json({ meetings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const meeting = await Meeting.findById(id);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    if (meeting.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only organizer can update meeting' });
    }

    Object.assign(meeting, updates);
    await meeting.save();
    await meeting.populate('organizer participants', 'profile.firstName profile.lastName email');

    res.json({ message: 'Meeting updated successfully', meeting });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const cancelMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    const meeting = await Meeting.findById(id);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    if (meeting.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only organizer can cancel meeting' });
    }

    meeting.status = 'cancelled';
    await meeting.save();

    res.json({ message: 'Meeting cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createMeeting, getMeetings, updateMeeting, cancelMeeting };