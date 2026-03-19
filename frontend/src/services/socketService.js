import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    initializeSocket();
  }
  return socket;
};

export const registerUser = (userId) => {
  const socket = getSocket();
  socket.emit('register-user', { userId });
};

export const registerCaptain = (captainId) => {
  const socket = getSocket();
  socket.emit('register-captain', { captainId });
};

export const requestRide = (rideData) => {
  const socket = getSocket();
  socket.emit('ride-requested', rideData);
};

export const acceptRide = (data) => {
  const socket = getSocket();
  socket.emit('ride-accepted', data);
};

export const updateLocation = (locationData) => {
  const socket = getSocket();
  socket.emit('location-update', locationData);
};

export const sendMessage = (messageData) => {
  const socket = getSocket();
  socket.emit('send-message', messageData);
};

export const onNewRideAvailable = (callback) => {
  const socket = getSocket();
  socket.on('new-ride-available', callback);
};

export const onRideAccepted = (callback) => {
  const socket = getSocket();
  socket.on('ride-accepted', callback);
};

export const onCaptainLocation = (callback) => {
  const socket = getSocket();
  socket.on('captain-location', callback);
};

export const onReceiveMessage = (callback) => {
  const socket = getSocket();
  socket.on('receive-message', callback);
};

export const onRideStarted = (callback) => {
  const socket = getSocket();
  socket.on('ride-started', callback);
};

export const onRideCompleted = (callback) => {
  const socket = getSocket();
  socket.on('ride-completed', callback);
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
