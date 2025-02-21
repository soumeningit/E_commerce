const Connection = require('../Utils/DBConnect');


exports.getProductsDetailsByUser = async (req, res) => {
    try {
        console.log("INSIDE GET PRODUCTS DETAILS BY USER ....");

        console.log("Request Query : " + JSON.stringify(req.query));
        const connection = await Connection();
        const id = req.query.id;
        console.log("ID : " + id);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Please provide id"
            });
        }
        const [user] = await connection.execute(
            `SELECT * FROM users WHERE user_id = ?`,
            [id]
        );
        if (!user.length) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        console.log("User Details : " + JSON.stringify(user));

        const [provider_details] = await connection.execute(
            `SELECT * FROM Product_Provider_Details WHERE user_id = ?`, [id]
        );
        if (provider_details.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Provider details not found"
            });
        }

        console.log("Provider Details : " + JSON.stringify(provider_details));

        const [rows] = await connection.execute(
            `SELECT * FROM products WHERE provider_id = ?`,
            [provider_details[0].public_id]
        );
        if (rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No products found"
            });
        }
        console.log("Products Details : " + JSON.stringify(rows));
        return res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.log("Error in getProductsDetailsByUser : " + error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
}
exports.getTableStructure = async (req, res) => {
    try {
        const connection = Connection();
        const [rows] = await connection.execute('DESC employee');
        console.log("Table Structure : " + rows);
        return res.status(200).json({
            success: true,
            data: rows
        });

    } catch (error) {
        console.log("Error in getTableStructure : " + error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.updateTableStructure = async (req, res) => {
    try {
        const connection = Connection();
        const { col, value } = req.body;
        if (!col) {
            return res.status(400).json({
                success: false,
                message: "Please provide column name"
            });
        }
        const [rows] = await connection.execute(
            `ALTER TABLE employee ADD ${col} VARCHAR(255) ${value}`
        )
        console.log("Table Structure : " + rows);
        return res.status(200).json({
            success: true,
            message: "Column added successfully"
        });

    } catch (error) {
        console.log("Error in updateTableStructure : " + error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

exports.getAllUserDetails = async (req, res) => {
    try {
        const connection = Connection();
        const [rows] = await connection.execute('SELECT * FROM employee');
        return res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.log("Error in getUserDetails : " + error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


exports.createUser = async (req, res) => {
    try {
        console.log("INSIDE CREATE USER ....");
        console.log("Request Body : " + JSON.stringify(req.body));
        const connection = Connection();
        const { name, id, age, department, city, salary, email } = req.body;
        if (!name || !id || !age || !department || !email) {
            return res.status(400).json({
                success: false,
                message: "Please provide all details"
            });
        }
        // Check user already exists
        const [user] = await connection.execute(`SELECT * FROM employee WHERE id='${id}'`);
        if (user.length) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        console.log("User not exists, creating user ....");

        const [rows] = await connection.execute(
            `INSERT INTO employee (id, name, age, department, city, salary, email) VALUES 
            (?, ?, ?, ?, ?, ?, ?)`,
            [id, name, age, department, city, salary, email]
        );

        console.log("User created : " + JSON.stringify(rows));
        if (!rows.affectedRows) {
            return res.status(400).json({
                success: false,
                message: "User Creation Failed"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User Created Successfully"
        });
    } catch (error) {
        console.log("Error in createUser : " + error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

exports.getUserDetails = async (req, res) => {
    try {
        console.log("INSIDE GET USER DETAILS ....");
        console.log("Request Body : " + JSON.stringify(req.body));
        const connection = Connection();
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Please provide id"
            });
        }
        const [userDetails] = await connection.execute(
            `SELECT * FROM employee WHERE id = ?`,
            [id]
        );
        if (!userDetails.length) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }
        console.log("User Details : " + JSON.stringify(userDetails));
        return res.status(200).json({
            success: true,
            data: userDetails
        });
    } catch (error) {
        console.log("Error in getUserDetails : " + error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

exports.updateUser = async (req, res) => {
    try {
        console.log("INSIDE UPDATE USER ....");
        const { id, name, email } = req.body;
        const connection = Connection();
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Please provide id"
            });
        }
        const [user] = await connection.execute(
            `SELECT * FROM employee WHERE id = ?`,
            [id]
        );

        if (!user.length) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        const [updatedUser] = await connection.execute(
            `UPDATE employee SET name = ?, email = ? WHERE id = ?`,
            [name, email, id]
        );

        if (!updatedUser.affectedRows) {
            return res.status(400).json({
                success: false,
                message: "User updation failed"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User updated successfully"
        });

    } catch (error) {
        console.log("Error in updateUser : " + error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        console.log("INSIDE DELETE USER ....");
        const { id } = req.body;
        const connection = Connection();
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Please provide id"
            });
        }
        const [user] = await connection.execute(
            `SELECT * FROM employee WHERE id = ?`,
            [id]
        );

        if (!user.length) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        const [deletedUser] = await connection.execute(
            `DELETE FROM employee WHERE id = ?`,
            [id]
        );

        if (!deletedUser.affectedRows) {
            return res.status(400).json({
                success: false,
                message: "User deletion failed"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        console.log("Error in deleteUser : " + error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};