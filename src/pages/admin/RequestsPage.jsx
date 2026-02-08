import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import { supabase } from '../../supabase';
import './requestsPage.css';

const RequestsPage = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeedbackList(data || []);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryStyle = (subject) => {
    const subjectLower = subject?.toLowerCase() || '';
    
    // Map subjects to their category styles
    if (subjectLower.includes('general inquiry') || subjectLower.includes('general')) {
      return { bg: 'category-general', text: '', label: 'General Inquiry' };
    }
    if (subjectLower.includes('missed collection') || subjectLower.includes('report')) {
      return { bg: 'category-urgent', text: '', label: 'Report a Missed Collection' };
    }
    if (subjectLower.includes('technical') || subjectLower.includes('app')) {
      return { bg: 'category-technical', text: '', label: 'App Technical Support' };
    }
    if (subjectLower.includes('admin') || subjectLower.includes('ward') || subjectLower.includes('worker')) {
      return { bg: 'category-admin', text: '', label: 'Admin/Ward Worker Feedback' };
    }
    if (subjectLower.includes('other')) {
      return { bg: 'category-other', text: '', label: 'Other' };
    }
    
    // Default
    return { bg: 'category-general', text: '', label: 'General Inquiry' };
  };

  const getInitials = (name) => {
    if (!name) return 'NA';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleMarkAsRead = async (id, cardElement) => {
    try {
      // Fade out the card
      if (cardElement) {
        cardElement.style.opacity = '0.5';
        cardElement.style.pointerEvents = 'none';
      }

      // Show toast
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      // Optional: Delete from database or mark as read
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      

      fetchFeedback();
    } catch (error) {
      console.error('Error marking feedback as read:', error);
    }
  };

  const filteredFeedback = feedbackList.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.name?.toLowerCase().includes(searchLower) ||
      item.subject?.toLowerCase().includes(searchLower) ||
      item.feedback?.toLowerCase().includes(searchLower) ||
      item.email?.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredFeedback.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFeedback = filteredFeedback.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="requests-page-wrapper">
      <AdminHeader />
      
      <main className="requests-main-content">
        <div className="requests-header-section">
          <div>
            <h1 className="requests-page-title">Feedback Management</h1>
            <p className="requests-page-subtitle">Manage and respond to citizen reports and feedback.</p>
          </div>
          <div className="requests-actions">
            <div className="requests-search-wrapper">
              <span className="requests-search-icon material-icons-outlined">search</span>
              <input
                className="requests-search-input"
                placeholder="Search feedback..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          
          </div>
        </div>

        {loading ? (
          <div className="requests-loading">Loading feedback...</div>
        ) : (
          <>
            <div className="requests-grid">
              {paginatedFeedback.map((item) => {
                const category = getCategoryStyle(item.subject);
                return (
                  <div key={item.id} className="requests-card">
                    <div className="requests-card-header">
                      <span className={`requests-badge ${category.bg} ${category.text}`}>
                        {category.label}
                      </span>
                      <span className="requests-time">{getTimeAgo(item.created_at)}</span>
                    </div>
                    <h3 className="requests-card-title">{item.subject || 'No Subject'}</h3>
                    <div className="requests-user-info">
                      <div className="requests-avatar">{getInitials(item.name)}</div>
                      <span className="requests-user-name">{item.name || 'Anonymous'}</span>
                    </div>
                    <p className="requests-feedback-text">
                      {item.feedback || 'No feedback provided.'}
                    </p>
                    <div className="requests-card-footer">
                      <button 
                        className="requests-action-btn"
                        onClick={(e) => handleMarkAsRead(item.id, e.target.closest('.requests-card'))}
                      >
                        <span className="material-icons-outlined">check_circle</span>
                        Mark as Read &amp; Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredFeedback.length === 0 && (
              <div className="requests-empty-state">
                No feedback found{searchQuery ? ' matching your search' : ''}.
              </div>
            )}

            {filteredFeedback.length > 0 && (
              <div className="requests-pagination">
                <div className="requests-pagination-info">
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredFeedback.length)} of {filteredFeedback.length} submissions
                </div>
                <div className="requests-pagination-controls">
                  <button
                    className="requests-pagination-arrow"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  >
                    <span className="material-icons-outlined">chevron_left</span>
                  </button>
                  {[...Array(Math.min(totalPages, 3))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        className={`requests-pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    className="requests-pagination-arrow"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  >
                    <span className="material-icons-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Toast Notification */}
      <div className={`requests-toast ${showToast ? 'show' : ''}`}>
        <span className="material-icons-outlined requests-toast-icon">check_circle</span>
        <span className="requests-toast-text">Feedback marked as read and deleted.</span>
      </div>
    </div>
  );
};

export default RequestsPage;