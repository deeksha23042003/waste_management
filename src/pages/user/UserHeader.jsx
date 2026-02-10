import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
import "./UserHeader.css";

const UserHeader = ({ active = "home" }) => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const avatarUrl = localStorage.getItem("avatarUrl");

  // Fetch unread notifications count
  useEffect(() => {
    fetchUnreadCount();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000); // 30 seconds

    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchUnreadCount = async () => {
    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.email) {
        console.log("No user session found");
        return;
      }

      const userEmail = session.user.email;

      // Query notifications table for unread notifications matching user email
      const { data, error, count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('email', userEmail)
        .eq('readstatus', 'unread');

      if (error) {
        console.error("Error fetching unread count:", error);
        return;
      }

      setUnreadCount(count || 0);
    } catch (err) {
      console.error("Error in fetchUnreadCount:", err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    navigate("/user/login");
  };

  const handleNotificationClick = () => {
    navigate("/user/notifications");
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
              className={`nav-link ${active === "complaints" ? "active" : ""}`}
              to="/user/complaints"
            >
              My Complaints
            </Link>
            <Link
              className={`nav-link ${active === "contact" ? "active" : ""}`}
              to="/user/contact"
            >
              Feedback
            </Link>
          </nav>

          {/* Actions */}
          <div className="header-actions">
            {/* Notification Button */}
            <button 
              className="notification-btn" 
              onClick={handleNotificationClick}
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined">notifications</span>
              {unreadCount > 0 && (
                <span className="notification-badge">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
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