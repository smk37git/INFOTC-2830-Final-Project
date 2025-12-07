const express = require('express');
const router = express.Router();
const Party = require('../models/Party');
const crypto = require('crypto');

// Generate random token
const generateToken = () => crypto.randomBytes(16).toString('hex');

// CREATE a new party
router.post('/', async (req, res) => {
  try {
    const { name, location, deadlineToVote, allowGuestProposals, hostName, hostEmail } = req.body;

    // Validate required fields
    if (!name || !deadlineToVote || !hostName || !hostEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate unique tokens
    const adminToken = generateToken();
    const inviteToken = generateToken();

    const party = new Party({
      name,
      location,
      deadlineToVote,
      allowGuestProposals: allowGuestProposals !== undefined ? allowGuestProposals : true,
      hostName,
      hostEmail,
      adminToken,
      inviteToken,
      status: 'OPEN'
    });

    await party.save();
    res.status(201).json(party);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET party by ID
router.get('/:partyId', async (req, res) => {
  try {
    const party = await Party.findById(req.params.partyId);
    if (!party) {
      return res.status(404).json({ error: 'Party not found' });
    }
    res.json(party);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET party by admin token
router.get('/admin/:adminToken', async (req, res) => {
  try {
    const party = await Party.findOne({ adminToken: req.params.adminToken });
    if (!party) {
      return res.status(404).json({ error: 'Party not found' });
    }
    res.json(party);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET party by invite token
router.get('/invite/:inviteToken', async (req, res) => {
  try {
    const party = await Party.findOne({ inviteToken: req.params.inviteToken });
    if (!party) {
      return res.status(404).json({ error: 'Party not found' });
    }
    res.json(party);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// UPDATE party status
router.patch('/:partyId/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['OPEN', 'CLOSED', 'FINALIZED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const party = await Party.findByIdAndUpdate(
      req.params.partyId,
      { status },
      { new: true }
    );

    if (!party) {
      return res.status(404).json({ error: 'Party not found' });
    }

    res.json(party);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE party
router.delete('/:partyId', async (req, res) => {
  try {
    const party = await Party.findByIdAndDelete(req.params.partyId);
    if (!party) {
      return res.status(404).json({ error: 'Party not found' });
    }
    res.json({ message: 'Party deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;