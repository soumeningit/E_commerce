const { createReviews } = require("../Utils/CreateTable");
const dbConnect = require("../Utils/DBConnect");


exports.getOrderDetails = async (req, res) => {
    let connection;
    try {
        console.log("inside get order details");
        const { userId } = req.query;
        console.log("userId : " + userId);
        console.log("req.query : ", req.query);
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "user id is not present"
            });
        }

        const pool = await dbConnect();
        connection = await pool.getConnection();

        const [userDetails] = await connection.execute(`SELECT * FROM users WHERE id = ? AND is_verified = ?`,
            [userId, 1]
        );

        if (userDetails.length === 0) {
            return res.status(401).json({
                success: false,
                message: "user is not present"
            });
        }

        const query = `
                        SELECT 
                            p.id as product_id,
                            p.product_name,
                            p.product_mrp,
                            p.image AS product_image,
                            o.id AS order_id,
                            o.order_completion_time,
                            pa.razorpay_payment_id AS online_payment_id,
                            pa.id AS payment_id,
                            pd.*
                        FROM orders AS o
                        JOIN order_items AS oi ON o.id = oi.order_id
                        JOIN product_details AS p ON oi.product_id = p.id
                        JOIN payments AS pa ON pa.order_id = o.id
                        JOIN product_description AS pd ON pd.id = p.id
                        WHERE o.user_id = ? AND o.order_status = ?;`;
        const [orderDetails] = await connection.execute(query, [userId, 'completed']);

        console.log("orderDetails : ", orderDetails);
        console.log("orderDetails : ", JSON.stringify(orderDetails));

        if (orderDetails.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No orders found",
                data: []
            });
        }
        return res.status(200).json({
            success: true,
            message: "Order details fetched successfully",
            data: orderDetails
        });

    } catch (error) {
        console.error("Error fetching order details:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

exports.getOrderDetailsById = async (req, res) => {
    try {
        console.log("inside get order details by id");
        const { userId, productId, orderId } = req.query;
        console.log("order_id : " + orderId);
        console.log("product_id : " + productId);
        if (!userId || !productId) {
            return res.status(401).json({
                success: false,
                message: "order id or product id is not present"
            });
        }

        const pool = await dbConnect();
        const connection = await pool.getConnection();

        const sql = `SELECT 
                        p.id as product_id,
                        p.product_name,
                        p.product_mrp,
                        p.image AS product_image,
                        o.id AS order_id,
                        o.order_completion_time,
                        pa.razorpay_payment_id AS online_payment_id,
                        pa.id AS payment_id,
                        pd.*
                    FROM orders AS o
                    JOIN order_items AS oi ON o.id = oi.order_id
                    JOIN product_details AS p ON oi.product_id = p.id
                    JOIN payments AS pa ON pa.order_id = o.id
                    JOIN product_description AS pd ON pd.id = p.id
                    WHERE o.user_id = ? AND oi.product_id = ?;`;

        const [orderDetails] = await connection.execute(sql, [userId, productId]);
        console.log("orderDetails : ", orderDetails);
        console.log("orderDetails : ", JSON.stringify(orderDetails));
        if (orderDetails.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No orders found",
                data: []
            });
        }
        return res.status(200).json({
            success: true,
            message: "Order details fetched successfully",
            data: orderDetails
        });

    } catch (error) {
        console.error("Error fetching order details by id:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
}

exports.submitReview = async (req, res) => {
    try {
        console.log("inside submit review");
        console.log("req.body : ", req.body);
        const { userId, orderId, productId } = req.body;

        const { email, message, rating } = req.body;

        if (!userId || !orderId || !productId) {
            return res.status(401).json({
                success: false,
                message: "user id or order id or product id is not present"
            });
        }
        if (!email || !message || !rating) {
            return res.status(401).json({
                success: false,
                message: "email or message or rating is not present"
            });
        }

        const pool = await dbConnect();
        const connection = await pool.getConnection();

        const isReviewTableExsist = await createReviews(connection);
        if (!isReviewTableExsist) {
            return res.status(401).json({
                success: false,
                message: "review table is not present"
            });
        }

        const [userDetails] = await connection.execute(`SELECT * FROM users WHERE id = ? AND is_verified = ?`,
            [userId, 1]
        );
        if (userDetails.length === 0) {
            return res.status(401).json({
                success: false,
                message: "user is not present"
            });
        }
        const [orderDetails] = await connection.execute(`SELECT * FROM orders WHERE id = ? AND user_id = ?`,
            [orderId, userId]
        );
        if (orderDetails.length === 0) {
            return res.status(401).json({
                success: false,
                message: "order is not present"
            });
        }
        const [productDetails] = await connection.execute(`SELECT * FROM product_details WHERE id = ?`,
            [productId]
        );
        if (productDetails.length === 0) {
            return res.status(401).json({
                success: false,
                message: "product is not present"
            });
        }
        const [reviewDetails] = await connection.execute(`SELECT * FROM reviews WHERE user_id = ? AND product_id = ?`,
            [userId, productId]
        );
        if (reviewDetails.length > 0) {
            return res.status(401).json({
                success: false,
                message: "review is already present"
            });
        }

        const sql = `INSERT INTO reviews (user_id, product_id, order_id, email, message, rating) VALUES (?, ?, ?, ?, ?, ?)`;
        const [reviewResponse] = await connection.execute(sql, [userId, productId, orderId, email, message, rating]);
        console.log("result : ", reviewResponse);

        if (reviewResponse.affectedRows === 0) {
            return res.status(401).json({
                success: false,
                message: "review is not inserted"
            });
        }

        return res.status(200).json({
            success: true,
            message: "review is inserted successfully",
            data: reviewResponse
        });

    } catch (error) {
        console.error("Error submitting review:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
}