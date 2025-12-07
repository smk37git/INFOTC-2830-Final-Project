const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  deadlineToVote: {
    type: Date,
    required: true
  },
  allowGuestProposals: {
    type: Boolean,
    default: true
  },
  hostName: {
    type: String,
    required: true,
    trim: true
  },
  hostEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  adminToken: {
    type: String,
    required: true,
    unique: true
  },
  inviteToken: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['OPEN', 'CLOSED', 'FINALIZED'],
    default: 'OPEN'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Party', partySchema);