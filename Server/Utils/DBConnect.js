// const mysql = require("mysql2");
// require("dotenv").config();

// const dbConnect = async () => {
//     try {
//         // Validate environment variables
//         const requiredEnvVars = ["DB_HOST", "DATABASE_USER", "DATABASE_PASSWORD", "DATABASE_NAME"];
//         const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
//         if (missingVars.length > 0) {
//             throw new Error(`Missing environment variables: ${missingVars.join(", ")}`);
//         }

//         const tempConnection = mysql.createConnection({
//             host: process.env.DB_HOST,
//             user: process.env.DATABASE_USER,
//             password: process.env.DATABASE_PASSWORD,
//         }).promise();


//         try {
//             await tempConnection.end();
//         } catch (error) {
//             console.error("Error closing temporary connection: ", error);
//         }

//         const pool = mysql.createPool({
//             host: process.env.DB_HOST,
//             user: process.env.DATABASE_USER,
//             database: process.env.DATABASE_NAME,
//             password: process.env.DATABASE_PASSWORD,
//             port: process.env.DB_PORT || 3306,
//             waitForConnections: true,
//             connectionLimit: 10,
//             maxIdle: 10,
//             idleTimeout: 60000,
//             queueLimit: 0,
//             enableKeepAlive: true,
//             keepAliveInitialDelay: 0,
//         });

//         return pool.promise();
//     } catch (error) {
//         console.error("Error in DBConnect: ", error);
//         throw error;
//     }
// };

// module.exports = dbConnect;

const mysql = require("mysql2");
require("dotenv").config();

const dbConnect = async () => {
    try {
        // Validate environment variables
        const requiredEnvVars = ["DB_HOST", "DATABASE_USER", "DATABASE_PASSWORD", "DATABASE_NAME"];
        const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
        if (missingVars.length > 0) {
            throw new Error(`Missing environment variables: ${missingVars.join(", ")}`);
        }

        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            port: process.env.DB_PORT || 3306,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            enableKeepAlive: true,
        });

        console.log("✅ MySQL pool created successfully");
        return pool.promise();

    } catch (error) {
        console.error("❌ Failed to connect to MySQL:", error);
        throw error;
    }
};

module.exports = dbConnect;
