const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.userRole || !allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. You do not have permission to access this resource.'
      });
    }
    next();
  };
};

export default roleMiddleware;
