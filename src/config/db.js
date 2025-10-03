import pkg from "pg";
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config();

// console.log(process.env.DB_USER);
// console.log(process.env.DB_HOST);
// console.log(process.env.DB_NAME);
// console.log(process.env.DB_PASSWORD);
// console.log(process.env.DB_PORT);
// console.log(process.env.SCHEMA_NAME);

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    schema: process.env.SCHEMA_NAME || 'public', // Default to 'public' if not set
});

pool.connect()
    .then(client => {
        console.log("Connected to the database");
        client.release();
    })
    .catch(err => {
        console.error("Database connection failed:", err);
    });

export default pool;
