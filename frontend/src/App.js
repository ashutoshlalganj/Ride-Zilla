import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { restoreAuth } from './redux/slices/authSlice';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserDashboard from './pages/UserDashboard';
import RideBooking from './pages/RideBooking';
import UserProfile from './pages/UserProfile';
import WalletPage from './pages/WalletPage';
import CaptainDashboard from './pages/CaptainDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Restore auth on app load
    dispatch(restoreAuth());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* User Routes */}
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/ride-booking" element={<RideBooking />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/profile" element={<UserProfile />} />

        {/* Captain Routes */}
        <Route path="/captain-dashboard" element={<CaptainDashboard />} />
        <Route path="/captain-profile" element={<UserProfile />} />

        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* 404 Route */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
