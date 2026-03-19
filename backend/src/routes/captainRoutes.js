import express from 'express';
import * as captainController from '../controllers/captainController.js';
import { captainAuthMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Captain Routes
router.get('/profile', captainAuthMiddleware, captainController.getProfile);
router.put('/profile', captainAuthMiddleware, captainController.updateProfile);
router.post('/update-location', captainAuthMiddleware, captainController.updateLocation);
router.post('/toggle-online-status', captainAuthMiddleware, captainController.toggleOnlineStatus);
router.get('/earnings', captainAuthMiddleware, captainController.getEarnings);
router.get('/rides', captainAuthMiddleware, captainController.getRides);
router.get('/ride-stats', captainAuthMiddleware, captainController.getRideStats);
router.get('/search', captainAuthMiddleware, captainController.searchCaptains);

export default router;
