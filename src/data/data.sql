-- Create the Users table for user login information
CREATE TABLE IF NOT EXISTS Users (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Create the Financers table for the master list of all approved financers
CREATE TABLE IF NOT EXISTS Financers (
    financer_id SERIAL PRIMARY KEY,
    financer_name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Create the FinancerRequests table to handle new financer requests
CREATE TABLE IF NOT EXISTS FinancerRequests (
    request_id SERIAL PRIMARY KEY,
    financer_name VARCHAR(255) NOT NULL,
    requested_by_user_id INT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    approved_by_user_id INT NULL,
    requested_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITHOUT TIME ZONE NULL,
    rejection_reason TEXT NULL,
    FOREIGN KEY (requested_by_user_id) REFERENCES Users(user_id),
    FOREIGN KEY (approved_by_user_id) REFERENCES Users(user_id)
);

-- Create a master table for Vehicle Make/Model/Variant and category
CREATE TABLE IF NOT EXISTS VehicleMaster (
    make_model_id SERIAL PRIMARY KEY,
    manufacturer VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    variant VARCHAR(255) NOT NULL,
    vehicle_category VARCHAR(50),
    UNIQUE (manufacturer, model, variant)
);

-- Create a master table for Pincode, City, and State for autofill
CREATE TABLE IF NOT EXISTS PincodeMaster (
    pincode_id SERIAL PRIMARY KEY,
    pincode VARCHAR(10) UNIQUE NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL
);

-- Create a master table for Addons
CREATE TABLE IF NOT EXISTS AddonMaster (
    addon_master_id SERIAL PRIMARY KEY,
    addon_name VARCHAR(255) NOT NULL UNIQUE
);


-- Create the Policies table to store core policy details
CREATE TABLE IF NOT EXISTS Policies (
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
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (insurer_id) REFERENCES Financers(financer_id)
);

-- Create the Vehicles table for vehicle-specific information
CREATE TABLE IF NOT EXISTS Vehicles (
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
    FOREIGN KEY (policy_id) REFERENCES Policies(policy_id),
    FOREIGN KEY (make_model_id) REFERENCES VehicleMaster(make_model_id),
    FOREIGN KEY (rto_id) REFERENCES PincodeMaster(pincode_id)
);

-- Create the Addons table to link addons to policies
CREATE TABLE IF NOT EXISTS PolicyAddons (
    policy_addon_id SERIAL PRIMARY KEY,
    policy_id INT NOT NULL,
    addon_master_id INT NOT NULL,
    is_included BOOLEAN,
    FOREIGN KEY (policy_id) REFERENCES Policies(policy_id),
    FOREIGN KEY (addon_master_id) REFERENCES AddonMaster(addon_master_id),
    UNIQUE (policy_id, addon_master_id)
);

-- Create the Customers table for customer details
CREATE TABLE IF NOT EXISTS Customers (
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
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (pincode_id) REFERENCES PincodeMaster(pincode_id)
);

-- Create the Nominees table for nominee details
CREATE TABLE IF NOT EXISTS Nominees (
    nominee_id SERIAL PRIMARY KEY,
    policy_id INT NOT NULL,
    nominee_name VARCHAR(255),
    relation VARCHAR(100),
    age INT,
    gender VARCHAR(50),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (policy_id) REFERENCES Policies(policy_id)
);

-- Create the WalletTransactions table to track payments
CREATE TABLE IF NOT EXISTS WalletTransactions (
    transaction_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    transaction_date TIMESTAMP WITHOUT TIME ZONE,
    payment_mode VARCHAR(50),
    amount DECIMAL(10, 2),
    status VARCHAR(50),
    transaction_ref_no VARCHAR(255) UNIQUE NOT NULL,
    payment_proof_file VARCHAR(255),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Create the Tickets table for support tickets
CREATE TABLE IF NOT EXISTS Tickets (
    ticket_id SERIAL PRIMARY KEY,
    ticket_type VARCHAR(100) NOT NULL,
    status VARCHAR(50),
    user_id INT NOT NULL,
    policy_id INT,
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (policy_id) REFERENCES Policies(policy_id)
);