import React, { useState } from 'react';
import './UserComplaintPage.css';
import {supabase} from '../../supabase.js';
import UserHeader from './UserHeader.jsx';
import { Link } from 'react-router-dom';
import { useEffect } from "react";

const UserComplaintPage = () => {
const [formData, setFormData] = useState({
  imageFile: null,
  address: '',
  description: '',
  ward_number: ''
});

  const [imagePreview, setImagePreview] = useState(null);
  
  const [location, setLocation] = useState({
  lat: null,
  lng: null,
  accuracy: null,
  loading: true,
  error: null
});

const uploadImageToSupabase = async (file, email) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${email}_${Date.now()}.${fileExt}`;
  const filePath = `complaints/${fileName}`;

  const { error } = await supabase.storage
    .from("WasteLocationBucket")
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from("WasteLocationBucket")
    .getPublicUrl(filePath);

  return data.publicUrl;
};



  const userData = {
    email:localStorage.getItem('loggedInEmail') || '',
    name: localStorage.getItem('loggedInName') || '',
    role: 'citizen'
  };
useEffect(() => {
  if (!navigator.geolocation) {
    setLocation({
      lat: null,
      lng: null,
      accuracy: null,
      loading: false,
      error: "Geolocation not supported"
    });
    return;
  }

  const success = (pos) => {
    setLocation({
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
      loading: false,
      error: null
    });
  };

  const failure = (err) => {
    console.error("Location error:", err);

    setLocation({
      lat: null,
      lng: null,
      accuracy: null,
      loading: false,
      error:
        err.code === 2
          ? "Unable to detect location. Please turn on Wi-Fi or use mobile."
          : err.message
    });
  };

  // Try HIGH accuracy first
  navigator.geolocation.getCurrentPosition(
    success,
    () => {
      // Fallback to LOW accuracy
      navigator.geolocation.getCurrentPosition(
        success,
        failure,
        { enableHighAccuracy: false, timeout: 20000 }
      );
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}, []);



  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imageFile: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.imageFile) {
    alert("Please upload a photo");
    return;
  }
  if (!formData.address.trim()) {
    alert("Please provide address");
    return;
  }
  if (!formData.description.trim()) {
    alert("Please provide description");
    return;
  }
  if (!formData.ward_number) {
    alert("Please enter ward number");
    return;
  }

  try {
    // 1️⃣ Upload image
    const imageUrl = await uploadImageToSupabase(
      formData.imageFile,
      userData.email
    );

    // 2️⃣ Insert complaint
    const { error } = await supabase
      .from("complaints")
      .insert([
        {
          email: userData.email,
          image_url: imageUrl,
          location: `${location.lat}, ${location.lng}`,
          address: formData.address,
          ward_number: formData.ward_number
        }
      ]);

    if (error) throw error;

    alert("Complaint submitted successfully ✅");

    // 3️⃣ Reset
    setFormData({
      imageFile: null,
      address: '',
      description: '',
      ward_number: ''
    });
    setImagePreview(null);

  } catch (err) {
    console.error(err);
    alert("Failed to submit complaint ❌");
  }
};


  const handleCancel = () => {
    setFormData({
      imageFile: null,
      address: '',
      description: ''
    });
    setImagePreview(null);
  };

  return (
    <>
    <UserHeader />
    <div className="complaint-page">
      <main className="main-content" >
        <div className="content-container" >
          <div className="back-link-wrapper">
            <Link to="/user/dashboard" className='back-link'>
              <span className="material-symbols-outlined">arrow_back</span>
              Back to Dashboard
            </Link>
          </div>

          <div className="form-card" >
            <div className="form-header">
              <div className="form-header-content" >
                <div className="form-icon">
                  <span className="material-symbols-outlined">add_a_photo</span>
                </div>
                <div>
                  <h2 className="form-title">Raise a Complaint</h2>
                  <p className="form-subtitle">Found waste piled up? Report it now and help keep our city clean.</p>
                </div>
              </div>
            </div>

            <div className="complaint-form" >
              <div className="form-section">
                <label className="form-label">
                  1. Waste Photo Evidence <span className="required">*</span>
                </label>
                <div className="upload-area">
                  <div className="upload-content">
                    {imagePreview ? (
                      <div className="image-preview">
                        <img src={imagePreview} alt="Preview" />
                        <button 
                          type="button" 
                          className="remove-image"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData({ ...formData, imageFile: null });
                          }}
                        >
                          <span className="material-symbols-outlined">close</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="material-symbols-outlined upload-icon">
                    {  /Android|iPhone|iPad/i.test(navigator.userAgent)
                        ? "photo_camera"
                      : "cloud_upload"}
</span>
                        <div className="upload-text">
                        <label htmlFor="file-upload" className="upload-label">
  <span>
    { /Android|iPhone|iPad/i.test(navigator.userAgent)
      ? "Take a photo"
      : "Upload a photo"
    }
  </span>

  <input
    id="file-upload"
    type="file"
    accept="image/*"
    capture="environment"
    className="file-input"
    onChange={handleFileChange}
  />


                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              capture="environment"
                              className="file-input"
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                          </label>
                          
                        </div>
                        
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-section">
                  <div className="label-with-badge">
                    <label className="form-label">2. GPS Location</label>
                    <span className="auto-badge">
                      <span className="material-symbols-outlined">my_location</span>
                      Auto-detected
                    </span>
                  </div>
                  <div className="input-wrapper">
                   <input
  className="form-input location-input"
  type="text"
  value={
    location.loading
      ? "Detecting location..."
      : location.error
      ? location.error
      : `${location.lat.toFixed(5)}°, ${location.lng.toFixed(5)}°`
  }
  disabled
/>

                    <div className="input-icon-left">
                      <span className="material-symbols-outlined">pin_drop</span>
                    </div>
                    <div className="input-icon-right">
                      <span className="material-symbols-outlined check-icon">check_circle</span>
                    </div>
                  </div>
                  <p className="input-hint">Accurate within 5 meters.</p>
                </div>

                <div className="form-section">
                  <label htmlFor="address" className="form-label">
                    3. Address <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      className="form-input"
                      id="address"
                      name="address"
                      type="text"
                     placeholder="e.g.House No. 45, 3rd Cross, Ward 7"

                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  <p className="input-hint"> Enter the street name, area for accurate collection.</p>
                </div>
              </div>
              <div className="form-section">
                <label htmlFor="ward_number" className="form-label">
                  4. Ward Number <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    className="form-input"
                    id="ward_number"
                    name="ward_number"
                    type="number"
                    placeholder="Enter your ward number"
                    value={formData.ward_number}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-section">
                <label htmlFor="description" className="form-label">
                  5. Complaint Description <span className="required">*</span>
                </label>
                <div className="textarea-wrapper">
                  <textarea
                    className="form-textarea"
                    id="description"
                    name="description"
                    placeholder="Describe the type of waste and estimated quantity..."
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  className="btn-cancel" 
                  type="button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button className="btn-submit" type="button" onClick={handleSubmit}>
                  <span>Submit Complaint</span>
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
          </div>

          <div className="form-footer">
            <p className="footer-text">
              By submitting this form, you agree to our <a href="#" className="footer-link">Terms of Service</a>. 
              False reporting may lead to account suspension.
            </p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="footer-icon">
              <span className="material-symbols-outlined">recycling</span>
            </div>
            <span className="footer-brand-text">GreenSort © 2023</span>
          </div>
          <div className="footer-links">
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
            <a href="#" className="footer-link">Support</a>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};

export default UserComplaintPage;