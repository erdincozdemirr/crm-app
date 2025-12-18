const request = require('supertest');
const app = require('../../src/app');
const etlService = require('../../src/services/etlService');

jest.mock('../../src/services/etlService');
jest.mock('../../src/models', () => ({
    sequelize: {
        sync: jest.fn(),
        close: jest.fn()
    }
}));

describe('EtlController', () => {
    describe('POST /api/etl/import', () => {
        it('should return 400 if no file uploaded', async () => {
            const res = await request(app).post('/api/etl/import');
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Please upload a CSV file.');
        });

        it('should call service and return result on valid file', async () => {
            const mockResult = { successCount: 5, errorCount: 0 };
            etlService.runImport.mockResolvedValue(mockResult);

            const res = await request(app)
                .post('/api/etl/import')
                .attach('file', Buffer.from('test data'), 'customers.csv');

            expect(res.statusCode).toBe(200);
            expect(etlService.runImport).toHaveBeenCalled();
            expect(res.body.data).toEqual(mockResult);
        });

        it('should handle service errors', async () => {
            etlService.runImport.mockRejectedValue(new Error('Processing failed'));

            const res = await request(app)
                .post('/api/etl/import')
                .attach('file', Buffer.from('test'), 'test.csv');

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe('Processing failed');
        });
    });
});
