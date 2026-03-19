import express from 'express';
import * as userController from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// User Routes
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);
router.get('/wallet', authMiddleware, userController.getWallet);
router.post('/wallet/add-money', authMiddleware, userController.addMoneyToWallet);
router.get('/rides', authMiddleware, userController.getRides);
router.get('/ride-stats', authMiddleware, userController.getRideStats);
router.post('/emergency-contact', authMiddleware, userController.addEmergencyContact);
router.delete('/emergency-contact/:contactIndex', authMiddleware, userController.removeEmergencyContact);
router.get('/search', authMiddleware, userController.searchUsers);

export default router;
