const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileSize: Number,
  mimeType: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  version: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['draft', 'reviewed', 'signed'],
    default: 'draft'
  },
  signatures: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    signedAt: {
      type: Date,
      default: Date.now
    },
    signature: String
  }],
  sharedWith: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);