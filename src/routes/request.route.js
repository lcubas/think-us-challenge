const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkRoleMiddleware } = require('../middlewares/checkRole.middleware');
const RequestController = require('../controllers/request.controller');

const router = express.Router();

// All authenticated users can view requests
router.get('/', verifyToken, RequestController.getAll);
router.get('/:id', verifyToken, RequestController.getById);
router.get('/employee/:employeeId', verifyToken, RequestController.getByEmployeeId);

// All authenticated users can create requests
router.post('/', verifyToken, RequestController.create);

// Only admins can approve/reject/delete
router.post('/:id/approve', verifyToken, checkRoleMiddleware('admin'), RequestController.approve);
router.post('/:id/reject', verifyToken, checkRoleMiddleware('admin'), RequestController.reject);
router.delete('/:id', verifyToken, checkRoleMiddleware('admin'), RequestController.delete);

module.exports = router;