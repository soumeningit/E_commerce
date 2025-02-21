const Connection = require('../Utils/DBConnect');
exports.createEmploy = async (req, res) => {
    try {
        console.log("INSIDE CREATE EMPLOYEE ....");
        const connection = Connection();

    } catch (error) {
        console.log("Error in createEmploy : " + error);
        return res.status(500).json({
            success: false,
            message: "Failed create employee entry"
        });
    }
};