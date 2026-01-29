'use client';

import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import styles from './page.module.css';

export default function ChatPage() {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [activeRoom, setActiveRoom] = useState('exam-stress');
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [username, setUsername] = useState('');
    const [typingUsers, setTypingUsers] = useState([]);
    const [onlineCount, setOnlineCount] = useState({});
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const rooms = [
        { id: 'exam-stress', name: 'Exam Stress', icon: '📚', color: '#EF4444' },
        { id: 'career-talk', name: 'Career Talk', icon: '💼', color: '#F59E0B' },
        { id: 'positive-vibes', name: 'Positive Vibes', icon: '✨', color: '#10B981' },
        { id: 'focus-zone', name: 'Focus Zone', icon: '🎯', color: '#3B82F6' },
    ];

    // Get logged-in user's username
    useEffect(() => {
        const userData = localStorage.getItem('mindlink-user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                setUsername(user.username);
            } catch (e) {
                setUsername('Anonymous User');
            }
        } else {
            setUsername('Anonymous User');
        }
    }, []);

    // Connect to Socket.io server
    useEffect(() => {
        // Use same host as browser but port 5000 for backend
        const backendUrl = typeof window !== 'undefined'
            ? `http://${window.location.hostname}:5000`
            : 'http://localhost:5000';

        const newSocket = io(backendUrl, {
            transports: ['websocket', 'polling'],
        });

        newSocket.on('connect', () => {
            console.log('✅ Connected to chat server');
            setConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('❌ Disconnected from chat server');
            setConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.log('⚠️ Connection error - backend may not be running');
            setConnected(false);
        });

        // Handle incoming messages
        newSocket.on('receive_message', (message) => {
            setMessages(prev => [...prev, message]);
        });

        // Handle typing indicators
        newSocket.on('user_typing', (data) => {
            if (data.username !== username) {
                setTypingUsers(prev => {
                    if (!prev.includes(data.username)) {
                        return [...prev, data.username];
                    }
                    return prev;
                });
            }
        });

        newSocket.on('user_stopped_typing', (data) => {
            setTypingUsers(prev => prev.filter(u => u !== data.username));
        });

        // Handle user count updates
        newSocket.on('room_users', (data) => {
            setOnlineCount(prev => ({ ...prev, [data.room]: data.count }));
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    // Join room when activeRoom changes
    useEffect(() => {
        if (socket && connected && username) {
            // Leave previous room
            socket.emit('leave_room', { room: activeRoom });

            // Join new room
            socket.emit('join_room', { room: activeRoom, username });

            // Clear messages and load history from database
            setMessages([]);
            setTypingUsers([]);

            // Load message history from database
            const backendUrl = typeof window !== 'undefined'
                ? `http://${window.location.hostname}:5000`
                : 'http://localhost:5000';

            fetch(`${backendUrl}/api/messages/${activeRoom}?limit=50`)
                .then(res => res.json())
                .then(data => {
                    if (data.messages && data.messages.length > 0) {
                        // Mark messages as not own (they're from history)
                        const historyMessages = data.messages.map(msg => ({
                            ...msg,
                            isOwn: msg.username === username
                        }));
                        setMessages(historyMessages);
                        console.log(`📜 Loaded ${historyMessages.length} messages from history`);
                    }
                })
                .catch(err => {
                    console.log('Could not load message history:', err.message);
                });
        }
    }, [activeRoom, socket, connected, username]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || !socket || !connected) return;

        const messageData = {
            room: activeRoom,
            username: username,
            content: inputMessage,
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            isOwn: true,
        };

        // Send message via socket
        socket.emit('send_message', messageData);

        // Add to local messages
        setMessages(prev => [...prev, { ...messageData, id: Date.now() }]);
        setInputMessage('');

        // Stop typing indicator
        socket.emit('stop_typing', { room: activeRoom, username });

        // AI MoodBot response if enabled
        if (aiMoodBot && inputMessage.toLowerCase().includes('stress')) {
            setTimeout(() => {
                const botMessage = {
                    id: Date.now() + 1,
                    username: '🤖 MoodBot',
                    content: "I hear you're feeling stressed. Remember, it's okay to take things one step at a time. You're stronger than you think! 💜",
                    time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
                    isBot: true,
                };
                setMessages(prev => [...prev, botMessage]);
            }, 1000);
        }
    };

    const handleTyping = (e) => {
        setInputMessage(e.target.value);

        if (socket && connected) {
            socket.emit('typing', { room: activeRoom, username });

            // Clear previous timeout
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            // Set new timeout to stop typing
            typingTimeoutRef.current = setTimeout(() => {
                socket.emit('stop_typing', { room: activeRoom, username });
            }, 2000);
        }
    };

    const currentRoom = rooms.find(r => r.id === activeRoom);
    const roomOnlineCount = onlineCount[activeRoom] || 0;

    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2 className={styles.sidebarTitle}>Chat Rooms</h2>
                    <span className={`${styles.connectionStatus} ${connected ? styles.online : styles.offline}`}>
                        {connected ? '🟢 Live' : '🔴 Offline'}
                    </span>
                </div>
                <div className={styles.roomList}>
                    {rooms.map((room) => (
                        <button
                            key={room.id}
                            className={`${styles.roomItem} ${activeRoom === room.id ? styles.active : ''}`}
                            onClick={() => setActiveRoom(room.id)}
                        >
                            <span className={styles.roomIcon} style={{ background: `${room.color}20` }}>
                                {room.icon}
                            </span>
                            <div className={styles.roomInfo}>
                                <span className={styles.roomName}>{room.name}</span>
                                <span className={styles.roomMembers}>
                                    {onlineCount[room.id] || 0} online
                                </span>
                            </div>
                            {activeRoom === room.id && <div className={styles.activeIndicator} style={{ background: room.color }} />}
                        </button>
                    ))}
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className={styles.chatMain}>
                {/* Chat Header */}
                <header className={styles.chatHeader}>
                    <div className={styles.chatHeaderInfo}>
                        <span className={styles.chatIcon} style={{ background: `${currentRoom?.color}20` }}>
                            {currentRoom?.icon}
                        </span>
                        <div>
                            <h1 className={styles.chatTitle}>{currentRoom?.name}</h1>
                            <span className={styles.chatStatus}>
                                <span className={styles.statusDot}></span>
                                {roomOnlineCount} members online {connected ? '• Live' : '• Connecting...'}
                            </span>
                        </div>
                    </div>
                    <div className={styles.chatActions}>
                        <button className={styles.iconButton} title="Room Info">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 16v-4M12 8h.01" />
                            </svg>
                        </button>
                    </div>
                </header>

                {/* Messages */}
                <div className={styles.messagesContainer}>
                    <div className={styles.welcomeBanner}>
                        <span className={styles.welcomeIcon}>{currentRoom?.icon}</span>
                        <h3>Welcome to {currentRoom?.name}!</h3>
                        <p>This is a safe, anonymous space. Be kind and supportive. 💜</p>
                        {!connected && (
                            <p className={styles.connectionWarning}>
                                ⚠️ Connecting to chat server... Make sure backend is running on port 5000
                            </p>
                        )}
                    </div>

                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`${styles.message} ${message.isOwn ? styles.ownMessage : ''} ${message.isBot ? styles.botMessage : ''}`}
                        >
                            {!message.isOwn && (
                                <div className={styles.messageAvatar}>
                                    {message.isBot ? '🤖' : message.username?.charAt(message.username.length - 1) || '?'}
                                </div>
                            )}
                            <div className={styles.messageContent}>
                                {!message.isOwn && (
                                    <span className={styles.messageUser}>{message.username}</span>
                                )}
                                <div className={styles.messageBubble}>
                                    {message.content}
                                </div>
                                <span className={styles.messageTime}>{message.time}</span>
                            </div>
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {typingUsers.length > 0 && (
                        <div className={styles.typingIndicator}>
                            <span>{typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...</span>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form className={styles.inputArea} onSubmit={handleSendMessage}>
                    <div className={styles.inputWrapper}>
                        <input
                            type="text"
                            className={styles.messageInput}
                            placeholder={connected ? "Type a supportive message..." : "Waiting for connection..."}
                            value={inputMessage}
                            onChange={handleTyping}
                            disabled={!connected}
                        />
                        <button type="submit" className={styles.sendButton} disabled={!inputMessage.trim() || !connected}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                            </svg>
                        </button>
                    </div>
                    <p className={styles.inputHint}>
                        Chatting as <strong>{username}</strong> • Your identity is protected
                    </p>
                </form>
            </main>
        </div>
    );
}
