exports.createOTP = async (connection) => {
    try {
        const [tables] = await connection.execute(`SHOW TABLES LIKE 'otp';`);

        if (tables.length === 0) {
            const query = `CREATE TABLE otp (
                id INT PRIMARY KEY AUTO_INCREMENT,
                email VARCHAR(100) NOT NULL,
                otp VARCHAR(10) NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expiresAt TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL 10 MINUTE)
            );`;

            await connection.execute(query);
            console.log("OTP table created successfully.");
        } else {
            console.log("OTP table already exists.");
        }

        return true;
    } catch (error) {
        console.error("Error creating OTP table:", error);
        return false;
    }
};

exports.createUsers = async (connection) => {
    try {
        const [rows] = await connection.execute(`SHOW TABLES LIKE 'users';`);

        if (rows.length === 0) {
            const query = `CREATE TABLE users(
                                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                firstName VARCHAR(255) NOT NULL,
                                middleName VARCHAR(100) DEFAULT NULL,
                                lastName VARCHAR(255) DEFAULT NULL,
                                email VARCHAR(100) UNIQUE DEFAULT NULL,
                                password VARCHAR(255) NOT NULL,
                                image VARCHAR(500) DEFAULT NULL,
                                mobileNo VARCHAR(14) NOT NULL,
                                role ENUM('user', 'staff', 'employee', 'admin', 'vendor') DEFAULT 'user',
                                is_verified BOOLEAN DEFAULT FALSE,
                                is_authorised BOOLEAN DEFAULT FALSE,
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                            );`;

            await connection.execute(query);
            console.log("Users table created successfully.");
        } else {
            console.log("Users table already exists.");
            return true;
        }
    } catch (error) {
        console.error("Error creating users table:", error);
        return false;
    }

    return true;
}

exports.createTokens = async (connection) => {
    try {
        const [rows] = await connection.execute(`SHOW TABLES LIKE 'tokens';`);

        if (rows.length === 0) {
            const query = `CREATE TABLE tokens(
                                id INT AUTO_INCREMENT PRIMARY KEY,
                                user_id INT NOT NULL,
                                reset_password_token VARCHAR(500) DEFAULT NULL,
                                reset_password_token_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                reset_password_token_expires_at DATETIME DEFAULT (CURRENT_TIMESTAMP + INTERVAL 15 MINUTE),
                                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                            );`;

            await connection.execute(query);
            console.log("Tokens table created successfully.");
        } else {
            console.log("Tokens table already exists.");
            return true;
        }
    } catch (error) {
        console.error("Error creating tokens table:", error);
        return false;
    }

    return true;
}

exports.createAdditionalDetails = async (connection) => {
    try {

        const sqlQuery = `SHOW TABLES LIKE 'additional_details';`;
        const [rows] = await connection.execute(sqlQuery);
        if (rows.length > 0) {
            console.log("Additional details table already exists.");
            return true;
        }
        else {
            const query = `CREATE TABLE additional_details(
                                id INT AUTO_INCREMENT PRIMARY KEY,
                                address VARCHAR(255) NOT NULL,
                                city VARCHAR(50),
                                state VARCHAR(50),
                                pin_code VARCHAR(10) NOT NULL,
                                country VARCHAR(50) NOT NULL,
                                gender ENUM('male', 'female', 'other'),
                                dob DATE,
                                user_id INT NOT NULL UNIQUE,
                                created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
                                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
                            );`;

            await connection.execute(query);
            console.log("Additional details table created successfully.");
        }
        return true;
    } catch (error) {
        console.error("Error creating additional details table:", error);
        return false;
    }
}

exports.createCategories = async (connection) => {
    try {
        const [rows] = await connection.execute(`SHOW TABLES LIKE 'categories';`);
        if (rows.length > 0) {
            console.log("Categories table already exists.");
            return true;
        }
        else {
            const query = `CREATE TABLE categories(
                                id INT PRIMARY KEY AUTO_INCREMENT,
                                category_name VARCHAR(100) NOT NULL UNIQUE,
                                categori_desc VARCHAR(500) NOT NULL,
                                parent_category INT DEFAULT NULL,
                                created_by INT NOT NULL,
                                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                FOREIGN KEY(parent_category) REFERENCES categories(id) ON DELETE CASCADE,
                                FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE CASCADE
                            );`;

            await connection.execute(query);
            console.log("Categories table created successfully.");
        }
        return true;
    } catch (error) {
        console.error("Error creating categories table:", error);
        return false;

    }
}

