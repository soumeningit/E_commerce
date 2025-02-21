const Connection = require('../Utils/DBConnect');
const cloudinaryConnect = require('../Utils/ClodinaryConnect');
const { uploadFileToCloudinary } = require('../Utils/uploadFileToCloudinary');
require('dotenv').config();

// make entry of product vendor
exports.createProductVendor = async (req, res) => {
    try {
        console.log("INSIDE CREATE PRODUCT VENDOR ....");
        console.log("req.body : " + JSON.stringify(req.body));
        const connection = await Connection();
        // check if table exist or not
        const [isTableExist] = await connection.execute(`SHOW TABLES LIKE 'Product_Provider_Details'`);
        if (isTableExist.length === 0) {
            const [providerTable] = await connection.execute(
                `CREATE TABLE Product_Provider_Details(
                    public_id_type ENUM('aadhar_card', 'pan_card', 'voter_card'),
                    public_id VARCHAR(255) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    contact_no VARCHAR(14) NOT NULL,
                    address VARCHAR(255) NOT NULL,
                    image_url text
                );`
            )
            if (providerTable.affectedRows === 0) {
                return res.status(500).json({
                    success: false,
                    message: "Internal server error"
                });
            }
            console.log("Table created successfully");
        }

        console.log("Table already exist");

        const { public_id_type, public_id, name, email, contact_no, address } = req.body;
        if (!public_id_type || !public_id || !name || !email || !contact_no || !address) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const user = await connection.execute(`
        SELECT * FROM USERS WHERE email = ?`, [email]);
        if (user.length === 0) {
            return res.status(400).json({
                success: false,
                message: "User not exist"
            });
        }

        console.log("User : " + JSON.stringify(user));
        const userID = user[0][0].user_id;
        console.log("User ID: " + userID);
        // check if email already exist or not
        const [isEmailExsist] = await connection.execute(`
            SELECT email FROM Product_Provider_Details WHERE email = ?`, [email]
        );
        if (isEmailExsist.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email already exist"
            });
        }

        console.log("Email not exist");

        // check public_id exsist or not
        const [isPublicIdExsist] = await connection.execute(`
            SELECT public_id FROM Product_Provider_Details WHERE public_id = ?`, [public_id]
        );

        if (isPublicIdExsist.length > 0) {
            return res.status(400).json({
                success: false,
                message: "User already exist"
            });
        }

        console.log("Public id not exist");

        // upload image to cloudinary
        const image = req.files.public_id_image;
        // compress image
        console.log("image:" + image);
        let image_url;
        if (image) {
            if (image.size > 1000000) {
                return res.status(400).json({
                    success: false,
                    message: "Image size should be less than 1MB"
                });
            }
            try {
                cloudinaryConnect();
            } catch (error) {
                console.log("Error in connect to cloudinary: ", error);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error"
                });

            }
            const folder = process.env.CLOUD_FOLDER;
            const height = 500;
            const quality = "auto:low";
            const uploadedImage = await uploadFileToCloudinary(image, folder, height, quality);
            if (!uploadedImage) {
                return res.status(500).json({
                    success: false,
                    message: "Image upload failed"
                });
            }
            console.log("Image upload response to cloudinary: ", uploadedImage);
            image_url = uploadedImage.secure_url;
        }

        console.log("Image url: " + image_url);
        const status = "pending";

        // insert data into table
        const [insertData] = await connection.execute(`
            INSERT INTO Product_Provider_Details(public_id_type, public_id, name, email, contact_no, address, status, image_url, user_id)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`, [public_id_type, public_id, name, email, contact_no, address, status, image_url, userID]
        );

        if (insertData.affectedRows === 0) {
            console.log("Error in insert data into table");
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product vendor data send to admin for approval"
        });


    } catch (error) {
        console.log("Error in make entry of product vendor: " + JSON.stringify(error));
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


