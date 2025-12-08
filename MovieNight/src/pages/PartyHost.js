import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useParty } from '../context/PartyContext';
import { ThumbsUp, ThumbsDown, Plus, Copy, Clapperboard, MapPin, Clock, Loader, Trash2 } from 'lucide-react';
import '../styles/Party.css';

export default function PartyHost() {
  const { partyId } = useParams(); // this is the adminToken
  const {
    currentParty,
    movies,
    showTimes,
    loading,
    error,
    getPartyByAdmin,
    addMovie,
    addShowTime,
    voteMovie,
    voteShowTime,
    deleteMovie,
    deleteShowTime,
    clearParty
  } = useParty();

  // form states
  const [newMovie, setNewMovie] = useState({ name: '', category: '', rating: '', runtimeMinutes: '', imdbLink: '' });
  const [newShowTime, setNewShowTime] = useState({ date: '', time: '' });

  // fetch party data on mount
  useEffect(() => {
    getPartyByAdmin(partyId);

    // cleanup on unmount
    return () => clearParty();
  }, [partyId]);

  // add movie handler
  const handleAddMovie = async (e) => {
    e.preventDefault();
    if (!newMovie.name || !currentParty) return;

    await addMovie(currentParty._id, {
      proposerName: currentParty.hostName,
      proposerEmail: currentParty.hostEmail,
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
      proposerName: currentParty.hostName,
      proposerEmail: currentParty.hostEmail,
      startTime
    });

    setNewShowTime({ date: '', time: '' });
  };

  // vote handlers
  const handleVoteMovie = (movieId, direction) => {
    const value = direction === 'up' ? 1 : -1;
    voteMovie(currentParty._id, movieId, currentParty.hostEmail, value);
  };

  const handleVoteShowTime = (timeId, direction) => {
    const value = direction === 'up' ? 1 : -1;
    voteShowTime(currentParty._id, timeId, currentParty.hostEmail, value);
  };

  // copy link helper
  const copyLink = (text) => navigator.clipboard.writeText(text);
  const baseUrl = window.location.origin;

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
            {currentParty.deadlineToVote && <span><Clock size={16} /> {new Date(currentParty.deadlineToVote).toLocaleString()}</span>}
          </p>
          <p><small>Status: {currentParty.status}</small></p>
        </div>

        {/* Share Links */}
        <div className="box">
          <h2>Share Links</h2>
          <div className="link-row">
            <span>Admin:</span>
            <input readOnly value={`${baseUrl}/party/host/${currentParty.adminToken}`} />
            <button onClick={() => copyLink(`${baseUrl}/party/host/${currentParty.adminToken}`)}><Copy size={16} /></button>
          </div>
          <div className="link-row">
            <span>Invite:</span>
            <input readOnly value={`${baseUrl}/party/guest/${currentParty.inviteToken}`} />
            <button onClick={() => copyLink(`${baseUrl}/party/guest/${currentParty.inviteToken}`)}><Copy size={16} /></button>
          </div>
        </div>

        {/* Movies */}
        <div className="box">
          <h2>Movies</h2>
          <form className="add-row" onSubmit={handleAddMovie}>
            <input placeholder="Name *" value={newMovie.name} onChange={e => setNewMovie({ ...newMovie, name: e.target.value })} required />
            <input placeholder="Category" value={newMovie.category} onChange={e => setNewMovie({ ...newMovie, category: e.target.value })} />
            <input placeholder="Rating" value={newMovie.rating} onChange={e => setNewMovie({ ...newMovie, rating: e.target.value })} />
            <input placeholder="Runtime (min)" value={newMovie.runtimeMinutes} onChange={e => setNewMovie({ ...newMovie, runtimeMinutes: e.target.value })} type="number" />
            <input placeholder="IMDB Link" value={newMovie.imdbLink} onChange={e => setNewMovie({ ...newMovie, imdbLink: e.target.value })} />
            <button type="submit"><Plus size={16} /></button>
          </form>

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
              </div>
              <div className="vote-btns">
                <button className="up" onClick={() => handleVoteMovie(m._id, 'up')}><ThumbsUp size={14} /> {m.votes?.up || 0}</button>
                <button className="down" onClick={() => handleVoteMovie(m._id, 'down')}><ThumbsDown size={14} /> {m.votes?.down || 0}</button>
                <button className="delete" onClick={() => deleteMovie(currentParty._id, m._id)}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>

        {/* Showtimes */}
        <div className="box">
          <h2>Showtimes</h2>
          <form className="add-row" onSubmit={handleAddShowTime}>
            <input type="date" value={newShowTime.date} onChange={e => setNewShowTime({ ...newShowTime, date: e.target.value })} required />
            <input type="time" value={newShowTime.time} onChange={e => setNewShowTime({ ...newShowTime, time: e.target.value })} required />
            <button type="submit"><Plus size={16} /></button>
          </form>

          {showTimes.length === 0 && <p className="empty-text">No showtimes added yet</p>}
          {showTimes.map(st => (
            <div key={st._id} className="item-row">
              <div>
                <strong>{new Date(st.startTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</strong>
                <span>{new Date(st.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="vote-btns">
                <button className="up" onClick={() => handleVoteShowTime(st._id, 'up')}><ThumbsUp size={14} /> {st.votes?.up || 0}</button>
                <button className="down" onClick={() => handleVoteShowTime(st._id, 'down')}><ThumbsDown size={14} /> {st.votes?.down || 0}</button>
                <button className="delete" onClick={() => deleteShowTime(currentParty._id, st._id)}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}