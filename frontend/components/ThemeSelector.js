'use client';

import { useState, useEffect } from 'react';
import styles from './ThemeSelector.module.css';

const themes = [
    { id: 'calm', emoji: '😌', name: 'Calm', description: 'Peaceful Purple & Teal' },
    { id: 'happy', emoji: '☀️', name: 'Sunshine', description: 'Bright Golden Warmth' },
    { id: 'sad', emoji: '🌊', name: 'Ocean', description: 'Deep Calming Blues' },
    { id: 'energized', emoji: '🔥', name: 'Blazing', description: 'Fiery Red & Orange' },
];

export default function ThemeSelector() {
    const [currentTheme, setCurrentTheme] = useState('calm');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Load saved theme from localStorage
        const savedTheme = localStorage.getItem('mindlink-theme') || 'calm';
        setCurrentTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    const handleThemeChange = (themeId) => {
        setCurrentTheme(themeId);
        document.documentElement.setAttribute('data-theme', themeId);
        localStorage.setItem('mindlink-theme', themeId);
        setIsOpen(false);
    };

    const currentThemeData = themes.find(t => t.id === currentTheme);

    return (
        <div className={styles.themeSelector}>
            <button
                className={styles.themeButton}
                onClick={() => setIsOpen(!isOpen)}
                title="Change mood theme"
            >
                <span className={styles.themeEmoji}>{currentThemeData?.emoji}</span>
                <span className={styles.themeLabel}>Mood</span>
            </button>

            {isOpen && (
                <>
                    <div className={styles.overlay} onClick={() => setIsOpen(false)} />
                    <div className={styles.dropdown}>
                        <div className={styles.dropdownHeader}>
                            <span>How are you feeling?</span>
                        </div>
                        <div className={styles.themeOptions}>
                            {themes.map((theme) => (
                                <button
                                    key={theme.id}
                                    className={`${styles.themeOption} ${currentTheme === theme.id ? styles.active : ''}`}
                                    onClick={() => handleThemeChange(theme.id)}
                                >
                                    <span className={styles.optionEmoji}>{theme.emoji}</span>
                                    <div className={styles.optionInfo}>
                                        <span className={styles.optionName}>{theme.name}</span>
                                        <span className={styles.optionDesc}>{theme.description}</span>
                                    </div>
                                    {currentTheme === theme.id && (
                                        <span className={styles.checkmark}>✓</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
