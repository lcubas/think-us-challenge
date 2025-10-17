const { UnauthorizedError } = require('../utils/errors');
const tokenService = require('../services/token.service');

const verifyToken = (req, _, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid authorization header');
  }

  const token = authHeader.substring(7); // Remove 'Bearer '

  const payload = tokenService.verifyAccessToken(token);

  req.user = {
    userId: payload.userId,
    role: payload.role,
  };

  next();
};



module.exports = { verifyToken };