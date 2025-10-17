const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const apiRoutes = require('./routes');
const { getEnv } = require('./config/env');
const { notFoundMiddleware } = require('./middlewares/notFound.middleware');
const { errorHandlerMiddleware } = require('./middlewares/errorHandler.middleware');
const { loggerMiddleware } = require('./middlewares/logger.middleware');

const env = getEnv();

const app = express();

app.use(helmet());

app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));

app.use(loggerMiddleware);

app.use('/api', apiRoutes);

app.use(notFoundMiddleware);

app.use(errorHandlerMiddleware);

module.exports = app;