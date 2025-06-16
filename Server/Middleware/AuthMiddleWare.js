const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.auth = async (req, res, next) => {
    try {
        console.log("INSIDE AUTH MIDDLEWARE");
        console.log("req.body : " + JSON.stringify(req.body));
        console.log("req.cookies : " + JSON.stringify(req.cookies));
        console.log("req.header : " + JSON.stringify(req.headers));
        const token = req.body.token
            || req.cookies['token']
            || (req.header("Authorization") ? req.header("Authorization").replace("Bearer ", "") : null);

        console.log("token inside auth middleware : " + token);
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing"
            });
        }
        // if token is present then verify the token
        try {
            const verifiedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = verifiedToken;
            next();
        } catch (error) {
            console.log("Error in token verification auth middleware : ", error)
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        };
    } catch (error) {
        console.log("Error in Auth Middleware", error);
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }
}

exports.isCustomer = async (req, res, next) => {
    try {
        const role = req.user.role;
        if (role != "customer") {
            return res.status(401).json({
                success: false,
                message: "Unauthorized, this route is only for customers"
            });
        };
        next();
    } catch (error) {
        console.log("Error in isCustomer Middleware", error);
        return res.status(401).json({
            success: false,
            message: "Unauthorized, this route is only for customers"
        });
    }
};

exports.isEmployee = async (req, res, next) => {
    try {
        console.log("req.role : " + JSON.stringify(req.user));
        const role = req.user.role;
        console.log("role : " + role);
        if (role != "employee") {
            return res.status(401).json({
                success: false,
                message: "Unauthorized, this route is only for employees"
            });
        };
        next();
    } catch (error) {
        console.log("Error in isEmployee Middleware", error);
        return res.status(401).json({
            success: false,
            message: "Unauthorized, this route is only for employees"
        });
    }
};

exports.isAdmin = async (req, res, next) => {
    try {
        console.log("INSIDE ADMIN MIDDLEWARE");
        const role = req.user.role;
        console.log("role : " + role);
        if (role != "admin") {
            return res.status(401).json({
                success: false,
                message: "Unauthorized, this route is only for admin"
            });
        };
        next();
    } catch (error) {
        console.log("Error in isAdmin Middleware", error);
        return res.status(401).json({
            success: false,
            message: "Unauthorized, this route is only for admin"
        });
    }
};

exports.isVendor = async (req, res, next) => {
    try {
        console.log("INSIDE VENDOR MIDDLEWARE");
        const role = req.user.role;
        console.log("role : " + role);
        if (role != "vendor") {
            return res.status(401).json({
                success: false,
                message: "Unauthorized, this route is only for vendors"
            });
        };
        next();
    } catch (error) {
        console.log("Error in isVendor Middleware", error);
        return res.status(401).json({
            success: false,
            message: "Unauthorized, this route is only for vendors"
        });
    }
};

exports.isUser = async (req, res, next) => {
    try {
        console.log("INSIDE VENDOR MIDDLEWARE");
        const role = req.user.role;
        console.log("role : " + role);
        if (role != "user") {
            return res.status(401).json({
                success: false,
                message: "Unauthorized, this route is only for users"
            });
        };
        next();
    } catch (error) {
        console.log("Error in isUser Middleware", error);
        return res.status(401).json({
            success: false,
            message: "Unauthorized, this route is only for vendors"
        });
    }
};

