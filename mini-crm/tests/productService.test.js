const productService = require('../src/services/productService');
const { Product } = require('../src/models');

jest.mock('../src/models');

describe('ProductService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('checkStock', () => {
        it('should return true if stock tracking is disabled', async () => {
            Product.findByPk.mockResolvedValue({ isStockTracked: false });
            const result = await productService.checkStock(1, 100);
            expect(result).toBe(true);
        });

        it('should return true if stock is sufficient', async () => {
            Product.findByPk.mockResolvedValue({ isStockTracked: true, stockQuantity: 10 });
            const result = await productService.checkStock(1, 5);
            expect(result).toBe(true);
        });

        it('should return false if stock is insufficient', async () => {
            Product.findByPk.mockResolvedValue({ isStockTracked: true, stockQuantity: 2 });
            const result = await productService.checkStock(1, 5);
            expect(result).toBe(false);
        });
    });

    describe('decreaseStock', () => {
        it('should decrement stock if tracked', async () => {
            const mockProduct = {
                isStockTracked: true,
                stockQuantity: 10,
                decrement: jest.fn()
            };
            Product.findByPk.mockResolvedValue(mockProduct);

            await productService.decreaseStock(1, 5);
            expect(mockProduct.decrement).toHaveBeenCalledWith('stockQuantity', expect.objectContaining({ by: 5 }));
        });

        it('should throw error if insufficient stock', async () => {
            const mockProduct = { isStockTracked: true, stockQuantity: 2 };
            Product.findByPk.mockResolvedValue(mockProduct);

            await expect(productService.decreaseStock(1, 5)).rejects.toThrow('Insufficient stock');
        });
    });
});
