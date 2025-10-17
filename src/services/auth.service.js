const bcrypt = require('bcryptjs');
const UserRepository = require('../repositories/user.repository');
const TokenService = require('./token.service');
const { getEnv } = require('../config/env');
const { UnauthorizedError, ConflictError } = require('../utils/errors');
const logger = require('../config/logger');
const { verifyPassword } = require('../utils/verifyPassword');

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
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  async login(email, password) {
    // Find user
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    console.log(user);

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    logger.info(`User logged in: ${email}`);

    // Generate tokens
    const accessToken = TokenService.generateAccessToken(user.id, user.role);
    const refreshToken = TokenService.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  async refreshAccessToken(refreshToken) {
    const payload = TokenService.verifyRefreshToken(refreshToken);
    const user = await UserRepository.findById(payload.userId);

    if (!user) {
      throw new UnauthorizedError('User not found or inactive');
    }

    const accessToken = TokenService.generateAccessToken(user.id, user.role);

    return { accessToken }; 
  }
}

module.exports = new AuthService();
