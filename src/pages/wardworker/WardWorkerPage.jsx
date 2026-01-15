import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import WardWorkerHeader from './WardWorkerHeader';
import './WardWorkerPage.css';

const WardWorkerPage = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [allComplaints, setAllComplaints] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [uploadingComplaint, setUploadingComplaint] = useState(null);
  const [proofImage, setProofImage] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (profile?.ward_number) {
      fetchComplaints();
    }
  }, [profile, filter]);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        window.location.href = '/login';
        return;
      }

      setUser(session.user);

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', session.user.email)
        .single();

      if (error) throw error;

      if (profileData.user_type !== 'worker') {
        alert('Access denied. This page is only for ward workers.');
        window.location.href = '/';
        return;
      }

      setProfile(profileData);
    } catch (error) {
      console.error('Error checking user:', error);
      setLoading(false);
    }
  };

  const fetchComplaints = async () => {
    try {
      setLoading(true);

       // Fetch ALL complaints for stats
    const { data: allData } = await supabase
      .from('complaints')
      .select('*')
      .eq('ward_number', profile.ward_number);
    
    setAllComplaints(allData || []);

      let query = supabase
        .from('complaints')
        .select('*')
        .eq('ward_number', profile.ward_number)
        .order('created_at', { ascending: false });

      if (filter === 'pending') {
        query = query.eq('status', 'pending');
      } else if (filter === 'in progress') {
        query = query.eq('status', 'in progress');
      } else if (filter === 'resolving') {
        query = query.eq('status', 'resolving');
      } else if (filter === 'all') {
        // Show all except resolved
        query = query.neq('status', 'resolved');
      }

      const { data, error } = await query;

      if (error) throw error;
      setComplaints(data || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const startTask = async (complaintId) => {
    try {
      const { error } = await supabase
        .from('complaints')
        .update({ status: 'in progress' })
        .eq('id', complaintId);

      if (error) throw error;
      fetchComplaints();
    } catch (error) {
      console.error('Error starting task:', error);
      alert('Failed to start task');
    }
  };

  const handleImageSelect = (e, complaintId) => {
    const file = e.target.files[0];
    if (file) {
      setProofImage(file);
      setUploadingComplaint(complaintId);
    }
  };

  const uploadProofAndResolve = async (complaint) => {
    if (!proofImage) {
      alert('Please select a proof image');
      return;
    }

    try {
      setUploading(true);

      const fileExt = proofImage.name.split('.').pop();
      const fileName = `${complaint.id}_${Date.now()}.${fileExt}`;
      const filePath = `resolved/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('WasteLocationBucket')
        .upload(filePath, proofImage);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('WasteLocationBucket')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from('resolved_details')
        .insert({
          complaint_id: complaint.id,
          resolved_image: publicUrl,
          email: user.email
        });

      if (insertError) throw insertError;

      const { error: updateError } = await supabase
        .from('complaints')
        .update({ status: 'resolving' })
        .eq('id', complaint.id);

      if (updateError) throw updateError;

      setUploadingComplaint(null);
      setProofImage(null);
      setRemarks('');
      fetchComplaints();
      alert('Proof uploaded successfully! Waiting for admin approval.');
    } catch (error) {
      console.error('Error uploading proof:', error);
      alert('Failed to upload proof');
    } finally {
      setUploading(false);
    }
  };

  const getStats = () => {
    const assigned = allComplaints.length;
    const pending = allComplaints.filter(c => c.status === 'pending').length;
    const resolved = allComplaints.filter(c => c.status === 'resolved').length;
   const resolving = allComplaints.filter(c => c.status === 'resolving').length;
const inprogress = allComplaints.filter(c => c.status === 'in progress').length;
    return { assigned, pending, resolved,resolving,inprogress};
  };

  const stats = getStats();

  if (loading && !profile) {
    return (
      <div className="ward-worker-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="ward-worker-page">
      <WardWorkerHeader profile={profile} />

      <main className="ward-worker-main">
        <header className="page-header">
          <div>
            <h2>Complaint Management</h2>
            <p>Manage tasks for Ward #{profile?.ward_number}</p>
          </div>
          <div className="header-actions">
            <div className="today-tasks">
              <span className="material-symbols-outlined">calendar_today</span>
              <span>Today's Tasks: {stats.assigned}</span>
            </div>
          </div>
        </header>

        <div className="content-area">
          <div className="stats-grid">
            <div className="stat-card">
              <div>
                <p className="stat-label">Assigned</p>
                <p className="stat-value">{stats.assigned}</p>
              </div>
              <div className="stat-icon blue">
                <span className="material-symbols-outlined">assignment_add</span>
              </div>
            </div>

            <div className="stat-card">
              <div>
                <p className="stat-label">Pending</p>
                <p className="stat-value orange">{stats.pending}</p>
              </div>
              <div className="stat-icon orange">
                <span className="material-symbols-outlined">pending</span>
              </div>
            </div>

            <div className="stat-card">
              <div>
                <p className="stat-label">In Progress</p>
                <p className="stat-value orange">{stats.inprogress}</p>
              </div>
              <div className="stat-icon orange">
                <span className="material-symbols-outlined">autorenew</span>
              </div>
            </div>
<div className="stat-card">
  <div>
    <p className="stat-label">Resolving</p>
    <p className="stat-value" style={{color: '#f59e0b'}}>{stats.resolving}</p>
  </div>
  <div className="stat-icon" style={{background: '#fef3c7', color: '#f59e0b'}}>
    <span className="material-symbols-outlined">pending_actions</span>
  </div>
</div>

            <div className="stat-card">
              <div>
                <p className="stat-label">Resolved</p>
                <p className="stat-value green">{stats.resolved}</p>
              </div>
              <div className="stat-icon green">
                <span className="material-symbols-outlined">check_circle</span>
              </div>
            </div>   
          </div>

          <div className="complaints-header">
            <h3>Active Complaints</h3>
            <div className="filter-buttons">
              <button 
                className={filter === 'all' ? 'active' : ''}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={filter === 'pending' ? 'active' : ''}
                onClick={() => setFilter('pending')}
              >
                Pending
              </button>
              <button 
                className={filter === 'in progress' ? 'active' : ''}
                onClick={() => setFilter('in progress')}
              >
                In Progress
              </button>
              <button 
                className={filter === 'resolving' ? 'active' : ''}
                onClick={() => setFilter('resolving')}
              >
                Resolving
              </button>
            </div>
          </div>

          <div className="complaints-grid">
            {loading ? (
              <div className="loading-state">Loading complaints...</div>
            ) : complaints.length === 0 ? (
              <div className="empty-state">
                <span className="material-symbols-outlined">inbox</span>
                <p>No complaints found</p>
              </div>
            ) : (
              complaints.map(complaint => (
                <div 
                  key={complaint.id} 
                  className={`complaint-card ${
                    complaint.status === 'in progress' ? 'in-progress' : ''
                  } ${
                    complaint.status === 'resolving' ? 'resolving' : ''
                  } ${
                    uploadingComplaint === complaint.id ? 'upload-mode' : ''
                  }`}
                >
                  {uploadingComplaint === complaint.id ? (
                    <>
                      <div className="upload-header">
                        <h4>
                          <span className="material-symbols-outlined">camera_alt</span>
                          Upload Proof
                        </h4>
                        <button 
                          className="close-btn"
                          onClick={() => {
                            setUploadingComplaint(null);
                            setProofImage(null);
                            setRemarks('');
                          }}
                        >
                          <span className="material-symbols-outlined">close</span>
                        </button>
                      </div>

                      <div className="upload-content">
                        <div className="complaint-info-mini">
                          <p className="complaint-title-mini">{complaint.description}</p>
                          <p className="complaint-id-mini">#{complaint.complaint_id} • {complaint.location}</p>
                        </div>

                        <div className="upload-section">
                          <label htmlFor={`file-${complaint.id}`} className="upload-area">
                            <div className="upload-box">
                              {proofImage ? (
                                <div className="image-preview">
                                  <img 
                                    src={URL.createObjectURL(proofImage)} 
                                    alt="Preview" 
                                  />
                                  <p className="image-name">{proofImage.name}</p>
                                </div>
                              ) : (
                                <>
                                  <div className="upload-icon">
                                    <span className="material-symbols-outlined">add_a_photo</span>
                                  </div>
                                  <p className="upload-text">Tap to take photo</p>
                                  <p className="upload-subtext">Required for verification</p>
                                </>
                              )}
                            </div>
                          </label>
                          <input
                            id={`file-${complaint.id}`}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={(e) => handleImageSelect(e, complaint.id)}
                            style={{ display: 'none' }}
                          />

                          <input
                            type="text"
                            placeholder="Add optional remarks..."
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            className="remarks-input"
                          />
                        </div>

                        <button
                          className="submit-btn"
                          onClick={() => uploadProofAndResolve(complaint)}
                          disabled={uploading || !proofImage}
                        >
                          {uploading ? (
                            <>
                              <span className="spinner-small"></span>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <span>Submit Resolution</span>
                              <span className="material-symbols-outlined">send</span>
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {complaint.status === 'resolving' && (
                        <>
                          <div className="progress-indicator resolving">
                            <div className="progress-bar">
                              <div className="progress-fill complete"></div>
                            </div>
                            <div className="progress-header resolving-header">
                              <div className="status-badge resolving">
                                <span className="pulse resolving-pulse"></span>
                                <span>Pending Admin Review</span>
                              </div>
                              <span className="complaint-id">#{complaint.complaint_id}</span>
                            </div>
                          </div>

                          <div className="card-content">
                            <div className="thumbnail-row">
                              <img src={complaint.image_url} alt="Thumbnail" className="thumbnail" />
                              <div className="thumbnail-info">
                                <h4>{complaint.description}</h4>
                                <p className="location-text">{complaint.location}</p>
                                <div className="timer-badge resolving-badge">
                                  <span className="material-symbols-outlined">schedule</span>
                                  Awaiting approval
                                </div>
                              </div>
                            </div>

                            <div className="card-actions">
                              <div className="resolving-message">
                                <span className="material-symbols-outlined">hourglass_top</span>
                                <p>Proof submitted. Waiting for admin to verify and approve.</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {complaint.status === 'in progress' && (
                        <>
                          <div className="progress-indicator">
                            <div className="progress-bar">
                              <div className="progress-fill"></div>
                            </div>
                            <div className="progress-header">
                              <div className="status-badge in-progress">
                                <span className="pulse"></span>
                                <span>In Progress</span>
                              </div>
                              <span className="complaint-id">#{complaint.complaint_id}</span>
                            </div>
                          </div>

                          <div className="card-content">
                            <div className="thumbnail-row">
                              <img src={complaint.image_url} alt="Thumbnail" className="thumbnail" />
                              <div className="thumbnail-info">
                                <h4>{complaint.description}</h4>
                                <p className="location-text">{complaint.location}</p>
                                <div className="timer-badge">
                                  <span className="material-symbols-outlined">timer</span>
                                  Started recently
                                </div>
                              </div>
                            </div>

                            <div className="card-actions">
                              <button 
                                className="action-btn resolve"
                                onClick={() => setUploadingComplaint(complaint.id)}
                              >
                                <span className="material-symbols-outlined">check_circle</span>
                                Mark as Resolved
                              </button>
                            </div>
                          </div>
                        </>
                      )}

                      {complaint.status === 'pending' && (
                        <>
                          <div className="card-image">
                            <img src={complaint.image_url} alt="Complaint" />
                            <div className="image-overlay"></div>
                            <div className="image-badges">
                              <span className="complaint-id-badge">#{complaint.complaint_id}</span>
                              <span className="status-badge pending">Pending</span>
                            </div>
                          </div>

                          <div className="card-content">
                            <h4>{complaint.description}</h4>
                            <div className="location">
                              <span className="material-symbols-outlined">location_on</span>
                              <span>{complaint.location}</span>
                            </div>
                            <p className="address">{complaint.address}</p>

                            <div className="card-actions">
                              <button 
                                className="action-btn start"
                                onClick={() => startTask(complaint.id)}
                              >
                                <span className="material-symbols-outlined">play_arrow</span>
                                Start Task
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WardWorkerPage;