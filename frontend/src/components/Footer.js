import React from 'react';
import { FaCar, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <FaCar className="text-yellow-400" size={28} />
                <span className="text-2xl font-bold">RideZilla</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                The most trusted ride-sharing platform for safe, affordable, and reliable transportation.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition">
                  <FaFacebook size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition">
                  <FaTwitter size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition">
                  <FaInstagram size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition">
                  <FaLinkedin size={20} />
                </a>
              </div>
            </div>

            {/* For Riders */}
            <div>
              <h4 className="text-lg font-bold mb-6">For Riders</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Book a Ride', href: '/ride-booking' },
                  { label: 'My Rides', href: '/dashboard' },
                  { label: 'Wallet', href: '/wallet' },
                  { label: 'My Profile', href: '/profile' },
                  { label: 'Offers', href: '#' },
                ].map((link, idx) => (
                  <li key={idx}>
                    <a href={link.href} className="text-gray-400 hover:text-yellow-400 transition text-sm">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Captains */}
            <div>
              <h4 className="text-lg font-bold mb-6">For Captains</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Become a Captain', href: '/signup?type=captain' },
                  { label: 'Earnings', href: '/captain-earnings' },
                  { label: 'My Rides', href: '/captain-dashboard' },
                  { label: 'Support', href: '#' },
                  { label: 'Rewards', href: '#' },
                ].map((link, idx) => (
                  <li key={idx}>
                    <a href={link.href} className="text-gray-400 hover:text-yellow-400 transition text-sm">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-lg font-bold mb-6">Company</h4>
              <ul className="space-y-3">
                {[
                  { label: 'About Us', href: '#' },
                  { label: 'Blog', href: '#' },
                  { label: 'Careers', href: '#' },
                  { label: 'Press', href: '#' },
                  { label: 'Contact', href: '#' },
                ].map((link, idx) => (
                  <li key={idx}>
                    <a href={link.href} className="text-gray-400 hover:text-yellow-400 transition text-sm">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-lg font-bold mb-6">Legal</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Terms & Conditions', href: '#' },
                  { label: 'Privacy Policy', href: '#' },
                  { label: 'Cookie Policy', href: '#' },
                  { label: 'Security', href: '#' },
                  { label: 'Report Safety', href: '#' },
                ].map((link, idx) => (
                  <li key={idx}>
                    <a href={link.href} className="text-gray-400 hover:text-yellow-400 transition text-sm">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800"></div>

          {/* Bottom Footer */}
          <div className="mt-12 flex flex-col md:flex-row items-end md:items-center justify-between">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} RideZilla. All rights reserved.
            </p>
            
            <div className="flex gap-6">
              <select className="bg-gray-800 text-white text-sm rounded-lg px-4 py-2 border border-gray-700 hover:border-gray-600 focus:outline-none focus:border-yellow-400">
                <option>English</option>
                <option>Hindi</option>
                <option>Spanish</option>
              </select>
              <select className="bg-gray-800 text-white text-sm rounded-lg px-4 py-2 border border-gray-700 hover:border-gray-600 focus:outline-none focus:border-yellow-400">
                <option>India</option>
                <option>USA</option>
                <option>UK</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

export default Footer;
