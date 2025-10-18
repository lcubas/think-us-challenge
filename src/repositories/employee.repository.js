const { Op } = require('sequelize');
const Employee = require('../models/employee.model');

class EmployeeRepository {
  async create(employeeData) {
    return Employee.create(employeeData);
  }

  async findById(id) {
    return Employee.findByPk(id);
  }

  async findByEmail(email) {
    return Employee.findOne({ where: { email: email.toLowerCase() } });
  }

  async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      department = null,
      search = null,
    } = options;

    const where = { isActive: true };

    if (department) {
      where.department = { [Op.iLike]: `%${department}%` };
    }

    if (search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Employee.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit),
      },
    };
  }

  async update(id, updates) {
    const employee = await Employee.findByPk(id);
    if (!employee) return null;
    return employee.update(updates);
  }

  async delete(id) {
    return Employee.destroy({ where: { id } });
  }
}

module.exports = new EmployeeRepository();
