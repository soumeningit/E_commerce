const Connection = require('../Utils/DBConnect');
const otpGenerator = require('otp-generator');
const mailSender = require('../Utils/MailSender');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { createUsers, createAdditionalDetails, createTokens, createOTP } = require('../Utils/CreateTable');

exports.sendOTP = async (req, res) => {
    try {
        console.log("INSIDE SEND OTP CONTROLLER ....");
        const connection = await Connection();
        if (!connection) {
            return res.status(500).json({
                success: false,
                message: "Database connection failed"
            });
        }
        let isOTPTableExsist = await createOTP(connection);
        console.log("Is OTP Table Exsist : " + isOTPTableExsist);
        if (!isOTPTableExsist) {
            return res.status(500).json({
                success: false,
                message: "OTP table creation failed"
            });
        }
        console.log("Is OTP Table Exsist : " + isOTPTableExsist);

        const { email, firstName, lastName } = req.body;
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

        const [otpData] = await connection.execute(
            `INSERT INTO otp(email, otp, createdAt, expiresAt)
            VALUES(?, ?, ?, ?)`,
            [email, otp, new Date(), new Date(Date.now() + 10 * 60 * 1000)]
        );

        if (!otpData.affectedRows) {
            return res.status(400).json({
                success: false,
                message: "OTP Save in Database Failed"
            })
        }

        console.log("OTP Data : " + JSON.stringify(otpData));

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

        const connection = await Connection();
        if (!connection) {
            return res.status(500).json({
                success: false,
                message: "Database connection failed"
            });
        }
        const isUserTableExsist = await createUsers(connection);
        if (!isUserTableExsist) {
            return res.status(500).json({
                success: false,
                message: "Users table creation failed"
            });
        }

        const isAdditionalTableExsist = await createAdditionalDetails(connection);
        if (!isAdditionalTableExsist) {
            return res.status(500).json({
                success: false,
                message: "Additional table creation failed"
            });
        }

        const isTokenTableExsist = await createTokens(connection);

        if (!isTokenTableExsist) {
            return res.status(500).json({
                success: false,
                message: "Token table creation failed"
            });
        }

        const {
            firstName,
            middleName = '',
            lastName,
            email,
            password,
            mobileNumber,
            otp, address,
            country, pinCode,
            countryCode
        } = req.body;

        if (!firstName || !email || !password || !mobileNumber || !otp || !address || !country || !pinCode) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing"
            })
        };

        const [user] = await connection.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        console.log("User Data : " + JSON.stringify(user));

        if (user.length > 0) {
            return res.status(404).json({

                success: false,
                message: "User already exsist"
            })
        };

        console.log("User Data : " + JSON.stringify(user));

        // Check OTP which user send and OTP which is saved in Database recently
        const [otpData] = await connection.execute(
            "SELECT * FROM otp WHERE email = ? ORDER BY id DESC LIMIT 1",
            [email]
        );

        console.log("OTP Data : " + JSON.stringify(otpData));

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

        const is_verified = true;

        const [userData] = await connection.execute(
            "INSERT INTO users (firstName, middleName, lastName, email, password, mobileNo, is_verified, country_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [firstName, middleName, lastName, email, hashPassword, mobileNumber, is_verified, countryCode]
        );

        if (!userData.affectedRows) {
            return res.status(400).json({
                success: false,
                message: "Sign Up failed"
            })
        }

        console.log("User Data : " + JSON.stringify(userData));

        const userId = userData.insertId;
        console.log("User ID : " + userId);

        const [additionalData] = await connection.execute(
            "INSERT INTO additional_details (user_id, address, pin_code, country, country_code) VALUES (?, ?, ?, ?, ?)",
            [userId, address, pinCode, country, countryCode]
        );

        if (!additionalData.affectedRows) {
            return res.status(400).json({
                success: false,
                message: "Additional Details Sign Up failed"
            })
        }

        console.log("Additional Data : " + JSON.stringify(additionalData));

        const [tokenData] = await connection.execute(
            "INSERT INTO tokens (user_id, reset_password_token) VALUES (?, ?)",
            [userId, null]
        );

        if (!tokenData.affectedRows) {
            return res.status(400).json({
                success: false,
                message: "Sign Up failed"
            })
        }

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
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        console.log("user : " + JSON.stringify(user));

        if (user.length === 0) {
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
            id: user[0].id,
            email: user[0].email,
            role: user[0].role,
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

        if (!isTokenTableExsist) {
            return res.status(500).json({
                success: false,
                message: "Token table creation failed"
            });
        }

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing"
            })
        }

        const connection = await Connection();

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
            "UPDATE users SET password=? WHERE email=?",
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

        const connection = await Connection();
        if (!connection) {
            return res.status(500).json({
                success: false,
                message: "Database connection failed"
            });
        }

        console.log("Email : " + email);
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

        const user_id = user[0].id;
        console.log("User ID : " + user_id);

        const token = crypto.randomBytes(20).toString('hex');
        console.log("Token : " + token);

        const [forgetPasswordToken] = await connection.execute(
            "UPDATE tokens SET reset_password_token = ? WHERE user_id = ?",
            [token, user_id]
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
            "SELECT * FROM tokens WHERE reset_password_token=?",
            [token]
        );
        if (!user.length) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        console.log("User Data : " + JSON.stringify(user));

        const user_id = user[0].id;
        console.log("User ID : " + user_id);

        const hashPassword = await bcrypt.hash(password, 10);
        console.log("Hash Password : " + hashPassword);
        const [updatedPassword] = await connection.execute(
            "UPDATE users SET password = ? WHERE id = ?",
            [hashPassword, user_id]
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