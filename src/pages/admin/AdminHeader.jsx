import React from 'react'
import './AdminHeader.css'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../supabase';
import { useNavigate } from 'react-router-dom';

const AdminHeader = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const menuRef = useRef(null);

    useEffect(() => {
        const checkAdminAccess = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) return navigate("/user/login");

                const { data, error } = await supabase
                    .from("profiles")
                    .select("id, avatar_url")
                    .eq("id", user.id)
                    .eq("user_type", "admin")
                    .single();

                if (error || !data) {
                    navigate("/user/login");
                } else {
                    setAvatarUrl(data.avatar_url || null);
                }
            } catch (err) {
                navigate("/user/login");
            }
        };

        checkAdminAccess();
    }, [navigate]);

    // close popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/user/login");
    };

    return (
        <header className="vrp-header">
            <div className="vrp-header-left">
                <div className="vrp-logo">
                    <span className="material-symbols-outlined vrp-logo-icon">recycling</span>
                </div>
                <h2 className="vrp-header-title">GreenSort Admin</h2>
                <nav className="vrp-nav-links">
                    <a href="/admin/complaints" className="vrp-nav-link">
                        <span className="material-symbols-outlined">report_problem</span>
                        Complaints
                    </a>
                    <a href="/admin/verify-resolution" className="vrp-nav-link">
                        <span className="material-symbols-outlined">fact_check</span>
                        Verify Resolution
                    </a>
                    <a href="/admin/users" className="vrp-nav-link">
                        <span className="material-symbols-outlined">person</span>
                        Users
                    </a>
                    <a href="/admin/feedback" className="vrp-nav-link">
                        <span className="material-symbols-outlined">feedback</span>
                        Feedback
                    </a>
                </nav>
            </div>
            <div className="vrp-header-right">
                <span className="vrp-badge">Admin Verification Mode</span>
                <div className="vrp-divider"></div>
                <div className="vrp-avatar-wrapper">
                    <div
                        className="vrp-avatar"
                        onClick={() => setShowMenu(!showMenu)}
                        style={avatarUrl ? {
                            backgroundImage: `url(${avatarUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        } : {}}
                    />
                    {showMenu && (
                        <div className="vrp-avatar-menu" ref={menuRef}>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminHeader