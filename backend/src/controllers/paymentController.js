import * as paymentService from '../services/paymentService.js';
import * as razorpayService from '../services/razorpayService.js';

export const createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await paymentService.createPaymentOrder(
      amount,
      req.user.userId
    );

    res.status(201).json({
      status: 'success',
      message: 'Payment order created',
      order,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    const result = await paymentService.verifyPayment(
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature
    );

    res.status(200).json({
      status: 'success',
      message: 'Payment verified',
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const addWalletMoney = async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await paymentService.createWalletPayment(
      req.user.userId,
      amount
    );

    res.status(201).json({
      status: 'success',
      message: 'Wallet payment order created',
      order,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const completeRidePayment = async (req, res) => {
  try {
    const { rideId, amount, paymentMethod } = req.body;

    const payment = await paymentService.completeRidePayment(
      rideId,
      amount,
      paymentMethod
    );

    res.status(200).json({
      status: 'success',
      message: 'Ride payment completed',
      payment,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const result = await paymentService.getPaymentHistory(
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

export const refundPayment = async (req, res) => {
  try {
    const { paymentId, amount } = req.body;

    const refund = await paymentService.refundPayment(paymentId, amount);

    res.status(200).json({
      status: 'success',
      message: 'Payment refunded',
      refund,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const getPaymentStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const stats = await paymentService.getPaymentStats(
      new Date(startDate),
      new Date(endDate)
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
