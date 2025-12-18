const customerService = require('../services/customerService');

class CustomerController {
    async create(req, res) {
        try {
            const customer = await customerService.createOrUpdate(req.body);
            res.status(201).json(customer);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const customers = await customerService.findAll(req.query);
            res.json(customers);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const customer = await customerService.findById(req.params.id);
            if (!customer) return res.status(404).json({ error: 'Customer not found' });
            res.json(customer);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const updated = await customerService.update(req.params.id, req.body);
            if (!updated) return res.status(404).json({ error: 'Customer not found' });
            res.json(updated);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

}

module.exports = new CustomerController();
