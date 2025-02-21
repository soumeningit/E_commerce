const Connection = require("../Utils/DBConnect");


exports.getVendors = async (req, res) => {
    try {
        console.log("INSIDE GET VENDORS ....");
        const connection = await Connection();
        const [vendors] = await connection.execute(`
            SELECT * FROM Product_Provider_Details;
        `);
        if (vendors.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No vendors found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Vendors found",
            data: vendors
        });
    } catch (error) {
        console.log(`Error in getVendors ${error}`);
        return res.status(501).json({
            success: false,
            message: "Internal server error"
        })
    }
};

exports.verifiedVendor = async (req, res) => {
    try {
        console.log("INSIDE VERIFIED VENDOR ....");
        console.log("req.body : " + JSON.stringify(req.body));

        const { email, status, role } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }
        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required"
            });
        }
        const connection = await Connection();

        const [vendorDetails] = await connection.execute(`
            SELECT * FROM Product_Provider_Details WHERE email = ?`, [email]
        );
        if (vendorDetails.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }
        console.log("Vendor details : " + JSON.stringify(vendorDetails));

        const [vendor] = await connection.execute(`
            UPDATE Product_Provider_Details SET status = ? WHERE email = ?; `, [status, email]
        );

        if (vendor.affectedRows === 0) {
            console.log("Vendor status not updated");
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }

        console.log("vendor : " + JSON.stringify(vendor));

        const [updateUser] = await connection.execute(`
            UPDATE USERS SET role = ? WHERE user_id = ?; `, [role, vendorDetails[0].user_id]
        );

        if (updateUser.affectedRows === 0) {
            console.log("User role not updated");
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }

        console.log("updateUser : " + JSON.stringify(updateUser));

        return res.status(200).json({
            success: true,
            message: "Vendor verified successfully"
        });

    } catch (error) {
        console.log(`Error verfied vendor ${error}`);
        return res.status(501).json({
            success: false,
            message: "Internal server error"
        })
    }
};
