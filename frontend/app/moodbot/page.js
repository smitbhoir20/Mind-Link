'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';

export default function MoodBotPage() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'bot',
            content: "Hi there! 👋 I'm MoodBot, your AI wellness companion. I'm here to listen, support, and help you feel better. How are you feeling today?",
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        },
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const getMoodBotResponse = async (userMessage) => {
        // Try to call the backend API
        try {
            // Use same host as browser but port 5000 for backend
            const backendUrl = typeof window !== 'undefined'
                ? `http://${window.location.hostname}:5000`
                : 'http://localhost:5000';

            const response = await fetch(`${backendUrl}/api/moodbot/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });

            if (response.ok) {
                const data = await response.json();
                return data.response;
            }
        } catch (error) {
            console.log('Backend not available, using fallback responses');
        }

        // Fallback responses if backend is not available
        const lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.includes('stress') || lowerMessage.includes('anxious') || lowerMessage.includes('worried')) {
            return "I can sense you're feeling stressed. Remember, it's completely normal to feel this way sometimes. Try taking a few deep breaths - inhale for 4 counts, hold for 4, exhale for 4. You've overcome challenges before, and you can do it again. 💪 What's specifically on your mind?";
        }

        if (lowerMessage.includes('sad') || lowerMessage.includes('down') || lowerMessage.includes('depressed')) {
            return "I'm sorry you're feeling down. Your feelings are valid, and it takes courage to acknowledge them. Remember, tough times don't last, but tough people do. 💜 Is there something specific that triggered these feelings, or would you like to talk about what might help you feel better?";
        }

        if (lowerMessage.includes('happy') || lowerMessage.includes('good') || lowerMessage.includes('great')) {
            return "That's wonderful to hear! 🌟 Positive feelings are worth celebrating. What's contributing to your good mood today? I'd love to hear about it!";
        }

        if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted') || lowerMessage.includes('sleep')) {
            return "Rest is so important for mental wellbeing. If you're feeling exhausted, your body and mind might be telling you to slow down. Consider taking a short break, maybe a power nap or a gentle walk. 😴 Have you been getting enough sleep lately?";
        }

        if (lowerMessage.includes('lonely') || lowerMessage.includes('alone')) {
            return "Feeling lonely can be really hard. But remember, you're not alone in feeling this way - many people experience loneliness. Have you tried our peer chat rooms? Sometimes connecting with others who understand can make a big difference. 💜 What kind of connection are you looking for?";
        }

        if (lowerMessage.includes('exam') || lowerMessage.includes('study') || lowerMessage.includes('test')) {
            return "Academic pressure can feel overwhelming! Here are some tips: break your study sessions into manageable chunks, take regular breaks, and remember that your worth isn't defined by grades. 📚 Would you like some specific study strategies or just need to vent about the pressure?";
        }

        if (lowerMessage.includes('thank')) {
            return "You're so welcome! 💜 I'm always here whenever you need to talk. Remember, taking care of your mental health is a sign of strength, not weakness. Is there anything else on your mind?";
        }

        // Default response
        return "Thank you for sharing that with me. I'm here to listen and support you. Could you tell me more about how you're feeling? Remember, every emotion is valid, and talking about it is the first step to feeling better. 💜";
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            role: 'user',
            content: inputMessage,
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        // Simulate typing delay
        setTimeout(async () => {
            const botResponse = await getMoodBotResponse(inputMessage);

            const botMessage = {
                id: messages.length + 2,
                role: 'bot',
                content: botResponse,
                time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            };

            setIsTyping(false);
            setMessages(prev => [...prev, botMessage]);
        }, 1500);
    };

    const quickPrompts = [
        "I'm feeling stressed 😰",
        "I need motivation 💪",
        "Tell me something positive ✨",
        "Help me relax 🧘",
    ];

    return (
        <div className={styles.container}>
            <div className={styles.chatWrapper}>
                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.botAvatar}>
                        <span className={styles.botEmoji}>🤖</span>
                        <span className={styles.onlineIndicator}></span>
                    </div>
                    <div className={styles.headerInfo}>
                        <h1 className={styles.headerTitle}>MoodBot</h1>
                        <p className={styles.headerSubtitle}>Your AI Wellness Companion</p>
                    </div>
                </header>

                {/* Messages */}
                <div className={styles.messagesContainer}>
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`${styles.message} ${message.role === 'user' ? styles.userMessage : styles.botMessage}`}
                        >
                            {message.role === 'bot' && (
                                <div className={styles.messageAvatar}>🤖</div>
                            )}
                            <div className={styles.messageContent}>
                                <div className={styles.messageBubble}>
                                    {message.content}
                                </div>
                                <span className={styles.messageTime}>{message.time}</span>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className={`${styles.message} ${styles.botMessage}`}>
                            <div className={styles.messageAvatar}>🤖</div>
                            <div className={styles.typingIndicator}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts */}
                <div className={styles.quickPrompts}>
                    {quickPrompts.map((prompt, index) => (
                        <button
                            key={index}
                            className={styles.quickPrompt}
                            onClick={() => setInputMessage(prompt)}
                        >
                            {prompt}
                        </button>
                    ))}
                </div>

                {/* Input Area */}
                <form className={styles.inputArea} onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        className={styles.messageInput}
                        placeholder="Share how you're feeling..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                    />
                    <button type="submit" className={styles.sendButton} disabled={!inputMessage.trim() || isTyping}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                        </svg>
                    </button>
                </form>

                {/* Disclaimer */}
                <p className={styles.disclaimer}>
                    MoodBot is an AI companion and not a substitute for professional mental health care.
                    If you're in crisis, please contact a mental health professional.
                </p>
            </div>
        </div>
    );
}
