const express = require('express');
const router = express.Router();

const { auth } = require('../Middleware/AuthMiddleWare');

const { addItemsToCart, getCartItems, updateCartItems, deleteItemsFromCart } = require('../Controller/Cart');

router.post('/add-items-to-cart', auth, addItemsToCart);
router.get('/get-cart-items', auth, getCartItems);
router.put('/update-cart-items', auth, updateCartItems);
router.delete('/delete-items-from-cart', auth, deleteItemsFromCart);

module.exports = router;