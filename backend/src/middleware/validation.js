import { body, validationResult } from 'express-validator';

export const validateSignup = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 3 }).withMessage('Full name must be at least 3 characters'),
  
  body('email')
    .trim()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('phone')
    .trim()
    .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
    .withMessage('Invalid phone number format'),
  
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*]/).withMessage('Password must contain at least one special character (!@#$%^&*)'),
  
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

export const validateLogin = [
  body('email')
    .trim()
    .isEmail().withMessage('Invalid email format'),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

export const validateCaptainSignup = [
  ...validateSignup,
  
  body('drivingLicenseNumber')
    .trim()
    .notEmpty().withMessage('Driving license number is required'),
  
  body('licenseExpiryDate')
    .isISO8601().withMessage('Invalid license expiry date'),
  
  body('vehicleType')
    .isIn(['bike', 'auto', 'car', 'sedan', 'suv'])
    .withMessage('Invalid vehicle type'),
  
  body('vehicleNumber')
    .trim()
    .notEmpty().withMessage('Vehicle number is required'),
  
  body('vehicleModel')
    .trim()
    .notEmpty().withMessage('Vehicle model is required')
];

export const validateRideBooking = [
  body('pickupLatitude')
    .isFloat({ min: -90, max: 90 }).withMessage('Invalid pickup latitude'),
  
  body('pickupLongitude')
    .isFloat({ min: -180, max: 180 }).withMessage('Invalid pickup longitude'),
  
  body('dropLatitude')
    .isFloat({ min: -90, max: 90 }).withMessage('Invalid drop latitude'),
  
  body('dropLongitude')
    .isFloat({ min: -180, max: 180 }).withMessage('Invalid drop longitude'),
  
  body('vehicleType')
    .isIn(['bike', 'auto', 'car', 'sedan', 'suv'])
    .withMessage('Invalid vehicle type'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

export const validatePayment = [
  body('rideId')
    .notEmpty().withMessage('Ride ID is required'),
  
  body('amount')
    .isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
  
  body('paymentMethod')
    .isIn(['card', 'wallet', 'cash', 'upi'])
    .withMessage('Invalid payment method'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];
