const express = require('express');
const router = express.Router();

const { auth, isAdmin } = require('../Middleware/AuthMiddleWare');
const { getVendors, verifiedVendor } = require('../Controller/Admin');

router.get('/get-vendors', auth, isAdmin, getVendors);
router.put('/verified-vendor', auth, isAdmin, verifiedVendor);

module.exports = router;