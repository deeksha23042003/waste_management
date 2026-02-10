import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import UserHeader from './UserHeader.jsx';
import './UserNotificationPage.css';

const UserNotificationPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all' or 'unread'
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAllAsRead = async (userEmail) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ readstatus: 'read' })
                .eq('email', userEmail)
                .eq('type_of_user', 'user')
                .eq('readstatus', 'unread');

            if (error) {
                console.error('Error marking notifications as read:', error);
            }
        } catch (err) {
            console.error('Error in markAllAsRead:', err);
        }
    };

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get current user email (you may need to adjust this based on your auth setup)
            
            
            const { data:dat1, error:err1 } = await supabase.auth.getUser();
            const userEmail = dat1.user?.email;
            if (!userEmail) {
                setError('User not authenticated');
                return;
            }

            // Fetch notifications for the current user
            const { data, error } = await supabase
                .from('notifications')
                .select(`
                    id,
                    created_at,
                    email,
                    complaint_id,
                    type_of_user,
                    message,
                    readstatus,
                    complaints (
                        id,
                        image_url,
                        location,
                        address,
                        ward_number,
                        status,
                        description
                    )
                `)
                .eq('type_of_user', 'user')
                .eq('email', userEmail)
                .order('created_at', { ascending: false });
                console.log('Supabase query executed with email:', userEmail);
                console.log('Fetched notifications:', data);
            if (error) throw error;

            setNotifications(data || []);

            // Mark all notifications as read after fetching
            await markAllAsRead(userEmail);
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setError('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            resolved: {
                label: 'Resolved',
                className: 'status-badge-resolved',
                icon: '✓'
            },
            'in-progress': {
                label: 'In Progress',
                className: 'status-badge-progress',
                icon: '⟳'
            },
            'in progress': {
                label: 'In Progress',
                className: 'status-badge-progress',
                icon: '⟳'
            },
            rejected: {
                label: 'Rejected',
                className: 'status-badge-rejected',
                icon: '✕'
            },
            pending: {
                label: 'Pending',
                className: 'status-badge-pending',
                icon: '○'
            }
        };

        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span className={`status-badge ${config.className}`}>
                <span className="status-icon">{config.icon}</span>
                {config.label}
            </span>
        );
    };

    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const created = new Date(timestamp);
        const diffInSeconds = Math.floor((now - created) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
        return created.toLocaleDateString();
    };

    const getStatusBorderClass = (status) => {
        if (status === 'in-progress' || status === 'in progress') return 'border-progress';
        if (status === 'rejected') return 'border-rejected';
        return '';
    };

    const filteredNotifications = filter === 'unread' 
        ? notifications.filter(n => n.readstatus === 'unread') 
        : notifications;

    if (loading) {
        return (
            <div className="notification-page">
                <UserHeader />
                <main className="notification-main">
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Loading notifications...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="notification-page">
            <UserHeader />
            
            <main className="notification-main">
                <div className="notification-header">
                    <div className="header-text">
                        <h1>Notifications</h1>
                        <p>Stay updated on the status of your reported complaints.</p>
                    </div>
                    
                    <div className="filter-buttons">
                        <button 
                            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            All Updates
                        </button>
                        <button 
                            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
                            onClick={() => setFilter('unread')}
                        >
                            Unread
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="error-message">
                        <span className="material-icons">error</span>
                        <p>{error}</p>
                        <button onClick={fetchNotifications}>Retry</button>
                    </div>
                )}

                <div className="notifications-list">
                    {filteredNotifications.length === 0 ? (
                        <div className="empty-state">
                            <span className="material-icons">notifications_none</span>
                            <h3>No notifications yet</h3>
                            <p>Your complaint updates will appear here</p>
                        </div>
                    ) : (
                        filteredNotifications.map((notification) => {
                            const complaint = notification.complaints;
                            
                            return (
                                <div 
                                    key={notification.id} 
                                    className={`notification-card ${getStatusBorderClass(complaint?.status)}`}
                                >
                                    <div className="card-content">
                                        <div className="card-body">
                                            <div className="image-container">
                                                {complaint?.image_url ? (
                                                    <img 
                                                        src={complaint.image_url} 
                                                        alt="Complaint location"
                                                        className="complaint-image"
                                                    />
                                                ) : (
                                                    <div className="no-image">
                                                        <span className="material-icons">image_not_supported</span>
                                                    </div>
                                                )}
                                                <div className="image-label">
                                                    {complaint?.status === 'resolved' ? 'Before' : 'Pending'}
                                                </div>
                                            </div>

                                            <div className="notification-details">
                                                <div className="meta-info">
                                                    <span className="complaint-id">
                                                        Complaint #{notification.complaint_id}
                                                    </span>
                                                    <span className="ward-badge">
                                                        <span className="material-icons">map</span>
                                                        Ward {complaint?.ward_number || 'N/A'}
                                                    </span>
                                                    <span className="time-ago">
                                                        <span className="material-icons">schedule</span>
                                                        {getTimeAgo(notification.created_at)}
                                                    </span>
                                                </div>

                                                <h3 className="notification-title">
                                                    {complaint?.description || 'Complaint Update'}
                                                </h3>

                                                <p className="notification-message">
                                                    {notification.message}
                                                </p>

                                                
                                            </div>
                                        </div>

                                        <div className="status-container">
                                            {getStatusBadge(complaint?.status)}
                                        </div>
                                    </div>

                                    {complaint?.status === 'resolved' && (
                                        <div className="card-footer">
                                            <p className="verification-text">
                                                Verified by Admin Agent
                                            </p>
                                            
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}

                  
                </div>
            </main>

           
        </div>
    );
};

export default UserNotificationPage;