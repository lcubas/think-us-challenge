const express = require('express');
const authRoutes = require('./auth.route');
const employeeRoutes = require('./employee.route');

const router = express.Router();

router.use('/v1/auth', authRoutes);
router.use('/v1/employees', employeeRoutes);

router.get('/health', (_, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = router;