import { useState, useEffect } from 'react';
import { supabase } from '../../supabase.js';
import './Profile.css';
import UserHeader from './UserHeader.jsx';
const Profile = () => {
  const [user, setUser] = useState(null);
 const [wards, setWards] = useState([]);
  const avatarUrl = localStorage.getItem("avatarUrl");
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone_no: '',
    ward_number: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
const [uploading, setUploading] = useState(false);
const [avatar, setAvatar] = useState(avatarUrl || null);

 useEffect(() => {
  const fetchWards = async () => {
    const { data, error } = await supabase
      .from("ward_details")
      .select("ward_number, ward_name")
      .order("ward_number", { ascending: true });

    if (error) {
      console.error("Error fetching wards:", error);
    } else {
      setWards(data);
    }
  };

  fetchWards();
}, []);

const uploadAvatar = async (file) => {
  try {
    setUploading(true);

    if (!file || !user) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = fileName;

    // Upload to AvatarBucket
    const { error: uploadError } = await supabase.storage
      .from("AvatarBucket")
      .upload(filePath, file, {
        upsert: true,
        cacheControl: "3600",
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data } = supabase.storage
      .from("AvatarBucket")
      .getPublicUrl(filePath);

    // Save URL in profiles table
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: data.publicUrl })
      .eq("id", user.id);

    if (updateError) throw updateError;

    const freshUrl = `${data.publicUrl}?t=${Date.now()}`;
// the public URL remains the same. Browsers cache images aggressively,
// so the updated image may not appear immediately.
// Adding a timestamp query parameter forces the browser to reload
// the latest version of the profile image.
setAvatar(freshUrl);
localStorage.setItem("avatarUrl", freshUrl);

    setMessage({ type: "success", text: "Profile photo updated!" });
  } catch (error) {
    console.error(error);
    setMessage({ type: "error", text: "Failed to upload avatar" });
  } finally {
    setUploading(false);
  }
};

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUser(user);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setProfile({
            full_name: data.full_name || '',
            email: data.email || user.email,
            phone_no: data.phone_no || '',
            ward_number: data.ward_number || ''
          });
        } else {
          setProfile(prev => ({ ...prev, email: user.email }));
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: name === 'ward_number' ? parseInt(value) || '' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profile.full_name,
          email: profile.email,
          phone_no: profile.phone_no,
          ward_number: profile.ward_number,
          created_at: new Date().toISOString()
        });

      if (error) {alert(error.message);throw error;}

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

 

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div>
    <UserHeader/>
    <main className="profile-main">
      <div className="profile-container">
        <div className="profile-header">
          <div>
            <div className="breadcrumb">
              <a href="#">Home</a>
              <span className="material-symbols-outlined">chevron_right</span>
              <span>Profile</span>
            </div>
            <h2>Profile Settings</h2>
          </div>
          <div className="profile-actions">
    
            <button className="btn-primary" onClick={handleSubmit} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="profile-grid">
          <aside className="profile-sidebar">
            <div className="profile-card">
            <div className="profile-avatar-wrapper">
  <div className="profile-avatar">
    <img
      src={avatar || "/default-avatar.png"}
      alt="Profile"
    />
  </div>

  <label className="avatar-upload-btn" title="Upload new photo">
    <span className="material-symbols-outlined">
      {uploading ? "hourglass_top" : "photo_camera"}
    </span>

    <input
      type="file"
      accept="image/*"
      hidden
      onChange={(e) => uploadAvatar(e.target.files[0])}
      disabled={uploading}
    />
  </label>
</div>

              <h3>{profile.full_name || 'User'}</h3>
              <p className="profile-email">{profile.email}</p>
              
              
            </div>

            <nav className="profile-nav">
              <a href="#" className="nav-item active">
                <span className="material-symbols-outlined">person</span>
                Personal Information
              </a>
              
            </nav>
          </aside>

          <div className="profile-content">
            <div className="content-card">
              <div className="card-header">
                <h3>Profile Information</h3>
                <p>Manage your account details based on your official profile record.</p>
              </div>

              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-section">
                  <h4 className="section-title">Core Identity</h4>
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Full Name</label>
                      <div className="input-wrapper">
                        <span className="material-symbols-outlined input-icon">badge</span>
                        <input
                          type="text"
                          name="full_name"
                          value={profile.full_name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <p className="input-help">Your display name across the platform.</p>
                    </div>

                    <div className="form-group full-width">
                      <label>Email Address</label>
                      <div className="input-wrapper">
                        <span className="material-symbols-outlined input-icon">mail</span>
                        <input
                          type="email"
                          name="email"
                          value={profile.email}
                          onChange={handleChange}
                          disabled
                        />
                      </div>
                      <p className="input-help">Used for authentication and notifications.</p>
                    </div>
                  </div>
                </div>

                <hr className="divider" />

                <div className="form-section">
                  <h4 className="section-title">Contact & Location</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <div className="input-wrapper">
                        <span className="material-symbols-outlined input-icon">phone</span>
                        <input
                          type="tel"
                          name="phone_no"
                          value={profile.phone_no}
                          onChange={handleChange}
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Ward Number</label>
                      <div className="input-wrapper">
                        <span className="material-symbols-outlined input-icon">map</span>
                        
<select
  name="ward_number"
  value={profile.ward_number || ""}
  onChange={handleChange}
>
  <option value="">Select Ward</option>
  {wards.map((ward) => (
    <option key={ward.ward_number} value={ward.ward_number}>
      Ward {ward.ward_number} – {ward.ward_name}
    </option>
  ))}
</select>

                      </div>
                      <p className="input-help">Integer value for your specific municipal ward.</p>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => getProfile()}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
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

export default Profile;