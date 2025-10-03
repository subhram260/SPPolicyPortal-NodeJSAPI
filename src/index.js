import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';
import errorHandler from './middlewares/errorHandeler.js';
import Router from './routes/Routes.js';
import { createAllTables } from './data/createTables.js';




dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cors());

//Routes
app.use('/api',Router);



//Testing PostgreSQL Connection
app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT current_database()');
        res.json({ message: 'Database connection successful', database: result.rows[0].current_database });
    } catch (err) {
        console.error('Database query failed:', err);
        res.status(500).send('Error connecting to the database.');
    }
});

//Error Handeling Middleware
app.use(errorHandler);


//Create Table
// createAllTables();

//Server Running
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



