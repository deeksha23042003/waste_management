// src/pages/SplashScreen.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SplashScreen.css";
import logo from "/logo.png";

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/user/login");
    }, 1700); // slightly faster feels better

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="splash-content">
        <img src={logo} alt="GreenSort Logo" className="splash-logo" />
        <h1 className="splash-title">GreenSort</h1>
        <p className="splash-tagline">Sort Smart. Live Green.</p>
      </div>
    </div>
  );
}
