import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clapperboard, LogIn } from 'lucide-react';
import '../styles/Party.css';

export default function JoinParty() {
  const [partyCode, setPartyCode] = useState('');
  const navigate = useNavigate();

  const handleJoin = (e) => {
    e.preventDefault();
    if (!partyCode.trim()) return;
    navigate(`/party/guest/${partyCode}`);
  };

  return (
    <div className="create-party">
      <div className="star-background"></div>
      <div className="create-party-content">
        <form className="box" onSubmit={handleJoin}>
          <h1><Clapperboard size={32} /> Join Party</h1>

          <label>Party Code</label>
          <input
            type="text"
            value={partyCode}
            onChange={e => setPartyCode(e.target.value)}
            placeholder="Enter party code"
            required
          />

          <button type="submit" className="btn-primary">
            <LogIn size={18} /> Join Party
          </button>
        </form>
      </div>
    </div>
  );
}