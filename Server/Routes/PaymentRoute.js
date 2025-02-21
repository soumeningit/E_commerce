const express = require('express');
const router = express.Router();

const { auth } = require('../Middleware/AuthMiddleWare');
const { capturePayment, paymentSuccess, verifyPayment } = require('../Controller/Payment');

router.post('/capture-payment', auth, capturePayment);
router.post('/payment-success-email', auth, paymentSuccess);
router.post('/verify-payment', auth, verifyPayment);

module.exports = router;