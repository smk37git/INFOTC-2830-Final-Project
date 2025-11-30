import { createContext, useContext, useState } from "react";

const PartyContext = createContext();

// hook for parties
export function useParty() {
    return useContext(PartyContext);
}

//parties Function
export function PartyProvider({ children }) {
    const [parties, setParties] = useState({});

    // gen. party by a random ID
    const generateId = () => Math.random().toString(36).substring(2, 9);

    // create a party
    const createParty = (partyData) => {
        const id = generateId();
        const newParty = {
            id,
            ...partyData,
            movies: [],
            showTimes: [],
            createdAt: new Date().toISOString(),
        };
        setParties(prev => ({...prev, [id]: newParty }));
        return newParty;
    }

    // get the Party ID
    const getParty = (id) => parties[id] || null;

    // add movie to party
    const addMovie = (partyId, movie) => {
        const movieId = generateId();
        setParties(prev => ({
            ...prev,
            [partyId]: {
                ...prev[partyId],
                movies: [...prev[partyId].movies, { id: movieId, ...movie, votes: {up: 0, down: 0} }]
            }
        }));
    };

    // add time to party
    const addShowTime = (partyId, showTime) => {
        const showTimeId = generateId();
        setParties(prev => ({
            ...prev,
            [partyId]: {
                ...prev[partyId],
                showTimes: [...prev[partyId].showTimes, { id: showTimeId, ...showTime, votes: {up: 0, down: 0} }]
            }
        }));
    };

    // vote on movie
    const voteMovie = (partyId, movieId, direction) => {
        setParties(prev => ({
            ...prev,
            [partyId]: {
            ...prev[partyId],
            movies: prev[partyId].movies.map(m => 
                m.id === movieId 
                ? { ...m, votes: { ...m.votes, [direction]: m.votes[direction] + 1 } }
                : m
            )
            }
        }));
    };

    // vote on time
    const voteShowTime = (partyId, showTimeId, direction) => {
        setParties(prev => ({
            ...prev,
            [partyId]: {
                ...prev[partyId],
                showTimes: prev[partyId].showTimes.map(st => st.id === showTimeId ?
                    {...st, votes: {...st.votes, [direction]: st.votes[direction] + 1}} : st
                )
            }
        }));
    };

    const value = {
        parties,
        createParty,
        getParty,
        addMovie,
        addShowTime,
        voteMovie,
        voteShowTime,
    }

    return (
        <PartyContext.Provider value={value}>
            {children}
        </PartyContext.Provider>
    )
}