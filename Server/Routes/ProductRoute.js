const express = require('express');
const router = express.Router();

const { auth, isVendor } = require('../Middleware/AuthMiddleWare');

const { createProduct, getProducts, searchProduct, getProductById, getParticularProductDetails, getReviews } = require('../Controller/Product');

router.post('/create-product', auth, isVendor, createProduct);
router.get('/get-product', getProducts);
router.get('/search-item', searchProduct);
router.get('/get-product-by-id', auth, isVendor, getProductById);
router.get('/get-product-details-by-id', getParticularProductDetails);
router.get('/get-reviews', getReviews);

module.exports = router;