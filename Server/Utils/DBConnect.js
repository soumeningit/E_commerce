const mysql = require('mysql2');
require('dotenv').config();

const dbConnect = async () => {
    try {
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
            await tempConnection.execute(`CREATE DATABASE ${process.env.DATABASE_NAME}`);
        } else {
            console.log("Database already exists");
        }
        tempConnection.end();

        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DATABASE_USER,
            database: process.env.DATABASE_NAME,
            password: process.env.DATABASE_PASSWORD,
            waitForConnections: true,
            connectionLimit: 10,
            maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
            idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0,
        });

        return pool.promise();
    } catch (error) {
        console.log("Error in DBConnect: ", error);
    }
}

module.exports = dbConnect;