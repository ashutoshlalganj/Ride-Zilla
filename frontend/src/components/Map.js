import React from 'react';

const Map = ({ latitude, longitude, zoom = 15 }) => {
  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-md">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API}&q=${latitude},${longitude}&zoom=${zoom}`}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default Map;
