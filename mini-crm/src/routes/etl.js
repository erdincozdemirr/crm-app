const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const etlController = require('../controllers/etlController');

// Multer Config: Use memory storage to avoid disk I/O
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router.post('/import', upload.single('file'), etlController.importCustomers);

module.exports = router;
