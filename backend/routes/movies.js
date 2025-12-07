const express = require('express');
const router = express.Router();
const MovieProposal = require('../models/MovieProposal');
const { MovieVote } = require('../models/Vote');

// CREATE a movie proposal
router.post('/', async (req, res) => {
  try {
    const { partyId, proposerName, proposerEmail, name, category, rating, runtimeMinutes, imdbLink } = req.body;

    // Validate required fields
    if (!partyId || !proposerName || !proposerEmail || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const movie = new MovieProposal({
      partyId,
      proposerName,
      proposerEmail,
      name,
      category,
      rating,
      runtimeMinutes,
      imdbLink,
      deleted: false
    });

    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET all movies for a party with vote counts
router.get('/party/:partyId', async (req, res) => {
  try {
    const movies = await MovieProposal.find({ 
      partyId: req.params.partyId,
      deleted: false 
    });

    // Get vote counts for each movie
    const moviesWithVotes = await Promise.all(
      movies.map(async (movie) => {
        const votes = await MovieVote.find({ movieId: movie._id });
        const upVotes = votes.filter(v => v.value === 1).length;
        const downVotes = votes.filter(v => v.value === -1).length;
        
        return {
          ...movie.toObject(),
          votes: {
            up: upVotes,
            down: downVotes,
            total: upVotes - downVotes
          }
        };
      })
    );

    res.json(moviesWithVotes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET single movie by ID
router.get('/:movieId', async (req, res) => {
  try {
    const movie = await MovieProposal.findById(req.params.movieId);
    if (!movie || movie.deleted) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// UPDATE movie (soft delete)
router.patch('/:movieId', async (req, res) => {
  try {
    const movie = await MovieProposal.findByIdAndUpdate(
      req.params.movieId,
      { deleted: true },
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE movie (hard delete - use with caution)
router.delete('/:movieId', async (req, res) => {
  try {
    const movie = await MovieProposal.findByIdAndDelete(req.params.movieId);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    // Also delete all votes for this movie
    await MovieVote.deleteMany({ movieId: req.params.movieId });
    
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;