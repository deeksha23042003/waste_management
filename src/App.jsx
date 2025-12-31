import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen";
import UserLogin from "./pages/user/UserLogin";

import UserDashboard from "./pages/user/UserDashboard";
import ResetPassword from "./pages/ResetPassword";

 import HowItWorks from "./pages/user/HowItWorks";
 import UserComplaintPage from "./pages/user/UserComplaintPage";
 import Profile from "./pages/user/Profile";
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

      </Routes>
    </Router>
  );
}

export default App;
