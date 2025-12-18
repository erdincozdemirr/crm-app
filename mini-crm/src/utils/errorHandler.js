const logger = require('../lib/logger');
const { SystemLog } = require('../models');
const context = require('../lib/asyncContext');

const errorHandler = async (err, req, res, next) => {
    const statusCode = err.status || 500;
    const traceId = context.getStore()?.get('traceId');

    // Console/File Log
    logger.error(err.message, {
        stack: err.stack,
        path: req.path,
        method: req.method,
        traceId
    });

    // DB Log
    try {
        await SystemLog.create({
            level: 'ERROR',
            message: err.message,
            traceId,
            meta: {
                stack: err.stack,
                path: req.path,
                method: req.method,
                statusCode
            }
        });
    } catch (dbErr) {
        // Fallback to file logger if DB fails
        logger.error('Failed to save error log to DB', { error: dbErr.message });
    }

    res.status(statusCode).json({
        error: {
            message: err.message,
            status: statusCode
        }
    });
};

module.exports = errorHandler;
