import express from 'express';
import * as paymentController from '../controllers/paymentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Payment Routes
router.post('/create-order', authMiddleware, paymentController.createPaymentOrder);
router.post('/verify', authMiddleware, paymentController.verifyPayment);
router.post('/wallet/add-money', authMiddleware, paymentController.addWalletMoney);
router.post('/ride/complete', authMiddleware, paymentController.completeRidePayment);
router.get('/history', authMiddleware, paymentController.getPaymentHistory);
router.post('/refund', authMiddleware, paymentController.refundPayment);
router.get('/stats', authMiddleware, paymentController.getPaymentStats);

export default router;
