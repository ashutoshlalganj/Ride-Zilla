import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { adminAuthMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin Routes
router.get('/dashboard', adminAuthMiddleware, adminController.getDashboardStats);
router.get('/users', adminAuthMiddleware, adminController.getAllUsers);
router.get('/captains', adminAuthMiddleware, adminController.getAllCaptains);
router.post('/users/:userId/block', adminAuthMiddleware, adminController.blockUser);
router.post('/users/:userId/unblock', adminAuthMiddleware, adminController.unblockUser);
router.post('/captains/:captainId/approve', adminAuthMiddleware, adminController.approveCaptain);
router.post('/captains/:captainId/block', adminAuthMiddleware, adminController.blockCaptain);
router.post('/captains/:captainId/unblock', adminAuthMiddleware, adminController.unblockCaptain);
router.get('/rides', adminAuthMiddleware, adminController.getAllRides);
router.get('/revenue-report', adminAuthMiddleware, adminController.getRevenueReport);

export default router;
