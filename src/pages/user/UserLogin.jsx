import { useState,useEffect } from 'react';
import { supabase } from '../../supabase.js';
import './UserLogin.css';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
  const [wards, setWards] = useState([]);

   const navigate=useNavigate();
  const [isRegister, setIsRegister] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userType: 'citizen',
    fullName: '',
    wardNumber: '',
      phone_no: '',   
    email: '',
    password: '',
    agreeTerms: false
  });

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

  const handleForgotPassword = async () => {
  if (!formData.email) {
    alert("Please enter your email first");
    return;
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(
      formData.email,
      {
        redirectTo: `${window.location.origin}/reset-password`
      }
    );

    if (error) throw error;

    alert("Password reset link sent to your email 📩");
  } catch (err) {
    alert(err.message);
  }
};


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

 
  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!formData.agreeTerms) {
      alert('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    setLoading(true);

    try {
      // Check if input is email or phone
      const isEmail = formData.email.includes('@');
      
      if (isEmail) {
        // Sign up with email
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              user_type: formData.userType,
              ward_number: formData.wardNumber
            }
          }
        });

        if (error) throw error;
        const user = data.user;

// Insert into profiles table
const { error: profileError } = await supabase
  .from("profiles")
  .insert({
    id: user.id,
    email: user.email,
    full_name: formData.fullName,
    user_type: formData.userType,
    phone_no: formData.phone_no,
    ward_number: formData.wardNumber
  });

if (profileError) throw profileError;
        
        alert('Registration successful! Please check your email for verification.');
      } 

      // Reset form
      setFormData({
        userType: 'citizen',
        fullName: '',
        wardNumber: '',
        phone_no: '',
        email: '',
        password: '',
        agreeTerms: false
      });
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isEmail = formData.email.includes('@');
      
      if (isEmail) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (error) throw error;

        const user = data.user;

