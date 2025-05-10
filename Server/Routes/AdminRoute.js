const express = require('express');
const router = express.Router();

const { auth, isAdmin } = require('../Middleware/AuthMiddleWare');
const {
    getAllUsers,
    blockUser,
    getAllBlockedUsers,
    unBlockUser,
    verifyUser,
    getPendingUsers
} = require('../Controller/Admin');

router.get('/get-all-notverified-user', auth, isAdmin, getPendingUsers);
router.post('/verify-user', auth, isAdmin, verifyUser);
router.get("/get-all-users", auth, isAdmin, getAllUsers);
router.get("/get-all-blocked-users", auth, isAdmin, getAllBlockedUsers);
router.delete("/block-user/:id", auth, isAdmin, blockUser);
router.put("/unblock-user/:id", auth, isAdmin, unBlockUser); // Assuming the same function is used for unblocking

module.exports = router;