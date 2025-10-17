// Set test environment
process.env.NODE_ENV = 'test';
process.env.PORT = '3000';
process.env.API_BASE_URL = 'http://localhost:3000';

// Database
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'hr_db_test';
process.env.DB_USER = 'hr_user';
process.env.DB_PASSWORD = 'hr_password_dev_only';

// JWT
process.env.JWT_SECRET = 'test-secret-key-minimum-32-characters-long-here';
process.env.JWT_EXPIRES_IN = '1d';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-minimum-32-chars-long';
process.env.JWT_REFRESH_EXPIRES_IN = '30d';

// Security
process.env.BCRYPT_ROUNDS = '4'; // Lower for tests (faster)
process.env.CORS_ORIGIN = 'http://localhost:3001';

// Logging
process.env.LOG_LEVEL = 'error'; // Minimal logging for tests

// Rate Limiting
process.env.RATE_LIMIT_WINDOW_MS = '900000';
process.env.RATE_LIMIT_MAX_REQUESTS = '100';

// Suppress console logs during tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};