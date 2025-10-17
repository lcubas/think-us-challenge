const logger = require('../config/logger');

const loggerMiddleware = (req, _, next) => {
  logger.debug(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });
  next();
};

module.exports = { loggerMiddleware };
