const AuthService = require('../../../../src/services/auth.service');
const UserRepository = require('../../../../src/repositories/user.repository');
const TokenService = require('../../../../src/services/token.service');
const { ConflictError, UnauthorizedError } = require('../../../../src/utils/errors');
const { hashPassword } = require('../../../../src/utils/hashPassword');

// Mocks
jest.mock('../../../../src/repositories/user.repository');
jest.mock('../../../../src/services/token.service');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user with hashed password', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'employee',
      };

      UserRepository.findByEmail.mockResolvedValue(null);
      UserRepository.create.mockResolvedValue(mockUser);

      const result = await AuthService.register('test@example.com', 'ValidPass123');

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw ConflictError if email already exists', async () => {
      UserRepository.findByEmail.mockResolvedValue({
        id: 'existing-user',
        email: 'test@example.com',
      });

      await expect(
        AuthService.register('test@example.com', 'ValidPass123'),
      ).rejects.toThrow(ConflictError);
    });

    it('should hash password before storing', async () => {
      UserRepository.findByEmail.mockResolvedValue(null);
      UserRepository.create.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        role: 'employee',
      });

      await AuthService.register('test@example.com', 'ValidPass123');

      expect(UserRepository.create).toHaveBeenCalled();
      const createCall = UserRepository.create.mock.calls[0][0];
      expect(createCall.password).not.toBe('ValidPass123');
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      const password = await hashPassword('ValidPass123');
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'employee',
        password,
      };

      UserRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await AuthService.login('test@example.com', 'ValidPass123');

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw UnauthorizedError with invalid credentials', async () => {
      UserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        AuthService.login('test@example.com', 'WrongPassword'),
      ).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh access token with valid refresh token', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'employee',
      };

      TokenService.verifyRefreshToken.mockReturnValue({ userId: 'user-123' });
      UserRepository.findById.mockResolvedValue(mockUser);

      const result = await AuthService.refreshAccessToken('valid-refresh-token');

      expect(result).toHaveProperty('accessToken');
    });
  });
});