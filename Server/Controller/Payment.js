const { instance } = require('../Config/razorpay');
const mailSender = require('../Utils/MailSender');
const { generatePaymentSuccessEmail } = require('../EmailTemplate/PaymentSuccess');
const dbConnect = require('../Utils/DBConnect');
const { createPayments, createOrders, createOrderItems } = require('../Utils/CreateTable');
const crypto = require('crypto');

exports.capturePayment = async (req, res) => {
    let connection;
    try {
        console.log("INSIDE CAPTURE PAYMENT INSIDE SERVER....")
        console.log("req.body : ", req.body);
        const { cartItems } = req?.body;
        const userId = req?.body?.userId;

        let orderIdFromDB;

        console.log("userId : " + userId);

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        };

        console.log("userId inside capturePayment : ", userId);

        if (cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No Items selected"
            })
        };
        console.log("cartItems inside capturePayment : ", cartItems);

        const pool = await dbConnect();
        connection = await pool.getConnection();

        const isPaymentTableExsist = await createPayments(connection);
        if (!isPaymentTableExsist) {
            return res.status(401).json({
                success: false,
                message: "Server Error"
            })
        }

        const isOrderTableExsist = await createOrders(connection);
        if (!isOrderTableExsist) {
            return res.status(401).json({
                success: false,
                message: "Server Error"
            })
        }

        const isCreateOrderItemsExist = await createOrderItems(connection);
        if (!isCreateOrderItemsExist) {
            return res.status(401).json({
                success: false,
                message: "Server Error"
            })
        }

        let email;

        const [userData] = await connection.execute(`SELECT * FROM users WHERE id = ?`, [userId]);

        console.log("userData : " + userData);
        console.log("userData : " + JSON.stringify(userData));

        email = userData[0].email;
        console.log("email : ", email);

        const name = userData[0].firstName + " " + userData[0].lastName;
        console.log("name : ", name);

        if (userData.length === 0) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        let totalAmount = 0;
        let amountFromAPI = 0;

        const [orderInitiateData] = await connection.execute(
            `INSERT INTO orders (is_order_initiated, order_initiation_time, user_id) VALUES (?, ?, ?)`,
            [1, new Date(), userId]
        );

        if (orderInitiateData.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Error while inserting into order table"
            })
        }

        console.log("orderInitiateData : ", JSON.stringify(orderInitiateData));

        orderIdFromDB = orderInitiateData.insertId;
        console.log("orderId : ", orderIdFromDB);

        for (let i = 0; i < cartItems.length; i++) {
            const [productData] = await connection.execute(`SELECT * FROM product_details WHERE id = ?`, [cartItems[i].product_id]);
            if (productData.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Product not found"
                })
            }
            const quantity = cartItems[i].quantity;
            console.log("quantity : ", quantity);
            const dbPrice = productData[0].product_mrp;
            console.log("dbPrice : ", dbPrice);
            totalAmount += Number(dbPrice) * Number(quantity);
            amountFromAPI += Number(cartItems[i].price_per_item) * Number(quantity);
            console.log("amountFromAPI : ", amountFromAPI);
            console.log("totalAmount : ", totalAmount);

            const [orderItemTableData] = await connection.execute(
                `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
                [orderIdFromDB, cartItems[i].product_id, cartItems[i].quantity, cartItems[i].price_per_item]
            )
            if (orderItemTableData.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Error while inserting into order table"
                })
            }

        }

        console.log("totalAmount : ", totalAmount);

        if (String(totalAmount) !== String(amountFromAPI)) {
            return res.status(400).json({
                success: false,
                message: "Amount mismatch"
            })
        }

        console.log("Amount matched");

        const options = {
            amount: totalAmount * 100,  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: "INR",
            receipt: Math.random(Date.now()).toString()
        };

        const order = await instance.orders.create(options);
        if (!order) {
            return res.status(400).json({
                success: false,
                message: "Error while creating order"
            })
        }

        console.log("order : ", order);

        const [updateOrder] = await connection.execute(
            `UPDATE orders SET order_id = ?, total_price = ? WHERE id = ?`,
            [order.id, totalAmount, orderIdFromDB]
        );

        if (updateOrder.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Error while updating order table"
            })
        }
        console.log("updateOrder : ", JSON.stringify(updateOrder));

        let payment_id;
        const [paymentData] = await connection.execute(
            `INSERT INTO payments (payment_amount, order_id, is_payment_initiated, payment_initiate_time, payment_initiator_id) VALUES(?, ?, ?, ?, ?) `,
            [totalAmount, orderIdFromDB, 1, new Date(), userId,]
        );

        if (paymentData.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Error while inserting into payment table"
            })
        }

        payment_id = paymentData.insertId;

        console.log("payment_id : " + payment_id);

        return res.status(200).json({
            success: true,
            message: "Order created successfully",
            data: order,
            keyId: process.env.RAZORPAY_KEY_ID,
            email: email,
            name: name,
            amount: totalAmount,
            order_id: orderIdFromDB,
            payment_id: payment_id
        })

    } catch (error) {
        console.log("Capture of Payment failed : ", error)
        console.log(error)
        return res.json({
            status: false,
            message: "Capture of Payment failed : " + error
        })
    }
}

exports.paymentSuccess = async (req, res) => {
    let connection;
    try {
        console.log("INSIDE PAYMENT SUCCESS SERVER....");
        console.log("req.body : ", req.body);
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req?.body?.response;
        const { userId } = req.body;
        const { amount } = req.body;
        const { order_id } = req.body;
        console.log("razorpay_payment_id : " + razorpay_payment_id, " razorpay_order_id : " + razorpay_order_id + " razorpay_signature : " + razorpay_signature + " userId : " + userId);
        console.log("order_id : " + order_id);

        const pool = await dbConnect();
        connection = await pool.getConnection();

        const [userDetails] = await connection.execute(`SELECT * FROM users WHERE id = ?`, [userId]);
        if (userDetails.length === 0) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        console.log("userDetails : ", JSON.stringify(userDetails));
        const name = userDetails[0].firstName + " " + userDetails[0].lastName;

        const emailResponse = await mailSender(userDetails[0].email, "Payment Complete", generatePaymentSuccessEmail(name, razorpay_payment_id, razorpay_order_id, amount / 100, 'E-Com', new Date().getFullYear()));
        console.log("emailResponse : ", emailResponse);
        if (!emailResponse.success) {
            return res.status(400).json({
                success: false,
                message: "Error while sending email"
            })
        }

        console.log("paymentData : ", JSON.stringify(paymentData));

        return res.status(200).json({
            success: true,
            message: "Payment Successfull",
        })
    } catch (error) {
        console.log("Payment Success failed : ", error)
        return res.status(400)
            .json({
                status: false,
                message: "Payment Success failed : " + error
            })

    }
};

exports.verifyPayment = async (req, res) => {
    let connection;
    console.log("req.body inside verify: ", req.body);
    try {
        console.log("INSIDE VERIFY PAYMENT SERVER....");
        const pool = await dbConnect();
        connection = await pool.getConnection();

        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            userId,
            order_id,
            payment_id,
            amount } = req.body;

        console.log("razorpay_payment_id " + razorpay_payment_id + "razorpay_order_id " + razorpay_order_id + " razorpay_signature : " + " userId : " + userId + " order_id : " + order_id + " payment_id : " + payment_id)

        const [paymentResponse] = await connection.execute(`UPDATE payments SET is_verify_payment_initiated = ?, verify_payment_initiation_time = ?, razorpay_payment_id = ?, razorpay_order_id = ? WHERE id = ?`,
            [1, new Date(), razorpay_payment_id, razorpay_order_id, payment_id]
        )

        console.log("paymentResponse inside verify payment : " + JSON.stringify(paymentResponse));

        console.log("razorpay_payment_id : " + razorpay_payment_id, " razorpay_order_id : " + razorpay_order_id +
            " razorpay_signature : " + razorpay_signature + " userId : " + userId
        );

        if (
            !razorpay_payment_id ||
            !razorpay_order_id ||
            !razorpay_signature ||
            !userId
        ) {
            console.log("All fields are nedded....")
        }

        const [userDetails] = await connection.execute(`SELECT * FROM users WHERE id = ?`, [userId]);

        console.log("userDetails + " + JSON.stringify(userDetails));

        const name = userDetails[0].firstName + " " + userDetails[0].lastName;

        let body = razorpay_order_id + "|" + razorpay_payment_id;
        let expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature == razorpay_signature) {
            const [updatePayment] = await connection.execute(
                `UPDATE payments SET payment_complete = ?, payment_completion_time = ? WHERE id = ?`,
                [1, new Date(), payment_id]
            );

            if (updatePayment.length === 0) {
                console.log("Payment not updated")
                return res.status(400).json({
                    success: false,
                    message: "Payment not updated"
                });
            }
            console.log("razorpay signature : ", razorpay_signature);
            console.log("Payment verified");

            const [updateOrderResponse] = await connection.execute(`UPDATE orders SET order_status = ?, order_completion_time = ? where id = ?`,
                ['completed', new Date(), order_id]
            );

            console.log("updateOrderResponse : " + JSON.stringify(updateOrderResponse))

            if (updateOrderResponse.length === 0) {
                console.log("Order not updated")
                return res.status(400).json({
                    success: false,
                    message: "Order not updated"
                });
            }

            const [orderItems] = await connection.execute(
                `SELECT * FROM order_items WHERE order_id = ?`,
                [order_id]
            )

            console.log("orderItems : ", JSON.stringify(orderItems));

            if (orderItems.length === 0) {
                console.log("Order items not updated")
                return res.status(400).json({
                    success: false,
                    message: "Order items not founfd"
                });
            }

            for (let i = 0; i < orderItems.length; i++) {
                const [updateProductDetails] = await connection.execute(
                    `UPDATE product_details SET current_stk = current_stk - ? WHERE id = ?`,
                    [orderItems[i].quantity, orderItems[i].product_id]
                )
                if (updateProductDetails.length === 0) {
                    console.log("Product details not updated")
                    return res.status(400).json({
                        success: false,
                        message: "Product details not updated"
                    });
                }
            }

            let responseData = {};

            responseData.name = name;
            responseData.paymentId = razorpay_payment_id;
            responseData.orderId = razorpay_order_id;
            responseData.amount = amount;

            return res.status(200).json({
                success: true,
                message: "Payment verified successfully",
                payment: true,
                data: responseData
            })

        }

    } catch (error) {
        console.log("Verification of Payment failed : ", error)
        return res.status(400)
            .json({
                status: false,
                message: "Verification of Payment failed : " + error
            })
    }
}