import * as userService from '../services/userService.js';

export const getProfile = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.userId);
    res.status(200).json({
      status: 'success',
      user,
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await userService.updateUserProfile(req.user.userId, req.body);
    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const getWallet = async (req, res) => {
  try {
    const wallet = await userService.getUserWallet(req.user.userId);
    res.status(200).json({
      status: 'success',
      wallet,
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const addMoneyToWallet = async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await userService.addMoneyToWallet(req.user.userId, amount);
    res.status(200).json({
      status: 'success',
      message: 'Money added to wallet',
      walletBalance: user.walletBalance,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const getRides = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await userService.getUserRides(
      req.user.userId,
      parseInt(page),
      parseInt(limit)
    );
    res.status(200).json({
      status: 'success',
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const getRideStats = async (req, res) => {
  try {
    const stats = await userService.getUserRideStats(req.user.userId);
    res.status(200).json({
      status: 'success',
      stats,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const addEmergencyContact = async (req, res) => {
  try {
    const user = await userService.addEmergencyContact(req.user.userId, req.body);
    res.status(201).json({
      status: 'success',
      message: 'Emergency contact added',
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const removeEmergencyContact = async (req, res) => {
  try {
    const { contactIndex } = req.params;
    const user = await userService.removeEmergencyContact(
      req.user.userId,
      parseInt(contactIndex)
    );
    res.status(200).json({
      status: 'success',
      message: 'Emergency contact removed',
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query, page = 1, limit = 20 } = req.query;
    const result = await userService.searchUsers(query, parseInt(page), parseInt(limit));
    res.status(200).json({
      status: 'success',
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};
