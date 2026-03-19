import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RideCard from '../components/RideCard';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const CaptainRides = () => {
  const { isAuthenticated, captain } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchRides();
  }, [isAuthenticated, navigate, statusFilter]);

  const fetchRides = async () => {
    try {
      const params = statusFilter ? `?status=${statusFilter}` : '';
      const response = await api.get(`/captains/rides${params}`);
      setRides(response.data.rides || []);
    } catch (error) {
      toast.error('Failed to load rides');
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
          <h1 className="text-3xl font-bold mb-8">My Rides</h1>

          {/* Filter Buttons */}
          <div className="flex gap-4 mb-8 flex-wrap">
            {['searching', 'accepted', 'arriving', 'started', 'completed', 'cancelled'].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(statusFilter === status ? null : status)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-300'
                  }`}
                >
                  {status}
                </button>
              )
            )}
          </div>

          {/* Rides List */}
          <div className="space-y-4">
            {rides.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No rides found</p>
            ) : (
              rides.map((ride) => (
                <RideCard key={ride._id} ride={ride} />
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CaptainRides;
