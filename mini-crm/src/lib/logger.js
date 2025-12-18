const { createLogger, transports, format } = require('winston');
const path = require('path');

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'mini-crm' },
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ level, message, timestamp, stack }) => {
          const context = require('./asyncContext');
          const traceId = context.getStore()?.get('traceId');
          const traceStr = traceId ? `[TraceID: ${traceId}] ` : '';

          if (stack) {
            return `${timestamp} [${level}] ${traceStr}${message} - ${stack}`;
          }
          return `${timestamp} [${level}] ${traceStr}${message}`;
        })
      )
    }),
    new transports.File({
      filename: path.join(__dirname, '../../logs/app-error.log'),
      level: 'error'
    }),
    new transports.File({
      filename: path.join(__dirname, '../../logs/app-combined.log')
    })
  ]
});

module.exports = logger;
