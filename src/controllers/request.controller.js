const { asyncHandlerMiddleware } = require('../middlewares/asyncHandlerMiddleware.middleware');
const RequestService = require('../services/request.service');

class RequestController {
  create = asyncHandlerMiddleware(async (req, res) => {
    const data = req.body;
    const request = await RequestService.createRequest(data);

    res.status(201).json({
      message: 'Request created successfully',
      data: request,
    });
  });

  getAll = asyncHandlerMiddleware(async (req, res) => {
    const query = req.query;
    const result = await RequestService.getRequests({
      page: query.page,
      limit: query.limit,
      status: query.status,
      employeeId: query.employeeId,
    });

    res.status(200).json({
      message: 'Requests retrieved successfully',
      data: result.data,
      pagination: result.pagination,
    });
  });

  getById = asyncHandlerMiddleware(async (req, res) => {
    const { id } = req.params;

    const request = await RequestService.getRequestById(id);

    res.status(200).json({
      message: 'Request retrieved successfully',
      data: request,
    });
  });

  getByEmployeeId = asyncHandlerMiddleware(async (req, res) => {
    const { employeeId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const result = await RequestService.getRequestsByEmployee(employeeId, {
      page: parseInt(page),
      limit: parseInt(limit),
    });

    res.status(200).json({
      message: 'Employee requests retrieved successfully',
      data: result.data,
      pagination: result.pagination,
    });
  });

  delete = asyncHandlerMiddleware(async (req, res) => {
    const { id } = req.params;

    const result = await RequestService.deleteRequest(id);

    res.status(200).json({
      message: result.message,
    });
  });
}

module.exports = new RequestController();
