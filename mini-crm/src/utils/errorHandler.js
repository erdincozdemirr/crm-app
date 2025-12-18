const logger = require('../lib/logger');

const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;

    logger.error(err.message, {
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body
    });

    res.status(statusCode).json({
        error: {
            message: err.message,
            status: statusCode
        }
    });
};

module.exports = errorHandler;
