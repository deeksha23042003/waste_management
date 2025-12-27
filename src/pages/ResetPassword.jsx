import { useEffect, useState } from "react";
import { supabase } from "../supabase.js";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;

    // If not opened via reset email → block access
    if (!hash.includes("type=recovery")) {
      navigate("/user/login");
    }
  }, [navigate]);

  const handleReset = async () => {
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Password updated successfully ✅");

      // 🔥 IMPORTANT: Clear recovery session
      await supabase.auth.signOut();

      // Redirect to login
      navigate("/user/login");
    }
  };

  return (
   <div className="reset-container">
  <div className="reset-card">
    <h2 className="reset-title">Reset Password</h2>

    <div className="reset-input-wrapper">
      <input
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>

    <button className="reset-btn" onClick={handleReset}>
      Update Password
    </button>

    <div className="reset-footer">
      <a href="/user/login">Back to Login</a>
    </div>
  </div>
</div>

  );
};

export default ResetPassword;
