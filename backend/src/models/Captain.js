import mongoose from 'mongoose';

const captainSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  profileImageUrl: String,
  drivingLicenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  licenseExpiryDate: {
    type: Date,
    required: true
  },
  licenseImageUrl: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  bankAccountNumber: String,
  bankIfscCode: String,
  aadharNumber: String,
  panCardNumber: String,
  totalEarnings: {
    type: Number,
    default: 0
  },
  totalCompletedRides: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5
  },
  otpCode: String,
  otpExpiresAt: Date,
  emailVerifiedAt: Date,
  phoneVerifiedAt: Date,
  documentVerifiedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

captainSchema.index({ email: 1 });
captainSchema.index({ phone: 1 });
captainSchema.index({ isOnline: 1 });
captainSchema.index({ currentLocation: '2dsphere' });

export default mongoose.model('Captain', captainSchema);
