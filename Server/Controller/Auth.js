const Connection = require('../Utils/DBConnect');
const otpGenerator = require('otp-generator');
const mailSender = require('../Utils/MailSender');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.sendOTP = async (req, res) => {
    try {
        const { aadharId, email, firstName, lastName } = req.body;
        if (!email || !firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing"
            })
        }

        const otp = otpGenerator.generate(4, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });
        console.log("OTP : " + otp);

        const connection = await Connection();
        const [rows] = await connection.execute('SHOW TABLES LIKE "OTP"');
        if (rows.length === 0) {
            await connection.execute(
                `CREATE TABLE OTP(
                otp VARCHAR(10) NOT NULL,
                ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                expiresAt TIMESTAMP DEFAULT (now() + interval 15 minute),
                email VARCHAR(100) NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`);
        }
        const [otpData] = await connection.execute(
            `INSERT INTO OTP(email, otp)
            VALUES(?, ?)`,
            [email, otp]
        );

        if (!otpData.affectedRows) {
            return res.status(400).json({
                success: false,
                message: "OTP Save in Database Failed"
            })
        }

        console.log("OTP Data : " + JSON.stringify(otpData));

        const latestOTP = await connection.execute(
            `SELECT * FROM OTP WHERE email = ? ORDER BY ID DESC LIMIT 1`,
            [email]
        );

        console.log("Latest OTP : " + JSON.stringify(latestOTP));

        const title = "OTP Verification";
        const body = `<h1>Dear ${firstName} ${lastName}</h1>
        <h2>Your OTP is ${otp}</h2>
        <h3>For Verification</h3>`;

        const mailInfo = await mailSender(email, title, body);
        console.log("Mail Info : " + JSON.stringify(mailInfo));
        if (mailInfo.success === false) {
            return res.status(400).json({
                success: false,
                message: "OTP Sent Failed"
            })
        }

        return res.status(200).json({
            success: true,
            message: "OTP Sent Successfully"
        });
    } catch (error) {
        console.log("Error in Send OTP" + error);
        return res.status(500).json({
            success: false,
            message: "OTP Sent Failed"
        })
    }
};

exports.signUp = async (req, res) => {
    try {
        console.log("INSIDE SIGN UP CONTROLLER ....");
        console.log("REQ BODY : " + JSON.stringify(req.body));

        const { firstName, middleName = '', lastName, email, password, mobileNumber, otp, address, role, countryCode } = req.body;

        if (!firstName || !email || !password || !mobileNumber || !otp || !address || !role || !countryCode) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing"
            })
        };

        const connection = await Connection();
        if (!connection) {
            return res.status(500).json({
                success: false,
                message: "Database connection failed"
            });
        }

        const [rows] = await connection.execute("SHOW TABLES LIKE 'users'");
        if (rows.length === 0) {
            const user = await connection.execute(`CREATE TABLE users (
                    user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    firstName VARCHAR(255) NOT NULL,
                    middleName VARCHAR(100) DEFAULT NULL,
                    lastName VARCHAR(255) DEFAULT NULL,
                    email VARCHAR(100) UNIQUE DEFAULT NULL,
                    password VARCHAR(255) NOT NULL,
                    aadharId VARCHAR(20),
                    mobileNo VARCHAR(14) NOT NULL,
                    reset_password_token VARCHAR(255) DEFAULT NULL,
                    address VARCHAR(255) NOT NULL,
                    role ENUM('customer', 'employee', 'admin') DEFAULT NULL,
                    country_code VARCHAR(50) DEFAULT NULL,
                    cart BOOLEAN DEFAULT false,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );`
            );
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "User Table Creation Failed"
                })
            }
            console.log("User Table Created");
        }

        const [user] = await connection.execute(
            "SELECT * FROM Users WHERE email = ?",
            [email]
        );

        if (user.length) {
            return res.status(404).json({
                success: false,
                message: "User already exsist"
            })
        };

        console.log("User Data : " + JSON.stringify(user));

        // Check OTP which user send and OTP which is saved in Database recently
        const [otpData] = await connection.execute(
            "SELECT * FROM OTP WHERE email = ? ORDER BY ID DESC LIMIT 1",
            [email]
        );

        // Check OTP time is not expired
        if (otpData[0].expiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP is Expired"
            })
        }

        if (!otpData.length) {
            return res.status(404).json({
                success: false,
                message: "OTP not found"
            })
        };

        console.log("OTP Data : " + JSON.stringify(otpData));

        if (otpData[0].otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "OTP is Incorrect"
            })
        };

        const hashPassword = await bcrypt.hash(password, 10);

        const [userData] = await connection.execute(
            "INSERT INTO users (firstName, middleName, lastName, email, password, mobileNo, address, role, country_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [firstName, middleName, lastName, email, hashPassword, mobileNumber, address, role, countryCode]
        );

        if (!userData.affectedRows) {
            return res.status(400).json({
                success: false,
                message: "Sign Up failed"
            })
        }

        console.log("User Data : " + JSON.stringify(userData));

        return res.status(200).json({
            success: true,
            message: "User Signed Up"
        });

    } catch (error) {
        console.log("Error in Sign Up" + error);
        return res.status(500).json({
            success: false,
            message: "Sign up failed"
        })
    }
};

