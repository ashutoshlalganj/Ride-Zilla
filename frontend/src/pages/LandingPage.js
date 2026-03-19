import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { FaCar, FaMapMarkerAlt, FaShieldAlt, FaUsers, FaClock, FaHeadset, FaLock } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const LandingPage = () => {
  const { isAuthenticated, userRole } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      if (userRole === 'user') {
        window.location.href = '/dashboard';
      } else if (userRole === 'captain') {
        window.location.href = '/captain-dashboard';
      }
    }
  }, [isAuthenticated, userRole]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-white to-gray-50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 mb-6 bg-yellow-100 px-4 py-2 rounded-full">
                <span className="text-yellow-600 font-semibold text-sm">🚀 Trusted by Millions</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Smart Rides, <span className="text-yellow-400">Every Time</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Fast, safe, and affordable rides at your fingertips. Get from A to B with confidence, every single ride.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  to="/signup"
                  className="btn-primary btn-lg text-center font-bold shadow-lg hover:shadow-xl"
                >
                  Book Your First Ride
                </Link>
                <Link
                  to="/login"
                  className="btn-secondary btn-lg text-center font-bold"
                >
                  Login
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-3xl font-bold text-gray-900">10M+</p>
                  <p className="text-sm text-gray-600">Active Users</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">500K+</p>
                  <p className="text-sm text-gray-600">Captains</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">4.8★</p>
                  <p className="text-sm text-gray-600">Rating</p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="hidden lg:flex justify-center items-center animate-slide-in-up">
              <div className="relative w-full max-w-md h-96">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl blur-3xl opacity-20"></div>
                <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                  <div className="p-8 space-y-6">
                    <div className="bg-yellow-100 rounded-2xl p-4">
                      <p className="text-sm text-gray-600 mb-2">Pickup Location</p>
                      <p className="font-bold text-gray-900">Central Station</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 h-1 bg-yellow-400 rounded-full"></div>
                      <div className="px-4">
                        <FaCar className="text-yellow-400" size={24} />
                      </div>
                      <div className="flex-1 h-1 bg-gray-300 rounded-full"></div>
                    </div>
                    <div className="bg-blue-100 rounded-2xl p-4">
                      <p className="text-sm text-gray-600 mb-2">Dropoff Location</p>
                      <p className="font-bold text-gray-900">New Market</p>
                    </div>
                    <button className="w-full btn-primary font-bold">
                      Request Ride
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-display mb-4">Why Choose RideZilla?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the difference with industry-leading features and services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaClock size={32} />,
                title: 'Lightning Fast',
                desc: 'Average pickup time of just 4 minutes across the city',
                color: 'bg-blue-100 text-blue-600',
              },
              {
                icon: <FaShieldAlt size={32} />,
                title: 'Safe & Secure',
                desc: 'Verified drivers, GPS tracking, and 24/7 customer support',
                color: 'bg-green-100 text-green-600',
              },
              {
                icon: <FaMapMarkerAlt size={32} />,
                title: 'Best Routes',
                desc: 'AI-powered route optimization for fastest rides',
                color: 'bg-yellow-100 text-yellow-600',
              },
              {
                icon: <FaUsers size={32} />,
                title: 'Professional Captains',
                desc: 'Courteous, experienced drivers with excellent ratings',
                color: 'bg-purple-100 text-purple-600',
              },
              {
                icon: <FaLock size={32} />,
                title: 'Your Privacy Matters',
                desc: 'Your data is encrypted and never shared',
                color: 'bg-red-100 text-red-600',
              },
              {
                icon: <FaHeadset size={32} />,
                title: '24/7 Support',
                desc: 'Always here to help, anytime you need assistance',
                color: 'bg-indigo-100 text-indigo-600',
              },
            ].map((feature, index) => (
              <div key={index} className="card hover:shadow-lg border border-gray-200 group">
                <div className={`${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition`}>
                  {feature.icon}
                </div>
                <h3 className="text-h3 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ride Types Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-display mb-4">Choose Your Ride</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Different rides for different needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Bike',
                price: '₹8/km',
                time: '2 mins',
                icon: '🏍️',
                color: 'from-orange-400 to-red-500',
              },
              {
                name: 'Auto',
                price: '₹10/km',
                time: '3 mins',
                icon: '🚙',
                color: 'from-green-400 to-blue-500',
              },
              {
                name: 'Car',
                price: '₹12/km',
                time: '4 mins',
                icon: '🚗',
                color: 'from-blue-400 to-purple-500',
              },
              {
                name: 'Premium',
                price: '₹18/km',
                time: '5 mins',
                icon: '🚙',
                color: 'from-yellow-400 to-orange-500',
              },
            ].map((ride, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${ride.color} rounded-2xl p-6 text-white card-elevated shadow-lg hover:shadow-xl transition cursor-pointer`}
              >
                <p className="text-4xl mb-4">{ride.icon}</p>
                <h3 className="text-xl font-bold mb-2">{ride.name}</h3>
                <div className="space-y-1">
                  <p className="text-white/90">{ride.price}</p>
                  <p className="text-white/80 text-sm">Avg. wait: {ride.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-display mb-4">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Enter Location',
                desc: 'Tell us where you want to go',
              },
              {
                step: '02',
                title: 'Choose Ride',
                desc: 'Pick from our available ride options',
              },
              {
                step: '03',
                title: 'Confirm & Pay',
                desc: 'Confirm your booking and payment method',
              },
              {
                step: '04',
                title: 'Enjoy Your Ride',
                desc: 'Your captain arrives and you\'re on your way',
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-400 text-gray-900 font-bold text-2xl mb-6 shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-h3 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Captains Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-display mb-6 text-white">Earn More as a Captain</h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Be your own boss and earn flexible income. Join thousands of captains making money on their own schedule.
              </p>
              <ul className="space-y-4 mb-12">
                {[
                  'Competitive earnings & incentives',
                  'Zero commitment, work when you want',
                  'Weekly payouts to your account',
                  'Free support & training',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <span className="text-yellow-400 font-bold">✓</span>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
              <button className="btn-primary font-bold">
                Sign Up as Captain
              </button>
            </div>
            <div className="bg-white/10 rounded-3xl p-8 backdrop-blur-sm border border-white/20">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Earnings This Week</span>
                  <span className="text-2xl font-bold text-yellow-400">₹12,450</span>
                </div>
                <div className="h-px bg-white/10"></div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Total Rides</span>
                  <span className="text-2xl font-bold">156</span>
                </div>
                <div className="h-px bg-white/10"></div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Rating</span>
                  <span className="text-2xl font-bold text-yellow-400">4.9★</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-display mb-6">Ready to Get Moving?</h2>
          <p className="text-xl text-gray-600 mb-12">
            Download the app or sign up on web to start your journey today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary btn-lg font-bold">
              Download App
            </button>
            <Link
              to="/signup"
              className="btn-secondary btn-lg font-bold"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
