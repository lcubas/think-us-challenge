const express = require('express');
const EmployeeController = require('../controllers/employee.controller');
const { verifyToken } = require('../middlewares/verifyToken.middleware');
const { checkRoleMiddleware } = require('../middlewares/checkRole.middleware');

const router = express.Router();

router.get('/', verifyToken, checkRoleMiddleware('admin'), EmployeeController.getAll);
router.get('/:id', verifyToken, checkRoleMiddleware('admin'), EmployeeController.getById);
router.post('/', verifyToken, checkRoleMiddleware('admin'), EmployeeController.create);
router.put('/:id', verifyToken, checkRoleMiddleware('admin'), EmployeeController.update);
router.delete('/:id', verifyToken, checkRoleMiddleware('admin'), EmployeeController.delete);

module.exports = router;