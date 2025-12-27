import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen";
import UserLogin from "./pages/user/UserLogin";

import UserDashboard from "./pages/user/UserDashboard";


 import HowItWorks from "./pages/user/HowItWorks";
 import UserComplaintPage from "./pages/user/UserComplaintPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/user/complaint" element={<UserComplaintPage />} />
      </Routes>
    </Router>
  );
}

export default App;
