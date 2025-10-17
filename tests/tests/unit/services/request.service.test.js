// __tests__/unit/services/request.service.test.js

const RequestService = require('../../../../src/services/request.service');
const RequestRepository = require('../../../../src/repositories/request.repository');
const EmployeeRepository = require('../../../../src/repositories/employee.repository');
const { NotFoundError } = require('../../../../src/utils/errors');

// Mocks
jest.mock('../../../../src/repositories/request.repository');
jest.mock('../../../../src/repositories/employee.repository');

describe('RequestService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createRequest', () => {
    it('should create a request when employee exists', async () => {
      const payload = {
        employeeId: 'emp-1',
        description: 'Necesito laptop',
        summary: 'Laptop nueva',
      };
      const employee = { id: 'emp-1', email: 'e@e.com' };
      const created = { id: 'req-1', ...payload };

      EmployeeRepository.findById.mockResolvedValue(employee);
      RequestRepository.create.mockResolvedValue(created);

      const result = await RequestService.createRequest(payload);

      expect(EmployeeRepository.findById).toHaveBeenCalledWith('emp-1');
      expect(RequestRepository.create).toHaveBeenCalledWith(payload);
      expect(result).toEqual(created);
    });

    it('should throw NotFoundError if employee does not exist', async () => {
      EmployeeRepository.findById.mockResolvedValue(null);

      await expect(
        RequestService.createRequest({ employeeId: 'missing', description: 'x', summary: 'x' }),
      ).rejects.toThrow(NotFoundError);

      expect(RequestRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('getRequestById', () => {
    it('should return a request by id', async () => {
      const req = { id: 'req-1', employeeId: 'emp-1' };
      RequestRepository.findById.mockResolvedValue(req);

      const result = await RequestService.getRequestById('req-1');

      expect(RequestRepository.findById).toHaveBeenCalledWith('req-1');
      expect(result).toBe(req);
    });

    it('should throw NotFoundError if request not found', async () => {
      RequestRepository.findById.mockResolvedValue(null);

      await expect(RequestService.getRequestById('missing')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getRequests', () => {
    it('should delegate to repository with options', async () => {
      const options = { limit: 10, offset: 0, where: { employeeId: 'emp-1' } };
      const list = [{ id: 'req-1' }, { id: 'req-2' }];
      RequestRepository.findAll.mockResolvedValue(list);

      const result = await RequestService.getRequests(options);

      expect(RequestRepository.findAll).toHaveBeenCalledWith(options);
      expect(result).toBe(list);
    });
  });

  describe('getRequestsByEmployee', () => {
    it('should return requests for an existing employee', async () => {
      const employeeId = 'emp-1';
      const options = { limit: 5 };
      const employee = { id: employeeId };
      const list = [{ id: 'req-1', employeeId }, { id: 'req-2', employeeId }];

      EmployeeRepository.findById.mockResolvedValue(employee);
      RequestRepository.findByEmployeeId.mockResolvedValue(list);

      const result = await RequestService.getRequestsByEmployee(employeeId, options);

      expect(EmployeeRepository.findById).toHaveBeenCalledWith(employeeId);
      expect(RequestRepository.findByEmployeeId).toHaveBeenCalledWith(employeeId, options);
      expect(result).toBe(list);
    });

    it('should throw NotFoundError if employee does not exist', async () => {
      EmployeeRepository.findById.mockResolvedValue(null);

      await expect(
        RequestService.getRequestsByEmployee('missing', { limit: 5 }),
      ).rejects.toThrow(NotFoundError);

      expect(RequestRepository.findByEmployeeId).not.toHaveBeenCalled();
    });
  });

  describe('deleteRequest', () => {
    it('should delete request and return success message', async () => {
      RequestRepository.findById.mockResolvedValue({ id: 'req-1' });
      RequestRepository.delete.mockResolvedValue(true);

      const result = await RequestService.deleteRequest('req-1');

      expect(RequestRepository.findById).toHaveBeenCalledWith('req-1');
      expect(RequestRepository.delete).toHaveBeenCalledWith('req-1');
      expect(result).toEqual({ message: 'Request deleted successfully' });
    });

    it('should throw NotFoundError if request not found', async () => {
      RequestRepository.findById.mockResolvedValue(null);

      await expect(RequestService.deleteRequest('missing')).rejects.toThrow(NotFoundError);
      expect(RequestRepository.delete).not.toHaveBeenCalled();
    });
  });
});
