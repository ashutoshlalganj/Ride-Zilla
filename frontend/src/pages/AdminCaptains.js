import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const AdminCaptains = () => {
  const { isAuthenticated, userRole } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [captains, setCaptains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!isAuthenticated || userRole !== 'admin') {
      navigate('/login');
      return;
    }

    fetchCaptains();
  }, [isAuthenticated, userRole, navigate, page]);

  const fetchCaptains = async () => {
    try {
      const response = await api.get(`/admin/captains?page=${page}`);
      setCaptains(response.data.captains || []);
    } catch (error) {
      toast.error('Failed to load captains');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveCaptain = async (captainId) => {
    try {
      await api.post(`/admin/captains/${captainId}/approve`);
      toast.success('Captain approved');
      fetchCaptains();
    } catch (error) {
      toast.error('Failed to approve captain');
    }
  };

  const handleBlockCaptain = async (captainId) => {
    try {
      await api.post(`/admin/captains/${captainId}/block`, {
        reason: 'Blocked by admin',
      });
      toast.success('Captain blocked');
      fetchCaptains();
    } catch (error) {
      toast.error('Failed to block captain');
    }
  };

  const handleUnblockCaptain = async (captainId) => {
    try {
      await api.post(`/admin/captains/${captainId}/unblock`);
      toast.success('Captain unblocked');
      fetchCaptains();
    } catch (error) {
      toast.error('Failed to unblock captain');
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
          <h1 className="text-3xl font-bold mb-8">Manage Captains</h1>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">License</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Approved</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {captains.map((captain) => (
                    <tr key={captain._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4">{captain.fullName}</td>
                      <td className="py-3 px-4">{captain.email}</td>
                      <td className="py-3 px-4">{captain.drivingLicenseNumber}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            captain.isBlocked
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {captain.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            captain.isApproved
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {captain.isApproved ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="py-3 px-4 space-x-2">
                        {!captain.isApproved && (
                          <button
                            onClick={() => handleApproveCaptain(captain._id)}
                            className="text-green-600 hover:text-green-800 font-medium text-sm"
                          >
                            Approve
                          </button>
                        )}
                        {captain.isBlocked ? (
                          <button
                            onClick={() => handleUnblockCaptain(captain._id)}
                            className="text-green-600 hover:text-green-800 font-medium text-sm"
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBlockCaptain(captain._id)}
                            className="text-red-600 hover:text-red-800 font-medium text-sm"
                          >
                            Block
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminCaptains;
