import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./UserDashboard.css";
import UserHeader from "./UserHeader";
import { useEffect } from "react";
const UserDashboard = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("loggedInEmail") || "";
  const firstName = localStorage.getItem("loggedInName") || "User";
  return (
    <>
    <UserHeader active="home" />
    <div className="dashboard-container">
     

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
                Welcome back, <span className="highlight">{firstName}</span>
              </h2>
              <p className="welcome-description">
                Let's keep our city clean together. Your contributions make a visible impact.
              </p>
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
                onClick={() => navigate("/user/complaint")}
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
                onClick={() => navigate("/how-it-works")}
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

    
      
    </div>
    </>
  );
};

export default UserDashboard;
