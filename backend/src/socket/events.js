// Socket Events
export const SOCKET_EVENTS = {
  // Connection events
  USER_CONNECTED: 'user-connected',
  CAPTAIN_CONNECTED: 'captain-connected',
  USER_DISCONNECTED: 'user-disconnected',
  CAPTAIN_DISCONNECTED: 'captain-disconnected',

  // Ride events
  RIDE_REQUESTED: 'ride-requested',
  RIDE_ACCEPTED: 'ride-accepted',
  RIDE_ARRIVED: 'ride-arrived',
  RIDE_STARTED: 'ride-started',
  RIDE_COMPLETED: 'ride-completed',
  RIDE_CANCELLED: 'ride-cancelled',

  // Location events
  LOCATION_UPDATE: 'location-update',
  CAPTAIN_LOCATION: 'captain-location',

  // Message events
  SEND_MESSAGE: 'send-message',
  RECEIVE_MESSAGE: 'receive-message',

  // Notification events
  NOTIFICATION: 'notification',
  ALERT: 'alert',
};

export const setupSocketEvents = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Socket Connected: ${socket.id}`);

    // User registration
    socket.on('register-user', (data) => {
      socket.join(`user-${data.userId}`);
      socket.join('users');
      console.log(`✓ User ${data.userId} joined`);
    });

    // Captain registration
    socket.on('register-captain', (data) => {
      socket.join(`captain-${data.captainId}`);
      socket.join('captains');
      console.log(`✓ Captain ${data.captainId} joined`);
    });

    // Ride requested
    socket.on('ride-requested', (data) => {
      io.to('captains').emit('new-ride-available', data);
    });

    // Ride accepted
    socket.on('ride-accepted', (data) => {
      io.to(`user-${data.userId}`).emit('ride-accepted', data);
    });

    // Location update
    socket.on('location-update', (data) => {
      io.to(`user-${data.userId}`).emit('captain-location', {
        latitude: data.latitude,
        longitude: data.longitude,
        captainId: data.captainId,
      });
    });

    // Message
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
      console.log(`❌ Socket Disconnected: ${socket.id}`);
    });
  });
};
