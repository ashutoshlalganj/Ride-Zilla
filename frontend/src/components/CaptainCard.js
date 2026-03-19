import React from 'react';
import { FaStar } from 'react-icons/fa';

const CaptainCard = ({ captain, onSelect, availability = true }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={captain.profileImageUrl || 'https://via.placeholder.com/60'}
            alt={captain.fullName}
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-800">{captain.fullName}</h3>
            <p className="text-sm text-gray-500">{captain.vehicleType}</p>
          </div>
        </div>
        {!availability && (
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
            Offline
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 py-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={i < Math.floor(captain.rating) ? 'text-yellow-400' : 'text-gray-300'}
              size={16}
            />
          ))}
        </div>
        <span className="text-sm font-medium text-gray-700">
          {captain.rating.toFixed(1)}/5
        </span>
      </div>

      <div className="text-sm text-gray-600 mb-3">
        <p>Completed: {captain.totalCompletedRides} rides</p>
      </div>

      {onSelect && availability && (
        <button
          onClick={() => onSelect(captain)}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Select Captain
        </button>
      )}
    </div>
  );
};

export default CaptainCard;
