import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaStar, FaClock, FaRoad, FaDollarSign, FaUser, FaArrowRight } from 'react-icons/fa';

const RideCard = ({ ride, onSelect, isPast = false }) => {
  const getStatusColor = (status) => {
    const colors = {
      searching: 'bg-yellow-100 text-yellow-700 border-l-4 border-yellow-400',
      accepted: 'bg-blue-100 text-blue-700 border-l-4 border-blue-400',
      arriving: 'bg-blue-100 text-blue-700 border-l-4 border-blue-400',
      started: 'bg-green-100 text-green-700 border-l-4 border-green-400',
      completed: 'bg-green-100 text-green-700 border-l-4 border-green-400',
      cancelled: 'bg-red-100 text-red-700 border-l-4 border-red-400',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-l-4 border-gray-400';
  };

  const getStatusBadge = (status) => {
    const badges = {
      searching: { text: 'Finding Ride', color: 'bg-yellow-100 text-yellow-700' },
      accepted: { text: 'Captain Accepted', color: 'bg-blue-100 text-blue-700' },
      arriving: { text: 'Captain Arriving', color: 'bg-blue-100 text-blue-700' },
      started: { text: 'In Progress', color: 'bg-green-100 text-green-700' },
      completed: { text: 'Completed', color: 'bg-green-100 text-green-700' },
      cancelled: { text: 'Cancelled', color: 'bg-red-100 text-red-700' },
    };
    const badge = badges[status] || { text: status, color: 'bg-gray-100 text-gray-700' };
    return badge;
  };

  const statusBadge = getStatusBadge(ride.rideStatus);
  const rideDate = new Date(ride.createdAt).toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="card hover:shadow-lg border border-gray-200 hover:border-yellow-400 transition group cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">🚕</span>
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-lg">{ride.rideType || 'Economy'}</p>
            <p className="text-xs text-gray-500">{rideDate}</p>
          </div>
        </div>
        <span className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ml-4 ${statusBadge.color}`}>
          {statusBadge.text}
        </span>
      </div>

      {/* Route */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="space-y-3">
          {/* From */}
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center gap-2 mt-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="w-0.5 h-8 bg-gray-300"></div>
            </div>
            <div className="flex-1 pt-1">
              <p className="text-xs text-gray-500 uppercase font-semibold">From</p>
              <p className="text-sm font-medium text-gray-900 mt-1">{ride.pickupLocation || ride.pickupAddress}</p>
            </div>
          </div>

          {/* To */}
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center gap-2">
              <div className="w-0.5 h-8 bg-gray-300"></div>
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase font-semibold">To</p>
              <p className="text-sm font-medium text-gray-900 mt-1">{ride.dropoffLocation || ride.dropAddress}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2 text-gray-400">
            <FaRoad size={16} />
          </div>
          <p className="text-xs text-gray-500 mb-1">Distance</p>
          <p className="text-lg font-bold text-gray-900">{ride.estimatedDistance || ride.actualDistance || 0} km</p>
        </div>
        <div className="text-center border-l border-r border-gray-200">
          <div className="flex items-center justify-center gap-2 mb-2 text-gray-400">
            <FaDollarSign size={16} />
          </div>
          <p className="text-xs text-gray-500 mb-1">Fare</p>
          <p className="text-lg font-bold text-gray-900">₹{ride.finalFare || ride.totalFare || 0}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2 text-gray-400">
            <FaClock size={16} />
          </div>
          <p className="text-xs text-gray-500 mb-1">Duration</p>
          <p className="text-lg font-bold text-gray-900">{ride.estimatedTime || 15} min</p>
        </div>
      </div>

      {/* Captain Info (if available) */}
      {ride.captain && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <FaUser size={16} className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{ride.captain.name}</p>
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-400" size={12} />
                <p className="text-xs text-gray-600">{ride.captain.rating || 4.8}/5</p>
              </div>
            </div>
          </div>
          <button className="p-2 hover:bg-yellow-100 rounded-lg transition">
            <FaPhone className="text-yellow-500" />
          </button>
        </div>
      )}

      {/* Rating (if past ride) */}
      {isPast && ride.userRating && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-gray-700">Your Rating</span>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={i < ride.userRating ? 'text-yellow-400' : 'text-gray-300'}
                size={18}
              />
            ))}
            <span className="ml-auto text-sm font-bold text-gray-700">{ride.userRating}/5</span>
          </div>
        </div>
      )}

      {/* Action Button */}
      {onSelect && (
        <button
          onClick={() => onSelect(ride)}
          className="w-full btn-primary font-bold flex items-center justify-center gap-2"
        >
          View Details <FaArrowRight size={14} />
        </button>
      )}
    </div>
  );
};

export default RideCard;
