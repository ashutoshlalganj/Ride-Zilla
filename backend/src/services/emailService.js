import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send email');
  }
};

export const sendRideConfirmationEmail = async (to, rideDetails) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Ride Confirmation</h2>
      <p>Your ride has been confirmed!</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr style="background-color: #f0f0f0;">
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Ride ID</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${rideDetails.rideId}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Pickup Address</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${rideDetails.pickupAddress}</td>
        </tr>
        <tr style="background-color: #f0f0f0;">
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Drop Address</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${rideDetails.dropAddress}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Estimated Fare</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">₹${rideDetails.estimatedFare}</td>
        </tr>
        <tr style="background-color: #f0f0f0;">
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Vehicle Type</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${rideDetails.vehicleType}</td>
        </tr>
      </table>
      <p style="margin-top: 20px; color: #666;">Thank you for choosing Ride Zilla!</p>
    </div>
  `;

  return sendEmail(to, 'Ride Confirmation - Ride Zilla', html);
};

export const sendRideCompletedEmail = async (to, rideDetails) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Ride Completed</h2>
      <p>Your ride has been completed successfully!</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr style="background-color: #f0f0f0;">
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Ride ID</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${rideDetails.rideId}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Total Fare</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">₹${rideDetails.finalFare}</td>
        </tr>
        <tr style="background-color: #f0f0f0;">
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Distance</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${rideDetails.distance} km</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Duration</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${rideDetails.duration} minutes</td>
        </tr>
      </table>
      <p style="margin-top: 20px; color: #666;">Please rate your ride to help us improve our service.</p>
    </div>
  `;

  return sendEmail(
    to,
    'Ride Completed - Thank You! - Ride Zilla',
    html
  );
};

export const sendPasswordResetEmail = async (to, resetLink) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Reset Request</h2>
      <p>We received a request to reset your password.</p>
      <p>Click the link below to reset your password:</p>
      <p>
        <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
      </p>
      <p style="color: #666;">This link will expire in 1 hour.</p>
      <p style="color: #666;">If you didn't request this, please ignore this email.</p>
    </div>
  `;

  return sendEmail(to, 'Password Reset - Ride Zilla', html);
};

export const sendWelcomeEmail = async (to, fullName) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to Ride Zilla, ${fullName}!</h2>
      <p>Thank you for joining our platform.</p>
      <p>You can now book rides, manage your account, and enjoy our services.</p>
      <p>
        <a href="${process.env.REACT_APP_API_URL}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Get Started
        </a>
      </p>
      <p style="color: #666;">Happy Riding!</p>
    </div>
  `;

  return sendEmail(to, 'Welcome to Ride Zilla!', html);
};

export const sendCancelledRideEmail = async (to, rideDetails) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Ride Cancelled</h2>
      <p>Your ride (ID: ${rideDetails.rideId}) has been cancelled.</p>
      <p><strong>Reason:</strong> ${rideDetails.reason || 'No reason provided'}</p>
      ${
        rideDetails.refundAmount
          ? `<p><strong>Refund Amount:</strong> ₹${rideDetails.refundAmount}</p>`
          : ''
      }
      <p>If you have any questions, please contact our support team.</p>
    </div>
  `;

  return sendEmail(to, 'Ride Cancelled - Ride Zilla', html);
};
