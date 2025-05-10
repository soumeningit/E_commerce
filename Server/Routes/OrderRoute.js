const express = require('express');
const router = express.Router();

const { getOrderDetails, getOrderDetailsById, submitReview } = require('../Controller/Order');
const { auth } = require('../Middleware/AuthMiddleWare');


router.get('/get-order-details', auth, getOrderDetails);
router.get('/get-order-details-by-id', auth, getOrderDetailsById);
router.post('/add-review', auth, submitReview);

module.exports = router;