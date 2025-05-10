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

        const tempConnection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
        }).promise();

        const [rows] = await tempConnection.execute(
            "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?",
            [process.env.DATABASE_NAME]
        );
        if (rows.length === 0) {
            await tempConnection.execute(`CREATE DATABASE ??`, [process.env.DATABASE_NAME]);
        } else {
            console.log("Database already exists");
        }
        try {
            await tempConnection.end();
        } catch (error) {
            console.error("Error closing temporary connection: ", error);
        }

        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DATABASE_USER,
            database: process.env.DATABASE_NAME,
            password: process.env.DATABASE_PASSWORD,
            waitForConnections: true,
            connectionLimit: 10,
            maxIdle: 10,
            idleTimeout: 60000,
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0,
        });

        return pool.promise();
    } catch (error) {
        console.error("Error in DBConnect: ", error);
        throw error;
    }
};

module.exports = dbConnect;