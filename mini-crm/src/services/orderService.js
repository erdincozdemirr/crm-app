const { Order, OrderItem, sequelize } = require('../models');
const BaseService = require('./baseService');
const ProductService = require('./productService');

class OrderService extends BaseService {
    constructor() {
        super(Order);
    }

    async createOrder(customerId, items, shippingAddress) {
        const t = await sequelize.transaction();

        try {
            let totalPrice = 0;
            const orderItemsData = [];

            for (const item of items) {
                const product = await ProductService.findById(item.productId);
                if (!product) {
                    throw new Error(`Product not found: ${item.productId}`);
                }

                await ProductService.decreaseStock(item.productId, item.quantity, t);

                const itemTotal = parseFloat(product.price) * item.quantity;
                totalPrice += itemTotal;

                orderItemsData.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: product.price
                });
            }

            const order = await this.model.create({
                customerId,
                shippingAddress,
                totalPrice,
                status: 'PENDING'
            }, { transaction: t });

            for (const itemData of orderItemsData) {
                await OrderItem.create({
                    orderId: order.id,
                    ...itemData
                }, { transaction: t });
            }

            await t.commit();
            return this.findById(order.id);

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async updateStatus(id, status) {
        const order = await this.findById(id);
        if (!order) throw new Error('Order not found');
        return order.update({ status });
    }
}

module.exports = new OrderService();
