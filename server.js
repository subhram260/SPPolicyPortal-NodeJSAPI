// // server.js
// const express = require('express');
// const sql = require('mssql');
// const cors = require('cors');

// const app = express();
// const port = 3000;

// const dbConfig = {
//     server: '(localdb)\\MSSQLLocalDB', 
//     database: 'BidhanPolicyPortal',
//     options: {
//         trustedConnection: true,
//     }
// };

// app.use(cors());
// app.use(express.json());

// // Financers endpoint
// app.get('/api/financers', async (req, res) => {
//     let pool;
//     try {
//         pool = await sql.connect(dbConfig);
//         let result = await pool.request().query('SELECT FinancerName FROM Financers');
//         const financers = result.recordset.map(record => record.FinancerName);
//         res.json(financers);
//     } catch (err) {
//         console.error('Database query failed:', err);
//         res.status(500).send('Error connecting to the database.');
//     } finally {
//         if (pool) {
//             sql.close(); // Ensure the connection is closed
//         }
//     }
// });

// // Submit data endpoint
// app.post('/api/policies', async (req, res) => {
//     try {
//         const formData = req.body;
//         // Your SQL INSERT logic goes here
//         console.log('Received form data:', formData);
//         res.status(200).json({ message: 'Data received and processed.' });
//     } catch (err) {
//         console.error('Data insertion failed:', err);
//         res.status(500).send('Error processing data.');
//     }
// });

// app.listen(port, () => {
//     console.log(`Backend API running on http://localhost:${port}`);
// });