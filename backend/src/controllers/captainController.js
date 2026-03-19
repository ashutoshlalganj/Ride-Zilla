import * as captainService from '../services/captainService.js';

export const getProfile = async (req, res) => {
  try {
    const captain = await captainService.getCaptainById(req.captain.captainId);
    res.status(200).json({
      status: 'success',
      captain,
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
    const captain = await captainService.updateCaptainProfile(
      req.captain.captainId,
      req.body
    );
    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      captain,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const captain = await captainService.updateCaptainLocation(
      req.captain.captainId,
      latitude,
      longitude
    );
    res.status(200).json({
      status: 'success',
      message: 'Location updated',
      captain,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const toggleOnlineStatus = async (req, res) => {
  try {
    const { isOnline } = req.body;
    const captain = await captainService.toggleCaptainOnlineStatus(
      req.captain.captainId,
      isOnline
    );
    res.status(200).json({
      status: 'success',
      message: `Captain is now ${isOnline ? 'online' : 'offline'}`,
      captain,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const getEarnings = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const earnings = await captainService.getCaptainEarnings(
      req.captain.captainId,
      period
    );
    res.status(200).json({
      status: 'success',
      earnings,
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
    const { status = null, page = 1, limit = 10 } = req.query;
    const result = await captainService.getCaptainRides(
      req.captain.captainId,
      status,
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
    const stats = await captainService.getCaptainRideStats(
      req.captain.captainId
    );
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

export const searchCaptains = async (req, res) => {
  try {
    const { query, page = 1, limit = 20 } = req.query;
    const result = await captainService.searchCaptains(
      query,
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
