import pool from "../config/db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const register = async (Name, Email, Password, Role, Location, Phone, Status) => {
    // Check for existing user
    const existingUser = await pool.query('SELECT * FROM spp."Dealers" WHERE "Email" = $1', [Email]);
    if (existingUser.rows.length > 0) {
        // Throw an error that the controller can catch
        const error = new Error('User with this email already exists');
        error.statusCode = 400;
        throw error;
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);

    // Insert new user into the database
    const result = await pool.query(
        `INSERT INTO spp."Dealers"("Name", "Email", "Password", "Role", "Location", "Phone", "Status")
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [Name, Email.toLowerCase(), hashedPassword, Role, Location, Phone, Status]
    );

    return result.rows[0];
};

const login = async (Email, Password) => {
    const result = await pool.query('SELECT * FROM spp."Dealers" WHERE LOWER("Email") = LOWER($1)', [Email]);
    if (result.rows.length === 0) {
        const error = new Error('Invalid credentials1');
        error.statusCode = 400;
        throw error;
    }

    const user = result.rows[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(Password, user.Password); // Note: It's user.Password (PascalCase) from DB
    if (!isMatch) {
        const error = new Error('Invalid credentials2');
        error.statusCode = 400;
        throw error;
    }

    // Create JWT payload with correct column names (PascalCase from your DB schema)
    const payload = {
        userDetails: {
            id: user.ID,
            name: user.Name,
            email: user.Email,
            role: user.Role,
            location: user.Location,
            status: user.Status
        },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token, userDetails: payload.userDetails }; // Return token and user details
};

export {
    register,
    login,
};