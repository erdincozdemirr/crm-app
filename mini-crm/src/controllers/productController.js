const productService = require('../services/productService');

class ProductController {
    async create(req, res) {
        try {
            const product = await productService.create(req.body);
            res.status(201).json(product);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const products = await productService.findAll();
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateStock(req, res) {
        try {
            const { id } = req.params;
            const { quantity } = req.body;

            const product = await productService.update(id, { stockQuantity: quantity });
            res.json(product);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new ProductController();
