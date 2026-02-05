require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Import SQLite database
const { saveMessage, getMessages, getChatRooms, clearRoomMessages } = require('./db/sqlite');

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

// API endpoint to clear message history
app.delete('/api/messages/:roomId', (req, res) => {
    try {
        const { roomId } = req.params;
        clearRoomMessages(roomId);

        // Notify all clients in the room users that chat is cleared
        io.to(roomId).emit('chat_cleared', { room: roomId });

        console.log(`🧹 Chat cleared for room: ${roomId}`);
        res.json({ success: true, message: 'Chat history cleared' });
    } catch (error) {
        console.error('Error clearing messages:', error);
        res.status(500).json({ error: 'Failed to clear messages' });
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

// ===== P2P Matchmaking (Socket.io Signaling Only) =====
const waitingQueue = [];
const activeMatches = new Map();

function removeFromQueue(socketId) {
    const index = waitingQueue.findIndex((entry) => entry.socketId === socketId);
    if (index !== -1) {
        waitingQueue.splice(index, 1);
        return true;
    }
    return false;
}

function getMatch(matchId) {
    return activeMatches.get(matchId);
}

function endMatch(matchId, reason = 'ended') {
    const match = activeMatches.get(matchId);
    if (!match) return;

    const { a, b } = match;
    io.to(a.socketId).emit('match_end', { matchId, reason });
    io.to(b.socketId).emit('match_end', { matchId, reason });
    activeMatches.delete(matchId);
}

function getPeerSocketId(match, socketId) {
    if (match.a.socketId === socketId) return match.b.socketId;
    if (match.b.socketId === socketId) return match.a.socketId;
    return null;
}

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

    // ===== P2P Matchmaking (Socket.io Signaling Only) =====
    socket.on('match_join', (data) => {
        const { username, mood, interests } = data || {};

        // Remove from queue if already waiting
        removeFromQueue(socket.id);

        const entry = {
            socketId: socket.id,
            username: username || 'Anonymous',
            mood: mood || 'neutral',
            interests: interests || [],
            joinedAt: Date.now()
        };

        if (waitingQueue.length > 0) {
            const other = waitingQueue.shift();
            const matchId = `match_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
            const initiatorSocketId = socket.id < other.socketId ? socket.id : other.socketId;

            const match = {
                id: matchId,
                a: entry,
                b: other,
                initiatorSocketId,
                accepted: {
                    [entry.socketId]: false,
                    [other.socketId]: false
                }
            };
            activeMatches.set(matchId, match);

            io.to(entry.socketId).emit('match_found', {
                matchId,
                isInitiator: initiatorSocketId === entry.socketId,
                peer: { username: other.username, mood: other.mood, interests: other.interests }
            });
            io.to(other.socketId).emit('match_found', {
                matchId,
                isInitiator: initiatorSocketId === other.socketId,
                peer: { username: entry.username, mood: entry.mood, interests: entry.interests }
            });
        } else {
            waitingQueue.push(entry);
            socket.emit('match_waiting', { queueSize: waitingQueue.length });
        }
    });

    socket.on('match_cancel', () => {
        removeFromQueue(socket.id);
    });

    socket.on('match_accept', (data) => {
        const { matchId } = data || {};
        const match = getMatch(matchId);
        if (!match) return;

        match.accepted[socket.id] = true;
        const peerSocketId = getPeerSocketId(match, socket.id);
        if (peerSocketId) {
            io.to(peerSocketId).emit('match_peer_accepted', { matchId });
        }

        const allAccepted = Object.values(match.accepted).every(Boolean);
        if (allAccepted) {
            io.to(match.a.socketId).emit('match_ready', {
                matchId,
                isInitiator: match.initiatorSocketId === match.a.socketId
            });
            io.to(match.b.socketId).emit('match_ready', {
                matchId,
                isInitiator: match.initiatorSocketId === match.b.socketId
            });
        }
    });

    socket.on('match_reject', (data) => {
        const { matchId } = data || {};
        const match = getMatch(matchId);
        if (!match) return;

        const peerSocketId = getPeerSocketId(match, socket.id);
        if (peerSocketId) {
            io.to(peerSocketId).emit('match_rejected', { matchId });
        }
        endMatch(matchId, 'rejected');
    });

    socket.on('match_end', (data) => {
        const { matchId, reason } = data || {};
        endMatch(matchId, reason || 'ended');
    });

    // WebRTC signaling relay (no message relay)
    socket.on('webrtc_offer', (data) => {
        const { matchId, sdp } = data || {};
        const match = getMatch(matchId);
        if (!match) return;
        const peerSocketId = getPeerSocketId(match, socket.id);
        if (peerSocketId) {
            io.to(peerSocketId).emit('webrtc_offer', { matchId, sdp });
        }
    });

    socket.on('webrtc_answer', (data) => {
        const { matchId, sdp } = data || {};
        const match = getMatch(matchId);
        if (!match) return;
        const peerSocketId = getPeerSocketId(match, socket.id);
        if (peerSocketId) {
            io.to(peerSocketId).emit('webrtc_answer', { matchId, sdp });
        }
    });

    socket.on('webrtc_ice', (data) => {
        const { matchId, candidate } = data || {};
        const match = getMatch(matchId);
        if (!match) return;
        const peerSocketId = getPeerSocketId(match, socket.id);
        if (peerSocketId) {
            io.to(peerSocketId).emit('webrtc_ice', { matchId, candidate });
        }
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

        // Remove from matchmaking queue
        removeFromQueue(socket.id);

        // End match if active
        for (const [matchId, match] of activeMatches.entries()) {
            if (match.a.socketId === socket.id || match.b.socketId === socket.id) {
                endMatch(matchId, 'peer_disconnected');
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
