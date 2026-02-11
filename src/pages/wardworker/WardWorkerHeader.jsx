import React, { useState, useEffect } from 'react';
import './WardWorkerHeader.css';
import { supabase } from '../../supabase';

const WardWorkerHeader = () => {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [name, setName] = useState("");
  const [wardNumber, setWardNumber] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isWorker, setIsWorker] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const closeMenu = (e) => {
      if (!e.target.closest(".ward-profile") &&
          !e.target.closest(".profile-menu")) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert("Logout failed");
      console.error(error);
      return;
    }

    // Clear any local storage if used
    localStorage.clear();

    // Redirect to login page
    window.location.href = "/user/login";
  };

  const checkUserType = async (userEmail) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('email', userEmail)
        .single();

      if (error) throw error;

      if (data.user_type !== 'worker') {
        // Redirect to appropriate page based on user type
        if (data.user_type === 'citizen') {
          window.location.href = '/user/dashboard';
        } else if (data.user_type === 'admin') {
          window.location.href = '/admin/dashboard';
        } else {
          window.location.href = '/user/login';
        }
        return false;
      }
      
      setIsWorker(true);
      return true;
    } catch (err) {
      console.error('Error checking user type:', err);
      window.location.href = '/user/login';
      return false;
    }
  };

  const fetchUnreadCount = async (userEmail) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('email', userEmail)
        .eq('type_of_user', 'worker')
        .eq('readstatus', 'unread');

      if (error) throw error;

      setUnreadCount(data || 0);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      // Get logged-in user from Supabase session
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("User not logged in");
        window.location.href = '/user/login';
        return;
      }

      // Check if user is a worker
      const isValidWorker = await checkUserType(user.email);
      if (!isValidWorker) return;

      // Fetch profile details using user.id
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, ward_number, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      // Set state
      setName(data.full_name);
      setWardNumber(data.ward_number);
      setAvatarUrl(data.avatar_url);

      // Fetch unread notifications count
      await fetchUnreadCount(user.email);
    } catch (err) {
      console.error('Error in fetchProfile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
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
          </div>
        </div>
      </nav>
    );
  }

  if (!isWorker) return null;

  return (
    <nav className="ward-header">
      <div className="ward-header-container" style={{width:"100vw"}}>
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
            <a href="/wardworker/dashboard" className="ward-nav-link">
              <span className="material-symbols-outlined">home</span>
              Home
            </a>
            
            <a href="/wardworker/notifications" className="ward-nav-link ward-nav-notifications">
              <span className="material-symbols-outlined">notifications</span>
              Notifications
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </a>
          </div>

          <div className="ward-header-right">
            {/* Mobile navigation */}
            <div className="ward-nav-mobile">
              <a href="/wardworker/dashboard" className="ward-nav-icon" title="Home">
                <span className="material-symbols-outlined">home</span>
              </a>
              
              <a href="/wardworker/notifications" className="ward-nav-icon ward-nav-notifications" title="Notifications">
                <span className="material-symbols-outlined">notifications</span>
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount}</span>
                )}
              </a>
            </div>
            
            <div className="ward-divider"></div>
            
            <div className="ward-profile">
              {showMenu && (
                <div className="profile-menu">
                  <button
                    className="profile-menu-item logout"
                    onClick={handleLogout}
                  >
                    <span className="material-symbols-outlined">logout</span>
                    Logout
                  </button>
                </div>
              )}

              <div className="profile-info">
                <p className="profile-name">{name || ""}</p>
                <p className="profile-ward">Ward {wardNumber}</p>
              </div>
              <img 
                onClick={() => setShowMenu(!showMenu)}
                src={avatarUrl || "https://rdxbrzfvjahdkzmpqwuc.supabase.co/storage/v1/object/public/WasteLocationBucket/default.jpg"}
                alt="Profile"
                className="ward-profile-avatar"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default WardWorkerHeader;