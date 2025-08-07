import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from "@shared/schema";

let pool: mysql.Pool | null = null;
let db: any = null;

// SingleStore connection configuration
const createSingleStoreConnection = () => {
  const requiredEnvVars = [
    'SINGLESTORE_HOST',
    'SINGLESTORE_PORT', 
    'SINGLESTORE_DATABASE',
    'SINGLESTORE_USER',
    'SINGLESTORE_PASSWORD'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.log(`Missing SingleStore environment variables: ${missingVars.join(', ')}`);
    console.log("Running with memory storage instead");
    return null;
  }

  try {
    const poolConfig = {
      host: process.env.SINGLESTORE_HOST!,
      port: parseInt(process.env.SINGLESTORE_PORT!),
      user: process.env.SINGLESTORE_USER!,
      password: process.env.SINGLESTORE_PASSWORD!,
      database: process.env.SINGLESTORE_DATABASE!,
      ssl: {
        rejectUnauthorized: false, // Set to true and provide ca cert for production
      },
      // Connection pool settings
      connectionLimit: 10,
      acquireTimeout: 60000,
      namedPlaceholders: true,
    };

    pool = mysql.createPool(poolConfig);
    db = drizzle(pool, { schema, mode: 'default' });
    
    console.log(`Connected to SingleStore database: ${process.env.SINGLESTORE_DATABASE}`);
    return db;
  } catch (error) {
    console.error('Failed to connect to SingleStore:', error);
    console.log("Falling back to memory storage");
    return null;
  }
};

// Initialize database connection
db = createSingleStoreConnection();

// Function to create tables if they don't exist
export const initializeTables = async () => {
  if (!db) {
    console.log("No database connection - skipping table initialization");
    return;
  }

  try {
    console.log("Initializing database tables...");
    
    // Create sessions table
    await pool!.execute(`
      CREATE TABLE IF NOT EXISTS sessions (
        sid VARCHAR(255) PRIMARY KEY,
        sess JSON NOT NULL,
        expire TIMESTAMP NOT NULL,
        INDEX IDX_session_expire (expire)
      ) ENGINE=InnoDB
    `);

    // Create users table (removed UNIQUE constraints due to SingleStore shard key restrictions)
    await pool!.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        profile_image_url VARCHAR(1000),
        role VARCHAR(50) NOT NULL DEFAULT 'lead',
        stripe_customer_id VARCHAR(255),
        stripe_subscription_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_username (username),
        INDEX idx_email (email)
      ) ENGINE=InnoDB
    `);

    // Create leads table (simplified for SingleStore compatibility)
    await pool!.execute(`
      CREATE TABLE IF NOT EXISTS leads (
        id VARCHAR(36) PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        age VARCHAR(10) NOT NULL,
        investment_budget VARCHAR(100),
        money_ready_available VARCHAR(100) NOT NULL,
        source VARCHAR(100),
        status VARCHAR(50) NOT NULL DEFAULT 'new',
        score INT DEFAULT 0,
        notes TEXT,
        user_id VARCHAR(36),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_email (email),
        INDEX idx_status (status)
      ) ENGINE=InnoDB
    `);

    // Create investments table (simplified for SingleStore compatibility)
    await pool!.execute(`
      CREATE TABLE IF NOT EXISTS investments (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        fund_name VARCHAR(255) NOT NULL,
        fund_description TEXT,
        amount DECIMAL(12,2) NOT NULL,
        current_value DECIMAL(12,2),
        return_percentage DECIMAL(5,2),
        status VARCHAR(50) NOT NULL DEFAULT 'active',
        investment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_status (status)
      ) ENGINE=InnoDB
    `);

    // Create email_sequences table
    await pool!.execute(`
      CREATE TABLE IF NOT EXISTS email_sequences (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        trigger_event VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);

    // Create email_templates table (simplified for SingleStore compatibility)
    await pool!.execute(`
      CREATE TABLE IF NOT EXISTS email_templates (
        id VARCHAR(36) PRIMARY KEY,
        sequence_id VARCHAR(36),
        name VARCHAR(255) NOT NULL,
        subject VARCHAR(500) NOT NULL,
        content TEXT NOT NULL,
        day_delay INT DEFAULT 0,
        \`order\` INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_sequence_id (sequence_id)
      ) ENGINE=InnoDB
    `);

    // Create email_sends table (simplified for SingleStore compatibility)
    await pool!.execute(`
      CREATE TABLE IF NOT EXISTS email_sends (
        id VARCHAR(36) PRIMARY KEY,
        template_id VARCHAR(36) NOT NULL,
        lead_id VARCHAR(36),
        user_id VARCHAR(36),
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        opened_at TIMESTAMP NULL,
        clicked_at TIMESTAMP NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'sent',
        INDEX idx_template_id (template_id),
        INDEX idx_lead_id (lead_id),
        INDEX idx_user_id (user_id),
        INDEX idx_status (status)
      ) ENGINE=InnoDB
    `);

    // Create bookings table (simplified for SingleStore compatibility)
    await pool!.execute(`
      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(36) PRIMARY KEY,
        lead_id VARCHAR(36),
        user_id VARCHAR(36),
        scheduled_at TIMESTAMP NOT NULL,
        duration INT DEFAULT 30,
        type VARCHAR(50) NOT NULL DEFAULT 'consultation',
        status VARCHAR(50) NOT NULL DEFAULT 'scheduled',
        meeting_link VARCHAR(1000),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_lead_id (lead_id),
        INDEX idx_user_id (user_id),
        INDEX idx_status (status),
        INDEX idx_scheduled_at (scheduled_at)
      ) ENGINE=InnoDB
    `);

    // Create default admin and investor users if they don't exist
    const adminUser = await pool!.execute(`
      INSERT IGNORE INTO users (id, username, email, password, role, first_name, last_name)
      VALUES (UUID(), 'admin', 'admin@example.com', '$2a$10$5LhYpeVnJm1Vmc.d1cQ4.O3PYHxGGN7yE5gTnLp5Hd9TkV5FLZvym', 'admin', 'Admin', 'User')
    `);

    const investorUser = await pool!.execute(`
      INSERT IGNORE INTO users (id, username, email, password, role, first_name, last_name)
      VALUES (UUID(), 'investor', 'investor@example.com', '$2a$10$5LhYpeVnJm1Vmc.d1cQ4.O3PYHxGGN7yE5gTnLp5Hd9TkV5FLZvym', 'investor', 'Investor', 'User')
    `);

    console.log("Database tables initialized successfully");
  } catch (error) {
    console.error("Error initializing database tables:", error);
    throw error;
  }
};

export { pool, db };