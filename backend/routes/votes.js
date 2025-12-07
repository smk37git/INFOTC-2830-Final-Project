const express = require('express');
const router = express.Router();
const { MovieVote, TimeVote } = require('../models/Vote');

// VOTE on a movie
router.post('/movie', async (req, res) => {
  try {
    const { partyId, movieId, voterEmail, value } = req.body;

    // Validate required fields
    if (!partyId || !movieId || !voterEmail || !value) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate vote value
    if (value !== 1 && value !== -1) {
      return res.status(400).json({ error: 'Vote value must be 1 or -1' });
    }

    // Check if user already voted on this movie
    const existingVote = await MovieVote.findOne({ movieId, voterEmail });

    if (existingVote) {
      // Update existing vote
      existingVote.value = value;
      await existingVote.save();
      res.json(existingVote);
    } else {
      // Create new vote
      const vote = new MovieVote({
        partyId,
        movieId,
        voterEmail,
        value
      });
      await vote.save();
      res.status(201).json(vote);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// VOTE on a time
router.post('/time', async (req, res) => {
  try {
    const { partyId, timeId, voterEmail, value } = req.body;

    // Validate required fields
    if (!partyId || !timeId || !voterEmail || !value) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate vote value
    if (value !== 1 && value !== -1) {
      return res.status(400).json({ error: 'Vote value must be 1 or -1' });
    }

    // Check if user already voted on this time
    const existingVote = await TimeVote.findOne({ timeId, voterEmail });

    if (existingVote) {
      // Update existing vote
      existingVote.value = value;
      await existingVote.save();
      res.json(existingVote);
    } else {
      // Create new vote
      const vote = new TimeVote({
        partyId,
        timeId,
        voterEmail,
        value
      });
      await vote.save();
      res.status(201).json(vote);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET user's vote on a specific movie
router.get('/movie/:movieId/user/:voterEmail', async (req, res) => {
  try {
    const vote = await MovieVote.findOne({
      movieId: req.params.movieId,
      voterEmail: req.params.voterEmail
    });
    
    if (!vote) {
      return res.json({ voted: false, value: null });
    }
    
    res.json({ voted: true, value: vote.value });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET user's vote on a specific time
router.get('/time/:timeId/user/:voterEmail', async (req, res) => {
  try {
    const vote = await TimeVote.findOne({
      timeId: req.params.timeId,
      voterEmail: req.params.voterEmail
    });
    
    if (!vote) {
      return res.json({ voted: false, value: null });
    }
    
    res.json({ voted: true, value: vote.value });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE vote on a movie
router.delete('/movie/:movieId/user/:voterEmail', async (req, res) => {
  try {
    const vote = await MovieVote.findOneAndDelete({
      movieId: req.params.movieId,
      voterEmail: req.params.voterEmail
    });

    if (!vote) {
      return res.status(404).json({ error: 'Vote not found' });
    }

    res.json({ message: 'Vote removed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE vote on a time
router.delete('/time/:timeId/user/:voterEmail', async (req, res) => {
  try {
    const vote = await TimeVote.findOneAndDelete({
      timeId: req.params.timeId,
      voterEmail: req.params.voterEmail
    });

    if (!vote) {
      return res.status(404).json({ error: 'Vote not found' });
    }

    res.json({ message: 'Vote removed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;