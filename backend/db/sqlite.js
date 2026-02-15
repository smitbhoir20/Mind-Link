const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

// Create database file in backend directory
const dbPath = path.join(__dirname, '..', 'mindlink.db');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Initialize tables
function initializeDatabase() {
    // Create users table
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            phone TEXT,
            password_hash TEXT NOT NULL,
            avatar TEXT DEFAULT '',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_login DATETIME
        )
    `);

    // Create chat_rooms table
    db.exec(`
        CREATE TABLE IF NOT EXISTS chat_rooms (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            icon TEXT,
            color TEXT DEFAULT '#8B5CF6',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Create messages table
    db.exec(`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            room_id TEXT NOT NULL,
            user_id INTEGER,
            username TEXT DEFAULT 'Anonymous',
            content TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Create index on room_id for faster queries
    db.exec(`
        CREATE INDEX IF NOT EXISTS idx_messages_room ON messages(room_id)
    `);

    // Migration: Add user_id column if it doesn't exist (for existing databases)
    try {
        db.exec(`ALTER TABLE messages ADD COLUMN user_id INTEGER`);
        console.log(' Added user_id column to messages table');
    } catch (e) {
        // Column already exists, ignore error
    }

    // Migration: Ensure UNIQUE constraints on users table
    try {
        db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
        db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username)`);
        console.log(' Verified unique constraints on users table');
    } catch (e) {
        console.error(' Error ensuring unique constraints:', e.message);
    }

    // Insert default chat rooms if they don't exist
    const insertRoom = db.prepare(`
        INSERT OR IGNORE INTO chat_rooms (id, name, description, icon, color) 
        VALUES (?, ?, ?, ?, ?)
    `);

    const defaultRooms = [
        ['exam-stress', 'Exam Stress', 'A safe space to discuss exam anxiety and study tips', 'BookOpen', '#EF4444'],
        ['career-talk', 'Career Talk', 'Discuss career paths, internships, and future plans', 'Briefcase', '#F59E0B'],
        ['peer-support', 'Peer Support', 'A safe space to support each other', 'MessageCircle', '#10B981'],
        ['focus-zone', 'Focus Zone', 'Stay focused and accountable with study buddies', 'Target', '#3B82F6']
    ];

    const insertMany = db.transaction((rooms) => {
        for (const room of rooms) {
            insertRoom.run(...room);
        }
    });

    insertMany(defaultRooms);

    console.log(' SQLite database initialized');
}

// ===== USER FUNCTIONS =====

// Register a new user
function createUser(username, email, phone, password) {
    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const stmt = db.prepare(`
        INSERT INTO users (username, email, phone, password_hash) 
        VALUES (?, ?, ?, ?)
    `);

    try {
        const result = stmt.run(username, email, phone || null, passwordHash);
        return { success: true, userId: result.lastInsertRowid };
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed: users.email')) {
            return { success: false, error: 'Email already registered' };
        }
        if (error.message.includes('UNIQUE constraint failed: users.username')) {
            return { success: false, error: 'Username already taken' };
        }
        return { success: false, error: error.message };
    }
}

// Find user by email for login
function findUserByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
}

// Find user by username
function findUserByUsername(username) {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username);
}

// Find user by ID
function findUserById(id) {
    const stmt = db.prepare('SELECT id, username, email, phone, avatar, created_at FROM users WHERE id = ?');
    return stmt.get(id);
}

// Verify password
function verifyPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}

// Update last login time
function updateLastLogin(userId) {
    const stmt = db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(userId);
}

// ===== MESSAGE FUNCTIONS =====

// Save a message
function saveMessage(roomId, username, content, userId = null) {
    const stmt = db.prepare(`
        INSERT INTO messages (room_id, user_id, username, content) 
        VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(roomId, userId, username, content);
    return result.lastInsertRowid;
}

// Get messages for a room (last 50 messages)
function getMessages(roomId, limit = 50) {
    const stmt = db.prepare(`
        SELECT id, room_id, username, content, created_at 
        FROM messages 
        WHERE room_id = ? 
        ORDER BY created_at DESC 
        LIMIT ?
    `);
    const messages = stmt.all(roomId, limit);

    // Reverse to get chronological order and format
    return messages.reverse().map(msg => ({
        id: msg.id,
        username: msg.username,
        content: msg.content,
        time: new Date(msg.created_at).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        }),
        isOwn: false // Will be determined by frontend
    }));
}

// Get all chat rooms
function getChatRooms() {
    const stmt = db.prepare('SELECT * FROM chat_rooms');
    return stmt.all();
}

// Clear all messages in a room
function clearRoomMessages(roomId) {
    const stmt = db.prepare('DELETE FROM messages WHERE room_id = ?');
    stmt.run(roomId);
}

// Initialize on load
initializeDatabase();

module.exports = {
    db,
    // User functions
    createUser,
    findUserByEmail,
    findUserByUsername,
    findUserById,
    verifyPassword,
    updateLastLogin,
    // Message functions
    saveMessage,
    getMessages,
    getChatRooms,
    clearRoomMessages
};

