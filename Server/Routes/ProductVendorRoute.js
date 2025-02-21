const express = require('express');
const router = express.Router();

const { auth } = require('../Middleware/AuthMiddleWare');

const { createProductVendor } = require('../Controller/ProductVendor');

router.post('/createProductVendor', auth, createProductVendor);

module.exports = router;