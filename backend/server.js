require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Import SQLite database
const { saveMessage, getMessages, getChatRooms } = require('./db/sqlite');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",  // Allow all origins for local network access
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const apiRoutes = require('./routes/api');
const moodbotRoutes = require('./routes/moodbot');
const authRoutes = require('./routes/auth');

app.use('/api', apiRoutes);
app.use('/api/moodbot', moodbotRoutes);
app.use('/api/auth', authRoutes);

// API endpoint to get message history for a room
app.get('/api/messages/:roomId', (req, res) => {
    try {
        const { roomId } = req.params;
        const limit = parseInt(req.query.limit) || 50;
        const messages = getMessages(roomId, limit);
        res.json({ messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// API endpoint to get all chat rooms
app.get('/api/rooms', (req, res) => {
    try {
        const rooms = getChatRooms();
        res.json({ rooms });
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ error: 'Failed to fetch rooms' });
    }
});

// Track users in rooms
const roomUsers = {};

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('✅ User connected:', socket.id);

    // Join a chat room
    socket.on('join_room', (data) => {
        const { room, username } = data;
        socket.join(room);
        socket.username = username;
        socket.currentRoom = room;

        // Track user in room
        if (!roomUsers[room]) {
            roomUsers[room] = new Set();
        }
        roomUsers[room].add(socket.id);

        console.log(`👤 ${username} joined room: ${room} (${roomUsers[room].size} users)`);

        // Notify room about new user
        socket.to(room).emit('user_joined', {
            username,
            message: `${username} joined the chat`
        });

        // Send updated user count to all in room
        io.to(room).emit('room_users', {
            room,
            count: roomUsers[room].size
        });
    });

    // Leave a chat room
    socket.on('leave_room', (data) => {
        const { room } = data;
        socket.leave(room);

        if (roomUsers[room]) {
            roomUsers[room].delete(socket.id);
            io.to(room).emit('room_users', {
                room,
                count: roomUsers[room].size
            });
        }

        console.log(`👋 User left room: ${room}`);
    });

    // Send message to room - NOW SAVES TO DATABASE
    socket.on('send_message', (data) => {
        const { room, content, username, time } = data;

        // Save message to database
        try {
            const msgId = saveMessage(room, username || 'Anonymous', content);
            console.log(`💾 Message saved to DB (id: ${msgId})`);
        } catch (error) {
            console.error('Failed to save message:', error);
        }

        const messageData = {
            id: Date.now(),
            username: username || 'Anonymous',
            content,
            time: time || new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            isOwn: false, // Will be false for recipients
        };

        // Broadcast to all OTHER users in the room (sender already added locally)
        socket.to(room).emit('receive_message', messageData);

        console.log(`💬 [${room}] ${username}: ${content}`);
    });

    // Typing indicator
    socket.on('typing', (data) => {
        const { room, username } = data;
        socket.to(room).emit('user_typing', { username });
    });

    socket.on('stop_typing', (data) => {
        const { room, username } = data;
        socket.to(room).emit('user_stopped_typing', { username });
    });

    // Disconnect
    socket.on('disconnect', () => {
        console.log('❌ User disconnected:', socket.id);

        // Remove from all rooms
        for (const room of Object.keys(roomUsers)) {
            if (roomUsers[room].has(socket.id)) {
                roomUsers[room].delete(socket.id);
                io.to(room).emit('room_users', {
                    room,
                    count: roomUsers[room].size
                });
            }
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'MindLink+ server is running', database: 'SQLite connected' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 MindLink+ server running on port ${PORT}`);
    console.log(`📡 Socket.io ready for real-time chat`);
    console.log(`💾 SQLite database connected`);
});
