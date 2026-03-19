import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { FaUser, FaWallet, FaSignOutAlt, FaBars, FaTimes, FaCar } from 'react-icons/fa';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isAuthenticated, userRole, user, captain } = useSelector(
    (state) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMenuOpen(false);
  };

  const currentUser = user || captain;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <FaCar size={28} className="text-yellow-400" />
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:inline">
              Ride<span className="text-yellow-400">Zilla</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-gray-700 font-medium hover:text-yellow-400 transition">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary btn-sm"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {userRole === 'user' && (
                  <>
                    <Link to="/dashboard" className="text-gray-700 font-medium hover:text-yellow-400 transition">
                      My Rides
                    </Link>
                    <Link to="/wallet" className="text-gray-700 font-medium hover:text-yellow-400 transition flex items-center gap-1">
                      <FaWallet size={16} /> Wallet
                    </Link>
                  </>
                )}
                {userRole === 'captain' && (
                  <>
                    <Link to="/captain-dashboard" className="text-gray-700 font-medium hover:text-yellow-400 transition">
                      Dashboard
                    </Link>
                    <Link to="/captain-earnings" className="text-gray-700 font-medium hover:text-yellow-400 transition">
                      Earnings
                    </Link>
                  </>
                )}

                <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <FaUser size={16} className="text-yellow-600" />
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-sm font-semibold text-gray-900">{currentUser?.name?.split(' ')[0] || 'User'}</p>
                      <p className="text-xs text-gray-500">{userRole || 'Guest'}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => navigate('/profile')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <FaUser size={18} className="text-gray-600" />
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="p-2 hover:bg-red-50 rounded-lg transition"
                  >
                    <FaSignOutAlt size={18} className="text-red-500" />
                  </button>
                </div>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {isMenuOpen ? (
              <FaTimes size={24} className="text-gray-900" />
            ) : (
              <FaBars size={24} className="text-gray-900" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden pb-6 space-y-3 border-t border-gray-200 pt-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="block w-full text-center py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block w-full btn-primary text-center"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg mb-2">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                    <FaUser size={16} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{currentUser?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                  </div>
                </div>
                
                {userRole === 'user' && (
                  <>
                    <Link
                      to="/dashboard"
                      className="block w-full py-2 px-4 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition"
                    >
                      My Rides
                    </Link>
                    <Link
                      to="/wallet"
                      className="block w-full py-2 px-4 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition"
                    >
                      Wallet
                    </Link>
                  </>
                )}
                {userRole === 'captain' && (
                  <>
                    <Link
                      to="/captain-dashboard"
                      className="block w-full py-2 px-4 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/captain-earnings"
                      className="block w-full py-2 px-4 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition"
                    >
                      Earnings
                    </Link>
                  </>
                )}
                
                <Link
                  to="/profile"
                  className="block w-full py-2 px-4 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition"
                >
                  Edit Profile
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="w-full py-2 px-4 text-red-600 font-medium hover:bg-red-50 rounded-lg transition"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
