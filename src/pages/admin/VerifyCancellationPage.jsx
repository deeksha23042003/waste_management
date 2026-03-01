import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import './VerifyCancellationPage.css';
import AdminHeader from './AdminHeader';

const VerifyCancellationPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Reject-back-to-pending modal state ──────────────────────────────────────
  const [rejectingComplaint, setRejectingComplaint] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejecting, setRejecting] = useState(false);
  // ────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchCancellingComplaints();
  }, []);

  const fetchCancellingComplaints = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: complaintsData, error: complaintsError } = await supabase
        .from('complaints')
        .select('*')
        .eq('status', 'cancelling')
        .order('created_at', { ascending: false });

      if (complaintsError) throw complaintsError;

      // For each complaint, fetch the cancel_details (worker's reason)
      const complaintsWithDetails = await Promise.all(
        (complaintsData || []).map(async (complaint) => {
          const { data: cancelData } = await supabase
            .from('cancel_details')
            .select('message, ward_worker_email')
            .eq('complaint_id', complaint.id);

          const cancelDetails =
            cancelData && cancelData.length > 0 ? cancelData[0] : null;

          return { ...complaint, cancel_details: cancelDetails };
        })
      );

      setComplaints(complaintsWithDetails);
    } catch (err) {
      console.error('Error fetching cancelling complaints:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Notification helper ─────────────────────────────────────────────────────
  const addNotification = async (email, complaintId, message, typeOfUser = 'citizen') => {
    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('email', email)
        .eq('complaint_id', complaintId);

      const { error } = await supabase.from('notifications').insert({
        email,
        complaint_id: complaintId,
        message,
        readstatus: 'unread',
        type_of_user: typeOfUser,
      });

      if (error) console.error('Error adding notification:', error);
    } catch (err) {
      console.error('Error in addNotification:', err);
    }
  };
  // ────────────────────────────────────────────────────────────────────────────

  // ── DELETE the complaint ────────────────────────────────────────────────────
  const handleDelete = async (complaintId) => {
    const complaint = complaints.find((c) => c.id === complaintId);
    if (!complaint) return;

    if (!window.confirm(`Are you sure you want to permanently delete complaint #${complaint.id}? This cannot be undone.`)) return;

    try {
      // Delete cancel_details first (FK reference)
      await supabase.from('cancel_details').delete().eq('complaint_id', complaintId);

      // Delete the complaint itself
      const { error } = await supabase.from('complaints').delete().eq('id', complaintId);
      if (error) throw error;

      // Notify the citizen
      await addNotification(
        complaint.email,
        complaint.id,
        `Your complaint #${complaint.id} has been reviewed by our admin team and has been removed as it was deemed invalid. If you believe this is a mistake, please raise a new complaint.`,
        'citizen'
      );

      // Notify the ward worker who reported it
      if (complaint.cancel_details?.ward_worker_email) {
        await addNotification(
          complaint.cancel_details.ward_worker_email,
          complaint.id,
          `Your report for complaint #${complaint.id} has been accepted by the admin. The complaint has been deleted. Good job keeping the system accurate!`,
          'worker'
        );
      }

      await fetchCancellingComplaints();
      alert('Complaint deleted successfully.');
    } catch (err) {
      console.error('Error deleting complaint:', err);
      alert('Failed to delete complaint. Please try again.');
    }
  };
  // ────────────────────────────────────────────────────────────────────────────

  // ── REJECT report → return complaint to pending ─────────────────────────────
  const handleRejectReport = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejecting this report.');
      return;
    }

    const complaint = rejectingComplaint;
    if (!complaint) return;

    try {
      setRejecting(true);

      // Reset complaint status back to pending
      const { error: updateError } = await supabase
        .from('complaints')
        .update({ status: 'pending' })
        .eq('id', complaint.id);
      if (updateError) throw updateError;

      // Remove cancel_details entry
      await supabase.from('cancel_details').delete().eq('complaint_id', complaint.id);

      // Notify the ward worker that their report was rejected
      if (complaint.cancel_details?.ward_worker_email) {
        await addNotification(
          complaint.cancel_details.ward_worker_email,
          complaint.id,
          `Your report for complaint #${complaint.id} was reviewed by admin and rejected. Reason: "${rejectReason.trim()}". The complaint has been returned to pending status and must be addressed.`,
          'worker'
        );
      }

      setRejectingComplaint(null);
      setRejectReason('');
      await fetchCancellingComplaints();
      alert('Report rejected. Complaint returned to Pending status.');
    } catch (err) {
      console.error('Error rejecting report:', err);
      alert('Failed to reject report. Please try again.');
    } finally {
      setRejecting(false);
    }
  };
  // ────────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="vcp-page">
        <AdminHeader />
        <div className="vcp-loading">
          <div className="vcp-loading-spinner"></div>
          <p>Loading reported complaints...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vcp-page">
        <AdminHeader />
        <div className="vcp-error">
          <span className="material-symbols-outlined vcp-error-icon">error</span>
          <p>Error loading complaints: {error}</p>
          <button className="vcp-retry-button" onClick={fetchCancellingComplaints}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vcp-page">
      <AdminHeader />

      <main className="vcp-main">
        <div className="vcp-main-header">
          <h1 className="vcp-title">Reported Complaints</h1>
          <div className="vcp-count">
            Showing {complaints.length}{' '}
            <span className="vcp-count-highlight">Reported</span> complaint
            {complaints.length !== 1 ? 's' : ''}
          </div>
        </div>

        {complaints.length === 0 ? (
          <div className="vcp-empty">
            <span className="material-symbols-outlined vcp-empty-icon">flag</span>
            <p className="vcp-empty-text">No reported complaints</p>
            <p className="vcp-empty-subtext">All clear — no complaints have been flagged for removal.</p>
          </div>
        ) : (
          <>
            {complaints.map((complaint) => (
              <article key={complaint.id} className="vcp-card">
                {/* ── Card Header ── */}
                <div className="vcp-card-header">
                  <div className="vcp-meta-group">
                    <span className="vcp-meta-label">Complaint ID</span>
                    <span className="vcp-meta-value vcp-meta-value--id">#{complaint.id}</span>
                  </div>

                  <div className="vcp-divider vcp-divider--vertical"></div>

                  <div className="vcp-meta-group">
                    <span className="vcp-meta-label">Ward Number</span>
                    <div className="vcp-meta-with-icon">
                      <span className="material-symbols-outlined vcp-meta-icon">map</span>
                      <span className="vcp-meta-value">Ward {complaint.ward_number}</span>
                    </div>
                  </div>

                  <div className="vcp-meta-group vcp-meta-group--flex">
                    <span className="vcp-meta-label">Location</span>
                    <span className="vcp-meta-value vcp-meta-value--muted">
                      {complaint.location || 'Location not specified'}
                    </span>
                  </div>

                  <div className="vcp-meta-group">
                    <span className="vcp-meta-label">Citizen's Email</span>
                    <span className="vcp-meta-value vcp-meta-value--muted">{complaint.email}</span>
                  </div>

                  <div>
                    <span className="vcp-status-badge">
                      <span className="vcp-status-pulse"></span>
                      Reported
                    </span>
                  </div>
                </div>

                {/* ── Card Body ── */}
                <div className="vcp-card-body">
                  {/* Complaint image + description */}
                  <div className="vcp-complaint-section">
                    <div className="vcp-complaint-image-wrap">
                      <div className="vcp-section-label">
                        <span className="vcp-dot vcp-dot--red"></span>
                        Complaint Image
                      </div>
                      <div
                        className="vcp-complaint-image"
                        style={{
                          backgroundImage: complaint.image_url
                            ? `url("${complaint.image_url}")`
                            : 'none',
                          backgroundColor: complaint.image_url ? 'transparent' : '#f1f5f9',
                        }}
                      >
                        {!complaint.image_url && (
                          <div className="vcp-image-placeholder">
                            <span className="material-symbols-outlined">image</span>
                            <span>No image</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="vcp-complaint-info">
                      <div className="vcp-info-row">
                        <span className="vcp-info-label">Description</span>
                        <p className="vcp-info-value">{complaint.description || '—'}</p>
                      </div>
                      <div className="vcp-info-row">
                        <span className="vcp-info-label">Address</span>
                        <p className="vcp-info-value">{complaint.address || '—'}</p>
                      </div>
                      <div className="vcp-info-row">
                        <span className="vcp-info-label">Reported by Worker</span>
                        <p className="vcp-info-value vcp-info-value--email">
                          {complaint.cancel_details?.ward_worker_email || '—'}
                        </p>
                      </div>

                      {/* Worker's reason */}
                      <div className="vcp-reason-box">
                        <div className="vcp-reason-header">
                          <span className="material-symbols-outlined">flag</span>
                          Worker's Reason for Reporting
                        </div>
                        <p className="vcp-reason-text">
                          {complaint.cancel_details?.message || 'No reason provided.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="vcp-actions">
                    <button
                      className="vcp-button vcp-button--reject"
                      onClick={() => {
                        setRejectingComplaint(complaint);
                        setRejectReason('');
                      }}
                    >
                      <span className="material-symbols-outlined vcp-button-icon">undo</span>
                      Return to Pending
                    </button>
                    <button
                      className="vcp-button vcp-button--delete"
                      onClick={() => handleDelete(complaint.id)}
                    >
                      <span className="material-symbols-outlined vcp-button-icon">delete</span>
                      Delete Complaint
                    </button>
                  </div>
                </div>
              </article>
            ))}

            <div className="vcp-load-more">
              <button className="vcp-load-more-button" onClick={fetchCancellingComplaints}>
                <span className="material-symbols-outlined">refresh</span>
                Refresh list
              </button>
            </div>
          </>
        )}
      </main>

      {/* ── Reject Report Modal ─────────────────────────────────────────────── */}
      {rejectingComplaint && (
        <div
          className="vcp-overlay"
          onClick={() => { setRejectingComplaint(null); setRejectReason(''); }}
        >
          <div className="vcp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="vcp-modal-header">
              <div className="vcp-modal-icon">
                <span className="material-symbols-outlined">undo</span>
              </div>
              <h3>Reject Report & Return to Pending</h3>
              <p>
                Complaint <strong>#{rejectingComplaint.id}</strong> will be returned to{' '}
                <strong>Pending</strong> status and the ward worker will be notified with your reason.
              </p>
            </div>

            <div className="vcp-modal-body">
              <label className="vcp-modal-label">
                Reason for rejection <span className="vcp-modal-required">*</span>
              </label>
              <textarea
                className="vcp-modal-textarea"
                placeholder="Explain why the report is invalid and what action the worker should take..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
            </div>

            <div className="vcp-modal-actions">
              <button
                className="vcp-modal-btn vcp-modal-btn--cancel"
                onClick={() => { setRejectingComplaint(null); setRejectReason(''); }}
              >
                Cancel
              </button>
              <button
                className="vcp-modal-btn vcp-modal-btn--confirm"
                onClick={handleRejectReport}
                disabled={rejecting || !rejectReason.trim()}
              >
                {rejecting ? (
                  <><span className="vcp-spinner-small"></span> Submitting...</>
                ) : (
                  <><span className="material-symbols-outlined">send</span> Confirm & Notify</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ─────────────────────────────────────────────────────────────────────── */}
    </div>
  );
};

export default VerifyCancellationPage;