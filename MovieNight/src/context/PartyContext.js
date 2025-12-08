import { createContext, useContext, useState } from "react";
import api from "../utils/api";

const PartyContext = createContext();

export function useParty() {
  return useContext(PartyContext);
}

export function PartyProvider({ children }) {
  const [currentParty, setCurrentParty] = useState(null);
  const [movies, setMovies] = useState([]);
  const [showTimes, setShowTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // create a party
  const createParty = async (partyData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/parties', partyData);
      setCurrentParty(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create party');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // get party by admin token
  const getPartyByAdmin = async (adminToken) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/parties/admin/${adminToken}`);
      setCurrentParty(response.data);
      await fetchMovies(response.data._id);
      await fetchShowTimes(response.data._id);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Party not found');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // get party by invite token
  const getPartyByInvite = async (inviteToken) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/parties/invite/${inviteToken}`);
      setCurrentParty(response.data);
      await fetchMovies(response.data._id);
      await fetchShowTimes(response.data._id);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Party not found');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // fetch movies for a party
  const fetchMovies = async (partyId) => {
    try {
      const response = await api.get(`/movies/party/${partyId}`);
      setMovies(response.data);
      return response.data;
    } catch (err) {
      console.error('Failed to fetch movies:', err);
    }
  };

  // fetch showtimes for a party
  const fetchShowTimes = async (partyId) => {
    try {
      const response = await api.get(`/times/party/${partyId}`);
      setShowTimes(response.data);
      return response.data;
    } catch (err) {
      console.error('Failed to fetch showtimes:', err);
    }
  };

  // add movie to party
  const addMovie = async (partyId, movieData) => {
    try {
      const response = await api.post('/movies', {
        partyId,
        ...movieData
      });
      // Refresh movies list
      await fetchMovies(partyId);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add movie');
      throw err;
    }
  };

  // add showtime to party
  const addShowTime = async (partyId, timeData) => {
    try {
      const response = await api.post('/times', {
        partyId,
        ...timeData
      });
      // Refresh showtimes list
      await fetchShowTimes(partyId);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add showtime');
      throw err;
    }
  };

  // vote on movie
  const voteMovie = async (partyId, movieId, voterEmail, value) => {
    try {
      await api.post('/votes/movie', {
        partyId,
        movieId,
        voterEmail,
        value // 1 for up, -1 for down
      });
      // Refresh movies to get updated vote counts
      await fetchMovies(partyId);
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  // vote on showtime
  const voteShowTime = async (partyId, timeId, voterEmail, value) => {
    try {
      await api.post('/votes/time', {
        partyId,
        timeId,
        voterEmail,
        value
      });
      // refresh showtimes to get updated vote counts
      await fetchShowTimes(partyId);
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  // delete movie
  const deleteMovie = async (partyId, movieId) => {
    try {
      await api.patch(`/movies/${movieId}`);
      await fetchMovies(partyId);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // delete showtime
  const deleteShowTime = async (partyId, timeId) => {
    try {
      await api.patch(`/times/${timeId}`);
      await fetchShowTimes(partyId);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // clear current party
  const clearParty = () => {
    setCurrentParty(null);
    setMovies([]);
    setShowTimes([]);
    setError(null);
  };

  const value = {
    currentParty,
    movies,
    showTimes,
    loading,
    error,
    createParty,
    getPartyByAdmin,
    getPartyByInvite,
    fetchMovies,
    fetchShowTimes,
    addMovie,
    addShowTime,
    voteMovie,
    voteShowTime,
    deleteMovie,
    deleteShowTime,
    clearParty,
  };

  return (
    <PartyContext.Provider value={value}>
      {children}
    </PartyContext.Provider>
  );
}