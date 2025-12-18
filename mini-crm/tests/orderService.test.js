const orderService = require('../src/services/orderService');
const productService = require('../src/services/productService');
const { Order, OrderItem, sequelize } = require('../src/models');

jest.mock('../src/models');
jest.mock('../src/services/productService');

describe('OrderService', () => {
    let mockTransaction;

    beforeEach(() => {
        mockTransaction = {
            commit: jest.fn(),
            rollback: jest.fn()
        };
        sequelize.transaction.mockResolvedValue(mockTransaction);
        jest.clearAllMocks();
    });

    describe('createOrder', () => {
        const mockCustomer = { id: 1 };
        const mockItems = [{ productId: 1, quantity: 2 }];
        const mockProduct = { id: 1, price: 100, isStockTracked: true };

        it('should create order successfully', async () => {
            productService.findById.mockResolvedValue(mockProduct);
            productService.decreaseStock.mockResolvedValue();
            Order.create.mockResolvedValue({ id: 123 });
            OrderItem.create.mockResolvedValue({});
            Order.findByPk.mockResolvedValue({ id: 123, status: 'PENDING' });

            const result = await orderService.createOrder(1, mockItems, 'Test Address');

            expect(sequelize.transaction).toHaveBeenCalled();
            expect(productService.decreaseStock).toHaveBeenCalledWith(1, 2, mockTransaction);
            expect(Order.create).toHaveBeenCalled();
            expect(mockTransaction.commit).toHaveBeenCalled();
            expect(result.id).toBe(123);
        });

        it('should rollback transaction on error', async () => {
            productService.findById.mockResolvedValue(mockProduct);
            productService.decreaseStock.mockRejectedValue(new Error('Insufficient stock'));

            await expect(orderService.createOrder(1, mockItems, 'Addr')).rejects.toThrow('Insufficient stock');
            expect(mockTransaction.rollback).toHaveBeenCalled();
            expect(mockTransaction.commit).not.toHaveBeenCalled();
        });
    });
});
