import Ride from '../models/Ride.js';
import User from '../models/User.js';
import Captain from '../models/Captain.js';
import axios from 'axios';

export const calculateFare = async (
  pickupLocation,
  dropLocation,
  vehicleType
) => {
  // Calculate distance using Google Maps API or haversine
  const distance = calculateDistance(
    pickupLocation.coordinates,
    dropLocation.coordinates
  );

  const baseFares = {
    bike: 30,
    auto: 50,
    car: 80,
    sedan: 100,
    suv: 120,
  };

  const perKmRates = {
    bike: 5,
    auto: 8,
    car: 12,
    sedan: 15,
    suv: 18,
  };

  const baseFare = baseFares[vehicleType] || baseFares.auto;
  const perKmRate = perKmRates[vehicleType] || perKmRates.auto;

  const distanceFare = distance * perKmRate;
  const totalFare = baseFare + distanceFare;

  return {
    baseFare,
    perKmRate,
    distance: Math.round(distance * 100) / 100,
    estimatedFare: Math.round(totalFare * 100) / 100,
  };
};

const calculateDistance = (pickup, drop) => {
  const [lat1, lon1] = pickup;
  const [lat2, lon2] = drop;

  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const createRideRequest = async (rideData) => {
  const { userId, pickupLocation, dropLocation, vehicleType } = rideData;

  const fareData = await calculateFare(pickupLocation, dropLocation, vehicleType);

  const ride = new Ride({
    userId,
    pickupLocation,
    pickupAddress: rideData.pickupAddress,
    dropLocation,
    dropAddress: rideData.dropAddress,
    vehicleType,
    baseFare: fareData.baseFare,
    perKmRate: fareData.perKmRate,
    estimatedDistance: fareData.distance,
    totalFare: fareData.estimatedFare,
    finalFare: fareData.estimatedFare,
    paymentMethod: rideData.paymentMethod || 'wallet',
  });

  await ride.save();
  return ride;
};

export const getRideById = async (rideId) => {
  const ride = await Ride.findById(rideId)
    .populate('userId', 'fullName phone profileImageUrl rating')
    .populate('captainId', 'fullName phone profileImageUrl rating');

  if (!ride) {
    throw new Error('Ride not found');
  }

  return ride;
};

export const updateRideStatus = async (rideId, status) => {
  const validStatuses = [
    'searching',
    'accepted',
    'arriving',
    'started',
    'completed',
    'cancelled',
  ];

  if (!validStatuses.includes(status)) {
    throw new Error('Invalid ride status');
  }

  const ride = await Ride.findByIdAndUpdate(
    rideId,
    { rideStatus: status },
    { new: true }
  );

  return ride;
};

export const acceptRide = async (captainId, rideId) => {
  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new Error('Ride not found');
  }

  if (ride.rideStatus !== 'searching') {
    throw new Error('Ride is not available');
  }

  ride.captainId = captainId;
  ride.rideStatus = 'accepted';
  ride.rideOtp = generateRideOTP();

  await ride.save();

  // Update captain earnings
  const captain = await Captain.findById(captainId);
  if (captain) {
    captain.totalCompletedRides += 1;
    await captain.save();
  }

  return ride;
};

export const completeRide = async (rideId, finalFare) => {
  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new Error('Ride not found');
  }

  ride.rideStatus = 'completed';
  ride.completedAt = new Date();
  ride.finalFare = finalFare;
  ride.paymentStatus = 'completed';

  await ride.save();

  // Update user stats
  const user = await User.findById(ride.userId);
  if (user) {
    user.totalRides += 1;
    if (ride.paymentMethod === 'wallet') {
      user.walletBalance -= finalFare;
    }
    await user.save();
  }

  // Update captain earnings
  const captain = await Captain.findById(ride.captainId);
  if (captain) {
    captain.totalEarnings += finalFare * 0.75; // 25% commission to platform
    await captain.save();
  }

  return ride;
};

export const cancelRide = async (rideId, cancelledBy, reason) => {
  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new Error('Ride not found');
  }

  if (['completed', 'cancelled'].includes(ride.rideStatus)) {
    throw new Error('Cannot cancel a completed or already cancelled ride');
  }

  let cancellationFee = 0;
  if (ride.rideStatus === 'accepted') {
    cancellationFee = ride.baseFare * 0.5;
  }

  ride.rideStatus = 'cancelled';
  ride.cancelledAt = new Date();
  ride.cancelledBy = cancelledBy;
  ride.cancellationReason = reason;
  ride.cancellationFee = cancellationFee;

  await ride.save();

  return ride;
};

export const rateRide = async (rideId, userId, rating, review) => {
  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new Error('Ride not found');
  }

  if (ride.rideStatus !== 'completed') {
    throw new Error('Can only rate completed rides');
  }

  if (ride.userId.toString() !== userId) {
    throw new Error('Unauthorized');
  }

  ride.userRating = rating;
  ride.userReview = review;

  await ride.save();

  // Update captain rating
  const captain = await Captain.findById(ride.captainId);
  if (captain) {
    const rides = await Ride.find({
      captainId: ride.captainId,
      userRating: { $exists: true, $ne: null },
    });

    const totalRating = rides.reduce((sum, r) => sum + r.userRating, 0);
    captain.rating = Math.round((totalRating / rides.length) * 10) / 10;
    await captain.save();
  }

  return ride;
};

export const getNearestRides = async (captainLocation, radius = 10) => {
  const rides = await Ride.find({
    rideStatus: 'searching',
    pickupLocation: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: captainLocation.coordinates,
        },
        $maxDistance: radius * 1000,
      },
    },
  }).populate('userId', 'fullName rating');

  return rides;
};

export const getUserActiveRide = async (userId) => {
  const ride = await Ride.findOne({
    userId,
    rideStatus: { $in: ['searching', 'accepted', 'arriving', 'started'] },
  }).populate('captainId', 'fullName phone profileImageUrl');

  return ride;
};

export const getCaptainActiveRide = async (captainId) => {
  const ride = await Ride.findOne({
    captainId,
    rideStatus: { $in: ['accepted', 'arriving', 'started'] },
  }).populate('userId', 'fullName phone profileImageUrl');

  return ride;
};

const generateRideOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const searchRides = async (query, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const rides = await Ride.find({
    $or: [
      { pickupAddress: { $regex: query, $options: 'i' } },
      { dropAddress: { $regex: query, $options: 'i' } },
      { vehicleType: { $regex: query, $options: 'i' } },
    ],
  })
    .populate('userId', 'fullName')
    .populate('captainId', 'fullName')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Ride.countDocuments({
    $or: [
      { pickupAddress: { $regex: query, $options: 'i' } },
      { dropAddress: { $regex: query, $options: 'i' } },
      { vehicleType: { $regex: query, $options: 'i' } },
    ],
  });

  return {
    rides,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
    },
  };
};
