import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RideCard from '../components/RideCard';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FaToggleOn, FaToggleOff, FaDollarSign, FaTrophy, FaStar, FaCheckCircle, FaMap, FaUser } from 'react-icons/fa';

const CaptainDashboard = () => {
  const { isAuthenticated, captain } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [isOnline, setIsOnline] = useState(false);
  const [stats, setStats] = useState({});
  const [earnings, setEarnings] = useState({});
  const [activeRide, setActiveRide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated, navigate]);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await api.get('/captains/ride-stats');
      const earningsRes = await api.get('/captains/earnings');

      setStats(statsRes.data.stats || {});
      setEarnings(earningsRes.data.earnings || {});
      setIsOnline(captain?.isOnline || false);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const toggleOnlineStatus = async () => {
    try {
      await api.post('/captains/toggle-online-status', {
        isOnline: !isOnline,
      });
      setIsOnline(!isOnline);
      toast.success(`You are now ${!isOnline ? 'online' : 'offline'}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
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
          {/* Welcome Section with Status Toggle */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-white shadow-lg">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold mb-2">Welcome, {captain?.fullName?.split(' ')[0]}!</h1>
                  <p className="text-green-50 text-lg">Ready to earn more today?</p>
                </div>
                <div className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 ${
                  isOnline
                    ? 'bg-green-700 text-white'
                    : 'bg-red-600 text-white'
                }`}>
                  {isOnline ? (
                    <>
                      <FaToggleOn size={20} /> Online
                    </>
                  ) : (
                    <>
                      <FaToggleOff size={20} /> Offline
                    </>
                  )}
                </div>
              </div>
              
              <button
                onClick={toggleOnlineStatus}
                className={`w-full font-bold py-3 rounded-xl transition text-lg ${
                  isOnline
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-white hover:bg-green-50 text-green-600'
                }`}
              >
                {isOnline ? 'Go Offline' : 'Go Online & Start Earning'}
              </button>
            </div>

            {/* Quick Stats Card */}
            <div className="card-elevated">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-4 rounded-xl">
                  <FaDollarSign className="text-green-600" size={24} />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">Today</span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Today's Earnings</p>
              <p className="text-3xl font-bold text-gray-900">₹{earnings.periodEarnings || 0}</p>
              <p className="text-xs text-gray-500 mt-3">Keep driving to earn more</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { 
                label: 'Total Earnings', 
                value: `₹${earnings.totalEarnings || 0}`, 
                icon: FaTrophy, 
                color: 'bg-yellow-100 text-yellow-600' 
              },
              { 
                label: 'Completed Rides', 
                value: stats.completedRides || 0, 
                icon: FaCheckCircle, 
                color: 'bg-green-100 text-green-600' 
              },
              { 
                label: 'Your Rating', 
                value: `${stats.averageRating || 0}/5`, 
                icon: FaStar, 
                color: 'bg-blue-100 text-blue-600' 
              },
              { 
                label: 'Acceptance Rate', 
                value: `${stats.acceptanceRate || 0}%`, 
                icon: FaCheckCircle, 
                color: 'bg-purple-100 text-purple-600' 
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="card group hover:shadow-lg">
                  <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                    <Icon size={24} />
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <button
              onClick={() => navigate('/captain-earnings')}
              className="card group hover:shadow-lg hover:border-yellow-400 cursor-pointer flex items-center justify-between p-6"
            >
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">View Detailed Earnings</h3>
                <p className="text-gray-600 text-sm">Track your weekly and monthly earnings</p>
              </div>
              <FaDollarSign className="text-gray-300 group-hover:text-yellow-400 transition" size={32} />
            </button>

            <button
              onClick={() => navigate('/captain-rides')}
              className="card group hover:shadow-lg hover:border-yellow-400 cursor-pointer flex items-center justify-between p-6"
            >
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Available Rides</h3>
                <p className="text-gray-600 text-sm">Accept new ride requests nearby</p>
              </div>
              <FaMap className="text-gray-300 group-hover:text-yellow-400 transition" size={32} />
            </button>
          </div>

          {/* Profile & Documents */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Captain Profile</h2>
                <p className="text-gray-600 text-sm mt-1">Keep your information updated</p>
              </div>
              <button
                onClick={() => navigate('/captain-profile')}
                className="btn-primary btn-sm font-bold"
              >
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Vehicle', value: captain?.vehicle?.vehicleType || 'Not Updated', icon: '🚗' },
                { label: 'License', value: captain?.drivingLicenseNumber ? '✓ Verified' : 'Not Verified', icon: '📄' },
                { label: 'Documents', value: 'All Submitted', icon: '✓' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-xl">
                  <p className="text-2xl mb-2">{item.icon}</p>
                  <p className="text-gray-600 text-sm">{item.label}</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Active Ride Display */}
          {activeRide && (
            <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold mb-6">Current Ride</h2>
              <RideCard ride={activeRide} />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CaptainDashboard;
