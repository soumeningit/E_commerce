const Connection = require("../Utils/DBConnect");
const connectCloudinary = require('../Utils/ClodinaryConnect');
const { uploadFileToCloudinary } = require("../Utils/uploadFileToCloudinary");
const { createProductDetails, createProductDescription } = require("../Utils/CreateTable");
const dbConnect = require("../Utils/DBConnect");

exports.createProduct = async (req, res) => {
    let connection;
    try {
        console.log("INSIDE CREATE PRODUCT ....");

        console.log("Request Body : ", req.body);
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Invalid input",
            });
        }

        const pool = await Connection(); // Returns pool.promise()
        connection = await pool.getConnection(); // Acquire a connection

        const isProductTableExsist = await createProductDetails(connection);
        if (!isProductTableExsist) {
            console.log("Error in creating Product table");
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }

        const isProductDescriptionTableExsist = await createProductDescription(connection);
        if (!isProductDescriptionTableExsist) {
            console.log("Error in creating Product Description table");
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }

        const [user] = await connection.execute(`SELECT * FROM users WHERE id = ?`, [userId]);
        if (user.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        console.log("User : ", JSON.stringify(user));

        const [userDetails] = await connection.execute(
            `SELECT * FROM users WHERE id = ? AND is_verified = ? AND is_authorised = ?`,
            [userId, 1, 1]
        );
        if (userDetails.length === 0) {
            return res.status(401).json({
                success: false,
                message: "User not verified",
            });
        }

        console.log("User Details : ", JSON.stringify(userDetails));

        const {
            productName,
            productPrice,
            productMRP = productPrice,
            shortDescription,
            mediumDescription,
            longDescription = null,
            categoryId,
            quantity,
            availableFrom,
        } = req.body;

        if (
            !productName ||
            !productPrice ||
            !shortDescription ||
            !mediumDescription ||
            !categoryId ||
            !availableFrom
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid input",
            });
        }

        try {
            connectCloudinary();
        } catch (error) {
            console.log("Error in connectCloudinary", error);
            return res.status(500).json({
                success: false,
                message: "Image upload failed",
            });
        }

        console.log("Request Files : ", req.files);

        const image = req.files.image;
        console.log("Image : ", image);
        if (!image) {
            return res.status(400).json({
                success: false,
                message: "Image not found",
            });
        }
        if (image.size > 1000000) {
            return res.status(400).json({
                success: false,
                message: "Image size should be less than 1MB",
            });
        }

        const height = 500;
        const quality = "auto:low";
        const uploadedImage = await uploadFileToCloudinary(image, process.env.CLOUD_FOLDER, height, quality);
        if (!uploadedImage) {
            return res.status(500).json({
                success: false,
                message: "Image upload failed",
            });
        }

        console.log("Image upload response to cloudinary: ", uploadedImage);
        const product_image = uploadedImage.secure_url;

        console.log("product_image : " + product_image);

        const [product] = await connection.execute(
            `INSERT INTO product_details (product_name, product_price, product_mrp, created_by, initial_quantity, current_stk, will_be_available, category_id, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [productName, productPrice, productMRP, userId, quantity, quantity, availableFrom, categoryId, product_image]
        );

        if (product.affectedRows === 0) {
            console.log("Error in insert data into products table");
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }

        const product_id = product.insertId;
        console.log("product_id : " + product_id);

        const query = `INSERT INTO product_description (product_id, short_desc, medium_desc, long_desc) VALUES (?, ?, ?, ?)`;
        const [productDescription] = await connection.execute(query, [
            product_id,
            shortDescription,
            mediumDescription,
            longDescription,
        ]);
        if (productDescription.affectedRows === 0) {
            console.log("Error in insert data into product_description table");
            const [rows] = await connection.execute(`DELETE FROM product_details WHERE id = ?`, [product_id]); // Fixed SQL syntax
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product created successfully",
        });
    } catch (error) {
        console.log(`Error in Product.js -> createProduct: ${error}`);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    } finally {
        if (connection) {
            connection.release(); // Built-in method for pooled connections
        }
    }
};

exports.getProducts = async (req, res) => {
    try {
        console.log("INSIDE GET PRODUCT ....");
        const pool = await dbConnect();
        const connection = await pool.getConnection();

        const query = `
                    SELECT
                        p.id AS product_id,
                        p.product_name,
                        p.product_mrp,
                        p.created_by,
                        p.category_id,
                        p.image AS product_image,
                        pd.id AS product_description_id,
                        pd.short_desc,
                        pd.medium_desc,
                        pd.long_desc,
                        u.firstName,
                        u.lastName,
                        u.email,
                        u.image AS user_image,
                        c.category_name,
                        categori_desc
                    FROM product_details AS p
                    JOIN product_description AS pd ON p.id = pd.product_id
                    JOIN categories AS c ON c.id = p.category_id
                    JOIN users AS u ON p.created_by = u.id;`;

        const [products] = await connection.execute(query);
        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Products not found"
            })
        }

        console.log("Products : " + JSON.stringify(products));

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
    let connection;
    try {
        console.log("INSIDE SERACH PRODICT ....");
        const { searchItem } = req.query;
        console.log("Search Item : " + searchItem);
        if (!searchItem) {
            console.log("Search Keyword is missing");
            return res.status(400).json({
                success: false,
                message: "Data Missing"
            })
        }

        const pool = await dbConnect();
        connection = await pool.getConnection();
        const searchQuery = `
                            SELECT 
                                p.id AS product_id,
                                p.product_name,
                                p.product_price,
                                p.product_mrp,
                                p.image,
                                d.short_desc,
                                d.medium_desc,
                                d.long_desc,
                                c.category_name
                            FROM product_details p
                            JOIN product_description d ON p.id = d.product_id
                            JOIN categories c ON p.category_id = c.id
                            WHERE 
                                p.product_name LIKE ?
                                OR d.short_desc LIKE ?
                                OR d.medium_desc LIKE ?
                                OR d.long_desc LIKE ?
                                OR c.category_name LIKE ?`;

        const searchTerm = `%${searchItem}%`;

        const [products] = await connection.execute(searchQuery,
            [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm]
        );
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
            data: products
        });
    } catch (error) {
        console.log("Error in Search Product : " + error);
        return res.status(400).json({
            success: false,
            message: "Item not found"
        })
    }
}

exports.getProductById = async (req, res) => {
    console.log("INSIDE GET PRODUCT BY ID ....");
    let connection;
    try {
        const { userId } = req.query;
        console.log("userid : " + userId);
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Invalid input",
            });
        }
        const pool = await dbConnect()
        connection = await pool.getConnection(); // Acquire a connection
        const query = `SELECT
                        p.id AS product_id,
                        p.product_name,
                        p.product_price,
                        p.product_mrp,
                        p.initial_quantity,
                        p.current_stk,
                        category_id,
                        p.image AS product_image,
                        p.created_at AS creation_time,
                        pd.id AS product_description_id,
                        pd.short_desc,
                        pd.medium_desc,
                        pd.long_desc
                    FROM product_details AS p
                    JOIN product_description AS pd ON p.id = pd.product_id
                    WHERE p.created_by = ?;`;
        const [product] = await connection.execute(query, [userId]);
        if (product.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Product found successfully",
            data: product
        });
    } catch (error) {
        console.log(`Error in getProductById: ${error}`);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

exports.getParticularProductDetails = async (req, res) => {
    let connection;
    try {
        console.log("INSIDE GET PRODUCT DETALS BY ID ....");
        const { id } = req.query;
        console.log("Product Id : " + id);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Invalid input",
            });
        }

        const pool = await dbConnect();
        connection = await pool.getConnection();

        const query =
            `SELECT
                    p.id AS product_id,
                    p.product_name,
                    p.product_price,
                    p.product_mrp,
                    p.initial_quantity,
                    p.current_stk,
                    p.category_id,
                    p.image AS product_image,
                    p.created_at AS creation_time,
                    c.category_name,
                    c.categori_desc,
                    c.parent_category,
                    pd.id AS product_description_id,
                    pd.short_desc,
                    pd.medium_desc,
                    pd.long_desc,
                    u.id AS seller_id,
                    u.firstName,
                    u.lastName,
                    u.email
            FROM product_details AS p
            JOIN categories AS C ON p.category_id = c.id
            JOIN product_description AS pd ON pd.product_id = p.id
            JOIN users AS u ON u.id = p.created_by
            WHERE p.id = ?;`

        const [product] = await connection.execute(query, [id]);
        if (product.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Product found successfully",
            data: product
        });

    } catch (error) {
        console.log(`Error in getParticularProductDetails: ${error}`);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

exports.getReviews = async (req, res) => {
    try {
        const { productId } = req.query;
        console.log("Product Id : " + productId);
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Invalid input",
            });
        }
        const pool = await dbConnect();
        const connection = await pool.getConnection();

        const query = `SELECT 
                            r.id AS review_id,
                            r.user_id AS review_created_by,
                            r.order_id,
                            r.email,
                            r.message,
                            r.rating,
                            r.created_at,
                            u.firstName,
                            u.lastName,
                            u.email,
                            u.image,
                            u.is_verified
                        FROM reviews AS r
                        JOIN users AS u ON u.id = r.user_id
                        WHERE r.product_id = ?;`;

        const [reviews] = await connection.execute(query, [productId]);
        if (reviews.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Reviews not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Reviews found successfully",
            data: reviews
        });

    } catch (error) {
        console.log(`Error in getReviews: ${error}`);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}