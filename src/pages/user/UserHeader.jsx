import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
import "./UserHeader.css";

const UserHeader = ({ active = "home" }) => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const avatarUrl = localStorage.getItem("avatarUrl");
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    navigate("/user/login");
  };

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

          {/* Navigation (UNCHANGED) */}
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
              className={`nav-link ${active === "complaints" ? "active" : ""}`}
              to="/user/complaints"
            >
              Complaints
            </Link>
            <Link
              className={`nav-link ${active === "contact" ? "active" : ""}`}
              to="/user/contact"
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

            {/* Avatar + Dropdown */}
            <div className="profile-wrapper">
              <img
                className="user-avatar"
                   src={avatarUrl}
                   alt="User Avatar"
                onClick={() => setOpenMenu(!openMenu)}
              />
     

              {openMenu && (
                <div className="profile-dropdown">
                  <button onClick={() => navigate("/user/profile")}>
                    Profile
                  </button>
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
