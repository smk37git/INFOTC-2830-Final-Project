import { Link } from "react-router-dom";
import '../styles/Navbar.css'

export default function Navbar() {
    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">MovieNight</Link>
            <div>|</div>
            <div className="navbar-links">
                <Link to="/">Home</Link>
                <Link to="/create">Create Party</Link>
                <Link to="/join">Join Party</Link>
            </div>
        </nav>
    );
}