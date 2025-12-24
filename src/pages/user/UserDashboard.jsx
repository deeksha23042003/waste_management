import React from 'react';
import './UserDashboard.css';

const UserDashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Top Navigation Bar */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-row">
            {/* Logo */}
            <div className="logo-section">
              <div className="logo-icon">
                <span className="material-symbols-outlined">recycling</span>
              </div>
              <h1 className="logo-text">GreenSort</h1>
            </div>

            {/* Navigation Links */}
            <nav className="nav-links">
              <a className="nav-link active" href="#">Home</a>
              <a className="nav-link" href="#">How it Works</a>
              <a className="nav-link" href="#">Community</a>
              <a className="nav-link" href="#">Contact</a>
            </nav>

            {/* Right Side Actions */}
            <div className="header-actions">
              <button className="notification-btn">
                <span className="material-symbols-outlined">notifications</span>
                <span className="notification-badge"></span>
              </button>
              <div className="user-avatar"></div>
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
                Let's keep our city clean together. Your contributions make a visible impact on the community.
              </p>
            </div>

            {/* Quick Date/Weather Widget */}
            <div className="weather-widget">
              <div className="weather-icon">
                <span className="material-symbols-outlined">wb_sunny</span>
              </div>
              <div>
                <p className="weather-label">Today's Forecast</p>
                <p className="weather-value">Sunny, 24°C</p>
              </div>
            </div>
          </section>

          {/* Stats Overview */}
          <section className="stats-section">
            <div className="stat-card">
              <div className="stat-icon green">
                <span className="material-symbols-outlined">check_circle</span>
              </div>
              <div>
                <p className="stat-label">Complaints Resolved</p>
                <p className="stat-value">12</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon yellow">
                <span className="material-symbols-outlined">emoji_events</span>
              </div>
              <div>
                <p className="stat-label">Community Rank</p>
                <p className="stat-value">Top 5%</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon primary">
                <span className="material-symbols-outlined">forest</span>
              </div>
              <div>
                <p className="stat-label">Trees Saved</p>
                <p className="stat-value">3</p>
              </div>
            </div>
          </section>

          {/* Main Action Grid */}
          <section className="control-center">
            <div className="section-header">
              <h3 className="section-title">Control Center</h3>
              <span className="section-subtitle">What would you like to do?</span>
            </div>

            <div className="action-grid">
              {/* Action 1: Raise Complaint */}
              <a className="action-card primary-card" href="#">
                <div className="card-bg-pattern">
                  <span className="material-symbols-outlined">add_a_photo</span>
                </div>
                <div className="card-icon-wrapper primary-icon">
                  <span className="material-symbols-outlined">add_a_photo</span>
                </div>
                <div className="card-content">
                  <h4 className="card-title">Raise Complaint</h4>
                  <p className="card-description">Report waste with photo & location details.</p>
                  <div className="card-action">
                    <span>Start Now</span>
                    <span className="material-symbols-outlined arrow">arrow_forward</span>
                  </div>
                </div>
              </a>

              {/* Action 2: My Complaints */}
              <a className="action-card" href="#">
                <div className="card-icon-wrapper green-icon">
                  <span className="material-symbols-outlined">assignment</span>
                </div>
                <div className="card-content">
                  <h4 className="card-title">My Complaints</h4>
                  <p className="card-description">Track status of your submitted reports.</p>
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                  <p className="progress-text">2 Active, 12 Resolved</p>
                </div>
              </a>

              {/* Action 3: App Info */}
              <a className="action-card" href="#">
                <div className="card-gradient"></div>
                <div className="card-icon-wrapper blue-icon">
                  <span className="material-symbols-outlined">info</span>
                </div>
                <div className="card-content">
                  <h4 className="card-title">App Info</h4>
                  <p className="card-description">Learn the GreenSort process & guidelines.</p>
                  <ul className="info-list">
                    <li>
                      <span className="material-symbols-outlined">circle</span> Sorting Guide
                    </li>
                    <li>
                      <span className="material-symbols-outlined">circle</span> Process Flow
                    </li>
                  </ul>
                </div>
              </a>

              {/* Action 4: Profile Page */}
              <a className="action-card" href="#">
                <div className="card-icon-wrapper purple-icon">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <div className="card-content">
                  <h4 className="card-title">Profile Page</h4>
                  <p className="card-description">Manage account details and settings.</p>
                  <div className="profile-info">
                    <div className="avatar-group">
                      <div className="mini-avatar"></div>
                      <div className="mini-avatar"></div>
                    </div>
                    <span className="level-text">Community Level 3</span>
                  </div>
                </div>
              </a>
            </div>
          </section>

          {/* Recent Updates / News Feed */}
          <section className="updates-section">
            <h3 className="section-title">Recent City Updates</h3>
            <div className="updates-grid">
              <div className="update-card">
                <div className="update-image schedule"></div>
                <div className="update-content">
                  <span className="update-badge">New Schedule</span>
                  <h5 className="update-title">Updated collection times for Ward 7</h5>
                  <p className="update-description">
                    Starting next Monday, collection trucks will arrive between 8 AM and 10 AM.
                  </p>
                </div>
              </div>

              <div className="update-card">
                <div className="update-image cleanup"></div>
                <div className="update-content">
                  <span className="update-badge">Event</span>
                  <h5 className="update-title">Community Clean-up Drive this Saturday</h5>
                  <p className="update-description">
                    Join us at Central Park for our monthly clean-up drive. Refreshments provided.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <div className="footer-icon">
              <span className="material-symbols-outlined">recycling</span>
            </div>
            <span className="footer-text">GreenSort © 2023</span>
          </div>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserDashboard;