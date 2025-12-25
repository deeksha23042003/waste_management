import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./UserDashboard.css";

const UserDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      {/* Top Navigation Bar */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-row">
            {/* Logo */}
            <div
              className="logo-section"
              onClick={() => navigate("/user/dashboard")}
              style={{ cursor: "pointer" }}
            >
              <div className="logo-icon">
                <span className="material-symbols-outlined">recycling</span>
              </div>
              <h1 className="logo-text">GreenSort</h1>
            </div>

            {/* Navigation Links */}
            <nav className="nav-links">
              <Link className="nav-link active" to="/user/dashboard">Home</Link>
              <Link className="nav-link" to="/how-it-works">How it Works</Link>
              <Link className="nav-link" to="/community">Community</Link>
              <Link className="nav-link" to="/contact">Contact</Link>
            </nav>

            {/* Right Side Actions */}
            <div className="header-actions">
              <button className="notification-btn">
                <span className="material-symbols-outlined">notifications</span>
                <span className="notification-badge"></span>
              </button>
              <div
                className="user-avatar"
                onClick={() => navigate("/user/profile")}
                style={{ cursor: "pointer" }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">

          {/* Welcome Section */}
          <section className="welcome-section">
            <div className="welcome-text">
              <div className="citizen-badge">
                <span className="material-symbols-outlined">eco</span>
                <span className="badge-text">Citizen Dashboard</span>
              </div>
              <h2 className="welcome-title">
                Welcome back, <span className="highlight">Alex!</span>
              </h2>
              <p className="welcome-description">
                Let's keep our city clean together. Your contributions make a visible impact.
              </p>
            </div>

            <div className="weather-widget">
              <span className="material-symbols-outlined">wb_sunny</span>
              <div>
                <p className="weather-label">Today's Forecast</p>
                <p className="weather-value">Sunny, 24°C</p>
              </div>
            </div>
          </section>

          {/* Control Center */}
          <section className="control-center">
            <div className="section-header">
              <h3 className="section-title">Control Center</h3>
              <span className="section-subtitle">What would you like to do?</span>
            </div>

            <div className="action-grid">

              {/* Raise Complaint */}
              <div
                className="action-card primary-card"
                onClick={() => navigate("/user/complaint/new")}
                style={{ cursor: "pointer" }}
              >
                <div className="card-icon-wrapper primary-icon">
                  <span className="material-symbols-outlined">add_a_photo</span>
                </div>
                <div className="card-content">
                  <h4>Raise Complaint</h4>
                  <p>Report waste with photo & location details.</p>
                  <span>Start Now →</span>
                </div>
              </div>

              {/* My Complaints */}
              <div
                className="action-card"
                onClick={() => navigate("/user/complaints")}
                style={{ cursor: "pointer" }}
              >
                <div className="card-icon-wrapper green-icon">
                  <span className="material-symbols-outlined">assignment</span>
                </div>
                <div className="card-content">
                  <h4>My Complaints</h4>
                  <p>Track status of reports</p>
                </div>
              </div>

              {/* App Info */}
              <div
                className="action-card"
                onClick={() => navigate("/app-info")}
                style={{ cursor: "pointer" }}
              >
                <div className="card-icon-wrapper blue-icon">
                  <span className="material-symbols-outlined">info</span>
                </div>
                <div className="card-content">
                  <h4>App Info</h4>
                  <p>Learn how GreenSort works</p>
                </div>
              </div>

              {/* Profile */}
              <div
                className="action-card"
                onClick={() => navigate("/user/profile")}
                style={{ cursor: "pointer" }}
              >
                <div className="card-icon-wrapper purple-icon">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <div className="card-content">
                  <h4>Profile</h4>
                  <p>Manage account settings</p>
                </div>
              </div>

            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <span>GreenSort © 2023</span>
      </footer>
    </div>
  );
};

export default UserDashboard;
