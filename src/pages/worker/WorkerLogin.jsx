import { useState } from "react";
import OtpVerify from "../Auth/OtpVerify";

export default function WorkerLogin() {
  const [showOtp, setShowOtp] = useState(false);

  return showOtp ? (
    <OtpVerify role="worker" />
  ) : (
    <div className="auth-box">
      <h2>Worker Login</h2>
      <input placeholder="Mobile Number" />
      <button onClick={() => setShowOtp(true)}>Send OTP</button>
    </div>
  );
}
