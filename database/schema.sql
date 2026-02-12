-- MindLink+ Database Schema
-- Create database
CREATE DATABASE IF NOT EXISTS mindlink;
USE mindlink;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    avatar VARCHAR(255) DEFAULT 'default-avatar.png',
    is_anonymous BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat rooms table
CREATE TABLE IF NOT EXISTS chat_rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7) DEFAULT '#8B5CF6',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_id INT NOT NULL,
    user_id INT,
    username VARCHAR(50) DEFAULT 'Anonymous',
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Self-care challenges table
CREATE TABLE IF NOT EXISTS selfcare_challenges (
    id INT PRIMARY KEY AUTO_INCREMENT,
    challenge_text TEXT NOT NULL,
    category VARCHAR(50),
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'easy'
);

-- Insert default chat rooms
INSERT INTO chat_rooms (name, description, icon, color) VALUES
('Exam Stress', 'A safe space to discuss exam anxiety and study tips', '📚', '#EF4444'),
('Career Talk', 'Discuss career paths, internships, and future plans', '💼', '#F59E0B'),
('Peer Support', 'A safe space to support each other', '💬', '#10B981'),
('Focus Zone', 'Stay focused and accountable with study buddies', '🎯', '#3B82F6');

-- Insert default self-care challenges
INSERT INTO selfcare_challenges (challenge_text, category, difficulty) VALUES
('Take a 10-minute walk outside and notice 3 beautiful things', 'physical', 'easy'),
('Write down 5 things you are grateful for today', 'mindfulness', 'easy'),
('Do 5 minutes of deep breathing exercises', 'mindfulness', 'easy'),
('Drink 8 glasses of water throughout the day', 'physical', 'easy'),
('Text a friend just to say hi and check on them', 'social', 'easy'),
('Take a 20-minute power nap', 'rest', 'easy'),
('Listen to your favorite uplifting song and dance', 'joy', 'easy'),
('Write a positive affirmation and put it where you''ll see it', 'mindfulness', 'easy'),
('Stretch for 5 minutes', 'physical', 'easy'),
('Put your phone away for 1 hour', 'digital-detox', 'medium'),
('Try a new healthy recipe', 'physical', 'medium'),
('Meditate for 10 minutes', 'mindfulness', 'medium'),
('Journal about your feelings for 15 minutes', 'mindfulness', 'medium'),
('Organize a small space in your room', 'productivity', 'medium'),
('Do a random act of kindness for someone', 'social', 'medium');