exports.createProductDetails = async (connection) => {
    try {
        const [rows] = await connection.execute(`SHOW TABLES LIKE 'product_details';`);
        if (rows.length > 0) {
            console.log("Products table already exists.");
            return true;
        } else {
            const query = `CREATE TABLE product_details(
                                id INT PRIMARY KEY AUTO_INCREMENT,
                                product_name VARCHAR(50) NOT NULL,
                                product_price DECIMAL(10,2) NOT NULL,
                                product_mrp DECIMAL(10,2),
                                created_by INT NOT NULL,
                                initial_quantity BIGINT NOT NULL,
                                current_stk BIGINT CHECK(current_stk >= 0),
                                will_be_available DATETIME,
                                category_id INT NOT NULL,
                                image VARCHAR(500),
                                prod_created_by INT,
                                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                FOREIGN KEY(prod_created_by) REFERENCES users(id) ON DELETE CASCADE,
                                FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE CASCADE
                            );`;

            await connection.execute(query);
            console.log("Product details table created successfully.");
        }
        return true;
    } catch (error) {
        console.error("Error creating products table:", error);
        return false;
    }
}

exports.createProductDescription = async (connection) => {
    try {
        const [rows] = await connection.execute(`SHOW TABLES LIKE 'product_description';`);
        if (rows.length > 0) {
            console.log("Product description table already exists.");
            return true;
        } else {
            const query = `CREATE TABLE product_description(
                                id INT PRIMARY KEY AUTO_INCREMENT,
                                product_id INT NOT NULL,
                                short_desc VARCHAR(160) NOT NULL,
                                medium_desc VARCHAR(500),
                                long_desc TEXT,
                                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                FOREIGN KEY(product_id) REFERENCES product_details(id) ON DELETE CASCADE
                            );`;

            await connection.execute(query);
            console.log("Product description table created successfully.");
        }
        return true;
    } catch (error) {
        console.error("Error creating product description table:", error);
        return false;
    }
}

exports.createProductProviderDetails = async (connection) => {
    try {
        const [rows] = await connection.execute(`SHOW TABLES LIKE 'product_provider_details';`);
        if (rows.length > 0) {
            console.log("Product images table already exists.");
            return true;
        } else {
            const query = `CREATE TABLE product_provider_details(
                                id INT PRIMARY KEY AUTO_INCREMENT,
                                public_id_type ENUM('aadhar', 'pan', 'voter','passport'),
                                public_id VARCHAR(255) NOT NULL UNIQUE,
                                unique_id VARCHAR(255) UNIQUE DEFAULT NULL,
                                user_id INT,
                                public_id_image VARCHAR(500) NOT NULL,
                                status ENUM('not_applied','applied','pending','verified','block') DEFAULT 'not_applied',
                                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
                            );`;

            await connection.execute(query);
            console.log("Product provider details table created successfully.");
        }
        return true;
    } catch (error) {
        console.error("Error creating product provider details table:", error);
        return false;
    }
}

exports.createOrders = async (connection) => {
    try {
        const [rows] = await connection.execute(`SHOW TABLES LIKE 'orders';`);
        if (rows.length > 0) {
            console.log("Orders table already exists.");
            return true;
        } else {
            const query = `CREATE TABLE orders(
                                id INT PRIMARY KEY AUTO_INCREMENT,
                                is_order_initiated BOOLEAN DEFAULT FALSE,
                                order_initiation_time DATETIME,
                                order_id VARCHAR(255),
                                user_id INT NOT NULL,
                                total_price DECIMAL(10,2),
                                payment_id INT,
                                quantity INT CHECK(quantity >= 0),
                                order_status ENUM('completed', 'pending', 'failed') DEFAULT 'pending',
                                order_completion_time DATETIME,
                                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
                                FOREIGN KEY(payment_id) REFERENCES payments(id) ON DELETE CASCADE
                            );`;
            await connection.execute(query);
            console.log("Orders table created successfully.");
        }
        return true;
    } catch (error) {
        console.error("Error creating orders table:", error);
        return false;
    }
}

exports.createOrderItems = async (connection) => {
    try {
        const [rows] = await connection.execute(`SHOW TABLES LIKE 'order_items';`);
        if (rows.length > 0) {
            console.log("Order items table already exists.");
            return true;
        } else {
            const query = `CREATE TABLE order_items(
                                id INT PRIMARY KEY AUTO_INCREMENT,
                                order_id INT,
                                product_id INT,
                                price DECIMAL(10,2),
                                quantity INT,
                                FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
                                FOREIGN KEY(product_id) REFERENCES product_details(id) ON DELETE CASCADE
                            );`;
            await connection.execute(query);
            console.log("Order items table created successfully.");
        }
        return true;
    } catch (error) {
        console.error("Error creating order items table:", error);
        return false;
    }
}


