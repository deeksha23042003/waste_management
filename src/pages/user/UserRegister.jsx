// src/pages/user/UserRegister.jsx
import { useState } from "react";
import { supabase } from "../../supabase.js";
import { useNavigate } from "react-router-dom";

export default function UserRegister() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [wardNumber, setWardNumber] = useState("");

  const handleRegister = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: "tempPassword123", // Supabase requires a password for signUp
        options: { data: { name, phone, role: "user", ward_number: wardNumber } },
      });
      if (error) throw error;

      alert("Registration successful! Please login via OTP.");
      navigate("/user/login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50">
      <h2 className="text-2xl font-bold mb-4">User Registration</h2>
      <input
        type="text"
        placeholder="Name"
        className="p-2 border rounded mb-2 w-64"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        className="p-2 border rounded mb-2 w-64"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Phone"
        className="p-2 border rounded mb-2 w-64"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        type="text"
        placeholder="Ward Number"
        className="p-2 border rounded mb-2 w-64"
        value={wardNumber}
        onChange={(e) => setWardNumber(e.target.value)}
      />
      <button
        onClick={handleRegister}
        className="bg-green-700 text-white px-4 py-2 rounded w-64 mt-2"
      >
        Register
      </button>
    </div>
  );
}
