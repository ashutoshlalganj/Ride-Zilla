import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { LineChart, BarChart } from 'recharts';

const CaptainEarnings = () => {
  const { isAuthenticated, captain } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [earnings, setEarnings] = useState({});
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchEarnings();
  }, [isAuthenticated, navigate, period]);

  const fetchEarnings = async () => {
    try {
      const response = await api.get(`/captains/earnings?period=${period}`);
      setEarnings(response.data.earnings || {});
    } catch (error) {
      toast.error('Failed to load earnings');
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
          <h1 className="text-3xl font-bold mb-8">My Earnings</h1>

          {/* Period Filter */}
          <div className="flex gap-4 mb-8">
            {['day', 'week', 'month'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  period === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-800 border border-gray-300'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>

          {/* Earnings Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <p className="text-gray-600 text-sm mb-2">Period Earnings</p>
              <p className="text-3xl font-bold text-gray-800">₹{earnings.periodEarnings || 0}</p>
              <p className="text-sm text-gray-500 mt-2">{earnings.periodRides || 0} rides</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <p className="text-gray-600 text-sm mb-2">Total Earnings</p>
              <p className="text-3xl font-bold text-gray-800">₹{earnings.totalEarnings || 0}</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <p className="text-gray-600 text-sm mb-2">Average per Ride</p>
              <p className="text-3xl font-bold text-gray-800">₹{earnings.averagePerRide || 0}</p>
            </div>
          </div>

          {/* More Details */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold mb-4">Earning Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between pb-4 border-b">
                <span className="text-gray-700">Today Earnings</span>
                <span className="font-bold">₹{earnings.periodEarnings || 0}</span>
              </div>
              <div className="flex justify-between pb-4 border-b">
                <span className="text-gray-700">Rides Today</span>
                <span className="font-bold">{earnings.periodRides || 0}</span>
              </div>
              <div className="flex justify-between pb-4 border-b">
                <span className="text-gray-700">Average Earning per Ride</span>
                <span className="font-bold">₹{earnings.averagePerRide || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Total Lifetime Earnings</span>
                <span className="font-bold text-green-600">₹{earnings.totalEarnings || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CaptainEarnings;
