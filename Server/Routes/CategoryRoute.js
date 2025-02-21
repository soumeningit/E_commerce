const express = require('express');
const router = express.Router();

const { auth, isEmployee } = require("../Middleware/AuthMiddleWare");

const { createCategory, getCategories, findItemsByCategory } = require("../Controller/Category");

router.post("/create-category", auth, isEmployee, createCategory);
router.get("/get-categories", getCategories);
router.get("/get-products-by-category", findItemsByCategory);

module.exports = router;