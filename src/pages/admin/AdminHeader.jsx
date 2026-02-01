import React from 'react'
import './AdminHeader.css'
import { useEffect } from 'react'
import { supabase } from '../../supabase';
import { useNavigate } from 'react-router-dom';
const AdminHeader = () => {
    const navigate=useNavigate();
  useEffect(() => {
  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return navigate("/user/login");

      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .eq("user_type", "admin")
        .single();

      if (error || !data) {
        navigate("/user/login");
      }
    } catch (err) {
      navigate("/user/login");
    }
  };

  checkAdminAccess();
}, [navigate]);

  return (
   <header className="vrp-header">
        <div className="vrp-header-left">
          <div className="vrp-logo">
            <span className="material-symbols-outlined vrp-logo-icon">recycling</span>
          </div>
          <h2 className="vrp-header-title">GreenSort Admin</h2>
        </div>
        <div className="vrp-header-right">
          <span className="vrp-badge">Admin Verification Mode</span>
          <div className="vrp-divider"></div>
          <div className="vrp-avatar"></div>
        </div>
      </header>
  )
}

export default AdminHeader