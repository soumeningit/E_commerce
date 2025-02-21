const Connection = require('../Utils/DBConnect');


exports.addItemsToCart = async (req, res) => {
    try {
        console.log("INSIDE ADD ITEMS TO CART ....");
        console.log("REQ BODY : ", req.body);

        const connection = await Connection();
        const { productId, userId, quantity = 0 } = req.body;

        if (!productId || !userId) {
            return res.status(400).json({
                success: false,
                message: "Product Id,User Id are required"
            });
        }

        // Check if user exists
        const [userDetails] = await connection.execute(
            `SELECT * FROM users WHERE user_id = ?`, [userId]
        );
        if (userDetails.length === 0) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        console.log("USER DETAILS:", JSON.stringify(userDetails));

        // Check if product exists
        const [productDetails] = await connection.execute(
            `SELECT * FROM products WHERE product_id = ?`, [productId]
        );
        if (productDetails.length === 0) {
            return res.status(400).json({ success: false, message: "Product not found" });
        }
        console.log("PRODUCT DETAILS:", JSON.stringify(productDetails));

        // Check if cart table exists (only needed once, not every request)
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS cart (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT NOT NULL,
                product_id VARCHAR(255) NOT NULL,
                quantity INT NOT NULL,
                price BIGINT,
                FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                FOREIGN KEY(product_id) REFERENCES products(product_id) ON DELETE CASCADE
            );
        `);
        console.log("Table checked/created successfully");

        // Check if the same product exists in the cart
        const [cartDetails] = await connection.execute(
            `SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?`,
            [userId, productId]
        );

        console.log("CART DETAILS:", JSON.stringify(cartDetails));

        if (cartDetails.length > 0) {
            // If the product exists, update quantity
            const existingCartId = cartDetails[0].id;
            // const updatedQuantity = cartDetails[0].quantity;

            // const [updatedCart] = await connection.execute(
            //     `UPDATE cart SET quantity = ? WHERE id = ?`,
            //     [updatedQuantity, existingCartId]
            // );

            // if (updatedCart.affectedRows === 0) {
            //     return res.status(400).json({ success: false, message: "Cart not updated" });
            // }
            console.log("UPDATED CART DETAILS:", JSON.stringify(updatedCart));
        } else {
            // If product does not exist, insert new row
            const [cart] = await connection.execute(
                `INSERT INTO cart (user_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
                [userId, productId, quantity, productDetails[0].product_mrp]
            );

            if (cart.affectedRows === 0) {
                return res.status(400).json({ success: false, message: "Product not added to cart" });
            }
            console.log("NEW CART ENTRY:", JSON.stringify(cart));
        }

        // Update user cart status
        const value = true;
        const [updatedUserDetails] = await connection.execute(
            `UPDATE users SET cart = ? WHERE user_id = ?`, [value, userId]
        );

        if (updatedUserDetails.affectedRows === 0) {
            return res.status(400).json({ success: false, message: "Cart status not updated" });
        }
        console.log("UPDATED USER DETAILS:", JSON.stringify(updatedUserDetails));

        return res.status(200).json({
            success: true,
            message: "Product added to cart successfully"
        });

    } catch (error) {
        console.log("Error in addItemsToCart", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getCartItems = async (req, res) => {
    try {
        console.log("INSIDE GET CART ITEMS ....");
        console.log("REQ QUERY : ", req.query);
        const connection = await Connection();
        const { userId } = req.query;

        const [cartItems] = await connection.execute(
            `SELECT * FROM cart WHERE user_id = ?`, [userId]
        );
        if (cartItems.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No items found in cart"
            });
        }
        console.log("CART ITEMS:", JSON.stringify(cartItems));

        let cartItemData = [];
        for (let i = 0; i < cartItems.length; i++) {
            const [productDetails] = await connection.execute(
                `SELECT * FROM products WHERE product_id = ?`, [cartItems[i].product_id]
            );
            cartItemData[i] = { productDetails: productDetails[0] };
        }

        console.log("CART ITEM DATA:", JSON.stringify(cartItemData));

        return res.status(200).json({
            success: true,
            data: cartItemData
        });
    } catch (error) {
        console.log("Error in getCartItems", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

exports.updateCartItems = async (req, res) => {
    try {

    } catch (error) {
        console.log("Error in updateCartItems", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

exports.deleteItemsFromCart = async (req, res) => {
    try {
        console.log("INSIDE DELETE ITEMS FROM CART ....");
        console.log("REQ BODY : ", req.body);
        const connection = await Connection();
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product Id is required"
            });
        }

        const cartDetails = await connection.execute(
            `DELETE FROM cart WHERE product_id = ?`, [productId]
        );

        if (cartDetails.affectedRows === 0) {
            return res.status(400).json({
                success: false,
                message: "Product not deleted from cart"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product deleted from cart successfully"
        });

    } catch (error) {
        console.log("Error in deleteItemsFromCart", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}