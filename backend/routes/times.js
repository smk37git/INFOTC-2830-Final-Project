const express = require('express');
const router = express.Router();
const TimeProposal = require('../models/TimeProposal');
const { TimeVote } = require('../models/Vote');

// CREATE a time proposal
router.post('/', async (req, res) => {
  try {
    const { partyId, proposerName, proposerEmail, startTime } = req.body;

    // Validate required fields
    if (!partyId || !proposerName || !proposerEmail || !startTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const timeProposal = new TimeProposal({
      partyId,
      proposerName,
      proposerEmail,
      startTime,
      deleted: false
    });

    await timeProposal.save();
    res.status(201).json(timeProposal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET all times for a party with vote counts
router.get('/party/:partyId', async (req, res) => {
  try {
    const times = await TimeProposal.find({ 
      partyId: req.params.partyId,
      deleted: false 
    });

    // Get vote counts for each time
    const timesWithVotes = await Promise.all(
      times.map(async (time) => {
        const votes = await TimeVote.find({ timeId: time._id });
        const upVotes = votes.filter(v => v.value === 1).length;
        const downVotes = votes.filter(v => v.value === -1).length;
        
        return {
          ...time.toObject(),
          votes: {
            up: upVotes,
            down: downVotes,
            total: upVotes - downVotes
          }
        };
      })
    );

    res.json(timesWithVotes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET single time by ID
router.get('/:timeId', async (req, res) => {
  try {
    const time = await TimeProposal.findById(req.params.timeId);
    if (!time || time.deleted) {
      return res.status(404).json({ error: 'Time not found' });
    }
    res.json(time);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// UPDATE time (soft delete)
router.patch('/:timeId', async (req, res) => {
  try {
    const time = await TimeProposal.findByIdAndUpdate(
      req.params.timeId,
      { deleted: true },
      { new: true }
    );

    if (!time) {
      return res.status(404).json({ error: 'Time not found' });
    }

    res.json(time);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE time (hard delete - use with caution)
router.delete('/:timeId', async (req, res) => {
  try {
    const time = await TimeProposal.findByIdAndDelete(req.params.timeId);
    if (!time) {
      return res.status(404).json({ error: 'Time not found' });
    }
    
    // Also delete all votes for this time
    await TimeVote.deleteMany({ timeId: req.params.timeId });
    
    res.json({ message: 'Time deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;