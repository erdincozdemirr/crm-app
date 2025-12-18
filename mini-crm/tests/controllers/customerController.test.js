const request = require('supertest');
const app = require('../../src/app');
const customerService = require('../../src/services/customerService');

jest.mock('../../src/services/customerService');

describe('CustomerController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/customers', () => {
        it('should create customer', async () => {
            customerService.createOrUpdate.mockResolvedValue({ id: 1, firstName: 'John' });
            const res = await request(app).post('/api/customers').send({ firstName: 'John' });
            expect(res.status).toBe(201);
            expect(res.body.firstName).toBe('John');
        });

        it('should handle errors', async () => {
            customerService.createOrUpdate.mockRejectedValue(new Error('Validation Error'));
            const res = await request(app).post('/api/customers').send({});
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Validation Error');
        });
    });

    describe('GET /api/customers', () => {
        it('should list customers', async () => {
            customerService.findAll.mockResolvedValue([{ id: 1 }]);
            const res = await request(app).get('/api/customers');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
        });

        it('should handle search params', async () => {
            customerService.findAll.mockResolvedValue([{ id: 1 }]);
            const res = await request(app).get('/api/customers?search=John');
            expect(customerService.findAll).toHaveBeenCalledWith({ search: 'John' });
        });

        it('should handle errors', async () => {
            customerService.findAll.mockRejectedValue(new Error('DB Error'));
            const res = await request(app).get('/api/customers');
            expect(res.status).toBe(500);
        });
    });

    describe('GET /api/customers/:id', () => {
        it('should return customer', async () => {
            customerService.findById.mockResolvedValue({ id: 1 });
            const res = await request(app).get('/api/customers/1');
            expect(res.status).toBe(200);
        });

        it('should return 404 if not found', async () => {
            customerService.findById.mockResolvedValue(null);
            const res = await request(app).get('/api/customers/999');
            expect(res.status).toBe(404);
        });

        it('should handle errors', async () => {
            customerService.findById.mockRejectedValue(new Error('DB Error'));
            const res = await request(app).get('/api/customers/1');
            expect(res.status).toBe(500);
        });
    });

    describe('PUT /api/customers/:id', () => {
        it('should update customer', async () => {
            customerService.update.mockResolvedValue({ id: 1, firstName: 'Updated' });
            const res = await request(app).put('/api/customers/1').send({ firstName: 'Updated' });
            expect(res.status).toBe(200);
        });

        it('should return 404 if not found', async () => {
            customerService.update.mockResolvedValue(null);
            const res = await request(app).put('/api/customers/999').send({ firstName: 'New' });
            expect(res.status).toBe(404);
        });

        it('should handle errors', async () => {
            customerService.update.mockRejectedValue(new Error('DB Error'));
            const res = await request(app).put('/api/customers/1').send({ firstName: 'Err' });
            expect(res.status).toBe(400);
        });
    });
});
