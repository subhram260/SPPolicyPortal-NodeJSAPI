import pool from "../config/db.js";

const createFinancer = async (data) => {
    const { name } = data;
    const result = await pool.query(
        "INSERT INTO SPP.Financers (financer_name) VALUES ($1) RETURNING *",
        [name]
    );
    return result.rows[0];
};

const getAllFinancers = async () => {
    const result = await pool.query("SELECT * FROM SPP.Financers");
    return result.rows;
};

const getFinancerById = async (id) => {
    const result = await pool.query("SELECT * FROM SPP.Financers WHERE financer_id = $1", [id]);
    return result.rows[0];
};

export { createFinancer, getAllFinancers, getFinancerById };
