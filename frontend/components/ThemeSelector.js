'use client';

import { useState, useEffect } from 'react';
import styles from './ThemeSelector.module.css';

import Icon from './Icon';

const themes = [
    { id: 'calm', icon: 'Feather', name: 'Calm', description: 'Peaceful Purple & Teal' },
    { id: 'happy', icon: 'Sun', name: 'Sunshine', description: 'Bright Golden Warmth' },
    { id: 'sad', icon: 'CloudRain', name: 'Ocean', description: 'Deep Calming Blues' },
    { id: 'energized', icon: 'Zap', name: 'Blazing', description: 'Fiery Red & Orange' },
];

export default function ThemeSelector() {
    const [currentTheme, setCurrentTheme] = useState('calm');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Load saved theme from localStorage
        const savedTheme = localStorage.getItem('mindlink-theme') || 'calm';
        if (savedTheme !== 'calm') {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCurrentTheme(savedTheme);
        }
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
            >
                <Icon name={currentThemeData?.icon || 'Feather'} className={styles.themeIcon} size={20} />
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
                                    <Icon name={theme.icon} size={24} className={styles.optionIcon} />
                                    <div className={styles.optionInfo}>
                                        <span className={styles.optionName}>{theme.name}</span>
                                        <span className={styles.optionDesc}>{theme.description}</span>
                                    </div>
                                    {currentTheme === theme.id && (
                                        <span className={styles.checkmark}></span>
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
