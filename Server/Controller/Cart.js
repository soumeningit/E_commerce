const { createCart } = require('../Utils/CreateTable');
const dbConnect = require('../Utils/DBConnect');
const Connection = require('../Utils/DBConnect');


exports.addItemsToCart = async (req, res) => {
    let connection;
    try {
        console.log("INSIDE ADD ITEMS TO CART ....");
        console.log("REQ BODY : ", req.body);

        const pool = await dbConnect();
        connection = await pool.getConnection();

        const isCartTableExsist = await createCart(connection);

        if (!isCartTableExsist) {
            return res.status(400).json({
                success: false,
                message: "Cart table creation faled"
            });
        }

        const { productId, userId, quantity, product_price, total_price } = req.body;

        console.log("productId : ", productId);
        console.log("userId : ", userId);
        console.log("quantity : ", quantity);
        console.log("product_price : ", product_price);
        console.log("total_price : ", total_price);

        if (!productId || !userId) {
            return res.status(400).json({
                success: false,
                message: "Product Id,User Id are required"
            });
        }

        // Check if user exists
        const [userDetails] = await connection.execute(
            `SELECT * FROM users WHERE id = ?`, [userId]
        );
        if (userDetails.length === 0) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }
        console.log("USER DETAILS:", JSON.stringify(userDetails));

        // Check if product exists
        const [productDetails] = await connection.execute(
            `SELECT * FROM product_details WHERE id = ?`, [productId]
        );
        if (productDetails.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Product not found"
            });
        }
        console.log("PRODUCT DETAILS:", JSON.stringify(productDetails));

        const product_price_db = productDetails[0].product_mrp;
        const_total_price = product_price * quantity;
        console.log("product_price : ", product_price_db);
        console.log("total_price :", total_price);

        const cartQuery = `
            INSERT INTO cart (user_id, product_id, quantity, price_per_item, total_price)
            VALUES (?, ?, ?, ?, ?);
        `;

        const cartDetails = await connection.execute(cartQuery, [
            userId, productId, quantity, product_price_db, total_price
        ]);

        console.log("CART DETAILS:", JSON.stringify(cartDetails));

        if (cartDetails.affectedRows === 0) {
            return res.status(400).json({
                success: false,
                message: "Product not added to cart"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product added to cart successfully"
        });

    } catch (error) {
        console.log("Error in addItemsToCart", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

exports.getCartItems = async (req, res) => {
    try {
        console.log("INSIDE GET CART ITEMS ....");
        console.log("REQ QUERY : ", req.query);
        const connection = await Connection();
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User Id is required"
            });
        }

        const query = `
            SELECT
                pd.*,
                c.*
            FROM product_details AS pd
            JOIN cart AS c ON pd.id = c.product_id
            WHERE c.user_id = 2;
        `;

        const [cartDetails] = await connection.execute(query, [userId]);
        console.log("CART DETAILS:", JSON.stringify(cartDetails));

        return res.status(200).json({
            success: true,
            data: cartDetails
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
            `DELETE FROM cart WHERE id = ?`, [productId]
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