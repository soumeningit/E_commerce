const { instance } = require('../Config/razorpay');
const Connection = require('../Utils/DBConnect');
const mailSender = require('../Utils/MailSender');
const { generatePaymentSuccessEmail } = require('../EmailTemplate/PaymentSuccess');

exports.capturePayment = async (req, res) => {
    try {
        console.log("INSIDE CAPTURE PAYMENT INSIDE SERVER....")
        console.log("req.body : ", req.body);
        const { data } = req?.body;
        const userId = req?.user.id || req?.body?.data?.userId;

        if (!data || !userId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        };

        console.log("data inside capturePayment : ", data);
        console.log("userId inside capturePayment : ", userId);

        const { cartItems, totalAmount } = data;
        if (cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No Items selected"
            })
        };
        console.log("cartItems inside capturePayment : ", cartItems);
        console.log("totalAmount inside capturePayment from frontend : ", totalAmount);

        const connection = await Connection();
        const [userData] = await connection.execute(`SELECT * FROM users WHERE user_id = ?`, [userId]);

        if (userData.length === 0) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        const quantity = data?.quantity;
        let amount = 0;

        let productData = [];

        for (let key in quantity) {
            console.log("key : ", key);
            console.log("quantity : ", quantity[key]);

            [productData] = await connection.execute(`SELECT * FROM products WHERE product_id = ? AND stocks > ?`, [key, quantity[key]]);
            if (productData.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Product out of stock"
                })
            }

            console.log("productData : ", productData);

            amount += productData[0].product_mrp * quantity[key];
        }

        console.log("amount : ", amount);

        if (amount !== totalAmount) {
            return res.status(400).json({
                success: false,
                message: "Amount mismatch"
            })
        }

        console.log("Amount matched");
        console.log("totalAmount : ", totalAmount);

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

        const [isOrderTable] = await connection.execute(`SHOW TABLES LIKE 'Orders'`);
        console.log("isOrderTable : ", isOrderTable);
        if (isOrderTable.length === 0) {
            const [orderTable] = await connection.execute(
                `CREATE TABLE Orders (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    order_id VARCHAR(50) NOT NULL,  -- Not unique because multiple products can have the same order_id
                    user_id INT NOT NULL,
                    total_amount INT CHECK (total_amount >= 0),  -- Stores total order cost
                    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
                    INDEX (order_id)  -- Explicitly index order_id for foreign key usage
                );`
            );
            if (!orderTable) {
                return res.status(400).json({
                    success: false,
                    message: "Error while creating order table"
                })
            }
            console.log("orderTable : ", JSON.stringify(orderTable));
        }

        const [isOrderItemTable] = await connection.execute(`SHOW TABLES LIKE 'Order_Items'`);
        console.log("isOrderItemTable : ", isOrderItemTable);
        if (isOrderItemTable.length === 0) {
            const [orderItemTable] = await connection.execute(
                `CREATE TABLE Order_Items (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    order_id VARCHAR(50) NOT NULL,  -- Foreign key linking to Orders
                    product_id VARCHAR(50) NOT NULL,
                    quantity INT NOT NULL CHECK (quantity > 0), -- Ensures positive quantity
                    price INT NOT NULL CHECK (price >= 0), -- Stores the price of a single unit
                    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
                    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE
                );`
            );
            if (!orderItemTable) {
                return res.status(400).json({
                    success: false,
                    message: "Error while creating order item table"
                })
            }
            console.log("orderItemTable : ", JSON.stringify(orderItemTable));
        }

        const [orderData] = await connection.execute(
            `INSERT INTO Orders (order_id, user_id, total_amount) VALUES (?, ?, ?)`,
            [order.id, userId, totalAmount]
        );

        if (orderData.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Error while inserting into order table"
            })
        }

        console.log("orderData : ", JSON.stringify(orderData));

        for (let key in quantity) {
            let amountData = amount - productData[0].product_mrp * quantity[key];
            const [orderItemTableData] = await connection.execute(
                `INSERT INTO Order_Items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
                [order.id, key, quantity[key], amountData]
            )
            if (orderItemTableData.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Error while inserting into order table"
                })
            }
            console.log("orderItemTableData : ", JSON.stringify(orderItemTableData));
        }
        return res.status(200).json({
            success: true,
            message: "Order created successfully",
            data: order,
            keyId: process.env.RAZORPAY_KEY_ID
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
    try {
        console.log("INSIDE PAYMENT SUCCESS SERVER....");
        console.log("req.body : ", req.body);
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req?.body?.response;
        const userId = req?.user.id;
        const { amount } = req?.body;
        console.log("razorpay_payment_id : " + razorpay_payment_id, " razorpay_order_id : " + razorpay_order_id + " razorpay_signature : " + razorpay_signature + " userId : " + userId);

        const connection = await Connection();
        const [userDetails] = await connection.execute(`SELECT * FROM users WHERE user_id = ?`, [userId]);
        if (userDetails.length === 0) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        console.log("userDetails : ", JSON.stringify(userDetails));
        const name = userDetails[0].firstName + " " + userDetails[0].lastName;

        const [paymentTable] = await connection.execute(`SHOW TABLES LIKE 'payments'`);

        console.log("paymentTable : ", paymentTable);

        if (paymentTable.length === 0) {
            const [paymentTableData] = await connection.execute(
                `CREATE TABLE Payments (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    payment_id VARCHAR(255) NOT NULL,
                    order_id VARCHAR(255) NOT NULL,
                    amount INT NOT NULL,
                    payment_mode ENUM('credit_card', 'debit_card', 'upi', 'net_banking', 'wallet', 'cash'),
                    transaction_id VARCHAR(255) UNIQUE,
                    payment_status ENUM('success', 'failed', 'pending', 'refunded') DEFAULT 'pending',
                    payment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY(order_id) REFERENCES Orders(order_id) ON DELETE CASCADE
                    );`
            );
            if (!paymentTableData) {
                return res.status(400).json({
                    success: false,
                    message: "Error while creating payment table"
                })
            }

            console.log("paymentTableData : ", JSON.stringify(paymentTableData));
        }

        const emailResponse = await mailSender(userDetails[0].email, "Payment Complete", generatePaymentSuccessEmail(name, razorpay_payment_id, razorpay_order_id, amount / 100, 'E-Com', new Date().getFullYear()));
        console.log("emailResponse : ", emailResponse);
        if (!emailResponse.success) {
            return res.status(400).json({
                success: false,
                message: "Error while sending email"
            })
        }

        const [paymentData] = await connection.execute(
            `INSERT INTO Payments (payment_id,order_id, amount, transaction_id) VALUES (?, ?, ?, ?)`,
            [razorpay_payment_id, razorpay_order_id, amount, razorpay_payment_id]
        );

        if (paymentData.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Error while inserting into payment table"
            })
        }

        console.log("paymentData : ", JSON.stringify(paymentData));

        return res.status(200).json({
            success: true,
            message: "Payment Successfull"
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
    try {
        console.log("INSIDE VERIFY PAYMENT SERVER....");
        const razorpay_payment_id = req?.body.razorpay_payment_id;
        const razorpay_order_id = req?.body.razorpay_order_id;
        const razorpay_signature = req?.body.razorpay_signature;
        const userId = req?.user.id;

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

        const connection = await Connection();
        const [userDetails] = await connection.execute(`SELECT * FROM users WHERE user_id = ?`, [userId]);

        let body = razorpay_order_id + "|" + razorpay_payment_id;
        let expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature == razorpay_signature) {
            const [updatePayment] = await connection.execute(
                `UPDATE Payments SET payment_status = 'success' WHERE payment_id = ?`,
                [razorpay_payment_id]
            );
            // const data = {

            // }
            if (updatePayment.length === 0) {
                console.log("Payment not updated")
                return res.status(400).json({
                    success: false,
                    message: "Payment not updated"
                });
            }
            console.log("razorpay signature : ", razorpay_signature);
            console.log("Payment verified");
            return res.status(200).json({
                success: true,
                message: "Payment verified successfully",
                payment: true
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


const enrolledStudent = async (userId, courses, res) => {
    try {
        console.log("enrolledStudent....")
        if (!userId || !courses) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }

        for (let courseId of courses) {
            try {
                console.log("enrolledStudent....")
                const enrolledCourse = await Course.findOneAndUpdate(
                    { _id: courseId },
                    { $push: { studentsEnrolled: userId } },
                    { new: true },
                )

                // console.log("enrolledCourse inside enrolledStudent: ", enrolledCourse)

                if (!enrolledCourse) {
                    console.log("course not found")
                }

                const courseProgress = await CourseProgress.create({
                    courseId: courseId,
                    userId: userId,
                    courseProgress: []
                })

                const enrolledStudent = await User.findByIdAndUpdate(
                    userId,
                    {
                        $push: {
                            courses: courseId,
                            courseProgress: courseProgress._id
                        },
                    },
                    { new: true }
                )
                // console.log("enrolledStudent inside enrolledStudent: ", enrolledStudent)

                if (!enrolledStudent) {
                    console.log("User not found")
                }

                const emailResponse = await mailSender(
                    enrolledStudent.email,
                    "Order Complete! Starts Learning",
                    CourseEnrollmentEmail(enrolledCourse?.courseName, enrolledStudent?.firstName)
                    // CourseEnrollmentEMail(`${enrolledCourse.courseName}, ${enrolledStudent.firstName}`)
                )

                // console.log("emailResponse : ", emailResponse)


            } catch (error) {
                console.log("Error in enrolledStudent : ", error)
            }

        }

        return {
            success: true,
            message: "All courses enrolled successfully"
        };

    } catch (error) {
        console.log("Enrolled Student failed : ", error)
        return res.status(400)
            .json({
                status: false,
                message: "Enrolled Student failed : " + error
            })
    }
}

exports.sendPaymentSuccessEmail = async (req, res) => {
    try {
        console.log("Inside sendPaymentSuccessEmail in server....")
        const { orederId, paymentId, amount } = req?.body;
        const userId = req?.user.id;

        console.log("orderId, paymentId, amount, userId", orederId, paymentId, amount, userId)

        if (!orederId || !paymentId || !amount || !userId) {

            console.log("Order Id, Payment Id, User Id, and Amount are required")

        }

        try {
            const studentName = await User.findById({ _id: userId });
            console.log("Student Name : ", studentName);

            await mailSender(
                studentName.email,
                "Payment Successfull",
                PaymentSuccessmail(`${studentName.firstName} ${studentName.lastName}`, amount / 100, paymentId, orederId),
            )

            return res.status(200)
                .json({
                    success: true,
                    message: "Payment Successfull",
                })

        }
        catch (e) {
            console.log("Error in sending email : ", e)
        }


    } catch (error) {
        console.log("Error in sendPaymentSuccessEmail : ", error)
        return res.status(400).json({
            success: false,
            message: "Error in sendPaymentSuccessEmail : " + error
        })
    }
}