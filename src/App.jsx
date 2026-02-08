import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen";
import UserLogin from "./pages/user/UserLogin";

import UserDashboard from "./pages/user/UserDashboard";
import ResetPassword from "./pages/ResetPassword";

 import HowItWorks from "./pages/user/HowItWorks";
 import UserComplaintPage from "./pages/user/UserComplaintPage";
 import Profile from "./pages/user/Profile";
  import Feedback from "./pages/user/Feedback";
  import Complaints from "./pages/user/Complaints";
import ErrorPage from "./pages/ErrorPage";
import WardWorkerPage from "./pages/wardworker/WardWorkerPage";
import VerifyResolutionPage from "./pages/admin/VerifyResolutionPage";
import ComplaintsPage from "./pages/admin/ComplaintsPage";
import RequestsPage from "./pages/admin/RequestsPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/user/complaint" element={<UserComplaintPage />} />
        <Route path="/user/profile" element={<Profile />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/user/contact" element={<Feedback />} />
        <Route path="/user/complaints" element={<Complaints />} />
        <Route path="/wardworker/dashboard" element={<WardWorkerPage />} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="/admin/verify-resolution" element={<VerifyResolutionPage />} />
        <Route path="/admin/complaints" element={<ComplaintsPage />} />
        <Route path="/admin/feedback" element={<RequestsPage />} />
      </Routes>
    </Router>
  );
}

export default App;