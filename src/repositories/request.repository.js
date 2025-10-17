const Request = require('../models/request.model');
const Employee = require('../models/employee.model');

class RequestRepository {
  async create(requestData) {
    return Request.create(requestData);
  }

  async findById(id) {
    return Request.findByPk(id, {
      include: [{ model: Employee, as: 'employee' }],
    });
  }

  async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      employeeId = null,
    } = options;

    const where = {};

    if (employeeId) {
      where.employeeId = employeeId;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Request.findAndCountAll({
      where,
      include: [{ model: Employee, as: 'employee' }],
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
    const request = await Request.findByPk(id);
    if (!request) return null;
    return request.update(updates);
  }

  async delete(id) {
    return Request.destroy({ where: { id } });
  }

  async findByEmployeeId(employeeId, options = {}) {
    const { page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    const { count, rows } = await Request.findAndCountAll({
      where: { employeeId },
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
}

module.exports = new RequestRepository();
