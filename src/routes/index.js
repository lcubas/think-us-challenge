const express = require('express');
const authRoutes = require('./auth.routes');

const router = express.Router();

router.use('/v1/auth', authRoutes);

router.get('/health', (_, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = router;