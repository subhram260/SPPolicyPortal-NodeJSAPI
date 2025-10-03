import pool from "../config/db.js";

const createAllTables = async () => {
  try {
    console.log('Creating database schema and tables...');
    
    // Create the schema first
    await pool.query('CREATE SCHEMA IF NOT EXISTS spp;');

    // 1. Master Tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS spp.Users (
          user_id SERIAL PRIMARY KEY,
          user_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS spp.Financers (
          financer_id SERIAL PRIMARY KEY,
          financer_name VARCHAR(255) NOT NULL UNIQUE,
          created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS spp.FinancerRequests (
          request_id SERIAL PRIMARY KEY,
          financer_name VARCHAR(255) NOT NULL,
          requested_by_user_id INT NOT NULL,
          status VARCHAR(50) DEFAULT 'Pending',
          approved_by_user_id INT NULL,
          requested_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
          approved_at TIMESTAMP WITHOUT TIME ZONE NULL,
          rejection_reason TEXT NULL,
          FOREIGN KEY (requested_by_user_id) REFERENCES spp.Users(user_id),
          FOREIGN KEY (approved_by_user_id) REFERENCES spp.Users(user_id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS spp.VehicleMaster (
          make_model_id SERIAL PRIMARY KEY,
          manufacturer VARCHAR(255) NOT NULL,
          model VARCHAR(255) NOT NULL,
          variant VARCHAR(255) NOT NULL,
          vehicle_category VARCHAR(50),
          UNIQUE (manufacturer, model, variant)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS spp.PincodeMaster (
          pincode_id SERIAL PRIMARY KEY,
          pincode VARCHAR(10) UNIQUE NOT NULL,
          city VARCHAR(100) NOT NULL,
          state VARCHAR(100) NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS spp.AddonMaster (
          addon_master_id SERIAL PRIMARY KEY,
          addon_name VARCHAR(255) NOT NULL UNIQUE
      );
    `);

    // 2. Core Transactional Tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS spp.Policies (
          policy_id SERIAL PRIMARY KEY,
          user_id INT NOT NULL,
          policy_type VARCHAR(255),
          risk_start_date DATE,
          tp_expiry_date DATE,
          od_expiry_date DATE,
          status VARCHAR(50),
          insurer_id INT,
          premium_amount DECIMAL(15, 2),
          is_new_vehicle BOOLEAN NOT NULL,
          previous_policy_expired_status VARCHAR(50),
          has_previous_claim BOOLEAN,
          previous_ncb INT,
          is_hypothecated BOOLEAN NOT NULL,
          created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
          FOREIGN KEY (user_id) REFERENCES spp.Users(user_id),
          FOREIGN KEY (insurer_id) REFERENCES spp.Financers(financer_id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS spp.Vehicles (
          vehicle_id SERIAL PRIMARY KEY,
          policy_id INT UNIQUE NOT NULL,
          registration_type VARCHAR(50),
          registration_no VARCHAR(255) UNIQUE,
          registration_date DATE,
          engine_no VARCHAR(255) UNIQUE,
          chassis_no VARCHAR(255) UNIQUE,
          make_model_id INT,
          manufacturing_year INT,
          ex_showroom_price DECIMAL(15, 2),
          idv DECIMAL(15, 2),
          rto_id INT,
          cc INT,
          has_reg_number BOOLEAN NOT NULL,
          created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
          FOREIGN KEY (policy_id) REFERENCES spp.Policies(policy_id),
          FOREIGN KEY (make_model_id) REFERENCES spp.VehicleMaster(make_model_id),
          FOREIGN KEY (rto_id) REFERENCES spp.PincodeMaster(pincode_id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS spp.PolicyAddons (
          policy_addon_id SERIAL PRIMARY KEY,
          policy_id INT NOT NULL,
          addon_master_id INT NOT NULL,
          is_included BOOLEAN,
          FOREIGN KEY (policy_id) REFERENCES spp.Policies(policy_id),
          FOREIGN KEY (addon_master_id) REFERENCES spp.AddonMaster(addon_master_id),
          UNIQUE (policy_id, addon_master_id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS spp.Customers (
          customer_id SERIAL PRIMARY KEY,
          user_id INT NOT NULL,
          customer_type VARCHAR(50) NOT NULL,
          customer_name VARCHAR(255),
          company_name VARCHAR(255),
          dob DATE,
          date_of_inc DATE,
          mobile_number VARCHAR(20),
          email VARCHAR(255),
          gstin VARCHAR(15),
          address_line1 VARCHAR(255),
          address_line2 VARCHAR(255),
          address_line3 VARCHAR(255),
          pincode_id INT,
          created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
          FOREIGN KEY (user_id) REFERENCES spp.Users(user_id),
          FOREIGN KEY (pincode_id) REFERENCES spp.PincodeMaster(pincode_id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS spp.Nominees (
          nominee_id SERIAL PRIMARY KEY,
          policy_id INT NOT NULL,
          nominee_name VARCHAR(255),
          relation VARCHAR(100),
          age INT,
          gender VARCHAR(50),
          created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
          FOREIGN KEY (policy_id) REFERENCES spp.Policies(policy_id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS spp.WalletTransactions (
          transaction_id SERIAL PRIMARY KEY,
          user_id INT NOT NULL,
          transaction_date TIMESTAMP WITHOUT TIME ZONE,
          payment_mode VARCHAR(50),
          amount DECIMAL(10, 2),
          status VARCHAR(50),
          transaction_ref_no VARCHAR(255) UNIQUE NOT NULL,
          payment_proof_file VARCHAR(255),
          created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
          FOREIGN KEY (user_id) REFERENCES spp.Users(user_id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS spp.Tickets (
          ticket_id SERIAL PRIMARY KEY,
          ticket_type VARCHAR(100) NOT NULL,
          status VARCHAR(50),
          user_id INT NOT NULL,
          policy_id INT,
          description TEXT,
          created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
          FOREIGN KEY (user_id) REFERENCES spp.Users(user_id),
          FOREIGN KEY (policy_id) REFERENCES spp.Policies(policy_id)
      );
    `);

    console.log('All tables created successfully!');
    
  } catch (err) {
    console.error('Error creating tables:', err);
  }
};

export { createAllTables };