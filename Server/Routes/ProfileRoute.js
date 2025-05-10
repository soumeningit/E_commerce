const express = require('express');
const router = express.Router();

const { auth } = require("../Middleware/AuthMiddleWare");
const { updateUserImage, getUserDetails, updateUserDetails, verifyUser, isUserVerified } = require('../Controller/Profile');

router.post('/update-user-image', auth, updateUserImage);
router.get('/get-user-profile-details', auth, getUserDetails);
router.post('/update-user-details', auth, updateUserDetails); // Assuming this is the correct endpoint for updating user details
router.post('/verify-user', auth, verifyUser);
router.get('/get-user-is-verified', auth, isUserVerified);

module.exports = router;