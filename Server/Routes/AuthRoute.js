const express = require('express');
const router = express.Router();

const {
    sendOTP,
    signUp,
    logIn,
    updatePassword,
    sendForgetPasswordToken,
    forgotPassword
} = require('../Controller/Auth');

router.post('/sendOTP', sendOTP);
router.post('/signUp', signUp);
router.post('/login', logIn);
router.put('/update-password', updatePassword);
router.post('/forgot-password-token', sendForgetPasswordToken);
router.post('/reset-password', forgotPassword);

module.exports = router;