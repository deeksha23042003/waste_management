import { Routes, Route } from "react-router-dom";

import UserLogin from "../pages/User/UserLogin";
import AdminLogin from "../pages/admin/AdminLogin";
import WorkerLogin from "../pages/Worker/WorkerLogin";
import UserRegister from "../pages/User/UserRegister";

import UserDashboard from "../pages/User/UserDashboard";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import WorkerDashboard from "../pages/Worker/WorkerDashboard";

import AppInfo from "../pages/User/AppInfo";
import SplashScreen from "../pages/Splash/SplashScreen";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />

      <Route path="/login/user" element={<UserLogin />} />
      <Route path="/login/admin" element={<AdminLogin />} />
      <Route path="/login/worker" element={<WorkerLogin />} />

      <Route path="/register" element={<UserRegister />} />

      <Route path="/user" element={<UserDashboard />} />
      <Route path="/user/info" element={<AppInfo />} />

      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/worker" element={<WorkerDashboard />} />
    </Routes>
  );
}
