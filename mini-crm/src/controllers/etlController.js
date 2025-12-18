const etlService = require('../services/etlService');

class EtlController {
    async importCustomers(req, res) {
        try {
            // Check if file is provided
            if (!req.file) {
                // If no file uploaded, maybe trigger default behavior or error?
                // For now, let's assume we always want a file upload as per new request
                // But to keep backward compat with the "mock" button (if any), handle gracefully

                // If no file but we want to test with mock:
                // const result = await etlService.runImport(null, null); 
                return res.status(400).json({ error: 'Please upload a CSV file.' });
            }

            const result = await etlService.runImport(req.file.buffer, req.file.originalname);

            res.json({
                message: 'Import completed',
                data: result
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new EtlController();
