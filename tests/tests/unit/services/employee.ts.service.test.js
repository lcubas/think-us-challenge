const EmployeeService = require('../../../../src/services/employee.service');
const EmployeeRepository = require('../../../../src/repositories/employee.repository');
const { NotFoundError, ConflictError } = require('../../../../src/utils/errors');

// Mocks
jest.mock('../../../../src/repositories/employee.repository');

describe('EmployeeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createEmployee', () => {
    it('should create employee and lowercase email', async () => {
      const payload = {
        firstName: 'Luis',
        lastName: 'Cubas',
        email: 'TEST@EXAMPLE.COM',
        documentNumber: '12345678',
        documentType: 'dni',
      };
      const created = { id: 'emp-1', ...payload, email: 'test@example.com' };

      EmployeeRepository.findByEmail.mockResolvedValue(null);
      EmployeeRepository.create.mockResolvedValue(created);

      const result = await EmployeeService.createEmployee(payload);

      expect(EmployeeRepository.findByEmail).toHaveBeenCalledWith('TEST@EXAMPLE.COM');
      expect(EmployeeRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'test@example.com' }),
      );
      expect(result).toEqual(created);
    });

    it('should throw ConflictError if email already exists', async () => {
      EmployeeRepository.findByEmail.mockResolvedValue({ id: 'emp-x', email: 'exists@example.com' });

      await expect(
        EmployeeService.createEmployee({ email: 'exists@example.com' }),
      ).rejects.toThrow(ConflictError);
      expect(EmployeeRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('getEmployeeById', () => {
    it('should return employee by id', async () => {
      const emp = { id: 'emp-1', email: 'a@b.com' };
      EmployeeRepository.findById.mockResolvedValue(emp);

      const result = await EmployeeService.getEmployeeById('emp-1');

      expect(EmployeeRepository.findById).toHaveBeenCalledWith('emp-1');
      expect(result).toBe(emp);
    });

    it('should throw NotFoundError if not found', async () => {
      EmployeeRepository.findById.mockResolvedValue(null);

      await expect(EmployeeService.getEmployeeById('missing')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getEmployees', () => {
    it('should delegate to repository with options', async () => {
      const options = { limit: 10, offset: 20, where: { isActive: true } };
      const list = [{ id: 'emp-1' }, { id: 'emp-2' }];
      EmployeeRepository.findAll.mockResolvedValue(list);

      const result = await EmployeeService.getEmployees(options);

      expect(EmployeeRepository.findAll).toHaveBeenCalledWith(options);
      expect(result).toBe(list);
    });
  });

  describe('updateEmployee', () => {
    it('should throw NotFoundError if employee does not exist', async () => {
      EmployeeRepository.findById.mockResolvedValue(null);

      await expect(
        EmployeeService.updateEmployee('emp-x', { firstName: 'New' }),
      ).rejects.toThrow(NotFoundError);
      expect(EmployeeRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ConflictError if updating to an email already in use', async () => {
      const existing = { id: 'emp-1', email: 'old@example.com' };
      EmployeeRepository.findById.mockResolvedValue(existing);
      // Simula que hay otro empleado con ese nuevo email
      EmployeeRepository.findByEmail.mockResolvedValue({ id: 'emp-2', email: 'dup@example.com' });

      await expect(
        EmployeeService.updateEmployee('emp-1', { email: 'dup@example.com' }),
      ).rejects.toThrow(ConflictError);

      expect(EmployeeRepository.update).not.toHaveBeenCalled();
    });

    it('should update employee and lowercase email when email changes', async () => {
      const existing = { id: 'emp-1', email: 'old@example.com' };
      const updates = { email: 'NEW@EXAMPLE.COM', firstName: 'Luis Angel' };
      const updated = { id: 'emp-1', email: 'new@example.com', firstName: 'Luis Angel' };

      EmployeeRepository.findById.mockResolvedValue(existing);
      EmployeeRepository.findByEmail.mockResolvedValue(null);
      EmployeeRepository.update.mockResolvedValue(updated);

      const result = await EmployeeService.updateEmployee('emp-1', updates);

      expect(EmployeeRepository.findById).toHaveBeenCalledWith('emp-1');
      expect(EmployeeRepository.findByEmail).toHaveBeenCalledWith('NEW@EXAMPLE.COM');
      expect(EmployeeRepository.update).toHaveBeenCalledWith(
        'emp-1',
        expect.objectContaining({ email: 'new@example.com', firstName: 'Luis Angel' }),
      );
      expect(result).toEqual(updated);
    });

    it('should update employee when email is unchanged (no uniqueness check)', async () => {
      const existing = { id: 'emp-1', email: 'same@example.com', firstName: 'Old' };
      const updates = { firstName: 'New' };
      const updated = { id: 'emp-1', email: 'same@example.com', firstName: 'New' };

      EmployeeRepository.findById.mockResolvedValue(existing);
      EmployeeRepository.update.mockResolvedValue(updated);

      const result = await EmployeeService.updateEmployee('emp-1', updates);

      expect(EmployeeRepository.findByEmail).not.toHaveBeenCalled();
      expect(EmployeeRepository.update).toHaveBeenCalledWith('emp-1', updates);
      expect(result).toEqual(updated);
    });
  });

  describe('deleteEmployee', () => {
    it('should throw NotFoundError if employee does not exist', async () => {
      EmployeeRepository.findById.mockResolvedValue(null);

      await expect(EmployeeService.deleteEmployee('emp-x')).rejects.toThrow(NotFoundError);
      expect(EmployeeRepository.delete).not.toHaveBeenCalled();
    });

    it('should delete employee and return success message', async () => {
      EmployeeRepository.findById.mockResolvedValue({ id: 'emp-1' });
      EmployeeRepository.delete.mockResolvedValue(true);

      const result = await EmployeeService.deleteEmployee('emp-1');

      expect(EmployeeRepository.findById).toHaveBeenCalledWith('emp-1');
      expect(EmployeeRepository.delete).toHaveBeenCalledWith('emp-1');
      expect(result).toEqual({ message: 'Employee deleted successfully' });
    });
  });
});
