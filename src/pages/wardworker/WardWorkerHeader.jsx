import React, { useState,useEffect } from 'react';
import './WardWorkerHeader.css';
import { supabase } from '../../supabase';
const WardWorkerHeader = () => {
  const [avatarUrl,setAvatarUrl] = useState("");
  const [name,setName]=useState("");
const [wardNumber, setWardNumber] = useState("");


 const fetchProfile = async () => {
    // 1️⃣ Get logged-in user from Supabase session
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User not logged in");
      return;
    }

    // 2️⃣ Fetch profile details using user.id
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, ward_number, avatar_url")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return;
    }

    // 3️⃣ Set state
    setName(data.full_name);
    setWardNumber(data.ward_number);
    setAvatarUrl(data.avatar_url);
  };
  useEffect(()=>{
    fetchProfile();
  },[])

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
           
            
            <div className="ward-divider"></div>
            
            <div className="ward-profile">
              <div className="profile-info">
                <p className="profile-name">{name|| ""}</p>
                <p className="profile-ward">Ward {wardNumber}</p>
              </div>
              <img 
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