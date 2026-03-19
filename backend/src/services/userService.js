import User from '../models/User.js';
import Ride from '../models/Ride.js';

export const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-passwordHash');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const updateUserProfile = async (userId, updateData) => {
  const allowedFields = [
    'fullName',
    'profileImageUrl',
    'emergencyContacts',
    'languagePreference',
    'preferredPaymentMethod',
  ];

  const filteredData = {};
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  });

  const user = await User.findByIdAndUpdate(userId, filteredData, {
    new: true,
    runValidators: true,
  }).select('-passwordHash');

  return user;
};

export const getUserWallet = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return {
    userId: user._id,
    walletBalance: user.walletBalance,
  };
};

export const addMoneyToWallet = async (userId, amount) => {
  if (amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { walletBalance: amount } },
    { new: true }
  );

  return user;
};

export const getUserRides = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const rides = await Ride.find({ userId })
    .populate('captainId', 'fullName rating profileImageUrl')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Ride.countDocuments({ userId });

  return {
    rides,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRides: total,
    },
  };
};

export const getUserRideStats = async (userId) => {
  const user = await User.findById(userId);

  const rides = await Ride.find({ userId });
  const completedRides = rides.filter(
    (r) => r.rideStatus === 'completed'
  ).length;
  const totalSpent = rides
    .filter((r) => r.rideStatus === 'completed')
    .reduce((sum, r) => sum + (r.finalFare || 0), 0);

  return {
    totalRides: user.totalRides,
    completedRides,
    totalSpent,
    averageRating: user.rating,
    walletBalance: user.walletBalance,
  };
};

export const addEmergencyContact = async (userId, contact) => {
  const user = await User.findById(userId);

  if (!user.emergencyContacts) {
    user.emergencyContacts = [];
  }

  user.emergencyContacts.push({
    name: contact.name,
    phone: contact.phone,
    relationship: contact.relationship,
  });

  await user.save();
  return user;
};

export const removeEmergencyContact = async (userId, contactIndex) => {
  const user = await User.findById(userId);

  if (user.emergencyContacts && user.emergencyContacts[contactIndex]) {
    user.emergencyContacts.splice(contactIndex, 1);
    await user.save();
  }

  return user;
};

export const searchUsers = async (query, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const users = await User.find({
    $or: [
      { fullName: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
      { phone: { $regex: query, $options: 'i' } },
    ],
  })
    .select('-passwordHash')
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments({
    $or: [
      { fullName: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
      { phone: { $regex: query, $options: 'i' } },
    ],
  });

  return {
    users,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
    },
  };
};
