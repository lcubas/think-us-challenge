const RequestRepository = require('../repositories/request.repository');
const EmployeeRepository = require('../repositories/employee.repository');
const { NotFoundError } = require('../utils/errors');
const logger = require('../config/logger');

class RequestService {
  async createRequest(requestData) {
    // Verify employee exists
    const employee = await EmployeeRepository.findById(requestData.employeeId);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    const request = await RequestRepository.create(requestData);

    logger.info(`Request created: ${request.id}`);

    return request;
  }

  async getRequestById(id) {
    const request = await RequestRepository.findById(id);

    if (!request) {
      throw new NotFoundError('Request not found');
    }

    return request;
  }

  async getRequests(options = {}) {
    return RequestRepository.findAll(options);
  }

  async getRequestsByEmployee(employeeId, options = {}) {
    const employee = await EmployeeRepository.findById(employeeId);

    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    return RequestRepository.findByEmployeeId(employeeId, options);
  }

  async deleteRequest(id) {
    const request = await RequestRepository.findById(id);

    if (!request) {
      throw new NotFoundError('Request not found');
    }

    await RequestRepository.delete(id);

    logger.info(`Request deleted: ${id}`);

    return { message: 'Request deleted successfully' };
  }
}

module.exports = new RequestService();
