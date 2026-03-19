// Ride status constants
export const RIDE_STATUS = {
  SEARCHING: 'searching',
  ACCEPTED: 'accepted',
  ARRIVING: 'arriving',
  STARTED: 'started',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Payment status constants
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

// Payment methods
export const PAYMENT_METHODS = {
  WALLET: 'wallet',
  CARD: 'card',
  CASH: 'cash',
  UPI: 'upi',
  RAZORPAY: 'razorpay',
};

// Vehicle types
export const VEHICLE_TYPES = {
  BIKE: 'bike',
  AUTO: 'auto',
  CAR: 'car',
  SEDAN: 'sedan',
  SUV: 'suv',
};

// User roles
export const USER_ROLES = {
  USER: 'user',
  CAPTAIN: 'captain',
  ADMIN: 'admin',
};

// Base fares for different vehicle types
export const BASE_FARES = {
  bike: 30,
  auto: 50,
  car: 80,
  sedan: 100,
  suv: 120,
};

// Per km rates
export const PER_KM_RATES = {
  bike: 5,
  auto: 8,
  car: 12,
  sedan: 15,
  suv: 18,
};
