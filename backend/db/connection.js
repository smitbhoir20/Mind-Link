const mysql = require('mysql2/promise');

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mindlink',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log(' MySQL connected successfully');
        connection.release();
    } catch (error) {
        console.error(' MySQL connection failed:', error.message);
        console.log('ℹ️  Make sure MySQL is running and the database exists');
    }
}

// Initialize tables
async function initializeTables() {
    try {
        const connection = await pool.getConnection();

        // Create tables if they don't exist
        await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) UNIQUE,
        avatar VARCHAR(255) DEFAULT 'default-avatar.png',
        is_anonymous BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        await connection.query(`
      CREATE TABLE IF NOT EXISTS chat_rooms (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        icon VARCHAR(50),
        color VARCHAR(7) DEFAULT '#8B5CF6',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        await connection.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT PRIMARY KEY AUTO_INCREMENT,
        room_id VARCHAR(50) NOT NULL,
        user_id INT,
        username VARCHAR(50) DEFAULT 'Anonymous',
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        console.log(' Database tables initialized');
        connection.release();
    } catch (error) {
        console.error(' Table initialization failed:', error.message);
    }
}

module.exports = {
    pool,
    testConnection,
    initializeTables
};
