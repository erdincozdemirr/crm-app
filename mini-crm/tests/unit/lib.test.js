const { AsyncLocalStorage } = require('async_hooks');

// Mock winston
const mockPrintf = jest.fn((fn) => fn);
const mockCombine = jest.fn((...args) => args);
const mockColorize = jest.fn(() => 'colorize');
const mockTimestamp = jest.fn(() => 'timestamp');
const mockErrors = jest.fn(() => 'errors');
const mockJson = jest.fn(() => 'json');

jest.mock('winston', () => ({
    createLogger: jest.fn(),
    format: {
        combine: mockCombine,
        timestamp: mockTimestamp,
        errors: mockErrors,
        json: mockJson,
        colorize: mockColorize,
        printf: mockPrintf
    },
    transports: {
        Console: jest.fn(),
        File: jest.fn()
    }
}));

// Mock asyncContext
const mockStore = new Map();
const mockGetStore = jest.fn();
jest.mock('../../src/lib/asyncContext', () => ({
    getStore: mockGetStore
}));

describe('Lib Tests', () => {

    describe('AsyncContext', () => {
        it('should correctly export an AsyncLocalStorage instance', () => {
            jest.resetModules(); // Reset to get the actual module, not the mock
            jest.unmock('../../src/lib/asyncContext');
            const asyncContext = require('../../src/lib/asyncContext');
            expect(asyncContext).toBeInstanceOf(AsyncLocalStorage);
        });
    });

    describe('Logger', () => {
        let logger;
        let printfCallback;

        beforeEach(() => {
            jest.resetModules();
            // We need to re-mock asyncContext for Logger tests because we unmocked it above
            jest.mock('../../src/lib/asyncContext', () => ({
                getStore: mockGetStore
            }));

            // Re-require logger to trigger createLogger
            logger = require('../../src/lib/logger');

            // The printf callback is the argument passed to format.printf
            // Since we mocked printf to return its argument, and combine calls it, 
            // we need to find where it was called.
            // In logger.js: format.combine(format.colorize(), format.printf(...))
            // So mockCombine args will contain the result of mockPrintf
            // But wait, logger.js executes immediately on require.

            // Let's capture the printf callback from the ALL calls to printf
            // The one inside Console transport is what we care about.
            const printfCalls = mockPrintf.mock.calls;
            // Depending on order, find the one that looks like our function
            // The logger has two combines. One for logger, one for Console transport.
            // Console transport one has colorize and printf.

            // Let's iterate and find the one that returns a string given inputs
            printfCallback = printfCalls.find(call => {
                try {
                    const res = call[0]({ level: 'info', message: 'test' });
                    return typeof res === 'string';
                } catch (e) {
                    return false;
                }
            })[0];
        });

        it('should create logger with correct transports', () => {
            const winston = require('winston');
            expect(winston.createLogger).toHaveBeenCalled();
            expect(winston.transports.Console).toHaveBeenCalled();
            expect(winston.transports.File).toHaveBeenCalledTimes(2);
        });

        it('should format log message without traceId', () => {
            mockGetStore.mockReturnValue(null);

            const info = {
                level: 'info',
                message: 'Hello World',
                timestamp: '2023-01-01'
            };

            const result = printfCallback(info);
            // Expected: "2023-01-01 [info] Hello World" (check logger.js logic)
            expect(result).toContain('[info]');
            expect(result).toContain('Hello World');
            expect(result).not.toContain('TraceID');
        });

        it('should format log message WITH traceId', () => {
            const store = new Map();
            store.set('traceId', 'abc-123');
            mockGetStore.mockReturnValue(store);

            const info = {
                level: 'info',
                message: 'Hello Trace',
                timestamp: '2023-01-01'
            };

            const result = printfCallback(info);
            expect(result).toContain('[TraceID: abc-123]');
            expect(result).toContain('Hello Trace');
        });

        it('should include stack trace if present', () => {
            mockGetStore.mockReturnValue(null);

            const info = {
                level: 'error',
                message: 'Error occurred',
                timestamp: '2023-01-01',
                stack: 'Error at file.js:1:1'
            };

            const result = printfCallback(info);
            expect(result).toContain('Error occurred');
            expect(result).toContain(' - Error at file.js:1:1');
        });

        it('should include traceId and stack trace when both present', () => {
            const store = new Map();
            store.set('traceId', 'xyz-999');
            mockGetStore.mockReturnValue(store);

            const info = {
                level: 'error',
                message: 'Critical error',
                timestamp: '2023-01-01',
                stack: 'Stack trace here'
            };

            const result = printfCallback(info);
            expect(result).toContain('[TraceID: xyz-999]');
            expect(result).toContain('Critical error');
            expect(result).toContain(' - Stack trace here');
        });
    });
});
