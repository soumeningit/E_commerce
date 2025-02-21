const express = require('express');
const router = express.Router();

const {
    getAllUserDetails,
    getTableStructure,
    updateTableStructure,
    createUser,
    getUserDetails,
    updateUser,
    deleteUser,
    getProductsDetailsByUser
} = require('../Controller/UserDetails');
const { auth, isVendor } = require('../Middleware/AuthMiddleWare');

router.get('/getProductsDetails', auth, isVendor, getProductsDetailsByUser);
router.get('/getUserDetails', getAllUserDetails);
router.get('/getTableStructure', getTableStructure);
router.post('/updateTableStructure', updateTableStructure);
router.post('/createUser', createUser);
router.post('/getUserDetails', getUserDetails);
router.put("/updateUserDetails", updateUser);
router.delete('/deleteUser', deleteUser);

module.exports = router;