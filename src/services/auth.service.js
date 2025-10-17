const bcrypt = require('bcryptjs');
const UserRepository = require('../repositories/user.repository');
const TokenService = require('./token.service');
const { getEnv } = require('../config/env');
const { UnauthorizedError, ConflictError } = require('../utils/errors');
const logger = require('../config/logger');

class AuthService {
  constructor() {
    this.env = getEnv();
  }

  async register(email, password, role = 'employee') {
    // Check if user exists
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, this.env.BCRYPT_ROUNDS);

    // Create user
    const user = await UserRepository.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
    });

    logger.info(`User registered: ${email}`);

    // Generate tokens
    const accessToken = TokenService.generateAccessToken(user.id, user.role);
    const refreshToken = TokenService.generateRefreshToken(user.id);

    return {
      user: { id: user.id, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    };
  }

  async login(email, password) {
    // Find user
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await user.verifyPassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Check if active
    if (!user.isActive) {
      throw new UnauthorizedError('User account is inactive');
    }

    // Update last login
    await UserRepository.updateLastLogin(user.id);

    logger.info(`User logged in: ${email}`);

    // Generate tokens
    const accessToken = TokenService.generateAccessToken(user.id, user.role);
    const refreshToken = TokenService.generateRefreshToken(user.id);

    return {
      user: { id: user.id, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken) {
    try {
      const payload = TokenService.verifyRefreshToken(refreshToken);
      const user = await UserRepository.findById(payload.userId);

      if (!user || !user.isActive) {
        throw new UnauthorizedError('User not found or inactive');
      }

      const newAccessToken = TokenService.generateAccessToken(user.id, user.role);

      return {
        accessToken: newAccessToken,
      };
    } catch (error) {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }
}

module.exports = new AuthService();
