import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaCar } from 'react-icons/fa';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    drivingLicenseNumber: '',
    licenseExpiryDate: '',
  });
  const [userType, setUserType] = useState('user');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        setLoading(false);
        return;
      }

      const endpoint = userType === 'user' ? '/auth/register-user' : '/auth/register-captain';
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      if (userType === 'captain') {
        payload.drivingLicenseNumber = formData.drivingLicenseNumber;
        payload.licenseExpiryDate = formData.licenseExpiryDate;
      }

      await api.post(endpoint, payload);
      toast.success('Registration successful! Please verify your email.');
      navigate('/verify-email', { state: { email: formData.email, userType } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-12 text-white">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">
              <FaCar className="text-yellow-400 mx-auto" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Join RideZilla</h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-12">
              {userType === 'user' 
                ? 'Book rides instantly and travel safely with verified drivers.'
                : 'Start earning today by becoming a professional captain.'}
            </p>
            
            <div className="space-y-4">
              {userType === 'user' ? (
                <>
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-400 text-2xl">✓</span>
                    <div className="text-left">
                      <p className="font-semibold">Safe & Secure</p>
                      <p className="text-gray-400 text-sm">Verified drivers & GPS tracking</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-400 text-2xl">✓</span>
                    <div className="text-left">
                      <p className="font-semibold">Affordable Rides</p>
                      <p className="text-gray-400 text-sm">Transparent pricing with no hidden fees</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-400 text-2xl">✓</span>
                    <div className="text-left">
                      <p className="font-semibold">24/7 Support</p>
                      <p className="text-gray-400 text-sm">Help whenever you need it</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-400 text-2xl">✓</span>
                    <div className="text-left">
                      <p className="font-semibold">Earn More</p>
                      <p className="text-gray-400 text-sm">Competitive rates and bonuses</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-400 text-2xl">✓</span>
                    <div className="text-left">
                      <p className="font-semibold">Be Your Boss</p>
                      <p className="text-gray-400 text-sm">Work on your own schedule</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-400 text-2xl">✓</span>
                    <div className="text-left">
                      <p className="font-semibold">Weekly Payouts</p>
                      <p className="text-gray-400 text-sm">Get paid every week</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex flex-col justify-center p-8 md:p-12 overflow-y-auto max-h-screen">
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
              <p className="text-gray-600 text-sm">Join millions of users who trust RideZilla</p>
            </div>

            {/* User Type Selection */}
            <div className="flex gap-3 mb-8 bg-gray-100 p-1 rounded-lg">
              {['user', 'captain'].map((type) => (
                <button
                  key={type}
                  onClick={() => setUserType(type)}
                  className={`flex-1 py-3 rounded-md font-semibold transition ${
                    userType === type
                      ? 'bg-yellow-400 text-gray-900 shadow-md'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {type === 'user' ? '👤 Rider' : '🚗 Captain'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-4 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div className="relative">
                  <FaPhone className="absolute left-4 top-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>

              {/* Captain Specific Fields */}
              {userType === 'captain' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Driving License Number</label>
                    <input
                      type="text"
                      name="drivingLicenseNumber"
                      value={formData.drivingLicenseNumber}
                      onChange={handleChange}
                      placeholder="DL12345678"
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">License Expiry Date</label>
                    <input
                      type="date"
                      name="licenseExpiryDate"
                      value={formData.licenseExpiryDate}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                </>
              )}

              {/* Password */}
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-4 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-4 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>

              {/* Terms & Conditions */}
              <label className="flex items-start gap-3 my-4">
                <input type="checkbox" className="w-4 h-4 mt-1 rounded" required />
                <span className="text-sm text-gray-600">
                  I agree to the <a href="#" className="text-yellow-500 font-medium">Terms of Service</a> and <a href="#" className="text-yellow-500 font-medium">Privacy Policy</a>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary btn-lg w-full font-bold disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-yellow-500 font-bold hover:text-yellow-600">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SignupPage;
