import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/user/dashboard" className="logo">
        <img src="/greensort-logo.png" alt="GreenSort" />
        <span>GreenSort</span>
      </Link>

      <div className="nav-links">
        <Link to="/user/dashboard">Home</Link>
        <Link to="/how-it-works">How it Works</Link>
        <Link to="/community">Community</Link>
        <Link to="/contact">Contact</Link>
      </div>

      <div
        className="profile-icon"
        onClick={() => navigate("/user/dashboard")}
      >
        🟢
      </div>
    </nav>
  );
}
