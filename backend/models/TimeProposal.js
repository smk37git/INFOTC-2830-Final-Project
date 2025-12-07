const mongoose = require('mongoose');

const timeProposalSchema = new mongoose.Schema({
  partyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Party',
    required: true
  },
  proposerName: {
    type: String,
    required: true,
    trim: true
  },
  proposerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  startTime: {
    type: Date,
    required: true
  },
  deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TimeProposal', timeProposalSchema);