import React from 'react';
import './WardWorkerHeader.css';

const WardWorkerHeader = () => {
  return (
    <nav className="ward-header">
      <div className="ward-header-container">
        <div className="ward-header-content">
          <div className="ward-header-left">
            <div className="ward-logo">
              <span className="material-symbols-outlined filled">recycling</span>
            </div>
            <div className="ward-brand">
              <h1 className="ward-title">GreenSort</h1>
              <p className="ward-subtitle">Ward Worker</p>
            </div>
          </div>

          <div className="ward-nav-center">
            <a href="#" className="ward-nav-link active">
              Complaints
            </a>
            <a href="#" className="ward-nav-link">
              History
            </a>
            <a href="#" className="ward-nav-link ward-nav-notifications">
              Notifications
              <span className="notification-dot"></span>
            </a>
          </div>

          <div className="ward-header-right">
            <div className="ward-status">
              <span className="status-indicator">
                <span className="status-ping"></span>
                <span className="status-dot"></span>
              </span>
              <span className="status-text">Active</span>
            </div>
            
            <div className="ward-divider"></div>
            
            <div className="ward-profile">
              <div className="profile-info">
                <p className="profile-name">Raju Kumar</p>
                <p className="profile-ward">Ward #12</p>
              </div>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJJKTWTarzXrCwSmcrZR9CZB4mWVGHc6HO3rjq1PuNeLjJzllfkKN4qNmW-98DF9PoCHPLCZUBmWlwSLLL72cGN1QWhjjT8Kw6x7mnH2YyEiKWZdtHswnj8249ifzJL3urjTxOt61xLYp-9eWZ2Ew0FF6xuYkm_y84NDXpnNxhDkmMHjgGoUz7mPm2NYNaq2MVGfohaZ71hZWPdizJrg5dcD2bJyHeqEiDBPQ70xRKs126-Mx-7RHDdW34c0SvpW0dDTyvfne2EQQ"
                alt="Profile"
                className="profile-avatar"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default WardWorkerHeader;