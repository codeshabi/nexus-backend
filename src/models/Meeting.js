const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  roomId: String,
  meetingHistory: {
    duration: Number,
    recordingUrl: String,
    notes: String
  }
}, {
  timestamps: true
});

meetingSchema.index({ startTime: 1, endTime: 1 });

module.exports = mongoose.model('Meeting', meetingSchema);