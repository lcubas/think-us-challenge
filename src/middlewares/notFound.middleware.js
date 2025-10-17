const notFoundMiddleware = (req, res, _) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
};

module.exports = { notFoundMiddleware };
