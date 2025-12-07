const mongoose = require('mongoose');

// Movie Vote Schema
const movieVoteSchema = new mongoose.Schema({
  partyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Party',
    required: true
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MovieProposal',
    required: true
  },
  voterEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  value: {
    type: Number,
    required: true,
    enum: [1, -1]
  }
}, {
  timestamps: true
});

// Unique constraint: one vote per user per movie
movieVoteSchema.index({ movieId: 1, voterEmail: 1 }, { unique: true });

// Time Vote Schema
const timeVoteSchema = new mongoose.Schema({
  partyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Party',
    required: true
  },
  timeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TimeProposal',
    required: true
  },
  voterEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  value: {
    type: Number,
    required: true,
    enum: [1, -1]
  }
}, {
  timestamps: true
});

// Unique constraint: one vote per user per time
timeVoteSchema.index({ timeId: 1, voterEmail: 1 }, { unique: true });

const MovieVote = mongoose.model('MovieVote', movieVoteSchema);
const TimeVote = mongoose.model('TimeVote', timeVoteSchema);

module.exports = { MovieVote, TimeVote };