const connectCloudinary = require("../Utils/ClodinaryConnect");
const { createProductProviderDetails } = require("../Utils/CreateTable");
const dbConnect = require("../Utils/DBConnect");
const Connection = require("../Utils/DBConnect");
const { uploadFileToCloudinary } = require("../Utils/uploadFileToCloudinary");
const crypto = require("crypto");

exports.updateUserImage = async (req, res) => {
    try {
        console.log("Inside updateUserImage");
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const connection = await Connection();

        const [user] = await connection.execute(`SELECT * FROM users WHERE id = ?`, [userId]);
        if (user.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        console.log("User : ", JSON.stringify(user));

        if (!req.files || !req.files.image) {
            return res.status(400).json({
                success: false,
                message: "Image not found"
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
        const user_image = uploadedImage.secure_url;

        const [updateUser] = await connection.execute(
            `UPDATE Users SET image = ? WHERE id = ?`,
            [user_image, userId]
        );

        console.log("Update User : ", JSON.stringify(updateUser));
        if (updateUser.affectedRows === 0) {
            return res.status(500).json({
                success: false,
                message: "Image upload failed"
            });
        }

        console.log("User image updated successfully");
        return res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            data: {
                user_image
            }
        });


    } catch (error) {
        console.error("Error in updateUserImage:", error);
        return res.status(500).json({
            success: false,
            message: "Image upload failed"
        });
    }
};

exports.getUserDetails = async (req, res) => {
    try {
        console.log("Inside getUserDetails");
        const userId = req.query.userId;
        console.log("User ID : ", userId, typeof userId);
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const connection = await Connection();

        const query = `SELECT
                            u.id AS user_id,
                            u.firstName,
                            u.middleName,
                            u.lastName,
                            u.email,
                            u.mobileNo,
                            u.role,
                            u.image,
                            u.is_verified,
                            u.is_authorised,
                            u.created_at,
                            a.address,
                            a.city,
                            a.state,
                            a.pin_code,
                            a.country,
                            a.dob,
                            a.country_code
                        FROM users AS u
                        JOIN additional_details AS a ON u.id = a.user_id
                        WHERE u.id = ?;`;

        const [user] = await connection.execute(query, [userId]);
        if (user.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        console.log("User : ", JSON.stringify(user));

        return res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            data: user[0]
        });
    } catch (error) {
        console.error("Error in getUserDetails:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user details"
        });
    }
};

exports.updateUserDetails = async (req, res) => {
    try {
        console.log("Inside updateUserDetails");
        console.log("Request Body : ", req.body);
        const {
            userId, firstName, lastName, countryCode, phone,
            address, city, state, pinCode, country, gender, dob
        } = req.body;

        console.log("User ID : ", userId, typeof userId);

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }
        const connection = await Connection();

        const userQuery = `UPDATE users SET firstName = ?, lastName = ?, mobileNo = ? WHERE id = ?`;

        const [updateUser] = await connection.execute(userQuery, [firstName, lastName, phone, userId]);
        if (updateUser.affectedRows === 0) {
            return res.status(500).json({
                success: false,
                message: "Failed to update user details"
            });
        }

        console.log("updateUser : ", JSON.stringify(updateUser));

        const query = `UPDATE additional_details SET address = ?, city = ?, state = ?, pin_code = ?, country = ?, gender = ?, dob = ?, country_code = ? WHERE user_id = ?`;
        const [updateUserDetails] = await connection.execute(query, [address, city, state, pinCode, country, gender, dob, countryCode, userId]);
        if (updateUserDetails.affectedRows === 0) {
            return res.status(500).json({
                success: false,
                message: "Failed to update user details"
            });
        }

        console.log("updateUserDetails : ", JSON.stringify(updateUserDetails));

        console.log("User details updated successfully");

        return res.status(200).json({
            success: true,
            message: "User details updated successfully",
        });

    } catch (error) {
        console.error("Error in updateUserDetails:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update user details"
        });
    }
};

exports.verifyUser = async (req, res) => {
    let connection
    try {

        console.log("INSIDE VERIFY USER ....");
        const pool = await Connection(); // Returns pool.promise()
        connection = await pool.getConnection(); // Acquire a connection

        const isProviderTableExsist = await createProductProviderDetails(connection);
        if (!isProviderTableExsist) {
            console.log("Error in creating Product Provider table");
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }

        const {
            email,
            id_card_number,
            card_type,
            date_of_birth,
            is_adult,
            user_id
        } = req.body;

        if (!email || !id_card_number || !card_type || !date_of_birth || !is_adult || !user_id) {
            return res.status(400).json({
                success: false,
                message: "Invalid input",
            });
        }
        let unique_id = crypto.randomUUID();
        console.log("unique_id : " + unique_id);
        unique_id = unique_id + user_id;
        console.log("unique_id new : " + unique_id);
        const [user] = await connection.execute(`SELECT * FROM users WHERE email = ?`, [email]);
        if (user.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Email is not registered",
            });
        }
        console.log("User : ", JSON.stringify(user));

        const db_user_id = user[0].id;
        if (String(db_user_id) !== String(user_id)) {
            return res.status(400).json({
                success: false,
                message: "User is not present",
            });
        }

        console.log("user id matched : ", db_user_id, user_id);

        if (user[0].is_authorised === 1) {
            return res.status(400).json({
                success: false,
                message: "User is already verified",
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

        const image = req.files.card_image;
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
        const public_id_card_image = uploadedImage.secure_url;

        console.log("product_image : " + public_id_card_image);

        const status = 'applied';
        const query = `INSERT INTO product_provider_details (public_id_type, public_id, unique_id, user_id, public_id_image, status) VALUES (?, ?, ?, ?, ?, ?)`;
        const [providerData] = await connection.execute(query, [card_type, id_card_number, unique_id, user_id, public_id_card_image, status]);

        if (providerData.affectedRows === 0) {
            return res.status(500).json({
                success: false,
                message: "Failed to verify user",
            });
        }
        console.log("Provider Data : ", JSON.stringify(providerData));

        return res.status(200).json({
            success: false,
            message: "User applied for verification successfully"
        })

    } catch (error) {
        console.log("Error in verifyUser", error);
        return res.status(500).json({
            success: false,
            message: "Failed to verify user"
        });
    }
}

exports.isUserVerified = async (req, res) => {
    let connection;
    try {

        console.log("Inside isUserVerified");

        const pool = await dbConnect();
        connection = await pool.getConnection();

        const { userId } = req.query;

        console.log("User ID : ", userId, typeof userId);

        if (!userId) {
            console.log("User id is not present");
            return res.status(401).json({
                success: false,
                message: "User id is not present"
            })
        };

        const userQuery = `SELECT 
                            u.*,
                            p.*
                        FROM users AS u
                        JOIN product_provider_details AS p ON u.id = p.user_id
                        WHERE u.is_verified = ? AND u.is_authorised = ? AND p.status = 'verified';
                        `;

        const [userResponse] = await connection.execute(userQuery, [1, 1, userId]);

        if (userResponse.length === 0) {
            console.log("User is not verified");
            return res.status(200).json({
                success: false,
                message: "User is not verified",
                data: {
                    is_verified: false
                }
            })
        }
        console.log("User is verified : ", JSON.stringify(userResponse));
        return res.status(200).json({
            success: true,
            message: "User is verified",
            data: {
                is_verified: true
            }
        });

    } catch (error) {
        console.log("Error in find is user is verified : " + error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}
