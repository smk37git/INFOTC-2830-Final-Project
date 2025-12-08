import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParty } from '../context/PartyContext';
import { ThumbsUp, ThumbsDown, Plus, Copy, Clapperboard, MapPin, Clock, Loader } from 'lucide-react';
import '../styles/Party.css';

export default function CreateParty() {
  const navigate = useNavigate();
  const { createParty, loading, error } = useParty();

  // form states
  const [partyName, setPartyName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [location, setLocation] = useState('');
  const [allowGuestProposals, setAllowGuestProposals] = useState(false);
  const [hostName, setHostName] = useState('');
  const [hostEmail, setHostEmail] = useState('');

  const handleCreateParty = async (e) => {
    e.preventDefault();

    try {
      const party = await createParty({
        name: partyName,
        location,
        deadlineToVote: deadline,
        allowGuestProposals,
        hostName,
        hostEmail
      });

      // navigate to host page with admin token
      navigate(`/party/host/${party.adminToken}`);
    } catch (err) {
      console.error('Failed to create party:', err);
    }
  };

  return (
    <div className="create-party">
      <div className="star-background"></div>
      <div className="create-party-content">
        <form className="box" onSubmit={handleCreateParty}>
          <h1><Clapperboard size={32} /> Create Party</h1>

          {error && <div className="error-message">{error}</div>}

          <label>Party Name *</label>
          <input
            type="text"
            value={partyName}
            onChange={e => setPartyName(e.target.value)}
            placeholder="Friday Movie Night"
            required
          />

          <label>Your Name *</label>
          <input
            type="text"
            value={hostName}
            onChange={e => setHostName(e.target.value)}
            placeholder="John Doe"
            required
          />

          <label>Your Email *</label>
          <input
            type="email"
            value={hostEmail}
            onChange={e => setHostEmail(e.target.value)}
            placeholder="john@example.com"
            required
          />

          <label>Voting Deadline *</label>
          <input
            type="datetime-local"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
            required
          />

          <label>Location</label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="John's House"
          />

          <div className="checkbox-row">
            <input
              type="checkbox"
              id="guests"
              checked={allowGuestProposals}
              onChange={e => setAllowGuestProposals(e.target.checked)}
            />
            <label htmlFor="guests">Allow Guest Proposals</label>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <><Loader size={18} className="spin" /> Creating...</> : 'Create Party'}
          </button>
        </form>
      </div>
    </div>
  );
}