exports.logIn = async (req, res) => {
    try {
        console.log("INSIDE LOG IN CONTROLLER ....");
        console.log("REQ BODY : " + JSON.stringify(req.body));

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing"
            })
        };

        const connection = await Connection();

        const [user] = await connection.execute(
            "SELECT * FROM Users WHERE email = ?",
            [email]
        );

        if (!user.length) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        };

        console.log("User Data : " + JSON.stringify(user));

        const isPasswordMatch = await bcrypt.compare(password, user[0].password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Password is Incorrect"
            })
        }

        const payload = {
            id: user[0].user_id,
            email: user[0].email,
            role: user[0].role,
            phone: user[0].phone
        }

        const user_data = {
            id: user[0].user_id,
            email: user[0].email,
        }

        console.log("user_id : " + user[0].user_id);

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1day' });

        return res
            .cookie("token", token, {
                httponly: true
            })
            .status(200)
            .json({
                success: true,
                message: "Log In Successfully",
                token: token,
                user_data: user_data
            });

    } catch (error) {
        console.log("Error in Log In" + error);
        return res.status(500).json({
            success: false,
            message: "Log In failed"
        });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        console.log("INSIDE UPDATE PASSWORD CONTROLLER ....");
        console.log("REQ BODY : " + JSON.stringify(req.body));

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing"
            })
        }
        const connection = Connection();
        const [user] = await connection.execute(
            "SELECT * FROM Users WHERE email=?",
            [email]
        );
        if (!user.length) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        console.log("User Data : " + JSON.stringify(user));
        const hashPassword = await bcrypt.hash(password, 10);
        const [updatedPassword] = await connection.execute(
            "UPDATE Users SET password=? WHERE email=?",
            [hashPassword, email]
        );
        if (!updatedPassword.affectedRows) {
            return res.status(400).json({
                success: false,
                message: "Password updation failed"
            })
        }
        console.log("Updated Password : " + JSON.stringify(updatedPassword));
        return res.status(200).json({
            success: true,
            message: "Password Updated Successfully"
        });

    } catch (error) {
        console.log("Error in Update Password" + error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
};

exports.sendForgetPasswordToken = async (req, res) => {
    try {
        console.log("INSIDE SEND FORGET PASSWORD TOKEN CONTROLLER ....");
        console.log("REQ BODY : " + JSON.stringify(req.body));

        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please provide email"
            });
        }
        console.log("Email : " + email);
        const connection = await Connection();
        const [user] = await connection.execute(
            `SELECT * FROM Users WHERE email=?`,
            [email]
        );
        if (user.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        console.log("User Data : " + JSON.stringify(user));

        const token = crypto.randomBytes(20).toString('hex');
        console.log("Token : " + token);

        const [forgetPasswordToken] = await connection.execute(
            "UPDATE USERS SET reset_password_token = ? WHERE email = ?",
            [token, email]
        );
        if (!forgetPasswordToken.affectedRows) {
            return res.status(400).json({
                success: false,
                message: "Forget Password Token Update Failed"
            });
        };
        console.log("Forget Password Token : " + JSON.stringify(forgetPasswordToken));
        const URL = `http://localhost:5173/reset-password/${token}`;
        const title = "Forget Password";
        const body = `<h1>Dear User</h1>
        <h2>Please click on below link to reset your password</h2>
        <a href="${URL}">Click Here</a>`;
        const mailInfo = await mailSender(email, title, body);
        console.log("Mail Info : " + JSON.stringify(mailInfo));
        if (mailInfo.success === false) {
            return res.status(400).json({
                success: false,
                message: "Forget Password Token Sent Failed"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Forget Password Token Sent Successfully"
        });

    } catch (error) {
        console.log("Error in Send Forget Password Token" + error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        console.log("INSIDE FORGOT PASSWORD CONTROLLER ....");
        console.log("REQ BODY : " + JSON.stringify(req.body));

        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide token and password"
            });
        }
        console.log("Token : " + token);
        console.log("Password : " + password);
        const connection = await Connection();
        const [user] = await connection.execute(
            "SELECT * FROM Users WHERE reset_password_token=?",
            [token]
        );
        if (!user.length) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        console.log("User Data : " + JSON.stringify(user));
        const hashPassword = await bcrypt.hash(password, 10);
        console.log("Hash Password : " + hashPassword);
        const [updatedPassword] = await connection.execute(
            "UPDATE Users SET password = ? WHERE reset_password_token = ?",
            [hashPassword, token]
        );
        if (!updatedPassword.affectedRows) {
            return res.status(400).json({
                success: false,
                message: "Password updation failed"
            });
        }
        console.log("Updated Password : " + JSON.stringify(updatedPassword));
        return res.status(200).json({
            success: true,
            message: "Password Updated Successfully"
        });
    } catch (error) {
        console.log("Error in Forgot Password" + error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};