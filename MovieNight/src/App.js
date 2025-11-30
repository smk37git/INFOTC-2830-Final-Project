import { Routes, Route } from "react-router-dom";

// pages
import Home from './pages/Home';
import CreateParty from './pages/CreateParty';
import PartyHost from './pages/PartyHost';
import PartyGuest from './pages/PartyGuest';
import JoinParty from './pages/JoinParty';

// context
import { PartyProvider } from "./context/PartyContext";

// components
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <PartyProvider>
      <div className="App">

        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateParty />} />
          <Route path="/party/host/:partyId" element={<PartyHost />} />
          <Route path="/party/guest/:partyId" element={<PartyGuest />} />
          <Route path="/join" element={<JoinParty />} />
        </Routes>
      </div>
    </PartyProvider>
  )
}