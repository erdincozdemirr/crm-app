const { Product } = require('../models');
const BaseService = require('./baseService');

class ProductService extends BaseService {
    constructor() {
        super(Product);
    }

    async checkStock(id, quantity) {
        const product = await this.findById(id);
        if (!product) throw new Error('Product not found');

        if (!product.isStockTracked) return true;

        return product.stockQuantity >= quantity;
    }

    async decreaseStock(id, quantity, transaction) {
        const product = await this.findById(id);
        if (!product.isStockTracked) return;

        if (product.stockQuantity < quantity) {
            throw new Error(`Insufficient stock for product: ${product.name}`);
        }

        await product.decrement('stockQuantity', { by: quantity, transaction });
    }
}

module.exports = new ProductService();