// 2️⃣ Fetch profile using user.id
const { data: profile, error: profileError } = await supabase
  .from("profiles")
  .select("*")
  .eq("email", user.email)
        console.log(profile);

        
        localStorage.setItem('loggedInEmail', profile[0].email);
        localStorage.setItem('loggedInName', profile[0].full_name.split(' ')[0]);
        localStorage.setItem("avatarUrl",profile[0].avatar_url);
        localStorage.setItem('loggedInRole', profile[0].user_type);//citizen,ward or admin
        //based on role we can navigate to respective dashboard later
        if(profile[0].user_type==='worker'){
       navigate('/wardworker/dashboard');
          return;
        }
        else if (profile[0].user_type==='admin'){
          alert('Login successful! You are an admin.Admin dashboard coming soon.');
          return;
        }
        else if(profile[0].user_type==='citizen'){
          
          navigate('/user/dashboard');
        }
         
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          phone: formData.email,
          password: formData.password
        });

        if (error) throw error;
        alert('Login successful!');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) throw error;
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left-panel">
        <img 
          alt="Green city background" 
          className="login-bg-image" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCW2zOMYIsD0cRgWT9K2CzBNcHEuJ-Dt0GLh3fWBbMciNffdXJ04rCxhk7oTEv_800B5-zcIwLlIhUdY91EGprEqZgZiSs-O9KaQHdGS5kaXV8S_4QhIp30fvuj12FS0GvsVqkwyGHfB_FP7Pv0-5fS62jfoRTsP6YqShcoxOzd8KmRebZXPyVftZT3calHZHKOBxgG3MNb9g35WsSJZeirsTofY_JI0G5NFpr3UbtiDetrqGMcpDnIMTUyECH_sw8-42mE3XwHYPI"
        />
        <div className="login-gradient-overlay"></div>
        <div className="login-content">
          <div className="login-icon-container">
            <span className="material-symbols-outlined">eco</span>
          </div>
          <h1 className="login-title">Building a cleaner future, one sort at a time.</h1>
          <p className="login-subtitle">Join the GreenSort community to manage waste efficiently, track your recycling impact, and contribute to a sustainable municipal ecosystem.</p>
          <div className="login-features">
            <div className="login-feature-badge">
              <span className="material-symbols-outlined">recycling</span>
              <span>Smart Tracking</span>
            </div>
            <div className="login-feature-badge">
              <span className="material-symbols-outlined">location_city</span>
              <span>City Wide</span>
            </div>
            <div className="login-feature-badge">
              <span className="material-symbols-outlined">groups</span>
              <span>Community Driven</span>
            </div>
          </div>
        </div>
      </div>

      <div className="login-right-panel">
        <header className="login-header">
          <div className="login-logo">
            <div className="login-logo-icon">
              <span className="material-symbols-outlined">eco</span>
            </div>
            <h2>GreenSort</h2>
          </div>
          <button className="login-support-btn">
            <span className="material-symbols-outlined">support_agent</span>
            <span>Support</span>
          </button>
        </header>


        <div className="login-form-container">
          <div className="login-form-wrapper">
            <div className="login-tabs">
              <button 
                className={!isRegister ? 'active' : ''}
                onClick={() => setIsRegister(false)}
              >
                Log In
              </button>
              <button 
                className={isRegister ? 'active' : ''}
                onClick={() => setIsRegister(true)}
              >
                Register
              </button>
            </div>

            <div className="login-form-header">
              <h2>{isRegister ? 'Create an account' : 'Welcome back'}</h2>
              <p>{isRegister ? 'Join GreenSort to start managing your waste efficiently.' : 'Log in to continue to GreenSort.'}</p>
            </div>

            <form onSubmit={isRegister ? handleRegister : handleLogin} className="login-form">
              {isRegister && (
                <>
                  <div className="login-input-group">
                    <label>I am a</label>
                    <div className="login-select-wrapper">
                      <select 
                        name="userType"
                        value={formData.userType}
                        onChange={handleInputChange}
                      >
                        <option value="citizen">Citizen</option>
                        <option value="worker">Ward Worker</option>
                
                      </select>
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>

                  <div className="login-input-group">
                    <label>Full Name</label>
                    <div className="login-input-wrapper">
                      <input 
                        type="text" 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                      />
                      <span className="material-symbols-outlined">person</span>
                    </div>
                  </div>
                  
                  <div className="login-input-group">
                  <label>Phone Number</label>
                  <div className="login-input-wrapper">
                    <input
                      type="tel"
                      name="phone_no"
                      value={formData.phone_no}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      required
                    />
                    <span className="material-symbols-outlined">call</span>
                  </div>
                </div>

                  <div className="login-input-group">
  <label>Ward</label>
  <div className="login-select-wrapper">
    <select
      name="wardNumber"
      value={formData.wardNumber}
      onChange={handleInputChange}
      required
    >
      <option value="">Select Ward</option>
      {wards.map((ward) => (
        <option key={ward.ward_number} value={ward.ward_number}>
          Ward {ward.ward_number} – {ward.ward_name}
        </option>
      ))}
    </select>
    <span className="material-symbols-outlined">expand_more</span>
  </div>
</div>

                </>
              )}

              <div className="login-input-group">
                <label>Email </label>
                <div className="login-input-wrapper">
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                  />
                  <span className="material-symbols-outlined">mail</span>
                </div>
              </div>

              <div className="login-input-group">
                <label>Password</label>
                <div className="login-input-wrapper">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={isRegister ? 'Create a strong password' : 'Enter your password'}
                    required
                  />
                  <span className="material-symbols-outlined icon-left">lock</span>
                  <button 
                    type="button"
                    style={{zIndex:"22"}}
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>
              {!isRegister && (
  <div className="forgot-password">
    <button
      type="button"
      className="forgot-link"
      onClick={handleForgotPassword}
    >
      Forgot password?
    </button>
  </div>
)}
              
              {isRegister && (
                <div className="login-checkbox-group">
                  <label>
                    <input 
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                    />
                    <span>
                      I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                    </span>
                  </label>
                </div>
              )}

              <button type="submit" className="login-submit-btn" disabled={loading}>
                <span>{loading ? 'Processing...' : (isRegister ? 'Create Account' : 'Log In')}</span>
                <span className="material-symbols-outlined">
                  {isRegister ? 'person_add' : 'login'}
                </span>
              </button>

            
            </form>

            {/*<div className="login-divider">
              <span>{isRegister ? 'Or register with' : 'Or log in with'}</span>
            </div>

             <button className="login-google-btn" onClick={handleGoogleSignIn}>
              <svg className="google-icon" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Sign {isRegister ? 'up' : 'in'} with Google</span>
            </button> */}
          </div>

          <div className="login-footer">
            <p>© 2024 GreenSort. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;