const request = require('supertest');
const app = require('../../src/app');
const productService = require('../../src/services/productService');

jest.mock('../../src/services/productService');

describe('ProductController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/products', () => {
        it('should create product', async () => {
            productService.create.mockResolvedValue({ id: 1, name: 'P1' });
            const res = await request(app).post('/api/products').send({ name: 'P1' });
            expect(res.status).toBe(201);
            expect(res.body.name).toBe('P1');
        });

        it('should handle errors', async () => {
            productService.create.mockRejectedValue(new Error('Validation Error'));
            const res = await request(app).post('/api/products').send({});
            expect(res.status).toBe(400);
        });
    });

    describe('GET /api/products', () => {
        it('should list products', async () => {
            productService.findAll.mockResolvedValue([{ id: 1 }]);
            const res = await request(app).get('/api/products');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
        });

        it('should handle errors', async () => {
            productService.findAll.mockRejectedValue(new Error('DB Error'));
            const res = await request(app).get('/api/products');
            expect(res.status).toBe(500);
        });
    });

    describe('PUT /api/products/:id/stock', () => {
        it('should update stock', async () => {
            productService.update.mockResolvedValue({ id: 1, stockQuantity: 50 });
            const res = await request(app).put('/api/products/1/stock').send({ quantity: 50 });
            expect(res.status).toBe(200);
            expect(res.body.stockQuantity).toBe(50);
        });

        it('should handle errors', async () => {
            productService.update.mockRejectedValue(new Error('Not Found'));
            const res = await request(app).put('/api/products/1/stock').send({ quantity: 50 });
            expect(res.status).toBe(400);
        });
    });
});
