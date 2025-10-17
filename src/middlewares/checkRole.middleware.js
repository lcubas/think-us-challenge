const logger = require('../config/logger');
const { ForbiddenError, UnauthorizedError } = require('../utils/errors');

const checkRoleMiddleware = (...allowedRoles) => {
  return (req, _, next) => {
    if (!req.user) {
      throw UnauthorizedError('User not authenticated');
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(`Forbidden access attempt by user ${req.user.userId} with role ${req.user.role}`);
      throw new ForbiddenError('You do not have permission to access this resource');
    }

    next();
  };
};

module.exports = { checkRoleMiddleware };
