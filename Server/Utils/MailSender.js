const nodemailer = require("nodemailer");
require('dotenv').config();

const mailSender = async (email, title, body) => {
    try {
        console.log("Inside Mail Sender");
        console.log("Email : " + email);
        console.log("Title : " + title);
        console.log("Body : " + body);
        console.log(process.env.MAIL_HOST, process.env.MAIL_USER, process.env.MAIL_PASSKEY);
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587,
            secure: false, // true for port 465, false for other ports
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSKEY,
            },
        });

        const info = await transporter.sendMail({
            from: 'Soumen', // sender address
            to: `${email}`, // list of receivers
            subject: `${title}`, // Subject line
            text: "Check It!", // plain text body
            html: `${body}`, // html body
        });

        console.log("INFO :" + JSON.stringify(info));

        let data = {
            success: true,
            message: "Mail send successfully"
        }

        return data;

    } catch (error) {
        console.log("Mail Can't Be Send Right Now" + error);
        let data = {
            success: false,
            message: "Mail Can't Be Send Right Now"
        }
        return data;
    }
}

module.exports = mailSender;