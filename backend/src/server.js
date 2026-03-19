import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true
});

app.use('/api/', limiter);
app.use('/api/auth/', authLimiter);

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Database Connection
import { default as connectDB } from './config/database.js';

// API Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import captainRoutes from './routes/captainRoutes.js';
import rideRoutes from './routes/rideRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/captains', captainRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'Ride Zilla API Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    status: 'error',
    message: message,
    timestamp: new Date().toISOString()
  });
});

// Socket.io Setup
io.on('connection', (socket) => {
  console.log(`[SOCKET] User connected: ${socket.id}`);

  // Join room based on user type
  socket.on('registerUserSocket', (data) => {
    socket.join(`user_${data.userId}`);
    console.log(`User ${data.userId} joined room user_${data.userId}`);
  });

  socket.on('registerCaptainSocket', (data) => {
    socket.join(`captain_${data.captainId}`);
    console.log(`Captain ${data.captainId} joined room captain_${data.captainId}`);
  });

  // Ride Request Events
  socket.on('searchRide', (data) => {
    // Find and notify nearby captains
    io.to('captains').emit('newRideRequest', data);
  });

  socket.on('acceptRide', (data) => {
    io.to(`user_${data.userId}`).emit('rideAccepted', data);
  });

  socket.on('rejectRide', (data) => {
    console.log(`Ride ${data.rideId} rejected`);
  });

  // Location Tracking
  socket.on('updateLocation', (data) => {
    io.to(`user_${data.rideId}`).emit('captainLocationUpdate', {
      latitude: data.latitude,
      longitude: data.longitude,
      rideId: data.rideId
    });
  });

  // Ride Status Updates
  socket.on('rideStarted', (data) => {
    io.to(`user_${data.userId}`).emit('rideStarted', data);
  });

  socket.on('rideCompleted', (data) => {
    io.to(`user_${data.userId}`).emit('rideCompleted', data);
  });

  socket.on('disconnect', () => {
    console.log(`[SOCKET] User disconnected: ${socket.id}`);
  });
});

// Server Startup
const PORT = process.env.PORT || 5000;

// Connect to database before starting server
connectDB().then(() => {
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔═══════════════════════════════════════╗
║   🚗 RIDE ZILLA API SERVER STARTED    ║
╠═══════════════════════════════════════╣
║  Server running on: http://localhost:${PORT}
║  Environment: ${process.env.NODE_ENV || 'development'}
║  Socket.io: Ready for real-time updates
╚═══════════════════════════════════════╝
    `);
  });
}).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export { app, io };
