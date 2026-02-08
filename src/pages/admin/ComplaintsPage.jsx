import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import { supabase } from '../../supabase';
import './ComplaintsPage.css';

const ComplaintsPage = () => {
    const [complaints, setComplaints] = useState([]);
    const [profiles, setProfiles] = useState({});
    const [wards, setWards] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedWard, setSelectedWard] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [totalCount, setTotalCount] = useState(0);
    const [resolvingCount, setResolvingCount] = useState(0);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        fetchData();
        // Default to light mode
        const isDarkMode = localStorage.getItem('color-theme') === 'dark';
        setIsDark(isDarkMode);
    }, [selectedWard, selectedStatus, searchTerm]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch profiles first
            const { data: profilesData } = await supabase
                .from('profiles')
                .select('*');
            
            const profilesMap = {};
            profilesData?.forEach(profile => {
                profilesMap[profile.id] = profile;
            });
            setProfiles(profilesMap);

            // Fetch ward details
            const { data: wardsData } = await supabase
                .from('ward_details')
                .select('*');
            
            const wardsMap = {};
            wardsData?.forEach(ward => {
                wardsMap[ward.ward_number] = ward;
            });
            setWards(wardsMap);

            // Build query for complaints
            let query = supabase
                .from('complaints')
                .select('*', { count: 'exact' })
                .order('created_at', { ascending: false });

            // Apply filters
            if (selectedWard !== 'all') {
                query = query.eq('ward_number', selectedWard);
            }
            if (selectedStatus !== 'all') {
                query = query.eq('status', selectedStatus);
            }
            if (searchTerm) {
                query = query.or(`id.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
            }

            const { data: complaintsData, count } = await query.limit(8);

            setComplaints(complaintsData || []);
            setTotalCount(count || 0);

            // Count resolving complaints
            const { count: resolvingTotal } = await supabase
                .from('complaints')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'resolving');
            
            setResolvingCount(resolvingTotal || 0);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleDarkMode = () => {
        const newDarkMode = !isDark;
        setIsDark(newDarkMode);
        localStorage.setItem('color-theme', newDarkMode ? 'dark' : 'light');
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            pending: 'complaints-status-pending',
            resolving: 'complaints-status-progress',
            resolved: 'complaints-status-resolved'
        };
        const statusText = {
            pending: 'Pending',
            resolving: 'In Progress',
            resolved: 'Resolved'
        };
        return (
            <span className={`complaints-status-badge ${statusClasses[status] || statusClasses.pending}`}>
                {statusText[status] || status}
            </span>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
        } else if (diffDays === 1) {
            return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        }
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getUniqueWards = () => {
        const wardNumbers = new Set();
        Object.values(wards).forEach(ward => {
            wardNumbers.add(ward.ward_number);
        });
        return Array.from(wardNumbers).sort((a, b) => a - b);
    };

    return (
        <div className={`complaints-page ${isDark ? 'complaints-dark' : ''}`}>
            <AdminHeader />
            
            <main className="complaints-main">
                <header className="complaints-header">
                    <div className="complaints-header-content">
                        <div className="complaints-header-top">
                            <div>
                                <h1 className="complaints-title">Complaints Master List</h1>

                            </div>
                            <div className="complaints-header-actions">
                                {resolvingCount > 0 && (
                                    <a 
                                        href="http://localhost:5173/admin/verify-resolution"
                                        className="complaints-btn-resolving"
                                    >
                                        <span className="material-icons-round">pending_actions</span>
                                        {resolvingCount} Resolving Complaint{resolvingCount !== 1 ? 's' : ''} - Proceed to Resolution
                                    </a>
                                )}
                                <button 
                                    className="complaints-theme-toggle"
                                    onClick={toggleDarkMode}
                                >
                                    <span className="material-icons-round">
                                        {isDark ? 'light_mode' : 'dark_mode'}
                                    </span>
                                </button>
                               
                            </div>
                        </div>

                        <div className="complaints-filters">
                            <div className="complaints-filters-row">
                                <div className="complaints-search-wrapper">
                                    <div className="complaints-search-icon">
                                        <span className="material-icons-round">search</span>
                                    </div>
                                    <input
                                        className="complaints-search-input"
                                        placeholder="Search by ID, Address, or Keywords..."
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <select 
                                    className="complaints-select"
                                    value={selectedWard}
                                    onChange={(e) => setSelectedWard(e.target.value)}
                                >
                                    <option value="all">All Wards</option>
                                    {getUniqueWards().map(wardNum => (
                                        <option key={wardNum} value={wardNum}>
                                            Ward {wardNum} - {wards[wardNum]?.ward_name || 'Unknown'}
                                        </option>
                                    ))}
                                </select>

                                <select 
                                    className="complaints-select"
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="resolving">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                            </div>

                            <div className="complaints-count">
                                <span className="complaints-count-number">{totalCount}</span> complaints found
                            </div>
                        </div>
                    </div>
                </header>

                <div className="complaints-content">
                    {loading ? (
                        <div className="complaints-loading">Loading complaints...</div>
                    ) : complaints.length === 0 ? (
                        <div className="complaints-empty">No complaints found</div>
                    ) : (
                        <div className="complaints-grid">
                            {complaints.map((complaint) => {
                                const assignee = profiles[complaint.avatar_url];
                                const isResolved = complaint.status === 'resolved';
                                
                                return (
                                    <article 
                                        key={complaint.id} 
                                        className={`complaints-card ${isResolved ? 'complaints-card-resolved' : ''}`}
                                    >
                                        <div className="complaints-card-image-wrapper">
                                            <img
                                                alt={complaint.description}
                                                className={`complaints-card-image ${isResolved ? 'complaints-card-image-grayscale' : ''}`}
                                                src={complaint.image_url || 'https://via.placeholder.com/400x300?text=No+Image'}
                                            />
                                            <div className="complaints-card-badge">
                                                {getStatusBadge(complaint.status)}
                                            </div>
                                            <div className="complaints-card-date-overlay">
                                                <div className="complaints-card-date">
                                                    <span className="material-icons-round">calendar_today</span>
                                                    {formatDate(complaint.created_at)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="complaints-card-content">
                                            <div className="complaints-card-header">
                                                <h3 className="complaints-card-id">
                                                    #{complaint.id}
                                                </h3>
                                                <div className="complaints-card-ward">
                                                    <span className="material-icons-round">location_city</span>
                                                    Ward {complaint.ward_number}
                                                </div>
                                            </div>

                                            <p className="complaints-card-title">
                                                {complaint.location || 'No location provided'}
                                            </p>
                                            <p className="complaints-card-description">
                                                {complaint.description || 'No description available'}
                                            </p>

                                           
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}

                    <div className="complaints-pagination">
                        <div className="complaints-pagination-info">
                            Showing <span className="complaints-pagination-number">1</span> to{' '}
                            <span className="complaints-pagination-number">{Math.min(8, totalCount)}</span> of{' '}
                            <span className="complaints-pagination-number">{totalCount}</span> results
                        </div>
                        <div className="complaints-pagination-buttons">
                            <button className="complaints-pagination-btn complaints-pagination-btn-disabled">
                                Previous
                            </button>
                            <button className="complaints-pagination-btn">Next</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ComplaintsPage;