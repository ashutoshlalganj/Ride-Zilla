import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { FaCar, FaEnvelope, FaLock } from 'react-icons/fa';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('user');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = userType === 'user' ? '/auth/login-user' : '/auth/login-captain';
      const response = await api.post(endpoint, {
        email,
        password,
      });

      const userData = userType === 'user' ? response.data.user : response.data.captain;
      
      dispatch(
        setUser({
          user: userData,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        })
      );

      toast.success(`${userType === 'user' ? 'User' : 'Captain'} login successful!`);
      navigate(userType === 'user' ? '/dashboard' : '/captain-dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 p-12">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">
              <FaCar className="text-white mx-auto" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Welcome Back</h1>
            <p className="text-white/90 text-lg leading-relaxed">
              Get reliable rides when you need them. Safe, fast, and affordable.
            </p>
            <div className="mt-12 space-y-4">
              {[
                { icon: '✓', text: '4M+ Rides Completed' },
                { icon: '✓', text: '98% On-time Guarantee' },
                { icon: '✓', text: 'Real-time Tracking' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-white">
                  <span className="text-2xl font-bold">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex flex-col justify-center p-8 md:p-12">
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Login to RideZilla</h2>
              <p className="text-gray-600">Sign in to your account to continue</p>
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-4 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-yellow-500 hover:text-yellow-600 font-medium">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary btn-lg w-full font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-600 mb-4">
                Don't have an account?{' '}
                <Link to="/signup" className="text-yellow-500 font-bold hover:text-yellow-600">
                  Sign up here
                </Link>
              </p>
            </div>

            {/* Social Login */}
            <div className="mt-6 space-y-3">
              <button className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium">
                <span>🔵</span> Continue with Google
              </button>
              <button className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium">
                <span>📱</span> Continue with Phone
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
