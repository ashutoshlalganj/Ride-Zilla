import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const createOrder = async (amount, currency = 'INR', receipt = null) => {
  try {
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: receipt || `rcptid_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    throw new Error(`Failed to create Razorpay order: ${error.message}`);
  }
};

export const verifySignature = (
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature
) => {
  const hmac = crypto.createHmac(
    'sha256',
    process.env.RAZORPAY_SECRET
  );
  hmac.update(razorpayOrderId + '|' + razorpayPaymentId);
  const digest = hmac.digest('hex');

  return digest === razorpaySignature;
};

export const fetchPayment = async (paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    throw new Error(`Failed to fetch payment: ${error.message}`);
  }
};

export const refundPayment = async (paymentId, amount = null) => {
  try {
    const options = {};
    if (amount) {
      options.amount = Math.round(amount * 100); // Convert to paise
    }

    const refund = await razorpay.payments.refund(paymentId, options);
    return refund;
  } catch (error) {
    throw new Error(`Failed to refund payment: ${error.message}`);
  }
};

export const fetchRefund = async (refundId) => {
  try {
    const refund = await razorpay.refunds.fetch(refundId);
    return refund;
  } catch (error) {
    throw new Error(`Failed to fetch refund: ${error.message}`);
  }
};

export const getCapturePayment = async (paymentId, amount) => {
  try {
    const payment = await razorpay.payments.capture(
      paymentId,
      Math.round(amount * 100)
    );
    return payment;
  } catch (error) {
    throw new Error(`Failed to capture payment: ${error.message}`);
  }
};

export const createTransfer = async (
  paymentId,
  recipientId,
  amount
) => {
  try {
    const transfer = await razorpay.transfers.create({
      account: recipientId,
      amount: Math.round(amount * 100),
      source: 'payment',
      source_id: paymentId,
    });
    return transfer;
  } catch (error) {
    throw new Error(`Failed to create transfer: ${error.message}`);
  }
};
