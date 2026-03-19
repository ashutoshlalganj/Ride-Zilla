export const socketHandlers = {
  onUserConnected: (socket, userId) => {
    socket.join(`user-${userId}`);
    socket.join('users');
    console.log(`✓ User ${userId} connected`);
  },

  onCaptainConnected: (socket, captainId) => {
    socket.join(`captain-${captainId}`);
    socket.join('captains');
    console.log(`✓ Captain ${captainId} connected`);
  },

  onLocationUpdate: (io, socket, data) => {
    io.to(`user-${data.userId}`).emit('captain-location', {
      latitude: data.latitude,
      longitude: data.longitude,
      captainId: data.captainId,
    });
  },

  onRideAccepted: (io, socket, data) => {
    io.to(`user-${data.userId}`).emit('ride-accepted', {
      captainId: data.captainId,
      captainName: data.captainName,
      vehicleDetails: data.vehicleDetails,
    });
  },

  onRideStarted: (io, socket, data) => {
    io.to(`user-${data.userId}`).emit('ride-started', {
      rideId: data.rideId,
      startTime: new Date(),
    });
  },

  onRideCompleted: (io, socket, data) => {
    io.to(`user-${data.userId}`).emit('ride-completed', {
      rideId: data.rideId,
      finalFare: data.finalFare,
      distance: data.distance,
      duration: data.duration,
    });
  },

  onSendMessage: (io, socket, data) => {
    if (data.recipientId) {
      io.to(`user-${data.recipientId}`).emit('receive-message', {
        senderId: data.senderId,
        senderName: data.senderName,
        message: data.message,
        timestamp: new Date(),
      });
    }
  },

  onError: (socket, error) => {
    console.error('Socket Error:', error);
    socket.emit('error', { message: 'An error occurred' });
  },

  onDisconnect: (socket, userId) => {
    console.log(`❌ User/Captain ${userId} disconnected`);
  },
};
