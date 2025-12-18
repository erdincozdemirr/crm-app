const BaseService = require('../../src/services/baseService');

describe('BaseService', () => {
    let mockModel;
    let service;

    beforeEach(() => {
        mockModel = {
            findAll: jest.fn(),
            findByPk: jest.fn(),
            create: jest.fn()
        };
        service = new BaseService(mockModel);
    });

    describe('findAll', () => {
        it('should call model.findAll with correct parameters', async () => {
            await service.findAll({ id: 1 });
            expect(mockModel.findAll).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('should call model.findAll with empty where clause if not provided', async () => {
            await service.findAll();
            expect(mockModel.findAll).toHaveBeenCalledWith({ where: {} });
        });
    });

    describe('findById', () => {
        it('should call model.findByPk with id', async () => {
            await service.findById(1);
            expect(mockModel.findByPk).toHaveBeenCalledWith(1);
        });
    });

    describe('create', () => {
        it('should call model.create with data and options', async () => {
            const data = { name: 'test' };
            const options = { transaction: 't' };
            await service.create(data, options);
            expect(mockModel.create).toHaveBeenCalledWith(data, options);
        });
    });

    describe('update', () => {
        it('should return null if item not found', async () => {
            mockModel.findByPk.mockResolvedValue(null);
            const result = await service.update(1, {});
            expect(result).toBeNull();
        });

        it('should update item if found', async () => {
            const mockItem = { update: jest.fn().mockResolvedValue('updated') };
            mockModel.findByPk.mockResolvedValue(mockItem);

            const result = await service.update(1, { name: 'new' });
            expect(mockItem.update).toHaveBeenCalledWith({ name: 'new' });
            expect(result).toBe('updated');
        });
    });

    describe('delete', () => {
        it('should return false if item not found', async () => {
            mockModel.findByPk.mockResolvedValue(null);
            const result = await service.delete(1);
            expect(result).toBe(false);
        });

        it('should destroy item and return true if found', async () => {
            const mockItem = { destroy: jest.fn() };
            mockModel.findByPk.mockResolvedValue(mockItem);

            const result = await service.delete(1);
            expect(mockItem.destroy).toHaveBeenCalled();
            expect(result).toBe(true);
        });
    });
});
