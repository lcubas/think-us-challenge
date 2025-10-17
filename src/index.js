const { getEnv } = require('./config/env');
const logger = require('./config/logger');
const { checkConnection } = require('./config/database');
const app = require('./app');

const env = getEnv();

const startServer = async () => {
  try {
    // Initialize database
    await checkConnection();

    // Start server
    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server running on port ${env.PORT}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      logger.info('🛑 Shutting down gracefully...');
      server.close(async () => {
        try {
          const { sequelize } = require('./src/config/database');
          await sequelize.close();
          logger.info('✅ Database connection closed');
          process.exit(0);
        } catch (error) {
          logger.error('❌ Error during shutdown:', error.message);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('❌ Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error('❌ Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();