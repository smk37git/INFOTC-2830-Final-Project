const mongoose = require('mongoose');

const movieProposalSchema = new mongoose.Schema({
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
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  rating: {
    type: String,
    trim: true
  },
  runtimeMinutes: {
    type: Number
  },
  imdbLink: {
    type: String,
    trim: true
  },
  deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MovieProposal', movieProposalSchema);