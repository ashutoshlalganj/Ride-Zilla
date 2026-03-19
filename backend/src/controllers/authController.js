import * as authService from '../services/authService.js';

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, phone, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Passwords do not match',
      });
    }

    const user = await authService.registerUser(fullName, email, phone, password);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully. Please verify your email.',
      userId: user._id,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const registerCaptain = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      confirmPassword,
      drivingLicenseNumber,
      licenseExpiryDate,
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Passwords do not match',
      });
    }

    const captain = await authService.registerCaptain(
      fullName,
      email,
      phone,
      password,
      drivingLicenseNumber,
      licenseExpiryDate
    );

    res.status(201).json({
      status: 'success',
      message: 'Captain registered successfully. Please verify your email.',
      captainId: captain._id,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const verifyUserEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const result = await authService.verifyUserSignup(email, otp);

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully',
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const verifyCaptainEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const result = await authService.verifyCaptainSignup(email, otp);

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully',
      captain: result.captain,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser(email, password);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const loginCaptain = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginCaptain(email, password);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      captain: result.captain,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    await authService.resendOTP(email);

    res.status(200).json({
      status: 'success',
      message: 'OTP sent to your email',
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Refresh token is required',
      });
    }

    const tokens = authService.refreshAccessToken(refreshToken);

    res.status(200).json({
      status: 'success',
      message: 'Token refreshed successfully',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'Logout successful',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Logout failed',
    });
  }
};
