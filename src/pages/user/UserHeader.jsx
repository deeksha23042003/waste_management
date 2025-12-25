import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./UserHeader.css";

const UserHeader = ({ active = "home" }) => {
  const navigate = useNavigate();

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="header-row">
          {/* Logo */}
          <div
            className="logo-section"
            onClick={() => navigate("/user/dashboard")}
          >
            <div className="logo-icon">
              <span className="material-symbols-outlined">recycling</span>
            </div>
            <h1 className="logo-text">GreenSort</h1>
          </div>

          {/* Navigation */}
          <nav className="nav-links">
            <Link
              className={`nav-link ${active === "home" ? "active" : ""}`}
              to="/user/dashboard"
            >
              Home
            </Link>
            <Link
              className={`nav-link ${active === "how" ? "active" : ""}`}
              to="/how-it-works"
            >
              How it Works
            </Link>
            <Link
              className={`nav-link ${active === "community" ? "active" : ""}`}
              to="/community"
            >
              Community
            </Link>
            <Link
              className={`nav-link ${active === "contact" ? "active" : ""}`}
              to="/contact"
            >
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="header-actions">
            <button className="notification-btn">
              <span className="material-symbols-outlined">notifications</span>
              <span className="notification-badge"></span>
            </button>

            <div
              className="user-avatar"
              onClick={() => navigate("/user/profile")}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
