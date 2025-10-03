import pool from "../config/db.js";

const getAllDealers = async () => {
    const query = 'SELECT "dealer_id","Name","Email","Password","Location","Phone","Role","Status" FROM spp."Dealers"';
    const result = await pool.query(query);
    return result.rows;
};

const getDealerById = async (id) => {
    const query = 'SELECT "dealer_id","Name","Email","Password","Location","Phone","Role","Status" FROM spp."Dealers" WHERE "dealer_id" = $1';
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// const createDealer = async (data) => {
//     const { name, location } = data;
//     const query = 'INSERT INTO spp.Dealers (Name, Location) VALUES ($1, $2) RETURNING *';
//     const values = [name, location];
//     const result = await pool.query(query, values);
//     return result.rows[0];
// };

export {
    getAllDealers,
    getDealerById
//     createDealer
};