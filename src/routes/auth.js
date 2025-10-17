const express = require('express');
const AuthController = require('../controllers/AuthController');

const router = express.Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);

module.exports = router;