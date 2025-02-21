const express = require('express');
const router = express.Router();

const { auth, isVendor } = require('../Middleware/AuthMiddleWare');

const { createProduct, getProducts, searchProduct } = require('../Controller/Product');

router.post('/create-product', auth, isVendor, createProduct);
router.get('/get-product', getProducts);
router.post('/search-item', auth, searchProduct);

module.exports = router;