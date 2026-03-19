import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Captain from '../models/Captain.js';
import nodemailer from 'nodemailer';
import { generateOTP } from '../utils/otp.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const hashPassword = async (password) => {
  return await bcryptjs.hash(password, 10);
};

export const comparePassword = async (password, hash) => {
  return await bcryptjs.compare(password, hash);
};

export const generateTokens = (userId, role = 'user') => {
  const accessToken = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  const refreshToken = jwt.sign(
    { userId, role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '30d' }
  );

  return { accessToken, refreshToken };
};

export const registerUser = async (fullName, email, phone, password) => {
  const existingUser = await User.findOne({
    $or: [{ email }, { phone }],
  });

  if (existingUser) {
    throw new Error('User with this email or phone already exists');
  }

  const passwordHash = await hashPassword(password);
  const otp = generateOTP();

  const user = new User({
    fullName,
    email,
    phone,
    passwordHash,
    otpCode: otp,
    otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  await user.save();
  await sendOTPEmail(email, otp);

  return user;
};

export const registerCaptain = async (
  fullName,
  email,
  phone,
  password,
  drivingLicenseNumber,
  licenseExpiryDate
) => {
  const existingCaptain = await Captain.findOne({
    $or: [{ email }, { phone }, { drivingLicenseNumber }],
  });

  if (existingCaptain) {
    throw new Error(
      'Captain with this email, phone, or license number already exists'
    );
  }

  const passwordHash = await hashPassword(password);
  const otp = generateOTP();

  const captain = new Captain({
    fullName,
    email,
    phone,
    passwordHash,
    drivingLicenseNumber,
    licenseExpiryDate,
    otpCode: otp,
    otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  await captain.save();
  await sendOTPEmail(email, otp);

  return captain;
};

export const verifyUserSignup = async (email, otp) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  if (user.otpCode !== otp || user.otpExpiresAt < new Date()) {
    throw new Error('Invalid or expired OTP');
  }

  user.isVerified = true;
  user.emailVerifiedAt = new Date();
  user.otpCode = null;
  user.otpExpiresAt = null;

  await user.save();

  const { accessToken, refreshToken } = generateTokens(user._id, 'user');

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const verifyCaptainSignup = async (email, otp) => {
  const captain = await Captain.findOne({ email });

  if (!captain) {
    throw new Error('Captain not found');
  }

  if (captain.otpCode !== otp || captain.otpExpiresAt < new Date()) {
    throw new Error('Invalid or expired OTP');
  }

  captain.isVerified = true;
  captain.emailVerifiedAt = new Date();
  captain.otpCode = null;
  captain.otpExpiresAt = null;

  await captain.save();

  const { accessToken, refreshToken } = generateTokens(captain._id, 'captain');

  return {
    captain,
    accessToken,
    refreshToken,
  };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  if (!user.isVerified) {
    throw new Error('User email not verified');
  }

  if (user.isBlocked) {
    throw new Error('User account is blocked');
  }

  const { accessToken, refreshToken } = generateTokens(user._id, 'user');

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const loginCaptain = async (email, password) => {
  const captain = await Captain.findOne({ email });

  if (!captain) {
    throw new Error('Captain not found');
  }

  const isPasswordValid = await comparePassword(password, captain.passwordHash);

  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  if (!captain.isVerified) {
    throw new Error('Captain email not verified');
  }

  if (!captain.isApproved) {
    throw new Error('Captain not approved by admin yet');
  }

  if (captain.isBlocked) {
    throw new Error('Captain account is blocked');
  }

  const { accessToken, refreshToken } = generateTokens(captain._id, 'captain');

  return {
    captain,
    accessToken,
    refreshToken,
  };
};

export const resendOTP = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  const otp = generateOTP();
  user.otpCode = otp;
  user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await user.save();
  await sendOTPEmail(email, otp);

  return { success: true };
};

export const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Ride Zilla - OTP Verification',
    html: `
      <h2>Email Verification</h2>
      <p>Your OTP code is: <strong>${otp}</strong></p>
      <p>This code will expire in 10 minutes.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send OTP email');
  }
};

export const refreshAccessToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      decoded.userId,
      decoded.role
    );
    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};
