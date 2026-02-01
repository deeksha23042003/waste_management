import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import './VerifyResolutionPage.css';
import AdminHeader from './AdminHeader';

const VerifyResolutionPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResolvingComplaints();
  }, []);

  const fetchResolvingComplaints = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch complaints with status 'resolving' (lowercase based on your DB)
      const { data: complaintsData, error: complaintsError } = await supabase
        .from('complaints')
        .select('*')
        .eq('status', 'resolving')
        .order('created_at', { ascending: false });

      if (complaintsError) throw complaintsError;

      console.log('Fetched complaints:', complaintsData);

      // For each complaint, fetch the resolved details to get the after image
      const complaintsWithResolvedDetails = await Promise.all(
        (complaintsData || []).map(async (complaint) => {
          // Without .single(), this returns an array
          const { data: resolvedData, error: resolvedError } = await supabase
            .from('resolved_details')
            .select('resolved_image, resolver_email')
            .eq('complaint_id', complaint.id);

          console.log(`Resolved data for complaint ${complaint.id}:`, resolvedData);

          
          // Get the first item if it exists
          const resolvedDetails = resolvedData && resolvedData.length > 0 ? resolvedData[0] : null;

          return {
            ...complaint,
            resolved_details: resolvedError ? null : resolvedDetails
          };
        })
      );

      console.log('Complaints with resolved details:', complaintsWithResolvedDetails);
      setComplaints(complaintsWithResolvedDetails);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (complaintId) => {
    try {
      const { error } = await supabase
        .from('complaints')
        .update({ status: 'resolved' })
        .eq('id', complaintId);

      if (error) throw error;
      
      // Refresh the list
      await fetchResolvingComplaints();
      alert('Resolution accepted successfully!');
    } catch (error) {
      console.error('Error accepting resolution:', error);
      alert('Failed to accept resolution. Please try again.');
    }
  };

  const handleReject = async (complaintId) => {
    try {
      const { error } = await supabase
        .from('complaints')
        .update({ status: 'pending' })
        .eq('id', complaintId);

      if (error) throw error;
    //let us remove the resolved details as well
      const { error: resolvedError } = await supabase
        .from('resolved_details')
        .delete()
        .eq('complaint_id', complaintId);
      
      // Refresh the list
      await fetchResolvingComplaints();
      alert('Resolution rejected. Complaint returned to Pending status.');
    } catch (error) {
      console.error('Error rejecting resolution:', error);
      alert('Failed to reject resolution. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="vrp-page">
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
        <div className="vrp-loading">
          <div className="vrp-loading-spinner"></div>
          <p>Loading complaints...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vrp-page">
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
        <div className="vrp-error">
          <span className="material-symbols-outlined vrp-error-icon">error</span>
          <p>Error loading complaints: {error}</p>
          <button className="vrp-retry-button" onClick={fetchResolvingComplaints}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vrp-page">
      <AdminHeader />

      <main className="vrp-main">
        <div className="vrp-main-header">
          <h1 className="vrp-title">Pending Verification</h1>
          <div className="vrp-count">
            Showing {complaints.length} <span className="vrp-count-highlight">Resolving</span> complaint{complaints.length !== 1 ? 's' : ''}
          </div>
        </div>

        {complaints.length === 0 ? (
          <div className="vrp-empty">
            <span className="material-symbols-outlined vrp-empty-icon">check_circle</span>
            <p className="vrp-empty-text">No complaints pending verification</p>
            <p className="vrp-empty-subtext">All complaints have been processed!</p>
          </div>
        ) : (
          <>
            {complaints.map((complaint) => (
              <article key={complaint.id} className="vrp-card">
                <div className="vrp-card-header">
                  <div className="vrp-meta-group">
                    <span className="vrp-meta-label">Complaint ID</span>
                    <span className="vrp-meta-value vrp-meta-value--id">
                      #{complaint.id}
                    </span>
                  </div>

                  <div className="vrp-divider vrp-divider--vertical"></div>

                  <div className="vrp-meta-group">
                    <span className="vrp-meta-label">Ward Number</span>
                    <div className="vrp-meta-with-icon">
                      <span className="material-symbols-outlined vrp-meta-icon">map</span>
                      <span className="vrp-meta-value">Ward {complaint.ward_number}</span>
                    </div>
                  </div>

                  <div className="vrp-meta-group vrp-meta-group--flex">
                    <span className="vrp-meta-label">Location</span>
                    <span className="vrp-meta-value vrp-meta-value--location">
                      {complaint.location || 'Location not specified'}
                    </span>
                  </div>
                
                <div className="vrp-meta-group">
                    <span className="vrp-meta-label">Citizen's Email</span>
                 <span className="vrp-meta-value vrp-meta-value--location">
                      #{complaint.email}
                    </span>
                  </div>

                  <div>
                    <span className="vrp-status">
                      <span className="vrp-status-pulse"></span>
                      Resolving
                    </span>
                  </div>
                </div>

                <div className="vrp-card-body">
                  <div className="vrp-images-grid">
                    {/* Before Image */}
                    <div className="vrp-image-container">
                      <div className="vrp-image-header">
                        <span className="vrp-image-label">
                          <span className="vrp-image-dot vrp-image-dot--before"></span>
                          Before
                        </span>
                        <span className="vrp-image-source">Source: Mobile Upload</span>
                      </div>
                      <div 
                        className="vrp-image vrp-image--before"
                        style={{ 
                          backgroundImage: complaint.image_url 
                            ? `url("${complaint.image_url}")` 
                            : 'none',
                          backgroundColor: complaint.image_url ? 'transparent' : '#f1f5f9'
                        }}
                      >
                        {!complaint.image_url && (
                          <div className="vrp-image-placeholder">
                            <span className="material-symbols-outlined">image</span>
                            <span>No image</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* After Image */}
                    <div className="vrp-image-container">
                      <div className="vrp-image-header">
                        <span className="vrp-image-label">
                          <span className="vrp-image-dot vrp-image-dot--after"></span>
                          After
                        </span>
                        <span className="vrp-image-source">Verified by Agent</span>
                      </div>
                      <div 
                        className="vrp-image vrp-image--after"
                        style={{ 
                          backgroundImage: complaint.resolved_details?.resolved_image 
                            ? `url("${complaint.resolved_details.resolved_image}")` 
                            : 'none',
                          backgroundColor: complaint.resolved_details?.resolved_image ? 'transparent' : '#f1f5f9'
                        }}
                      >
                        {complaint.resolved_details?.resolved_image && (
                          <div className="vrp-image-new-badge">New</div>
                        )}
                        {!complaint.resolved_details?.resolved_image && (
                          <div className="vrp-image-placeholder">
                            <span className="material-symbols-outlined">pending</span>
                            <span>Awaiting resolution image</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="vrp-actions">
                    <button 
                      className="vrp-button vrp-button--reject"
                      onClick={() => handleReject(complaint.id)}
                    >
                      <span className="material-symbols-outlined vrp-button-icon">close</span>
                      Reject
                    </button>
                    <button 
                      className="vrp-button vrp-button--accept"
                      onClick={() => handleAccept(complaint.id)}
                    >
                      <span className="material-symbols-outlined vrp-button-icon">check_circle</span>
                      Accept Resolution
                    </button>
                  </div>
                </div>
              </article>
            ))}

            <div className="vrp-load-more">
              <button className="vrp-load-more-button" onClick={fetchResolvingComplaints}>
                <span className="material-symbols-outlined">refresh</span>
                Refresh pending items
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default VerifyResolutionPage;