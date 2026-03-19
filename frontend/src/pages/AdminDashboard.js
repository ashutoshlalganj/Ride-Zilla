import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { isAuthenticated, userRole } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || userRole !== 'admin') {
      navigate('/login');
      return;
    }

    fetchDashboardStats();
  }, [isAuthenticated, userRole, navigate]);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data.stats || {});
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Users', value: stats.totalUsers || 0, icon: '👥' },
              { label: 'Total Captains', value: stats.totalCaptains || 0, icon: '🚗' },
              { label: 'Total Rides', value: stats.totalRides || 0, icon: '📊' },
              { label: 'Total Revenue', value: `₹${stats.totalRevenue || 0}`, icon: '💰' },
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-md">
                <p className="text-3xl mb-2">{stat.icon}</p>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Admin Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/admin/users')}
              className="bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 font-bold transition"
            >
              Manage Users
            </button>
            <button
              onClick={() => navigate('/admin/captains')}
              className="bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 font-bold transition"
            >
              Manage Captains
            </button>
            <button
              onClick={() => navigate('/admin/rides')}
              className="bg-purple-600 text-white py-4 rounded-lg hover:bg-purple-700 font-bold transition"
            >
              Manage Rides
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
