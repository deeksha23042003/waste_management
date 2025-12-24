import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function OtpVerify({ role }) {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const verifyOtp = () => {
    if (otp === "1234") {
      navigate(`/${role}`);
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="auth-box">
      <h2>OTP Verification</h2>
      <input
        placeholder="Enter OTP (1234)"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={verifyOtp}>Verify</button>
    </div>
  );
}
