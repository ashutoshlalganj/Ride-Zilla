import { verifyAccessToken } from '../utils/jwt.js';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'No token provided. Please login first.'
      });
    }

    const token = authHeader.slice(7);
    const decoded = verifyAccessToken(token);
    
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token. Please login again.'
    });
  }
};

// Alias for captain routes
const captainAuthMiddleware = authMiddleware;

// Alias for admin routes
const adminAuthMiddleware = authMiddleware;

export default authMiddleware;
export { authMiddleware, captainAuthMiddleware, adminAuthMiddleware };
