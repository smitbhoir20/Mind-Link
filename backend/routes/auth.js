const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const emailValidator = require('deep-email-validator');
const {
    createUser,
    findUserByEmail,
    findUserByUsername,
    findUserById,
    verifyPassword,
    updateLastLogin
} = require('../db/sqlite');

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'mindlink-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // Token valid for 7 days

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = decoded;
        next();
    });
};

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { username, email, phone, password } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({
                error: 'Username, email, and password are required'
            });
        }

        // Validate email existence
        const { valid, reason, validators } = await emailValidator.validate({
            email: email,
            validateSMTP: false // SMTP check often times out in dev/cloud environments
        });
        if (!valid) {
            return res.status(400).json({
                error: 'Please provide a valid email address.',
                details: {
                    reason: validators[reason]?.reason || reason,
                    suggestion: validators.typo?.source
                }
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({
                error: 'Password must be at least 6 characters'
            });
        }

        // Validate username
        if (username.length < 3) {
            return res.status(400).json({
                error: 'Username must be at least 3 characters'
            });
        }

        // Check if email already exists
        const existingEmail = findUserByEmail(email);
        if (existingEmail) {
            return res.status(400).json({
                error: 'Email already registered'
            });
        }

        // Check if username already exists
        const existingUsername = findUserByUsername(username);
        if (existingUsername) {
            return res.status(400).json({
                error: 'Username already taken'
            });
        }

        // Create user in database
        const result = createUser(username, email, phone, password);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: result.userId, username, email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        console.log(` New user registered: ${username} (${email})`);

        res.status(201).json({
            message: 'Registration successful',
            user: { id: result.userId, username, email, phone },
            token
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login user
router.post('/login', (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }

        // Find user by email
        const user = findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Verify password
        if (!verifyPassword(password, user.password_hash)) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Update last login time
        updateLastLogin(user.id);

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, username: user.username, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        console.log(` User logged in: ${user.username}`);

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                avatar: user.avatar
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Check email availability
router.get('/check-email', (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const user = findUserByEmail(email);
    res.json({ available: !user });
});

// Check username availability
router.get('/check-username', (req, res) => {
    const { username } = req.query;
    if (!username) return res.status(400).json({ error: 'Username required' });

    const user = findUserByUsername(username);
    res.json({ available: !user });
});

// Get current user profile (protected route)
router.get('/me', authenticateToken, (req, res) => {
    try {
        const user = findUserById(req.user.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });

    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
});

// Verify token is valid
router.get('/verify', authenticateToken, (req, res) => {
    res.json({
        valid: true,
        user: {
            userId: req.user.userId,
            username: req.user.username,
            email: req.user.email
        }
    });
});

// Export middleware for use in other routes
module.exports = router;
module.exports.authenticateToken = authenticateToken;
