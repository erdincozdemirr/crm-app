const request = require('supertest');
const app = require('../../src/app');
const orderService = require('../../src/services/orderService');
const customerService = require('../../src/services/customerService');

jest.mock('../../src/services/orderService');
jest.mock('../../src/services/customerService');

describe('OrderController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/orders', () => {
        it('should create order successfully', async () => {
            const payload = {
                customer: { firstName: 'John', phone: '123' },
                items: [{ productId: 1, quantity: 1 }],
                shippingAddress: 'Test Address'
            };

            customerService.createOrUpdate.mockResolvedValue({ id: 1 });
            orderService.createOrder.mockResolvedValue({ id: 101, status: 'PENDING' });

            const res = await request(app).post('/api/orders').send(payload);

            expect(res.status).toBe(201);
            expect(orderService.createOrder).toHaveBeenCalledWith(1, payload.items, payload.shippingAddress);
        });

        it('should return 400 if customer data missing', async () => {
            const res = await request(app).post('/api/orders').send({ items: [] });
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Customer data required');
        });

        it('should handle service errors', async () => {
            const payload = { customer: { firstName: 'John' } };
            customerService.createOrUpdate.mockRejectedValue(new Error('Service Error'));

            const res = await request(app).post('/api/orders').send(payload);
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Service Error');
        });
    });

    describe('GET /api/orders/:id', () => {
        it('should return order if found', async () => {
            orderService.findById.mockResolvedValue({ id: 1 });
            const res = await request(app).get('/api/orders/1');
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(1);
        });

        it('should return 404 if not found', async () => {
            orderService.findById.mockResolvedValue(null);
            const res = await request(app).get('/api/orders/999');
            expect(res.status).toBe(404);
        });

        it('should handle errors', async () => {
            orderService.findById.mockRejectedValue(new Error('DB Error'));
            const res = await request(app).get('/api/orders/1');
            expect(res.status).toBe(500);
        });
    });

    describe('PATCH /api/orders/:id/status', () => {
        it('should update status', async () => {
            orderService.updateStatus.mockResolvedValue({ id: 1, status: 'SHIPPED' });
            const res = await request(app).patch('/api/orders/1/status').send({ status: 'SHIPPED' });
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('SHIPPED');
        });

        it('should handle errors', async () => {
            orderService.updateStatus.mockRejectedValue(new Error('Invalid Status'));
            const res = await request(app).patch('/api/orders/1/status').send({ status: 'INVALID' });
            expect(res.status).toBe(400);
        });
    });
});
