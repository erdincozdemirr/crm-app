const orderService = require('../services/orderService');
const customerService = require('../services/customerService');

class OrderController {
    async create(req, res) {
        try {
            const { customer, items, shippingAddress } = req.body;

            if (!customer) {
                return res.status(400).json({ error: 'Customer data required' });
            }

            const customerRecord = await customerService.createOrUpdate(customer);

            const order = await orderService.createOrder(customerRecord.id, items, shippingAddress);

            res.status(201).json(order);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getAllOrders(req, res) {
        try {
            const orders = await orderService.findAll();
            res.json(orders);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const order = await orderService.findById(req.params.id);
            if (!order) return res.status(404).json({ error: 'Order not found' });
            res.json(order);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateStatus(req, res) {
        try {
            const { status } = req.body;
            const order = await orderService.updateStatus(req.params.id, status);
            res.json(order);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new OrderController();