exports.createPayments = async (connection) => {
    try {
        const [rows] = await connection.execute(`SHOW TABLES LIKE 'payments';`);
        if (rows.length > 0) {
            console.log("Payments table already exists.");
            return true;
        } else {
            const query = `CREATE TABLE payments(
                                id INT PRIMARY KEY AUTO_INCREMENT,
                                payment_amount DECIMAL(10,2),
                                order_id INT,
                                is_payment_initiated BOOLEAN,
                                payment_initiate_time DATETIME,
                                payment_initiator_id INT,
                                is_verify_payment_initiated BOOLEAN,
                                verify_payment_initiation_time DATETIME,
                                razorpay_payment_id VARCHAR(255),
                                razorpay_order_id VARCHAR(255),
                                payment_complete BOOLEAN DEFAULT 0,
                                payment_completion_time DATETIME,
                                FOREIGN KEY(payment_initiator_id) REFERENCES users(id) ON DELETE CASCADE
                            );`;

            await connection.execute(query);
            console.log("Payments table created successfully.");
        }
        return true;
    } catch (error) {
        console.error("Error creating payments table:", error);
        return false;
    }
}

exports.customerReviewForProduct = async (connection) => {
    try {
        const [rows] = await connection.execute(`SHOW TABLES LIKE 'customer_review_for_product';`);
        if (rows.length > 0) {
            console.log("Customer review for product table already exists.");
            return true;
        } else {
            const query = `CREATE TABLE customer_review_for_product (
                                id INT PRIMARY KEY AUTO_INCREMENT,
                                rating DECIMAL(2,1) NOT NULL CHECK (rating BETWEEN 0 AND 5),
                                user_id INT NOT NULL,
                                product_id INT NOT NULL,
                                message TEXT NOT NULL,
                                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                FOREIGN KEY(product_id) REFERENCES product_details(id) ON DELETE CASCADE,
                                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
                                UNIQUE(user_id, product_id)
                            );`;

            await connection.execute(query);
            console.log("Customer review for product table created successfully.");
        }
        return true;
    } catch (error) {
        console.error("Error creating customer review for product table:", error);
        return false;
    }
}

exports.createCart = async (connection) => {
    try {
        const [rows] = await connection.execute(`SHOW TABLES LIKE 'cart';`);
        if (rows.length > 0) {
            console.log("Cart table already exists.");
            return true;
        } else {
            const query = `CREATE TABLE cart(
                                id INT PRIMARY KEY AUTO_INCREMENT,
                                user_id INT NOT NULL,
                                product_id INT NOT NULL,
                                quantity INT CHECK(quantity >= 0),
                                price_per_item DECIMAL(10,2),
                                total_price DECIMAL(10,2),
                                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                FOREIGN KEY(product_id) REFERENCES product_details(id) ON DELETE CASCADE,
                                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
                                UNIQUE (user_id, product_id)
                            );`;

            await connection.execute(query);
            console.log("Cart table created successfully.");
        }
        return true;
    } catch (error) {
        console.error("Error creating cart table:", error);
        return false;
    }
}

exports.createReviews = async (connection) => {
    try {
        const [rows] = await connection.execute(`SHOW TABLES LIKE 'reviews';`);
        if (rows.length > 0) {
            console.log("Reviews table already exists.");
            return true;
        } else {
            const query = `CREATE TABLE reviews(
                                id INT PRIMARY KEY AUTO_INCREMENT,
                                user_id INT,
                                product_id INT,
                                order_id INT,
                                email VARCHAR(250),
                                message TEXT,
                                rating DECIMAL(2,1) CHECK (rating BETWEEN 0 AND 5),
                                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL,
                                FOREIGN KEY(product_id) REFERENCES product_details(id) ON DELETE CASCADE,
                                FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
                            );`;
            await connection.execute(query);
            console.log("Reviews table created successfully.");
        }
        return true;
    } catch (error) {
        console.error("Error creating reviews table:", error);
        return false;
    }
}

exports.contactus = async (connection) => {
    try {
        const [rows] = await connection.execute(`SHOW TABLES LIKE 'contactus';`);
        if (rows.length > 0) {
            console.log("Contact us table already exists.");
            return true;
        } else {
            const query = `CREATE TABLE contactus (
                                id INT PRIMARY KEY AUTO_INCREMENT,
                                name VARCHAR(255) NOT NULL,
                                email VARCHAR(50) NOT NULL,
                                user_id INT,
                                message TEXT NOT NULL,
                                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
                            );`;
            await connection.execute(query);
            console.log("Contact us table created successfully.");
        }
        return true;
    } catch (error) {
        console.error("Error creating contact us table:", error);
        return false;
    }
}



