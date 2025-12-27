// src/pages/SplashScreen.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "./SplashScreen.css";
import logo from "/logo.png";

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const boot = async () => {
      // Optional minimum splash time (UX polish)
      const minDelay = new Promise(res => setTimeout(res, 2500));
await minDelay;
      // 1️⃣ Check session
      const { data } = await supabase.auth.getSession();
      const sessionUser = data?.session?.user;


      // 2️⃣ No session → login
      if (!sessionUser) {
        navigate("/user/login");
        return;
      }

      // 3️⃣ Fetch role
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("email", sessionUser.email)
        .single();
      
      if (error || !profile) {
        navigate("/user/login");
        return;
      }

      // 4️⃣ Role based redirect
      if (profile.user_type === "citizen") {
        navigate("/user/dashboard");
      } else if (profile.user_type === "worker") {
        //navigate("/worker/dashboard");
        alert("Worker access is not available yet.");
        navigate("/user/login");
      } else if (profile.user_type === "admin") {
        // navigate("/admin/dashboard");
        alert("Admin access is not available yet.");
        navigate("/user/login");
      } else {
        navigate("/user/login");
      }
    };

    boot();
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
