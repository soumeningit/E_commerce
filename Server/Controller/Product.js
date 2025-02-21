const Connection = require("../Utils/DBConnect");
const connectCloudinary = require('../Utils/ClodinaryConnect');
const crypto = require('crypto');
const { uploadFileToCloudinary } = require("../Utils/uploadFileToCloudinary");

exports.createProduct = async (req, res) => {
    try {
        console.log("INSIDE CREATE PRODUCT ....");
        console.log("Request Body : ", req.body);
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Invalid input"
            });
        }

        const connection = await Connection();
        const [user] = await connection.execute(`SELECT * FROM  USERS WHERE email = ?`, [email]);
        if (user.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        console.log("User : ", JSON.stringify(user));
        const status = "verified";
        const [userDetails] = await connection.execute(`SELECT * FROM Product_Provider_Details WHERE email = ? AND status = ?`, [email, status]);
        if (userDetails.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not verified"
            });
        }

        console.log("User Details : ", JSON.stringify(userDetails));

        const product_id = crypto.randomBytes(10).toString('hex');
        console.log("product_id : " + product_id);

        const [isTable] = await connection.execute(`SHOW TABLES LIKE 'Products'`);
        console.log("isTable : ", JSON.stringify(isTable));
        if (isTable.length === 0) {
            console.log("Table not found");
            console.log("Creating table Products");
            const response = await connection.execute(
                `CREATE TABLE Products (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    product_id VARCHAR(255) UNIQUE NOT NULL,
                    product_name VARCHAR(255) NOT NULL UNIQUE,
                    quantity BIGINT DEFAULT 0,
                    stocks BIGINT,
                    description TEXT DEFAULT NULL,
                    product_image TEXT,
                    product_cost_price INT NOT NULL,
                    product_mrp INT NOT NULL,
                    entry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    category_id INT,
                    provider_id VARCHAR(255),
                    FOREIGN KEY(category_id) REFERENCES Categories(id) ON DELETE CASCADE,
                    FOREIGN KEY(provider_id) REFERENCES Product_Provider_Details(public_id) ON DELETE CASCADE
                );`
            )
            if (response) {
                console.log("Table Products created successfully");
            }
        }

        const { product_name, quantity, description, product_cost_price, product_mrp, category_id } = req.body;
        if (!product_name || !quantity || !product_cost_price || !product_mrp || !category_id) {
            return res.status(400).json({
                success: false,
                message: "Invalid input"
            });
        }

        if (quantity <= 0 || product_cost_price <= 0 || product_mrp <= 0) {
            return res.status(400).json({
                success: false,
                message: "Value should be greater than 0"
            });
        }

        try {
            connectCloudinary();
        } catch (error) {
            console.log("Error in connectCloudinary", error);
            return res.status(500).json({
                success: false,
                message: "Image upload failed"
            });
        }

        console.log("Request Files : ", req.files);

        const image = req.files.image;
        console.log("Image : ", image);
        if (!image) {
            return res.status(400).json({
                success: false,
                message: "Image not found"
            });
        }
        if (image.size > 1000000) {
            return res.status(400).json({
                success: false,
                message: "Image size should be less than 1MB"
            });
        }

        const height = 500;
        const quality = "auto:low";
        const uploadedImage = await uploadFileToCloudinary(image, process.env.CLOUD_FOLDER, height, quality);
        if (!uploadedImage) {
            return res.status(500).json({
                success: false,
                message: "Image upload failed"
            });
        }

        console.log("Image upload response to cloudinary: ", uploadedImage);
        const product_image = uploadedImage.secure_url;

        const [product] = await connection.execute(
            `INSERT INTO Products (product_id, product_name, quantity, description, product_image, product_cost_price, product_mrp, category_id, provider_id, stocks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [product_id, product_name, quantity, description, product_image, product_cost_price, product_mrp, category_id, userDetails[0].public_id, quantity]
        );

        if (product.affectedRows === 0) {
            console.log("Error in insert data into products table");
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product created successfully"
        });

    } catch (error) {
        console.log(`Error in Product.js -> createProduct: ${error}`);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
};

exports.getProducts = async (req, res) => {
    try {
        const connection = await Connection();
        const [products] = await connection.execute(`SELECT * FROM Products`);
        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Products not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Products found successfully",
            data: products
        });
    } catch (error) {
        console.log(`Error in getProducts: ${error}`);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

exports.searchProduct = async (req, res) => {
    try {
        console.log("INSIDE SERACH PRODICT ....");
        const { searchItem } = req.body;
        if (!searchItem) {
            console.log("Search Keyword is missing");
            return res.status(400).json({
                success: false,
                message: "Data Missing"
            })
        }
        const connection = await Connection();
        const [products] = await connection.execute(`SELECT * FROM Products WHERE product_name LIKE ?`, [`%${searchItem}%`]);
        console.log("Products : " + JSON.stringify(products));
        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Data not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Data Get Successfully",
            products
        });
    } catch (error) {
        console.log("Error in Search Product : " + error);
        return res.status(400).json({
            success: false,
            message: "Item not found"
        })
    }
}