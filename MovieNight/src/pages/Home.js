import { Link } from 'react-router-dom';
import { Clapperboard } from 'lucide-react';
import '../styles/Home.css';

export default function Home() {
  return (
    <div className="home">
      <div className="star-background"></div>
      
      <div className="home-content">
        <div className="logo-box">
          <Clapperboard size={64} color="#a88beb" />
          <div className="logo-text">
            <span>MOVIE</span>
            <span>NIGHT</span>
          </div>
        </div>
        
        <div className="home-panels">
          <Link to="/create" className="panel">
            <h2>CREATE PARTY</h2>
            <p>Start a new watch party and invite friends</p>
          </Link>
          
          <Link to="/join" className="panel">
            <h2>JOIN PARTY</h2>
            <p>Enter a party code to join</p>
          </Link>
        </div>
      </div>
    </div>
  );
}