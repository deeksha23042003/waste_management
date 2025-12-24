import { useState } from "react";
import OtpVerify from "../Auth/OtpVerify";

export default function AdminLogin() {
  const [showOtp, setShowOtp] = useState(false);

  return showOtp ? (
    <OtpVerify role="admin" />
  ) : (
    <div className="auth-box">
      <h2>Admin Login</h2>
      <input placeholder="Registered Mobile Number" />
      <button onClick={() => setShowOtp(true)}>Send OTP</button>
    </div>
  );
}
