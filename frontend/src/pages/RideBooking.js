import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Map from '../components/Map';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { setEstimatedFare } from '../redux/slices/rideSlice';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaArrowDown, FaCar, FaWallet, FaArrowRight } from 'react-icons/fa';

const RideBooking = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { estimatedFare } = useSelector((state) => state.ride);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    pickupAddress: '',
    dropAddress: '',
    vehicleType: 'car',
    paymentMethod: 'wallet',
  });
  const [loading, setLoading] = useState(false);
  const [mapLocation, setMapLocation] = useState({ lat: 28.6139, lng: 77.2090 });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateFare = async () => {
    if (!formData.pickupAddress || !formData.dropAddress) {
      toast.warning('Please enter both pickup and drop addresses');
      return;
    }

    try {
      const response = await api.post('/rides/calculate-fare', {
        pickupLocation: { coordinates: [mapLocation.lng, mapLocation.lat] },
        dropLocation: { coordinates: [mapLocation.lng + 0.1, mapLocation.lat + 0.1] },
        vehicleType: formData.vehicleType,
      });

      dispatch(setEstimatedFare(response.data.fare));
      toast.success('Fare calculated');
    } catch (error) {
      toast.error('Failed to calculate fare');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/rides/book', {
        pickupLocation: { coordinates: [mapLocation.lng, mapLocation.lat] },
        dropLocation: { coordinates: [mapLocation.lng + 0.1, mapLocation.lat + 0.1] },
        pickupAddress: formData.pickupAddress,
        dropAddress: formData.dropAddress,
        vehicleType: formData.vehicleType,
        paymentMethod: formData.paymentMethod,
      });

      toast.success('Ride booked successfully!');
      navigate(`/ride/${response.data.ride._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book ride');
    } finally {
      setLoading(false);
    }
  };

  const rideTypes = [
    { value: 'bike', label: 'Bike', icon: '🏍️', price: '₹8/km', time: '2 min' },
    { value: 'auto', label: 'Auto', icon: '🚙', price: '₹10/km', time: '3 min' },
    { value: 'car', label: 'Car', icon: '🚗', price: '₹12/km', time: '4 min' },
    { value: 'sedan', label: 'Sedan', icon: '🚙', price: '₹15/km', time: '5 min' },
  ];

  const paymentMethods = [
    { value: 'wallet', label: 'Wallet', icon: '💳' },
    { value: 'card', label: 'Card', icon: '💳' },
    { value: 'upi', label: 'UPI', icon: '📱' },
    { value: 'cash', label: 'Cash', icon: '💵' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Book Your Ride</h1>
            <p className="text-gray-600">Choose your ride type and confirm your destination</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Booking Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Location Section */}
              <div className="card-elevated">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Where are you going?</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Pickup Location */}
                  <div className="relative">
                    <label className="form-label">Pickup Location</label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-4 top-4 text-green-500" />
                      <input
                        type="text"
                        name="pickupAddress"
                        value={formData.pickupAddress}
                        onChange={handleChange}
                        placeholder="Enter pickup location"
                        className="input-field pl-12"
                        required
                      />
                    </div>
                  </div>

                  {/* Swap Icon */}
                  <div className="flex justify-center">
                    <button
                      type="button"
                      className="bg-yellow-100 hover:bg-yellow-200 text-yellow-600 p-3 rounded-full transition"
                    >
                      <FaArrowDown size={20} />
                    </button>
                  </div>

                  {/* Drop Location */}
                  <div className="relative">
                    <label className="form-label">Drop Location</label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-4 top-4 text-red-500" />
                      <input
                        type="text"
                        name="dropAddress"
                        value={formData.dropAddress}
                        onChange={handleChange}
                        placeholder="Enter drop location"
                        className="input-field pl-12"
                        required
                      />
                    </div>
                  </div>

                  {/* Vehicle Type Selection */}
                  <div className="pt-6">
                    <label className="form-label">Choose Ride Type</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {rideTypes.map((ride) => (
                        <button
                          key={ride.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, vehicleType: ride.value })}
                          className={`p-4 rounded-xl border-2 transition text-center ${
                            formData.vehicleType === ride.value
                              ? 'border-yellow-400 bg-yellow-50'
                              : 'border-gray-200 bg-white hover:border-yellow-300'
                          }`}
                        >
                          <p className="text-3xl mb-2">{ride.icon}</p>
                          <p className="text-xs font-bold text-gray-900">{ride.label}</p>
                          <p className="text-xs text-gray-600 mt-1">{ride.price}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="pt-4">
                    <label className="form-label">Payment Method</label>
                    <div className="grid grid-cols-4 gap-3">
                      {paymentMethods.map((method) => (
                        <button
                          key={method.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, paymentMethod: method.value })}
                          className={`p-4 rounded-xl border-2 transition text-center ${
                            formData.paymentMethod === method.value
                              ? 'border-yellow-400 bg-yellow-50'
                              : 'border-gray-200 bg-white hover:border-yellow-300'
                          }`}
                        >
                          <p className="text-2xl mb-2">{method.icon}</p>
                          <p className="text-xs font-bold text-gray-900">{method.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fare Estimation */}
                  {estimatedFare && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-gray-700 font-medium">Estimated Fare</p>
                        <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">
                          Estimated
                        </span>
                      </div>
                      <p className="text-4xl font-bold text-gray-900 mb-3">
                        ₹{estimatedFare.estimatedFare}
                      </p>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>Distance: {estimatedFare.distance} km</p>
                        <p>Est. Duration: {estimatedFare.time || 15} min</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={calculateFare}
                      className="flex-1 btn-secondary font-bold"
                    >
                      Estimate Fare
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !estimatedFare}
                      className="flex-1 btn-primary font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? 'Booking...' : 'Confirm Booking'}
                      <FaArrowRight size={14} />
                    </button>
                  </div>
                </form>
              </div>

              {/* Offers Section */}
              <div className="card-elevated">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Available Offers</h3>
                <div className="space-y-3">
                  {[
                    { code: 'WELCOME20', desc: 'Get 20% off on first ride', amount: '₹100' },
                    { code: 'SAVE50', desc: 'Flat ₹50 off on every ride', amount: '₹50' },
                  ].map((offer, idx) => (
                    <div key={idx} className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900">{offer.code}</p>
                        <p className="text-sm text-gray-600">{offer.desc}</p>
                      </div>
                      <p className="text-lg font-bold text-yellow-500">{offer.amount}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel - Map */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Map */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 h-96">
                  <Map latitude={mapLocation.lat} longitude={mapLocation.lng} />
                </div>

                {/* Wallet Balance */}
                <div className="card-elevated">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FaWallet className="text-green-600" size={20} />
                      <span className="font-semibold text-gray-900">Wallet Balance</span>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-2">₹500</p>
                  <button className="w-full btn-secondary btn-sm font-bold">
                    Add Funds
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RideBooking;
