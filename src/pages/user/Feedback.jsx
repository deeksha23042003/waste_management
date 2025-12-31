import { useState, useEffect } from 'react';
import { supabase } from '../../supabase.js';
import './Feedback.css';
import UserHeader from './UserHeader.jsx';
const Feedback = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    feedback: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUser(user);
        
        // Try to get profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', user.id)
          .single();

        if (profile) {
          setFormData(prev => ({
            ...prev,
            name: profile.full_name || '',
            email: profile.email || user.email
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            email: user.email
          }));
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.feedback.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('feedback')
        .insert({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          feedback: formData.feedback,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      setMessage({ 
        type: 'success', 
        text: 'Thank you for your feedback! We\'ll get back to you soon.' 
      });
      
      // Reset form (keep name and email if user is logged in)
      setFormData(prev => ({
        name: user ? prev.name : '',
        email: user ? prev.email : '',
        subject: 'General Inquiry',
        feedback: ''
      }));

      // Clear success message after 5 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to submit feedback. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (<div>
    <UserHeader/>
    <main className="feedback-main">
      <div className="feedback-container">
        <div className="feedback-header">
          <div className="header-icon">
            <span className="material-symbols-outlined">support_agent</span>
          </div>
          <h2>Get in Touch</h2>
          <p>
            Have questions about waste collection schedules, app features, or need to report an issue? 
            We're here to help keep our city clean.
          </p>
        </div>

        <div className="feedback-grid">
          <aside className="contact-info">
            <h3>Contact Information</h3>
            
            <div className="contact-card email-card">
              <div className="contact-icon">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <div className="contact-content">
                <h4>Email Us</h4>
                <p>For general inquiries and support.</p>
                <a href="mailto:greensort@gmail.com">support@greensort</a>
              </div>
            </div>

            <div className="contact-card phone-card">
              <div className="contact-icon">
                <span className="material-symbols-outlined">call</span>
              </div>
              <div className="contact-content">
                <h4>Call Us</h4>
                <p>Mon-Fri from 8am to 5pm.</p>
                <a href="tel:+919686241088">+91 9686241088</a>
              </div>
            </div>

            <div className="contact-card location-card">
              <div className="contact-icon">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <div className="contact-content">
                <h4>Office</h4>
                <p>Come say hello at our HQ.</p>
                <address>
  GreenSort Office<br />
  Ward No. 4, Thenkpete<br />
  Near Sri Krishna Temple<br />
  Udupi, Karnataka – 576101<br />
  India
</address>

              </div>
            </div>

            <div className="faq-card">
              <h4>Need quick answers?</h4>
              <p>Check out our frequently asked questions about sorting guidelines.</p>
              <a href="#" className="faq-link">
                Visit FAQ Center
                <span className="material-symbols-outlined">arrow_forward</span>
              </a>
            </div>
          </aside>

          <div className="feedback-form-section">
            <div className="form-card">
              <h3>Send us a Message</h3>
              
              {message.text && (
                <div className={`message ${message.type}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="feedback-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <div className="input-wrapper">
                      <span className="material-symbols-outlined input-icon">person</span>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <div className="input-wrapper">
                      <span className="material-symbols-outlined input-icon">alternate_email</span>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <div className="input-wrapper">
                    <span className="material-symbols-outlined input-icon">label</span>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                    >
                      <option>General Inquiry</option>
                      <option>Report a Missed Collection</option>
                      <option>App Technical Support</option>
                      <option>Admin/Ward Worker Feedback</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="feedback">Message</label>
                  <div className="input-wrapper">
                    <textarea
                      id="feedback"
                      name="feedback"
                      value={formData.feedback}
                      onChange={handleChange}
                      placeholder="How can we help you today?"
                      rows="5"
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="btn-submit"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
    </div>
  );
};

export default Feedback;