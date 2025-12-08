import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clapperboard, LogIn, Loader } from 'lucide-react';
import api from "../utils/api";
import '../styles/Party.css';

export default function JoinParty() {
  const [partyCode, setPartyCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!partyCode.trim()) return;

    setLoading(true);
    setError('');

    try {
      // check party exists
      await api.get(`/parties/invite/${partyCode.trim()}`);
      navigate(`/party/guest/${partyCode.trim()}`);
    } catch (err) {
      setError('Party not found. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-party">
      <div className="star-background"></div>
      <div className="create-party-content">
        <form className="box" onSubmit={handleJoin}>
          <h1><Clapperboard size={32} /> Join Party</h1>

          {error && <div className="error-message">{error}</div>}

          <label>Party Code / Invite Token</label>
          <input
            type="text"
            value={partyCode}
            onChange={e => setPartyCode(e.target.value)}
            placeholder="Enter party invite code"
            required
          />

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <><Loader size={18} className="spin" /> Joining...</> : <><LogIn size={18} /> Join Party</>}
          </button>
        </form>
      </div>
    </div>
  );
}