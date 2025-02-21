const cloudinary = require('cloudinary').v2
require('dotenv').config()

const connectCloudinary = async (file) => {
    try {
        const response = cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_SECRET_KEY
        });
        console.log("Connected to Cloudinary" + response);
    } catch (error) {
        console.log("Error in uploadToCloudinary", error);
    }
};

module.exports = connectCloudinary;