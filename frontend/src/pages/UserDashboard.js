import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RideCard from '../components/RideCard';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaArrowRight, FaWallet, FaHistory, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';

const UserDashboard = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [stats, setStats] = useState({});
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
      const ridesRes = await api.get('/users/rides?limit=5');
      const statsRes = await api.get('/users/ride-stats');

      setRides(ridesRes.data.rides || []);
      setStats(statsRes.data.stats || {});
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
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
          {/* Welcome Section with Quick Action */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Welcome Card */}
            <div className="lg:col-span-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-8 text-gray-900 shadow-lg">
              <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.fullName?.split(' ')[0]}!</h1>
              <p className="text-gray-800 text-lg mb-6">Ready for your next adventure?</p>
              <button
                onClick={() => navigate('/ride-booking')}
                className="inline-flex items-center gap-2 bg-gray-900 text-white font-bold py-3 px-8 rounded-full hover:bg-gray-800 transition"
              >
                <FaMapMarkerAlt /> Book Your Ride Now
              </button>
            </div>

            {/* Wallet Card */}
            <div className="card-elevated cursor-pointer hover:shadow-xl transition" onClick={() => navigate('/wallet')}>
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-4 rounded-xl">
                  <FaWallet className="text-green-600" size={24} />
                </div>
                <FaArrowRight className="text-gray-400" />
              </div>
              <p className="text-gray-600 text-sm mb-1">Wallet Balance</p>
              <p className="text-3xl font-bold text-gray-900">₹{stats.walletBalance || 0}</p>
              <p className="text-xs text-gray-500 mt-2">Tap to add funds</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { 
                label: 'Total Rides', 
                value: stats.totalRides || 0, 
                icon: FaHistory, 
                color: 'bg-blue-100 text-blue-600' 
              },
              { 
                label: 'Completed', 
                value: stats.completedRides || 0, 
                icon: FaArrowRight, 
                color: 'bg-green-100 text-green-600' 
              },
              { 
                label: 'Total Spent', 
                value: `₹${stats.totalSpent || 0}`, 
                icon: FaWallet, 
                color: 'bg-yellow-100 text-yellow-600' 
              },
              { 
                label: 'Your Rating', 
                value: `${stats.averageRating || 0}/5`, 
                icon: FaStar, 
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

          {/* Recent Rides Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Recent Rides</h2>
                <p className="text-gray-600 text-sm mt-1">Your ride history</p>
              </div>
              {rides.length > 0 && (
                <button
                  onClick={() => navigate('/rides')}
                  className="text-yellow-500 font-semibold hover:text-yellow-600 flex items-center gap-2"
                >
                  View All <FaArrowRight size={14} />
                </button>
              )}
            </div>

            {rides.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🚗</div>
                <p className="text-gray-600 text-lg mb-6">No rides yet. Start your first ride today!</p>
                <button
                  onClick={() => navigate('/ride-booking')}
                  className="btn-primary font-bold"
                >
                  Book a Ride
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {rides.map((ride) => (
                  <div key={ride._id} className="border border-gray-200 rounded-xl p-6 hover:border-yellow-400 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                            <span className="text-xl">🚕</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{ride.rideType || 'Economy'}</p>
                            <p className="text-sm text-gray-600">{new Date(ride.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 text-gray-600">
                            <FaMapMarkerAlt className="text-green-600" size={16} />
                            <span className="text-sm">{ride.pickupLocation}</span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-600">
                            <FaMapMarkerAlt className="text-red-600" size={16} />
                            <span className="text-sm">{ride.dropoffLocation}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">₹{ride.fare}</p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                          ride.status === 'completed' ? 'bg-green-100 text-green-700' :
                          ride.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {ride.status?.charAt(0).toUpperCase() + ride.status?.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;
