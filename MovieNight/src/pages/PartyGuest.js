import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useParty } from '../context/PartyContext';
import { ThumbsUp, ThumbsDown, Plus, Clapperboard, MapPin, Clock, Loader } from 'lucide-react';
import '../styles/Party.css';

export default function PartyGuest() {
  const { partyId } = useParams(); // this is the inviteToken
  const {
    currentParty,
    movies,
    showTimes,
    loading,
    error,
    getPartyByInvite,
    addMovie,
    addShowTime,
    voteMovie,
    voteShowTime,
    clearParty
  } = useParty();

  // guest info state
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestRegistered, setGuestRegistered] = useState(false);

  // form state
  const [newMovie, setNewMovie] = useState({ name: '', category: '', rating: '', runtimeMinutes: '', imdbLink: '' });
  const [newShowTime, setNewShowTime] = useState({ date: '', time: '' });

  // fetch party data on mount
  useEffect(() => {
    const loadParty = async () => {
      try {
        const party = await getPartyByInvite(partyId);
        
        // localStorage for saved guest info
        const savedName = localStorage.getItem(`guest_name_${party._id}`);
        const savedEmail = localStorage.getItem(`guest_email_${party._id}`);
        if (savedName && savedEmail) {
          setGuestName(savedName);
          setGuestEmail(savedEmail);
          setGuestRegistered(true);
        }
      } catch (err) {
        console.error('Failed to load party:', err);
      }
    };

    loadParty();

    return () => clearParty();
  }, [partyId]);

  // register guest
  const handleRegisterGuest = (e) => {
    e.preventDefault();
    if (!guestName || !guestEmail || !currentParty) return;

    localStorage.setItem(`guest_name_${currentParty._id}`, guestName);
    localStorage.setItem(`guest_email_${currentParty._id}`, guestEmail);
    setGuestRegistered(true);
  };

  // add movie handler
  const handleAddMovie = async (e) => {
    e.preventDefault();
    if (!newMovie.name || !currentParty) return;

    await addMovie(currentParty._id, {
      proposerName: guestName,
      proposerEmail: guestEmail,
      name: newMovie.name,
      category: newMovie.category,
      rating: newMovie.rating,
      runtimeMinutes: newMovie.runtimeMinutes ? parseInt(newMovie.runtimeMinutes) : null,
      imdbLink: newMovie.imdbLink
    });

    setNewMovie({ name: '', category: '', rating: '', runtimeMinutes: '', imdbLink: '' });
  };

  // add showtime handler
  const handleAddShowTime = async (e) => {
    e.preventDefault();
    if (!newShowTime.date || !newShowTime.time || !currentParty) return;

    const startTime = new Date(`${newShowTime.date}T${newShowTime.time}`).toISOString();

    await addShowTime(currentParty._id, {
      proposerName: guestName,
      proposerEmail: guestEmail,
      startTime
    });

    setNewShowTime({ date: '', time: '' });
  };

  // vote handlers
  const handleVoteMovie = (movieId, direction) => {
    if (!guestRegistered) {
      alert('Please enter your name and email first');
      return;
    }
    const value = direction === 'up' ? 1 : -1;
    voteMovie(currentParty._id, movieId, guestEmail, value);
  };

  const handleVoteShowTime = (timeId, direction) => {
    if (!guestRegistered) {
      alert('Please enter your name and email first');
      return;
    }
    const value = direction === 'up' ? 1 : -1;
    voteShowTime(currentParty._id, timeId, guestEmail, value);
  };

  // loading state
  if (loading) {
    return (
      <div className="create-party">
        <div className="star-background"></div>
        <div className="create-party-content">
          <div className="box">
            <Loader size={32} className="spin" />
            <p>Loading party...</p>
          </div>
        </div>
      </div>
    );
  }

  // error state
  if (error) {
    return (
      <div className="create-party">
        <div className="star-background"></div>
        <div className="create-party-content">
          <div className="box">
            <h2>Error</h2>
            <p className="error-message">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentParty) return null;

  return (
    <div className="create-party">
      <div className="star-background"></div>
      <div className="create-party-content">

        {/* Header */}
        <div className="box header-box">
          <h1><Clapperboard size={28} /> {currentParty.name}</h1>
          <p>
            {currentParty.location && <span><MapPin size={16} /> {currentParty.location}</span>}
            {currentParty.deadlineToVote && <span><Clock size={16} /> Voting ends: {new Date(currentParty.deadlineToVote).toLocaleString()}</span>}
          </p>
        </div>

        {/* Guest Registration */}
        {!guestRegistered && (
          <div className="box">
            <h2>Enter Your Info to Vote</h2>
            <form onSubmit={handleRegisterGuest}>
              <label>Your Name *</label>
              <input
                type="text"
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                placeholder="Your name"
                required
              />
              <label>Your Email *</label>
              <input
                type="email"
                value={guestEmail}
                onChange={e => setGuestEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
              <button type="submit" className="btn-primary">Join Party</button>
            </form>
          </div>
        )}

        {guestRegistered && (
          <div className="box">
            <p>Welcome, <strong>{guestName}</strong>! ({guestEmail})</p>
          </div>
        )}

        {/* Movies */}
        <div className="box">
          <h2>Movies</h2>
          {currentParty.allowGuestProposals && guestRegistered && (
            <form className="add-row" onSubmit={handleAddMovie}>
              <input placeholder="Name *" value={newMovie.name} onChange={e => setNewMovie({ ...newMovie, name: e.target.value })} required />
              <input placeholder="Category" value={newMovie.category} onChange={e => setNewMovie({ ...newMovie, category: e.target.value })} />
              <input placeholder="Rating" value={newMovie.rating} onChange={e => setNewMovie({ ...newMovie, rating: e.target.value })} />
              <input placeholder="Runtime (min)" value={newMovie.runtimeMinutes} onChange={e => setNewMovie({ ...newMovie, runtimeMinutes: e.target.value })} type="number" />
              <input placeholder="IMDB Link" value={newMovie.imdbLink} onChange={e => setNewMovie({ ...newMovie, imdbLink: e.target.value })} />
              <button type="submit"><Plus size={16} /></button>
            </form>
          )}

          {movies.length === 0 && <p className="empty-text">No movies added yet</p>}
          {movies.map(m => (
            <div key={m._id} className="item-row">
              <div>
                <strong>{m.name}</strong>
                <span>
                  {m.category}
                  {m.rating && ` ⭐${m.rating}`}
                  {m.runtimeMinutes && ` ${m.runtimeMinutes}min`}
                </span>
                {m.imdbLink && <a href={m.imdbLink} target="_blank" rel="noreferrer">IMDB</a>}
                <small>Proposed by: {m.proposerName}</small>
              </div>
              <div className="vote-btns">
                <button className="up" onClick={() => handleVoteMovie(m._id, 'up')} disabled={!guestRegistered}>
                  <ThumbsUp size={14} /> {m.votes?.up || 0}
                </button>
                <button className="down" onClick={() => handleVoteMovie(m._id, 'down')} disabled={!guestRegistered}>
                  <ThumbsDown size={14} /> {m.votes?.down || 0}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Showtimes */}
        <div className="box">
          <h2>Showtimes</h2>
          {currentParty.allowGuestProposals && guestRegistered && (
            <form className="add-row" onSubmit={handleAddShowTime}>
              <input type="date" value={newShowTime.date} onChange={e => setNewShowTime({ ...newShowTime, date: e.target.value })} required />
              <input type="time" value={newShowTime.time} onChange={e => setNewShowTime({ ...newShowTime, time: e.target.value })} required />
              <button type="submit"><Plus size={16} /></button>
            </form>
          )}

          {showTimes.length === 0 && <p className="empty-text">No showtimes added yet</p>}
          {showTimes.map(st => (
            <div key={st._id} className="item-row">
              <div>
                <strong>{new Date(st.startTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</strong>
                <span>{new Date(st.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                <small>Proposed by: {st.proposerName}</small>
              </div>
              <div className="vote-btns">
                <button className="up" onClick={() => handleVoteShowTime(st._id, 'up')} disabled={!guestRegistered}>
                  <ThumbsUp size={14} /> {st.votes?.up || 0}
                </button>
                <button className="down" onClick={() => handleVoteShowTime(st._id, 'down')} disabled={!guestRegistered}>
                  <ThumbsDown size={14} /> {st.votes?.down || 0}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}