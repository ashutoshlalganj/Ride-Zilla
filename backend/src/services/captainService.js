import Captain from '../models/Captain.js';
import Ride from '../models/Ride.js';

export const getCaptainById = async (captainId) => {
  const captain = await Captain.findById(captainId).select('-passwordHash');
  if (!captain) {
    throw new Error('Captain not found');
  }
  return captain;
};

export const updateCaptainProfile = async (captainId, updateData) => {
  const allowedFields = [
    'fullName',
    'profileImageUrl',
    'bankAccountNumber',
    'bankIfscCode',
  ];

  const filteredData = {};
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  });

  const captain = await Captain.findByIdAndUpdate(captainId, filteredData, {
    new: true,
    runValidators: true,
  }).select('-passwordHash');

  return captain;
};

export const updateCaptainLocation = async (captainId, latitude, longitude) => {
  const captain = await Captain.findByIdAndUpdate(
    captainId,
    {
      currentLocation: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
    },
    { new: true }
  );

  return captain;
};

export const toggleCaptainOnlineStatus = async (captainId, isOnline) => {
  const captain = await Captain.findByIdAndUpdate(
    captainId,
    { isOnline },
    { new: true }
  );

  return captain;
};

export const getCaptainEarnings = async (captainId, period = 'month') => {
  const captain = await Captain.findById(captainId);

  let dateFilter = {};
  const now = new Date();

  if (period === 'day') {
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    dateFilter = { createdAt: { $gte: startOfDay } };
  } else if (period === 'week') {
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    dateFilter = { createdAt: { $gte: startOfWeek } };
  } else if (period === 'month') {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    dateFilter = { createdAt: { $gte: startOfMonth } };
  }

  const rides = await Ride.find({
    captainId,
    rideStatus: 'completed',
    ...dateFilter,
  });

  const earnings = rides.reduce((sum, ride) => sum + (ride.finalFare || 0), 0);
  const rideCount = rides.length;

  return {
    captainId,
    totalEarnings: captain.totalEarnings,
    periodEarnings: earnings,
    periodRides: rideCount,
    averagePerRide: rideCount > 0 ? earnings / rideCount : 0,
  };
};

export const getCaptainRides = async (
  captainId,
  status = null,
  page = 1,
  limit = 10
) => {
  const skip = (page - 1) * limit;

  const query = { captainId };
  if (status) {
    query.rideStatus = status;
  }

  const rides = await Ride.find(query)
    .populate('userId', 'fullName rating profileImageUrl')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Ride.countDocuments(query);

  return {
    rides,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRides: total,
    },
  };
};

export const getCaptainRideStats = async (captainId) => {
  const captain = await Captain.findById(captainId);

  const rides = await Ride.find({ captainId });
  const completedRides = rides.filter(
    (r) => r.rideStatus === 'completed'
  ).length;
  const cancelledRides = rides.filter(
    (r) => r.rideStatus === 'cancelled'
  ).length;

  return {
    totalRides: captain.totalCompletedRides,
    completedRides,
    cancelledRides,
    acceptanceRate:
      rides.length > 0
        ? ((completedRides / rides.length) * 100).toFixed(2)
        : 0,
    averageRating: captain.rating,
    totalEarnings: captain.totalEarnings,
    walletBalance: captain.walletBalance || 0,
  };
};

export const approveCaptain = async (captainId) => {
  const captain = await Captain.findByIdAndUpdate(
    captainId,
    { isApproved: true },
    { new: true }
  );

  return captain;
};

export const blockCaptain = async (captainId, reason) => {
  const captain = await Captain.findByIdAndUpdate(
    captainId,
    {
      isBlocked: true,
      blockReason: reason,
      blockedAt: new Date(),
    },
    { new: true }
  );

  return captain;
};

export const unblockCaptain = async (captainId) => {
  const captain = await Captain.findByIdAndUpdate(
    captainId,
    {
      isBlocked: false,
      blockReason: null,
      blockedAt: null,
    },
    { new: true }
  );

  return captain;
};

export const getNearestCaptains = async (latitude, longitude, radius = 5) => {
  const captains = await Captain.find({
    currentLocation: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: radius * 1000,
      },
    },
    isOnline: true,
    isApproved: true,
    isBlocked: false,
  }).select('-passwordHash');

  return captains;
};

export const searchCaptains = async (query, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const captains = await Captain.find({
    $or: [
      { fullName: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
      { phone: { $regex: query, $options: 'i' } },
      { drivingLicenseNumber: { $regex: query, $options: 'i' } },
    ],
  })
    .select('-passwordHash')
    .skip(skip)
    .limit(limit);

  const total = await Captain.countDocuments({
    $or: [
      { fullName: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
      { phone: { $regex: query, $options: 'i' } },
      { drivingLicenseNumber: { $regex: query, $options: 'i' } },
    ],
  });

  return {
    captains,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
    },
  };
};
