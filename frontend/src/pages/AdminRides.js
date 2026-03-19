import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RideCard from '../components/RideCard';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const AdminRides = () => {
  const { isAuthenticated, userRole } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!isAuthenticated || userRole !== 'admin') {
      navigate('/login');
      return;
    }

    fetchRides();
  }, [isAuthenticated, userRole, navigate, page]);

  const fetchRides = async () => {
    try {
      const response = await api.get(`/admin/rides?page=${page}`);
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
          <h1 className="text-3xl font-bold mb-8">Manage Rides</h1>

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

export default AdminRides;
