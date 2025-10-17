const { asyncHandlerMiddleware } = require('../middlewares/asyncHandler.middleware');
const EmployeeService = require('../services/employee.service');

class EmployeeController {
  create = asyncHandlerMiddleware(async (req, res) => {
    const data = req.body;
    const employee = await EmployeeService.createEmployee(data);

    res.status(201).json({
      message: 'Employee created successfully',
      data: employee,
    });
  });

  getAll = asyncHandlerMiddleware(async (req, res) => {
    const query = req.query;
    const result = await EmployeeService.getEmployees({
      page: query.page,
      limit: query.limit,
      department: query.department,
      search: query.search,
    });

    res.status(200).json({
      message: 'Employees retrieved successfully',
      data: result.data,
      pagination: result.pagination,
    });
  });

  getById = asyncHandlerMiddleware(async (req, res) => {
    const { id } = req.params;
    const employee = await EmployeeService.getEmployeeById(id);

    res.status(200).json({
      message: 'Employee retrieved successfully',
      data: employee,
    });
  });

  update = asyncHandlerMiddleware(async (req, res) => {
    const { id } = req.params;
    const employee = await EmployeeService.updateEmployee(id, req.body);

    res.status(200).json({
      message: 'Employee updated successfully',
      data: employee,
    });
  });

  delete = asyncHandlerMiddleware(async (req, res) => {
    const { id } = req.params;
    const result = await EmployeeService.deleteEmployee(id);

    res.status(200).json({
      message: result.message,
    });
  });
}

module.exports = new EmployeeController();