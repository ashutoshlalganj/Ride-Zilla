import User from '../models/User.js';
import Captain from '../models/Captain.js';
import Ride from '../models/Ride.js';
import Payment from '../models/Payment.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCaptains = await Captain.countDocuments();
    const totalRides = await Ride.countDocuments();
    const completedRides = await Ride.countDocuments({ rideStatus: 'completed' });

    const totalRevenue = await Payment.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    res.status(200).json({
      status: 'success',
      stats: {
        totalUsers,
        totalCaptains,
        totalRides,
        completedRides,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-passwordHash')
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.status(200).json({
      status: 'success',
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const getAllCaptains = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const captains = await Captain.find()
      .select('-passwordHash')
      .skip(skip)
      .limit(limit);

    const total = await Captain.countDocuments();

    res.status(200).json({
      status: 'success',
      captains,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked: true },
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'User blocked successfully',
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked: false },
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'User unblocked successfully',
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const approveCaptain = async (req, res) => {
  try {
    const { captainId } = req.params;
    const captain = await Captain.findByIdAndUpdate(
      captainId,
      { isApproved: true },
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'Captain approved successfully',
      captain,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const blockCaptain = async (req, res) => {
  try {
    const { captainId } = req.params;
    const { reason } = req.body;

    const captain = await Captain.findByIdAndUpdate(
      captainId,
      { isBlocked: true, blockReason: reason },
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'Captain blocked successfully',
      captain,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const unblockCaptain = async (req, res) => {
  try {
    const { captainId } = req.params;
    const captain = await Captain.findByIdAndUpdate(
      captainId,
      { isBlocked: false, blockReason: null },
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'Captain unblocked successfully',
      captain,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const getAllRides = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const rides = await Ride.find()
      .populate('userId', 'fullName email phone')
      .populate('captainId', 'fullName email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Ride.countDocuments();

    res.status(200).json({
      status: 'success',
      rides,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const payments = await Payment.find({
      transactionDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
      paymentStatus: 'completed',
    });

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const transactionCount = payments.length;

    res.status(200).json({
      status: 'success',
      report: {
        totalRevenue,
        transactionCount,
        dateRange: { startDate, endDate },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};
