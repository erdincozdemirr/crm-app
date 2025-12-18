const express = require('express');

const router = express.Router();
const productController = require('../controllers/productController');

router.post('/', productController.create);
router.get('/', productController.getAll);
router.put('/:id/stock', productController.updateStock);

module.exports = router;
