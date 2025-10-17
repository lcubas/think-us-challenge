const EmployeeRepository = require('../repositories/employee.repository');
const { NotFoundError, ConflictError } = require('../utils/errors');
const logger = require('../config/logger');

class EmployeeService {
  async createEmployee(employeeData) {
    // Check if email exists
    const existing = await EmployeeRepository.findByEmail(employeeData.email);
    if (existing) {
      throw new ConflictError('Employee email already exists');
    }

    const employee = await EmployeeRepository.create({
      ...employeeData,
      email: employeeData.email.toLowerCase(),
    });

    logger.info(`Employee created: ${employee.id}`);

    return employee;
  }

  async getEmployeeById(id) {
    const employee = await EmployeeRepository.findById(id);

    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    return employee;
  }

  async getEmployees(options = {}) {
    return EmployeeRepository.findAll(options);
  }

  async updateEmployee(id, updates) {
    const employee = await EmployeeRepository.findById(id);

    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    // If updating email, check uniqueness
    if (updates.email && updates.email !== employee.email) {
      const existing = await EmployeeRepository.findByEmail(updates.email);
      if (existing) {
        throw new ConflictError('Email already in use');
      }
      updates.email = updates.email.toLowerCase();
    }

    const updated = await EmployeeRepository.update(id, updates);

    logger.info(`Employee updated: ${id}`);

    return updated;
  }

  async deleteEmployee(id) {
    const employee = await EmployeeRepository.findById(id);

    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    await EmployeeRepository.delete(id);

    logger.info(`Employee deleted: ${id}`);

    return { message: 'Employee deleted successfully' };
  }
}

module.exports = new EmployeeService();