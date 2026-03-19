import express from 'express';
import * as rideController from '../controllers/rideController.js';
import { authMiddleware, captainAuthMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Ride Routes
router.post('/book', authMiddleware, rideController.bookRide);
router.get('/:rideId', authMiddleware, rideController.getRideById);
router.post('/calculate-fare', authMiddleware, rideController.getCalculatedFare);
router.post('/:rideId/accept', captainAuthMiddleware, rideController.acceptRide);
router.post('/:rideId/start', captainAuthMiddleware, rideController.startRide);
router.post('/:rideId/complete', captainAuthMiddleware, rideController.completeRide);
router.post('/:rideId/cancel', authMiddleware, rideController.cancelRide);
router.post('/:rideId/rate', authMiddleware, rideController.rateRide);
router.get('/user/:userId/active', authMiddleware, rideController.getActiveRide);
router.get('/captain/:captainId/nearby', captainAuthMiddleware, rideController.getNearestRides);
router.get('/search', authMiddleware, rideController.searchRides);

export default router;
