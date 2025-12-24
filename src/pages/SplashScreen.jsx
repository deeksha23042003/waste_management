// src/pages/SplashScreen.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../public/logo.png";

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/user/login"); // Default to User login page
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-green-50">
      <img src={logo} alt="GreenSort Logo" className="w-40 h-40" />
      <h1 className="text-3xl font-bold text-green-700 ml-4">GreenSort</h1>
    </div>
  );
}
