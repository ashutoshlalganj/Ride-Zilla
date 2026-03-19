import express from 'express';
import * as authController from '../controllers/authController.js';
import { validateSignup, validateLogin } from '../middleware/validation.js';

const router = express.Router();

// Auth Routes
router.post('/register-user', validateSignup, authController.registerUser);
router.post('/register-captain', validateSignup, authController.registerCaptain);
router.post('/verify-user-email', authController.verifyUserEmail);
router.post('/verify-captain-email', authController.verifyCaptainEmail);
router.post('/login-user', validateLogin, authController.loginUser);
router.post('/login-captain', validateLogin, authController.loginCaptain);
router.post('/resend-otp', authController.resendOTP);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

export default router;
