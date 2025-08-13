import pino from 'pino';

// Environment-based log level
const logLevel = import.meta.env.DEV ? 'debug' : 'info';

// Create a base logger instance
const logger = pino({
  level: logLevel,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
  base: {
    env: import.meta.env.NODE_ENV,
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
});

// Create a child logger with the file context
const createLogger = (context: string) => {
  return logger.child({ context });
};

export { logger as default, createLogger };
