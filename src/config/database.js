const { Sequelize } = require('sequelize');
const { getEnv } = require('./env');
const logger = require('./logger');

const env = getEnv();

const sequelize = new Sequelize(
  env.DB_NAME,
  env.DB_USER,
  env.DB_PASSWORD,
  {
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: 'postgres',
    logging: env.LOG_LEVEL === 'debug' ? (sql) => logger.debug(sql) : false,
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000,
    },
    retry: {
      max: 3,
    },
  },
);

const checkConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Database connected');
    
    if (env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: env.NODE_ENV === 'development' });
      logger.info('✅ Database synced');
    }
  } catch (error) {
    logger.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, checkConnection };
