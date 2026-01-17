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
const [resolvedImage, setResolvedImage] = useState(null);
const openModal = async (complaint) => {
  setSelectedComplaint(complaint);
  setResolvedImage(null);

  // fetch resolved image (if any)
  const { data } = await supabase
    .from("resolved_details")
    .select("resolved_image")
    .eq("complaint_id", complaint.id)
    .single();

  if (data?.resolved_image) {
    setResolvedImage(data.resolved_image);
  }

  const modal = document.getElementById("detail-modal");
  if (modal) {
    modal.style.opacity = "1";
    modal.style.pointerEvents = "auto";
  }
};
const closeModal = () => {
  const modal = document.getElementById("detail-modal");

  if (modal) {
    modal.style.opacity = "0";
    modal.style.pointerEvents = "none";
  }

  // clear selected data after animation
  setTimeout(() => {
    setSelectedComplaint(null);
    setResolvedImage(null);
  }, 300);
};

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
      pending: { class: 'status-pending', icon: 'hourglass_empty', text: 'PENDING' },
      resolving:{ class: 'status-resolving', icon: 'hourglass_empty', text: 'RESOLVING' }
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
                const isResolving=complaint.status.toLowerCase() === 'resolving';

                return (
                  <div 
                    key={complaint.id} 
                    className={isResolved ? 'complaint-card card-resolved' : 'complaint-card'}
                    onClick={() => (!isResolving ) && openModal(complaint)}
                    style={{ cursor: (isResolving ) ? 'default' : 'pointer' }}
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
                         
                          <div className="progress-text-box">
                           
                            <p className="progress-message">{complaint.status}</p>
                          </div>
                        </div>
                      )}
                      {complaint.status === "resolving" && (
  <div className="resolving-content">
    <div className="resolving-icon-box">
      <span className="material-symbols-outlined">pending_actions</span>
    </div>

    <div className="resolving-text-box">
      <p className="resolving-heading">Verification Pending</p>
      <p className="resolving-message">
        Cleanup completed. Awaiting admin approval.
      </p>
    </div>
  </div>
)}

                      {isResolved && (
                        <div className="card-bottom">
                          <span className="card-action-text">
                           Tap to view proof
                          </span>
                          
                            <span className="material-symbols-outlined">arrow_forward</span>
                          
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

       <div id="detail-modal" className="simple-modal" onClick={closeModal}>
  {selectedComplaint && (
    <div className="simple-modal-content" onClick={(e) => e.stopPropagation()}>
      
      <div className="modal-header">
        <h3>Complaint #{selectedComplaint.id}</h3>
        <button onClick={closeModal}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="modal-images">
        {/* BEFORE IMAGE */}
        <div className="image-box">
          <p className="image-label">Before</p>
          <img
            src={selectedComplaint.image_url}
            alt="Reported issue"
          />
        </div>

        {/* AFTER IMAGE */}
        <div className="image-box">
          <p className="image-label">After</p>
          {resolvedImage ? (
            <img src={resolvedImage} alt="Resolved proof" />
          ) : (
            <div className="no-image">Not resolved yet</div>
          )}
          
        </div>
      </div>

      <div className="modal-footer">
        <p><strong>Address:</strong> {selectedComplaint.address}</p>
        <p><strong>Status:</strong> {selectedComplaint.status}</p>
      </div>

    </div>
  )}
</div>

      </div>
    </>
  );
}