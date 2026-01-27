const express = require('express');
const router = express.Router();

// Chat rooms data
const chatRooms = [
    { id: 'exam-stress', name: 'Exam Stress', description: 'A safe space to discuss exam anxiety and study tips', icon: '📚', color: '#EF4444' },
    { id: 'career-talk', name: 'Career Talk', description: 'Discuss career paths, internships, and future plans', icon: '💼', color: '#F59E0B' },
    { id: 'positive-vibes', name: 'Positive Vibes', description: 'Share positivity, gratitude, and uplifting moments', icon: '✨', color: '#10B981' },
    { id: 'focus-zone', name: 'Focus Zone', description: 'Stay focused and accountable with study buddies', icon: '🎯', color: '#3B82F6' },
];

// Self-care challenges
const challenges = [
    { id: 1, text: "Take a 10-minute walk outside and notice 3 beautiful things 🌳", category: "physical" },
    { id: 2, text: "Write down 5 things you are grateful for today ✨", category: "mindfulness" },
    { id: 3, text: "Do 5 minutes of deep breathing exercises 🧘", category: "mindfulness" },
    { id: 4, text: "Drink 8 glasses of water throughout the day 💧", category: "physical" },
    { id: 5, text: "Text a friend just to say hi and check on them 💜", category: "social" },
    { id: 6, text: "Take a 20-minute power nap 😴", category: "rest" },
    { id: 7, text: "Listen to your favorite uplifting song and dance 🎵", category: "joy" },
    { id: 8, text: "Write a positive affirmation and put it where you'll see it 🌟", category: "mindfulness" },
    { id: 9, text: "Stretch for 5 minutes 🤸", category: "physical" },
    { id: 10, text: "Put your phone away for 1 hour 📵", category: "digital-detox" },
    { id: 11, text: "Try a new healthy snack 🥗", category: "physical" },
    { id: 12, text: "Meditate for 10 minutes 🧘", category: "mindfulness" },
    { id: 13, text: "Journal about your feelings for 15 minutes 📔", category: "mindfulness" },
    { id: 14, text: "Organize a small space in your room 🧹", category: "productivity" },
    { id: 15, text: "Do a random act of kindness for someone 💝", category: "social" },
];

// Get all chat rooms
router.get('/rooms', (req, res) => {
    res.json(chatRooms);
});

// Get a specific room
router.get('/rooms/:id', (req, res) => {
    const room = chatRooms.find(r => r.id === req.params.id);
    if (room) {
        res.json(room);
    } else {
        res.status(404).json({ error: 'Room not found' });
    }
});

// Get a random self-care challenge
router.get('/selfcare/challenge', (req, res) => {
    const randomIndex = Math.floor(Math.random() * challenges.length);
    res.json(challenges[randomIndex]);
});

// Get all challenges
router.get('/selfcare/challenges', (req, res) => {
    res.json(challenges);
});

// Get challenges by category
router.get('/selfcare/challenges/:category', (req, res) => {
    const categoryFilter = req.params.category;
    const filtered = challenges.filter(c => c.category === categoryFilter);
    res.json(filtered);
});

module.exports = router;
