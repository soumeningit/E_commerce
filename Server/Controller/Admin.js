const Connection = require("../Utils/DBConnect");


exports.getPendingUsers = async (req, res) => {

    let connection;
    try {
        console.log("INSIDE VERIFY USER ....");

        const pool = await Connection();
        connection = await pool.getConnection();

        const query = `
                    SELECT
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
                        ppd.status AS user_status,
                        ppd.public_id_type,
                        ppd.public_id,
                        ppd.unique_id,
                        ppd.public_id_image
                    FROM users AS u
                    JOIN additional_details AS a ON u.id = a.user_id
                    JOIN product_provider_details AS ppd ON u.id = ppd.user_id
                    WHERE u.role != ? AND u.is_verified = ? AND u.is_authorised = ? AND ppd.status = ?;`;
        const [users] = await connection.execute(query, ["admin", true, false, "applied"]);

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No users found"
            });
        }
        console.log("users : " + JSON.stringify(users));
        return res.status(200).json({
            success: true,
            message: "Vendors found",
            data: users
        });
    } catch (error) {
        console.log(`Error in getVendors ${error}`);
        return res.status(501).json({
            success: false,
            message: "Internal server error"
        })
    }
};

exports.verifyUser = async (req, res) => {
    let connection;
    try {
        console.log("INSIDE VERIFY USER ....");

        const pool = await Connection();
        connection = await pool.getConnection();

        console.log("req.body : ", req.body);

        const users = req.body.userId;
        console.log("Users : ", users);

        if (!Array.isArray(users) || users.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No users provided"
            });
        }

        for (let userId of users) {
            const [userDetails] = await connection.execute(
                `SELECT * FROM product_provider_details WHERE user_id = ?`,
                [userId]
            );

            if (userDetails.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: `User ID ${userId} not found`
                });
            }

            const status = userDetails[0].status;

            if (status === "verified") {
                return res.status(400).json({
                    success: false,
                    message: `User ID ${userId} is already verified`
                });
            }

            const [userData] = await connection.execute(
                `UPDATE users SET is_verified = ?, is_authorised = ?, role = ? WHERE id = ?`,
                [1, 1, "vendor", userId]
            );

            if (userData.affectedRows === 0) {
                return res.status(500).json({
                    success: false,
                    message: `Failed to update user ID ${userId}`
                });
            }

            const [vendorData] = await connection.execute(
                `UPDATE product_provider_details SET status = ? WHERE user_id = ?`,
                ["verified", userId]
            );

            if (vendorData.affectedRows === 0) {
                return res.status(500).json({
                    success: false,
                    message: `Failed to update vendor status for user ID ${userId}`
                });
            }
        }

        return res.status(200).json({
            success: true,
            message: "All users verified successfully"
        });

    } catch (error) {
        console.error("Error verifying users:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    } finally {
        if (connection) connection.release();
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        console.log("INSIDE GET ALL USERS ....");
        const connection = await Connection();

        const query = `
                    SELECT
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
                        a.dob
                    FROM users AS u
                    JOIN additional_details AS a ON u.id = a.user_id
                    WHERE u.role != 'admin' AND u.is_verified = true;`;

        const [users] = await connection.execute(query);
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No users found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Users found",
            data: users
        });
    } catch (error) {
        console.log(`Error in getAllUsers ${error}`);
        return res.status(501).json({
            success: false,
            message: "Internal server error"
        })
    }
}

exports.blockUser = async (req, res) => {
    try {
        console.log("INSIDE BLOCK USER ....");
        const connection = await Connection();

        const id = req.params;
        console.log("id : " + JSON.stringify(id));
        const userId = id.id;
        console.log("userId : " + userId);
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }
        const [user] = await connection.execute(`
            UPDATE users SET is_verified = false WHERE id = ?; `, [userId]
        );
        if (user.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "User blocked successfully"
        });
    } catch (error) {
        console.log(`Error in blockUser ${error}`);
        return res.status(501).json({
            success: false,
            message: "Internal server error"
        })
    }
}

exports.getAllBlockedUsers = async (req, res) => {
    try {
        console.log("INSIDE GET ALL USERS ....");
        const connection = await Connection();

        const query = `
                    SELECT
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
                        a.dob
                    FROM users AS u
                    JOIN additional_details AS a ON u.id = a.user_id
                    WHERE u.role != 'admin' AND u.is_verified = false;`;

        const [users] = await connection.execute(query);
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No users found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Users found",
            data: users
        });
    } catch (error) {
        console.log(`Error in getAllUsers ${error}`);
        return res.status(501).json({
            success: false,
            message: "Internal server error"
        })
    }
}

exports.unBlockUser = async (req, res) => {
    try {
        console.log("INSIDE BLOCK USER ....");
        const connection = await Connection();

        const id = req.params;
        console.log("id : " + JSON.stringify(id));
        const userId = id.id;
        console.log("userId : " + userId);
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }
        const [user] = await connection.execute(`
            UPDATE users SET is_verified = true WHERE id = ?; `, [userId]
        );
        if (user.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "User un-blocked successfully"
        });
    } catch (error) {
        console.log(`Error in un-blockUser ${error}`);
        return res.status(501).json({
            success: false,
            message: "Internal server error"
        })
    }
}
