const jwt = require('jsonwebtoken');
const { getEnv } = require('../config/env');
const { UnauthorizedError } = require('../utils/errors');

class TokenService {
  constructor() {
    this.env = getEnv();
  }

  generateAccessToken(userId, role) {
    return jwt.sign(
      { userId, role },
      this.env.JWT_SECRET,
      { expiresIn: this.env.JWT_EXPIRES_IN },
    );
  }

  generateRefreshToken(userId) {
    return jwt.sign(
      { userId },
      this.env.JWT_REFRESH_SECRET,
      { expiresIn: this.env.JWT_REFRESH_EXPIRES_IN },
    );
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.env.JWT_SECRET);
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired access token');
    }
  }

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, this.env.JWT_REFRESH_SECRET);
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired access token');
    }
  }

  decodeToken(token) {
    return jwt.decode(token);
  }
}

module.exports = new TokenService();