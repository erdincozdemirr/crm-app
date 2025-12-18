const etlService = require('../../src/services/etlService');
const { EtlImport } = require('../../src/models');
const customerService = require('../../src/services/customerService');

jest.mock('../../src/models');
jest.mock('../../src/services/customerService');
jest.mock('../../src/lib/logger', () => ({
    info: jest.fn(),
    error: jest.fn()
}));

describe('EtlService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('runImport', () => {
        const mockFileBuffer = Buffer.from('Ad Soyad,Telefon,Email\nTest User,+905551112233,test@mail.com');
        const mockFilename = 'test.csv';

        it('should process valid file and create customers', async () => {
            // Mock EtlImport.create
            const mockEtlRecord = { id: 1, update: jest.fn() };
            EtlImport.create.mockResolvedValue(mockEtlRecord);

            // Mock customerService.createOrUpdate
            customerService.createOrUpdate.mockResolvedValue({ id: 1 });

            const result = await etlService.runImport(mockFileBuffer, mockFilename);

            expect(EtlImport.create).toHaveBeenCalledWith({
                filename: mockFilename,
                fileContent: mockFileBuffer,
                status: 'PROCESSING'
            });

            expect(customerService.createOrUpdate).toHaveBeenCalledWith(expect.objectContaining({
                firstName: 'Test',
                lastName: 'User',
                phone: '+905551112233',
                email: 'test@mail.com'
            }));

            expect(mockEtlRecord.update).toHaveBeenCalledWith(expect.objectContaining({
                status: 'COMPLETED',
                processedCount: 1,
                errorCount: 0
            }));

            expect(result.successCount).toBe(1);
        });

        it('should handle CSV cleaning (phone normalization)', async () => {
            const messyBuffer = Buffer.from('Ad Soyad,Telefon\nUser2,0555 999 88 77');
            EtlImport.create.mockResolvedValue({ id: 2, update: jest.fn() });
            customerService.createOrUpdate.mockResolvedValue({});

            await etlService.runImport(messyBuffer, 'messy.csv');

            expect(customerService.createOrUpdate).toHaveBeenCalledWith(expect.objectContaining({
                phone: '+905559998877'
            }));
        });

        it('should throw error if DB save fails', async () => {
            EtlImport.create.mockRejectedValue(new Error('DB Error'));

            await expect(etlService.runImport(mockFileBuffer, mockFilename))
                .rejects.toThrow('Database save failed');
        });

        it('should skip invalid rows (no phone/email)', async () => {
            const invalidBuffer = Buffer.from('Ad Soyad,Telefon,Email\nGhost User,,'); // Empty phone and email
            const mockEtlRecord = { id: 3, update: jest.fn() };
            EtlImport.create.mockResolvedValue(mockEtlRecord);

            const result = await etlService.runImport(invalidBuffer, 'invalid.csv');

            expect(customerService.createOrUpdate).not.toHaveBeenCalled();
            expect(result.errorCount).toBe(1);
        });
    });
});
