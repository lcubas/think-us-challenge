const { asyncHandler } = require('../middleware/errorHandler');
const AuthService = require('../services/AuthService');

class AuthController {
  register = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const result = await AuthService.register(email, password);

    res.status(201).json({
      message: 'User registered successfully',
      data: result,
    });
  });

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const result = await AuthService.login(email, password);

    res.status(200).json({
      message: 'Login successful',
      data: result,
    });
  });

  refresh = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Refresh token required',
      });
    }

    const result = await AuthService.refreshAccessToken(refreshToken);

    res.status(200).json({
      message: 'Token refreshed successfully',
      data: result,
    });
  });

  validate = asyncHandler(async (req, res) => {
    const token = req.headers.authorization?.substring(7);

    if (!token) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Token required',
      });
    }

    const { user, payload } = await AuthService.validateToken(token);

    res.status(200).json({
      message: 'Token is valid',
      data: {
        user: { id: user.id, email: user.email, role: user.role },
        payload,
      },
    });
  });
}

module.exports = new AuthController();