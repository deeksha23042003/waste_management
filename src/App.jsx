import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen";
import UserLogin from "./pages/User/UserLogin";

import UserDashboard from "./pages/User/UserDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import WorkerLogin from "./pages/Worker/WorkerLogin";
import WorkerDashboard from "./pages/Worker/WorkerDashboard";
 import HowItWorks from "./pages/user/HowItWorks";
 import UserComplaintPage from "./pages/user/UserComplaintPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/worker/login" element={<WorkerLogin />} />
        <Route path="/worker/dashboard" element={<WorkerDashboard />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/user/complaint" element={<UserComplaintPage />} />
      </Routes>
    </Router>
  );
}

export default App;
