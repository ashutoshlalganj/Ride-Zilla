import * as rideService from '../services/rideService.js';
import * as emailService from '../services/emailService.js';

export const bookRide = async (req, res) => {
  try {
    const { pickupLocation, dropLocation, vehicleType, pickupAddress, dropAddress, paymentMethod } = req.body;

    const ride = await rideService.createRideRequest({
      userId: req.user.userId,
      pickupLocation,
      dropLocation,
      vehicleType,
      pickupAddress,
      dropAddress,
      paymentMethod,
    });

    res.status(201).json({
      status: 'success',
      message: 'Ride booked successfully',
      ride,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const getRideById = async (req, res) => {
  try {
    const ride = await rideService.getRideById(req.params.rideId);
    res.status(200).json({
      status: 'success',
      ride,
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const getCalculatedFare = async (req, res) => {
  try {
    const { pickupLocation, dropLocation, vehicleType } = req.body;
    const fare = await rideService.calculateFare(
      pickupLocation,
      dropLocation,
      vehicleType
    );
    res.status(200).json({
      status: 'success',
      fare,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const acceptRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const ride = await rideService.acceptRide(req.captain.captainId, rideId);
    res.status(200).json({
      status: 'success',
      message: 'Ride accepted',
      ride,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const startRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const ride = await rideService.updateRideStatus(rideId, 'started');
    res.status(200).json({
      status: 'success',
      message: 'Ride started',
      ride,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const completeRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { finalFare } = req.body;
    const ride = await rideService.completeRide(rideId, finalFare);

    // Send email
    await emailService.sendRideCompletedEmail(
      req.user?.email || 'user@example.com',
      {
        rideId: ride._id,
        finalFare: ride.finalFare,
        distance: ride.actualDistance,
        duration: ride.actualDuration,
      }
    );

    res.status(200).json({
      status: 'success',
      message: 'Ride completed',
      ride,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const cancelRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { cancelledBy, reason } = req.body;
    const ride = await rideService.cancelRide(rideId, cancelledBy, reason);

    res.status(200).json({
      status: 'success',
      message: 'Ride cancelled',
      ride,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const rateRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { rating, review } = req.body;
    const ride = await rideService.rateRide(rideId, req.user.userId, rating, review);

    res.status(200).json({
      status: 'success',
      message: 'Ride rated successfully',
      ride,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const getActiveRide = async (req, res) => {
  try {
    const ride = await rideService.getUserActiveRide(req.user.userId);
    if (!ride) {
      return res.status(404).json({
        status: 'error',
        message: 'No active ride found',
      });
    }
    res.status(200).json({
      status: 'success',
      ride,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const getNearestRides = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;
    const rides = await rideService.getNearestRides(
      {
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      parseFloat(radius)
    );

    res.status(200).json({
      status: 'success',
      rides,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const searchRides = async (req, res) => {
  try {
    const { query, page = 1, limit = 20 } = req.query;
    const result = await rideService.searchRides(
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
