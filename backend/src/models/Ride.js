import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  captainId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Captain'
  },
  pickupLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  },
  pickupAddress: String,
  dropLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  },
  dropAddress: String,
  vehicleType: {
    type: String,
    enum: ['bike', 'auto', 'car', 'sedan', 'suv'],
    required: true
  },
  rideStatus: {
    type: String,
    enum: ['searching', 'accepted', 'arriving', 'started', 'completed', 'cancelled'],
    default: 'searching'
  },
  baseFare: Number,
  perKmRate: Number,
  perMinuteRate: Number,
  estimatedDistance: Number,
  estimatedDuration: Number,
  actualDistance: Number,
  actualDuration: Number,
  totalFare: Number,
  discountApplied: {
    type: Number,
    default: 0
  },
  finalFare: Number,
  surgeMultiplier: {
    type: Number,
    default: 1
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'wallet', 'cash', 'upi']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'refunded'],
    default: 'pending'
  },
  rideOtp: String,
  startedAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  cancellationReason: String,
  cancelledBy: {
    type: String,
    enum: ['user', 'captain', 'admin']
  },
  cancellationFee: Number,
  userRating: {
    type: Number,
    min: 1,
    max: 5
  },
  userReview: String,
  captainRating: {
    type: Number,
    min: 1,
    max: 5
  },
  captainReview: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

rideSchema.index({ userId: 1, createdAt: -1 });
rideSchema.index({ captainId: 1, createdAt: -1 });
rideSchema.index({ rideStatus: 1 });
rideSchema.index({ pickupLocation: '2dsphere' });
rideSchema.index({ dropLocation: '2dsphere' });

export default mongoose.model('Ride', rideSchema);
