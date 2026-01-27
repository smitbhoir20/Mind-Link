'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function SelfCarePage() {
    const [currentChallenge, setCurrentChallenge] = useState(null);
    const [completedChallenges, setCompletedChallenges] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const challenges = [
        { id: 1, text: "Take a 10-minute walk outside and notice 3 beautiful things 🌳", category: "physical", icon: "🚶" },
        { id: 2, text: "Write down 5 things you are grateful for today ✨", category: "mindfulness", icon: "📝" },
        { id: 3, text: "Do 5 minutes of deep breathing exercises 🧘", category: "mindfulness", icon: "🌬️" },
        { id: 4, text: "Drink 8 glasses of water throughout the day 💧", category: "physical", icon: "💧" },
        { id: 5, text: "Text a friend just to say hi and check on them 💜", category: "social", icon: "📱" },
        { id: 6, text: "Take a 20-minute power nap 😴", category: "rest", icon: "💤" },
        { id: 7, text: "Listen to your favorite uplifting song and dance 🎵", category: "joy", icon: "💃" },
        { id: 8, text: "Write a positive affirmation and put it where you'll see it 🌟", category: "mindfulness", icon: "✍️" },
        { id: 9, text: "Stretch for 5 minutes 🤸", category: "physical", icon: "🧘" },
        { id: 10, text: "Put your phone away for 1 hour 📵", category: "digital-detox", icon: "📴" },
        { id: 11, text: "Try a new healthy snack 🥗", category: "physical", icon: "🍎" },
        { id: 12, text: "Meditate for 10 minutes 🧘", category: "mindfulness", icon: "🕯️" },
        { id: 13, text: "Journal about your feelings for 15 minutes 📔", category: "mindfulness", icon: "📖" },
        { id: 14, text: "Organize a small space in your room 🧹", category: "productivity", icon: "✨" },
        { id: 15, text: "Do a random act of kindness for someone 💝", category: "social", icon: "🤗" },
    ];

    const categoryColors = {
        physical: { bg: 'rgba(20, 184, 166, 0.1)', color: '#14B8A6' },
        mindfulness: { bg: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' },
        social: { bg: 'rgba(236, 72, 153, 0.1)', color: '#EC4899' },
        rest: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' },
        joy: { bg: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' },
        'digital-detox': { bg: 'rgba(107, 114, 128, 0.1)', color: '#6B7280' },
        productivity: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10B981' },
    };

    const getNewChallenge = () => {
        setIsLoading(true);

        // Filter out completed challenges
        const availableChallenges = challenges.filter(c => !completedChallenges.includes(c.id));

        setTimeout(() => {
            if (availableChallenges.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableChallenges.length);
                setCurrentChallenge(availableChallenges[randomIndex]);
            } else {
                // Reset if all challenges completed
                setCompletedChallenges([]);
                const randomIndex = Math.floor(Math.random() * challenges.length);
                setCurrentChallenge(challenges[randomIndex]);
            }
            setIsLoading(false);
        }, 500);
    };

    const markCompleted = () => {
        if (currentChallenge) {
            setCompletedChallenges([...completedChallenges, currentChallenge.id]);
            setCurrentChallenge(null);
        }
    };

    const tips = [
        { icon: "🌅", title: "Morning Routine", text: "Start your day with intention" },
        { icon: "💪", title: "Stay Active", text: "Movement boosts your mood" },
        { icon: "🧠", title: "Mind Breaks", text: "Rest is productive too" },
        { icon: "💜", title: "Be Kind", text: "To yourself and others" },
    ];

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <span className={styles.headerIcon}>🌿</span>
                    <h1 className={styles.headerTitle}>Daily Self-Care</h1>
                    <p className={styles.headerSubtitle}>
                        Small actions for big impact on your wellbeing
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className={styles.main}>
                {/* Challenge Card */}
                <section className={styles.challengeSection}>
                    <div className={styles.challengeCard}>
                        {!currentChallenge ? (
                            <div className={styles.challengeEmpty}>
                                <span className={styles.challengeEmoji}>🎯</span>
                                <h2>Ready for Your Daily Challenge?</h2>
                                <p>Click the button below to get a personalized self-care challenge just for you!</p>
                                <button
                                    className={styles.challengeButton}
                                    onClick={getNewChallenge}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className={styles.loadingSpinner}></span>
                                    ) : (
                                        <>
                                            <span>✨</span> Get Today's Challenge
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className={styles.challengeContent}>
                                <div
                                    className={styles.challengeBadge}
                                    style={{
                                        background: categoryColors[currentChallenge.category]?.bg,
                                        color: categoryColors[currentChallenge.category]?.color
                                    }}
                                >
                                    {currentChallenge.category.replace('-', ' ')}
                                </div>
                                <span className={styles.challengeIcon}>{currentChallenge.icon}</span>
                                <h2 className={styles.challengeText}>{currentChallenge.text}</h2>
                                <div className={styles.challengeActions}>
                                    <button
                                        className={styles.completeButton}
                                        onClick={markCompleted}
                                    >
                                        <span>✅</span> I Did It!
                                    </button>
                                    <button
                                        className={styles.skipButton}
                                        onClick={getNewChallenge}
                                        disabled={isLoading}
                                    >
                                        <span>🔄</span> Try Another
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Progress */}
                    <div className={styles.progress}>
                        <div className={styles.progressInfo}>
                            <span>Today's Progress</span>
                            <span className={styles.progressCount}>{completedChallenges.length} completed</span>
                        </div>
                        <div className={styles.progressBar}>
                            <div
                                className={styles.progressFill}
                                style={{ width: `${(completedChallenges.length / challenges.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </section>

                {/* Tips Section */}
                <section className={styles.tipsSection}>
                    <h3 className={styles.tipsTitle}>Self-Care Tips</h3>
                    <div className={styles.tipsGrid}>
                        {tips.map((tip, index) => (
                            <div key={index} className={styles.tipCard}>
                                <span className={styles.tipIcon}>{tip.icon}</span>
                                <h4 className={styles.tipTitle}>{tip.title}</h4>
                                <p className={styles.tipText}>{tip.text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Motivation Quote */}
                <section className={styles.quoteSection}>
                    <blockquote className={styles.quote}>
                        "Taking care of yourself doesn't mean me first, it means me too."
                    </blockquote>
                    <cite className={styles.quoteAuthor}>— L.R. Knost</cite>
                </section>
            </main>
        </div>
    );
}
