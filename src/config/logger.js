const { getEnv } = require('./env');

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const colors = {
  error: '\x1b[31m',    // Red
  warn: '\x1b[33m',     // Yellow
  info: '\x1b[36m',     // Cyan
  debug: '\x1b[90m',    // Gray
  reset: '\x1b[0m',
};

class Logger {
  constructor() {
    const env = getEnv();
    this.level = levels[env.LOG_LEVEL];
  }

  log(levelName, message, meta) {
    if (levels[levelName] > this.level) return;

    const timestamp = new Date().toISOString();
    const color = colors[levelName];
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    
    console.log(
      `${color}[${timestamp}] ${levelName.toUpperCase()}${colors.reset}: ${message}${metaStr}`,
    );
  }

  error(message, meta) { this.log('error', message, meta); }
  warn(message, meta) { this.log('warn', message, meta); }
  info(message, meta) { this.log('info', message, meta); }
  debug(message, meta) { this.log('debug', message, meta); }
}

module.exports = new Logger();