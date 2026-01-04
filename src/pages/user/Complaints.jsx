import { useState, useEffect } from 'react';
import { supabase } from '../../supabase.js';
import UserHeader from '../user/UserHeader.jsx';
import './Complaints.css';
import { useNavigate } from 'react-router-dom';
export default function Complaints() {
    const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
    fetchComplaints();
  }, []);

  useEffect(() => {
    filterComplaints();
  }, [complaints, activeFilter, searchQuery]);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('email', user.email)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComplaints(data || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterComplaints = () => {
    let filtered = [...complaints];

    if (activeFilter !== 'all') {
      filtered = filtered.filter(c => c.status.toLowerCase() === activeFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.location?.toLowerCase().includes(query) ||
        c.address?.toLowerCase().includes(query) ||
        c.id?.toString().includes(query)
      );
    }

    setFilteredComplaints(filtered);
  };

  const getStatusBadge = (status) => {
    const badges = {
      resolved: { class: 'status-resolved', icon: 'check_circle', text: 'RESOLVED' },
      'in progress': { class: 'status-progress', icon: 'sync', text: 'IN PROGRESS' },
      assigned: { class: 'status-assigned', icon: 'assignment_ind', text: 'ASSIGNED' },
      pending: { class: 'status-pending', icon: 'hourglass_empty', text: 'PENDING' }
    };
    return badges[status.toLowerCase()] || badges.pending;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just Now';
    if (hours < 24) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const openModal = (complaint) => {
    setSelectedComplaint(complaint);
    const modal = document.getElementById('detail-modal');
    if (modal) {
      modal.style.opacity = '1';
      modal.style.pointerEvents = 'auto';
    }
  };

  const closeModal = () => {
    const modal = document.getElementById('detail-modal');
    if (modal) {
      modal.style.opacity = '0';
      modal.style.pointerEvents = 'none';
    }
    setTimeout(() => setSelectedComplaint(null), 300);
  };

  const deleteComplaint = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this complaint?')) return;

    try {
      const { error } = await supabase
        .from('complaints')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setComplaints(complaints.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting complaint:', error);
      alert('Failed to cancel complaint');
    }
  };

  return (
    <>
      <UserHeader />
      <div className="complaints-page">
        <div className="complaints-container">
          <div className="page-header">
            <div className="header-content">
              <h2 className="page-title">My Complaints</h2>
              <p className="page-subtitle">Track your reported issues visually. Click on any card to view detailed resolution timelines and proof.</p>
            </div>
            <button className="btn-report-new" onClick={()=>{navigate('/user/complaint')}}>
              <span className="material-symbols-outlined">add_a_photo</span>
              <span>Report New Issue</span>
            </button>
          </div>

          <div className="controls-section">
            <div className="filter-tabs">
              <button 
                className={activeFilter === 'all' ? 'filter-tab active' : 'filter-tab'}
                onClick={() => setActiveFilter('all')}
              >
                All Cases
              </button>
              <button 
                className={activeFilter === 'resolved' ? 'filter-tab active' : 'filter-tab'}
                onClick={() => setActiveFilter('resolved')}
              >
                Resolved
              </button>
              <button 
                className={activeFilter === 'in progress' ? 'filter-tab active' : 'filter-tab'}
                onClick={() => setActiveFilter('in progress')}
              >
                In Progress
              </button>
              <button 
                className={activeFilter === 'pending' ? 'filter-tab active' : 'filter-tab'}
                onClick={() => setActiveFilter('pending')}
              >
                Pending
              </button>
            </div>

            <div className="search-container">
              <span className="material-symbols-outlined search-icon">search</span>
              <input 
                type="text" 
                className="search-input"
                placeholder="Search complaints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="state-container">
              <span className="material-symbols-outlined state-icon">hourglass_empty</span>
              <p className="state-text">Loading your complaints...</p>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="state-container">
              <span className="material-symbols-outlined state-icon">inbox</span>
              <p className="state-text">{searchQuery || activeFilter !== 'all' ? 'No complaints match your filters' : 'No complaints yet'}</p>
            </div>
          ) : (
            <div className="complaints-grid">
              {filteredComplaints.map((complaint) => {
                const statusBadge = getStatusBadge(complaint.status);
                const isPending = complaint.status.toLowerCase() === 'pending';
                const isResolved = complaint.status.toLowerCase() === 'resolved';

                return (
                  <div 
                    key={complaint.id} 
                    className={isResolved ? 'complaint-card card-resolved' : 'complaint-card'}
                    onClick={() => !isPending && openModal(complaint)}
                    style={{ cursor: isPending ? 'default' : 'pointer' }}
                  >
                    <div className="card-image-section">
                      {complaint.image_url ? (
                        <div 
                          className="complaint-image"
                          style={{ backgroundImage: `url(${complaint.image_url})` }}
                        />
                      ) : (
                        <div className="complaint-image-placeholder">
                          <span className="material-symbols-outlined">image</span>
                        </div>
                      )}
                      <div className="image-overlay" />
                      <div className={`badge-status ${statusBadge.class}`}>
                        <span className="material-symbols-outlined">{statusBadge.icon}</span>
                        <span>{statusBadge.text}</span>
                      </div>
                      <div className="card-info-overlay">
                        <div className="card-meta-info">
                          <span className="complaint-number">#GS-{complaint.id} </span>
                          <span className="complaint-date">{formatDate(complaint.created_at)}</span>
                        </div>
                        {/* <h3 className="complaint-title">{complaint.location}</h3> */}
                        <p className="complaint-address">
                          <span className="material-symbols-outlined">location_on</span>
                          <span>{complaint.address}</span>
                        </p>
                      </div>
                    </div>

                    <div className="card-body">
                      {isPending ? (
                        <div className="pending-content">
                          <p className="pending-text">
                             Awaiting review by municipal team.
                          </p>
                          <div className="pending-buttons">
                            <button 
                              className="btn-action-cancel"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteComplaint(complaint.id);
                              }}
                            >
                              Cancel
                            </button>
                            <button className="btn-action-edit">Edit</button>
                          </div>
                        </div>
                      ) : complaint.feedback ? (
                        <div className="feedback-content">
                          <div className="feedback-icon-box">
                            <span className="material-symbols-outlined">
                              {isResolved ? 'sentiment_satisfied' : 'engineering'}
                            </span>
                          </div>
                          <div className="feedback-text-box">
                            <p className="feedback-heading">
                              {isResolved ? 'Feedback Received' : 'Assigned to Team'}
                            </p>
                            <p className="feedback-message">{complaint.feedback}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="progress-content">
                          <div className="progress-icon-box">
                            <span className="material-symbols-outlined">schedule</span>
                          </div>
                          <div className="progress-text-box">
                            <p className="progress-heading">Default</p>
                            <p className="progress-message">Unhandled status</p>
                          </div>
                        </div>
                      )}

                      {!isPending && (
                        <div className="card-bottom">
                          <span className="card-action-text">
                            {isResolved ? 'Tap to view proof' : 'View Details'}
                          </span>
                          {isResolved ? (
                            <div className="avatar-list">
                              <div className="user-avatar" />
                            </div>
                          ) : (
                            <span className="material-symbols-outlined">arrow_forward</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div id="detail-modal" className="complaint-modal">
          {selectedComplaint && (
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-left">
                <div className="modal-image-section">
                  {selectedComplaint.image_url ? (
                    <div 
                      className="modal-image-display"
                      style={{ backgroundImage: `url(${selectedComplaint.image_url})` }}
                    />
                  ) : (
                    <div className="modal-image-empty">
                      <span className="material-symbols-outlined">image</span>
                    </div>
                  )}
                  <div className="modal-label">Reported Issue</div>
                </div>
                <div className="modal-image-section">
                  <div className="modal-image-empty">
                    <span className="material-symbols-outlined">verified</span>
                    <p>Resolution proof not available</p>
                  </div>
                  <div className="modal-label modal-label-proof">
                    <span className="material-symbols-outlined">verified</span>
                    <span>Resolution Proof</span>
                  </div>
                </div>
                <button className="btn-close-modal-mobile" onClick={closeModal}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="modal-right">
                <div className="modal-top">
                  <div className="modal-info">
                    <div className="modal-status-line">
                      <span className={`dot-status dot-${selectedComplaint.status.toLowerCase()}`} />
                      <span className="status-text">{selectedComplaint.status}</span>
                      <span className="modal-complaint-id">#GS-{selectedComplaint.id}</span>
                    </div>
                    <h2 className="modal-title">{selectedComplaint.location}</h2>
                    <p className="modal-location">
                      <span className="material-symbols-outlined">location_on</span>
                      <span>{selectedComplaint.address}</span>
                    </p>
                  </div>
                  <button className="btn-close-modal" onClick={closeModal}>
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="modal-timeline">
                  <h3 className="timeline-heading">Resolution Timeline</h3>
                  <div className="timeline-list">
                    <div className="timeline-entry timeline-active">
                      <div className="timeline-marker timeline-marker-resolved" />
                      <div className="timeline-content">
                        <p className="timeline-event">Issue Resolved</p>
                        <p className="timeline-time">{formatDate(selectedComplaint.created_at)}</p>
                        {selectedComplaint.feedback && (
                          <div className="timeline-quote">
                            <p>{selectedComplaint.feedback}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="timeline-entry">
                      <div className="timeline-marker" />
                      <div className="timeline-content">
                        <p className="timeline-event">Cleanup In Progress</p>
                        <p className="timeline-time">{formatDate(selectedComplaint.created_at)}</p>
                      </div>
                    </div>
                    <div className="timeline-entry">
                      <div className="timeline-marker" />
                      <div className="timeline-content">
                        <p className="timeline-event">Assigned to Ward {selectedComplaint.ward_number}</p>
                        <p className="timeline-time">{formatDate(selectedComplaint.created_at)}</p>
                      </div>
                    </div>
                    <div className="timeline-entry">
                      <div className="timeline-marker" />
                      <div className="timeline-content">
                        <p className="timeline-event">Report Submitted</p>
                        <p className="timeline-time">{formatDate(selectedComplaint.created_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-buttons">
                  <button className="btn-modal-primary">Download Report</button>
                  <button className="btn-modal-secondary">Rate Service</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}