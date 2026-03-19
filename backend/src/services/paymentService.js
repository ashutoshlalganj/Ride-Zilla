import Razorpay from 'razorpay';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import Ride from '../models/Ride.js';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const createPaymentOrder = async (amount, userId, rideId = null) => {
  try {
    // Amount in paise
    const amountInPaise = Math.round(amount * 100);

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${userId}_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    // Save payment record
    const payment = new Payment({
      userId,
      rideId,
      amount,
      currency: 'INR',
      razorpayOrderId: order.id,
      paymentStatus: 'pending',
      paymentMethod: 'razorpay',
    });

    await payment.save();

    return {
      orderId: order.id,
      amount,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
      userId,
    };
  } catch (error) {
    throw new Error(`Payment order creation failed: ${error.message}`);
  }
};

export const verifyPayment = async (
  razorpayPaymentId,
  razorpayOrderId,
  razorpaySignature
) => {
  try {
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
    hmac.update(razorpayOrderId + '|' + razorpayPaymentId);
    const digest = hmac.digest('hex');

    if (digest !== razorpaySignature) {
      throw new Error('Invalid payment signature');
    }

    // Fetch payment from payment service
    const razorpayPayment = await razorpay.payments.fetch(razorpayPaymentId);

    // Update payment record
    const payment = await Payment.findOne({
      razorpayOrderId,
    });

    if (payment) {
      payment.razorpayPaymentId = razorpayPaymentId;
      payment.razorpaySignature = razorpaySignature;
      payment.paymentStatus = 'completed';
      payment.transactionDate = new Date();

      await payment.save();

      // Add money to wallet
      const user = await User.findById(payment.userId);
      if (user) {
        user.walletBalance += payment.amount;
        await user.save();
      }
    }

    return {
      success: true,
      message: 'Payment verified successfully',
      payment,
    };
  } catch (error) {
    throw new Error(`Payment verification failed: ${error.message}`);
  }
};

export const createWalletPayment = async (userId, amount) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Create Razorpay order
    const order = await createPaymentOrder(amount, userId);

    return order;
  } catch (error) {
    throw new Error(`Wallet payment creation failed: ${error.message}`);
  }
};

export const completeRidePayment = async (rideId, amount, paymentMethod) => {
  try {
    const ride = await Ride.findById(rideId);

    if (!ride) {
      throw new Error('Ride not found');
    }

    const payment = new Payment({
      userId: ride.userId,
      rideId,
      amount,
      currency: 'INR',
      paymentStatus: 'completed',
      paymentMethod,
      transactionDate: new Date(),
    });

    await payment.save();

    if (paymentMethod === 'wallet') {
      const user = await User.findById(ride.userId);
      if (user) {
        if (user.walletBalance < amount) {
          throw new Error('Insufficient wallet balance');
        }
        user.walletBalance -= amount;
        await user.save();
      }
    }

    return payment;
  } catch (error) {
    throw new Error(`Ride payment completion failed: ${error.message}`);
  }
};

export const getPaymentHistory = async (userId, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;

    const payments = await Payment.find({ userId })
      .populate('rideId')
      .sort({ transactionDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Payment.countDocuments({ userId });

    return {
      payments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
      },
    };
  } catch (error) {
    throw new Error(`Payment history retrieval failed: ${error.message}`);
  }
};

export const refundPayment = async (paymentId, amount) => {
  try {
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.paymentStatus === 'refunded') {
      throw new Error('Payment already refunded');
    }

    // Refund via Razorpay
    if (payment.razorpayPaymentId) {
      await razorpay.payments.refund(payment.razorpayPaymentId, {
        amount: amount * 100, // Convert to paise
      });
    }

    payment.paymentStatus = 'refunded';
    payment.refundDate = new Date();
    payment.refundAmount = amount;

    await payment.save();

    // Add refund amount back to wallet
    const user = await User.findById(payment.userId);
    if (user) {
      user.walletBalance += amount;
      await user.save();
    }

    return payment;
  } catch (error) {
    throw new Error(`Payment refund failed: ${error.message}`);
  }
};

export const getPaymentStats = async (startDate, endDate) => {
  try {
    const payments = await Payment.find({
      transactionDate: { $gte: startDate, $lte: endDate },
      paymentStatus: 'completed',
    });

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const transactionCount = payments.length;
    const averageTransaction = transactionCount > 0 ? totalRevenue / transactionCount : 0;

    return {
      totalRevenue,
      transactionCount,
      averageTransaction,
      dateRange: { startDate, endDate },
    };
  } catch (error) {
    throw new Error(`Payment stats retrieval failed: ${error.message}`);
  }
};
