export const setupSocketHandlers = (io) => {
  const activeUsers = new Map();
  const activeCaptains = new Map();

  io.on('connection', (socket) => {
    console.log(`🔌 User Connected: ${socket.id}`);

    // User joins
    socket.on('user-register', (userId) => {
      activeUsers.set(socket.id, { userId, socketId: socket.id });
      socket.join(`user-${userId}`);
      console.log(`✓ User ${userId} registered on socket ${socket.id}`);
    });

    // Captain joins
    socket.on('captain-register', (captainId) => {
      activeCaptains.set(socket.id, { captainId, socketId: socket.id });
      socket.join(`captain-${captainId}`);
      console.log(`✓ Captain ${captainId} registered on socket ${socket.id}`);
    });

    // New ride request
    socket.on('ride-request', (rideData) => {
      io.to('captains').emit('new-ride-available', rideData);
    });

    // Captain accepts ride
    socket.on('ride-accepted', (data) => {
      io.to(`user-${data.userId}`).emit('ride-accepted', {
        captainId: data.captainId,
        captainDetails: data.captainDetails,
        vehicleDetails: data.vehicleDetails,
      });
    });

    // Location update from captain
    socket.on('location-update', (data) => {
      io.to(`user-${data.userId}`).emit('captain-location', {
        latitude: data.latitude,
        longitude: data.longitude,
      });
    });

    // Ride started
    socket.on('ride-started', (data) => {
      io.to(`user-${data.userId}`).emit('ride-started', {
        rideId: data.rideId,
        startTime: new Date(),
      });
    });

    // Ride completed
    socket.on('ride-completed', (data) => {
      io.to(`user-${data.userId}`).emit('ride-completed', {
        rideId: data.rideId,
        amount: data.amount,
      });
    });

    // Chat message
    socket.on('send-message', (data) => {
      if (data.recipientId) {
        io.to(`user-${data.recipientId}`).emit('receive-message', {
          senderId: data.senderId,
          message: data.message,
          timestamp: new Date(),
        });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      activeUsers.delete(socket.id);
      activeCaptains.delete(socket.id);
      console.log(`❌ User Disconnected: ${socket.id}`);
    });
  });

  return { activeUsers, activeCaptains };
};
