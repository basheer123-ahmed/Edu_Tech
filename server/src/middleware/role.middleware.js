const ApiError = require('../utils/ApiError');

/**
 * Middleware to restrict access based on roles
 * @param {...string} roles 
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Unauthorized - No user context'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403, 
          `Forbidden - Role '${req.user.role}' does not have permission to access this resource`
        )
      );
    }

    next();
  };
};

module.exports = authorize;
