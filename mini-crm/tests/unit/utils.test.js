const errorHandler = require('../../src/utils/errorHandler');
const logger = require('../../src/lib/logger');

// Mock logger to prevent actual logging during tests
jest.mock('../../src/lib/logger', () => ({
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn()
}));

describe('Utils', () => {
    describe('ErrorHandler', () => {
        let req, res, next;

        beforeEach(() => {
            req = {
                path: '/test',
                method: 'GET',
                body: {}
            };
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            next = jest.fn();
            jest.clearAllMocks();
        });

        it('should handle error with status code', () => {
            const err = new Error('Test error');
            err.status = 400;

            errorHandler(err, req, res, next);

            expect(logger.error).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    message: 'Test error',
                    status: 400
                }
            });
        });

        it('should default to 500 if no status provided', () => {
            const err = new Error('Internal error');

            errorHandler(err, req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: expect.objectContaining({ status: 500 })
            }));
        });
    });

    describe('Logger', () => {
        it('should have basic log methods mocked', () => {
            // Just verifying that our mock works and methods exist
            expect(logger.info).toBeDefined();
            expect(logger.error).toBeDefined();
            expect(logger.warn).toBeDefined();
        });
    });
});
