import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Plus, Copy, Clapperboard, MapPin, Clock } from 'lucide-react';
import '../styles/Party.css';

export default function PartyHost() {
  const { partyId } = useParams();

  // Sample data -- @backend needs to update
  const [party] = useState({
    name: 'Sample Movie',
    location: "Sample Location",
    deadline: '2025-01-15T19:00',
    allowGuestProposals: true
  });

  const [movies, setMovies] = useState([]);
  const [showTimes, setShowTimes] = useState([]);
  const [newMovie, setNewMovie] = useState({ name: '', category: '', rating: '', runtime: '', imdbLink: '' });
  const [newShowTime, setNewShowTime] = useState({ date: '', time: '' });

  const addMovie = (e) => {
    e.preventDefault();
    if (!newMovie.name) return;
    setMovies([...movies, { ...newMovie, id: Date.now(), votes: { up: 0, down: 0 } }]);
    setNewMovie({ name: '', category: '', rating: '', runtime: '', imdbLink: '' });
  };

  const addShowTime = (e) => {
    e.preventDefault();
    if (!newShowTime.date || !newShowTime.time) return;
    setShowTimes([...showTimes, { ...newShowTime, id: Date.now(), votes: { up: 0, down: 0 } }]);
    setNewShowTime({ date: '', time: '' });
  };

  const voteMovie = (id, dir) => {
    setMovies(movies.map(m => m.id === id ? { ...m, votes: { ...m.votes, [dir]: m.votes[dir] + 1 } } : m));
  };

  const voteShowTime = (id, dir) => {
    setShowTimes(showTimes.map(st => st.id === id ? { ...st, votes: { ...st.votes, [dir]: st.votes[dir] + 1 } } : st));
  };

  const copyLink = (text) => navigator.clipboard.writeText(text);
  const baseUrl = window.location.origin;

  return (
    <div className="create-party">
      <div className="star-background"></div>
      <div className="create-party-content">

        <div className="box header-box">
          <h1><Clapperboard size={28} /> {party.name}</h1>
          <p>
            {party.location && <span><MapPin size={16} /> {party.location}</span>}
            {party.deadline && <span><Clock size={16} /> {new Date(party.deadline).toLocaleString()}</span>}
          </p>
        </div>

        <div className="box">
          <h2>Share Links</h2>
          <div className="link-row">
            <span>Admin:</span>
            <input readOnly value={`${baseUrl}/party/host/${partyId}`} />
            <button onClick={() => copyLink(`${baseUrl}/party/host/${partyId}`)}><Copy size={16} /></button>
          </div>
          <div className="link-row">
            <span>Invite:</span>
            <input readOnly value={`${baseUrl}/party/guest/${partyId}`} />
            <button onClick={() => copyLink(`${baseUrl}/party/guest/${partyId}`)}><Copy size={16} /></button>
          </div>
        </div>

        <div className="box">
          <h2>Movies</h2>
          <form className="add-row" onSubmit={addMovie}>
            <input placeholder="Name" value={newMovie.name} onChange={e => setNewMovie({ ...newMovie, name: e.target.value })} required />
            <input placeholder="Category" value={newMovie.category} onChange={e => setNewMovie({ ...newMovie, category: e.target.value })} />
            <input placeholder="Rating" value={newMovie.rating} onChange={e => setNewMovie({ ...newMovie, rating: e.target.value })} />
            <input placeholder="Runtime" value={newMovie.runtime} onChange={e => setNewMovie({ ...newMovie, runtime: e.target.value })} />
            <input placeholder="IMDB Link" value={newMovie.imdbLink} onChange={e => setNewMovie({ ...newMovie, imdbLink: e.target.value })} />
            <button type="submit"><Plus size={16} /></button>
          </form>

          {movies.length === 0 && <p className="empty-text">No movies added yet</p>}
          {movies.map(m => (
            <div key={m.id} className="item-row">
              <div>
                <strong>{m.name}</strong>
                <span>{m.category} {m.rating && `⭐${m.rating}`} {m.runtime}</span>
                {m.imdbLink && <a href={m.imdbLink} target="_blank" rel="noreferrer">IMDB</a>}
              </div>
              <div className="vote-btns">
                <button className="up" onClick={() => voteMovie(m.id, 'up')}><ThumbsUp size={14} /> {m.votes.up}</button>
                <button className="down" onClick={() => voteMovie(m.id, 'down')}><ThumbsDown size={14} /> {m.votes.down}</button>
              </div>
            </div>
          ))}
        </div>

        <div className="box">
          <h2>Showtimes</h2>
          <form className="add-row" onSubmit={addShowTime}>
            <input type="date" value={newShowTime.date} onChange={e => setNewShowTime({ ...newShowTime, date: e.target.value })} required />
            <input type="time" value={newShowTime.time} onChange={e => setNewShowTime({ ...newShowTime, time: e.target.value })} required />
            <button type="submit"><Plus size={16} /></button>
          </form>

          {showTimes.length === 0 && <p className="empty-text">No showtimes added yet</p>}
          {showTimes.map(st => (
            <div key={st.id} className="item-row">
              <div>
                <strong>{new Date(st.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</strong>
                <span>{st.time}</span>
              </div>
              <div className="vote-btns">
                <button className="up" onClick={() => voteShowTime(st.id, 'up')}><ThumbsUp size={14} /> {st.votes.up}</button>
                <button className="down" onClick={() => voteShowTime(st.id, 'down')}><ThumbsDown size={14} /> {st.votes.down}</button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}