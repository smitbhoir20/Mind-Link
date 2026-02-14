'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Icon from '@/components/Icon';

export default function Settings() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('profile');
    const [user, setUser] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMsg, setNotificationMsg] = useState('');

    // Form States
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [notifications, setNotifications] = useState({
        sound: true,
        desktop: false,
        email: true
    });

    useEffect(() => {
        const userData = localStorage.getItem('mindlink-user');
        if (!userData) {
            router.push('/auth');
            return;
        }
        const parsedUser = JSON.parse(userData);
        if (!user || user.email !== parsedUser.email) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUser(parsedUser);
        }
        setUsername(parsedUser.username || '');
        setEmail(parsedUser.email || '');

        const savedNotifications = localStorage.getItem('mindlink-notifications');
        if (savedNotifications) {
            setNotifications(JSON.parse(savedNotifications));
        }
    }, [router, user]);

    const handleSaveProfile = (e) => {
        e.preventDefault();
        const updatedUser = { ...user, username };
        localStorage.setItem('mindlink-user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        notify('Changes saved');
    };

    const toggleNotification = (key) => {
        const newNotifs = { ...notifications, [key]: !notifications[key] };
        setNotifications(newNotifs);
        localStorage.setItem('mindlink-notifications', JSON.stringify(newNotifs));
    };

    const notify = (msg) => {
        setNotificationMsg(msg);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
    };

    if (!user) return null;

    const tabs = [
        { id: 'profile', label: 'Profile', icon: 'User' },
        { id: 'notifications', label: 'Notifications', icon: 'Bell' },
        { id: 'security', label: 'Security', icon: 'Shield' },
    ];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Account Settings</h1>
                <p className={styles.subtitle}>Update your profile and manage account preferences.</p>
            </header>

            <div className={styles.settingsGrid}>
                <aside className={styles.sidebar}>
                    <p className={styles.sidebarTitle}>General</p>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`${styles.navButton} ${activeTab === tab.id ? styles.activeNav : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <Icon name={tab.icon} size={20} />
                            <span className={styles.navLabel}>{tab.label}</span>
                        </button>
                    ))}
                </aside>

                <main className={styles.content}>
                    <div className="animate-fade-in">
                        {activeTab === 'profile' && (
                            <section>
                                <div className={styles.sectionHeader}>
                                    <h2 className={styles.sectionTitle}>Profile</h2>
                                    <p className={styles.sectionDesc}>Update your display name and login information.</p>
                                </div>

                                <div className={styles.settingsCard}>
                                    <form onSubmit={handleSaveProfile}>
                                        <div className={styles.settingGroup}>
                                            <label className={styles.label}>Name</label>
                                            <span className={styles.helperText}>Used for identification in chat and buddy requests.</span>
                                            <div className={styles.inputWrapper}>
                                                <input
                                                    type="text"
                                                    className={styles.input}
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    placeholder="Display Name"
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.settingGroup}>
                                            <label className={styles.label}>Email</label>
                                            <span className={styles.helperText}>Primary email associated with this account.</span>
                                            <div className={styles.inputWrapper}>
                                                <input
                                                    type="email"
                                                    className={styles.input}
                                                    value={email}
                                                    disabled
                                                />
                                            </div>
                                        </div>

                                        <button type="submit" className={styles.saveButton}>
                                            Save profile
                                        </button>
                                    </form>
                                </div>
                            </section>
                        )}

                        {activeTab === 'notifications' && (
                            <section>
                                <div className={styles.sectionHeader}>
                                    <h2 className={styles.sectionTitle}>Notifications</h2>
                                    <p className={styles.sectionDesc}>Control how you receive updates and messages.</p>
                                </div>

                                <div className={styles.settingsCard}>
                                    <div className={styles.toggleWrapper}>
                                        <div>
                                            <span className={styles.toggleTitle}>Audio alerts</span>
                                            <span className={styles.toggleDesc}>Play sounds for incoming events.</span>
                                        </div>
                                        <label className="toggle">
                                            <input
                                                type="checkbox"
                                                checked={notifications.sound}
                                                onChange={() => toggleNotification('sound')}
                                            />
                                            <span className="toggle-switch"></span>
                                        </label>
                                    </div>

                                    <div className={styles.toggleWrapper}>
                                        <div>
                                            <span className={styles.toggleTitle}>System notifications</span>
                                            <span className={styles.toggleDesc}>Show native desktop alerts.</span>
                                        </div>
                                        <label className="toggle">
                                            <input
                                                type="checkbox"
                                                checked={notifications.desktop}
                                                onChange={() => toggleNotification('desktop')}
                                            />
                                            <span className="toggle-switch"></span>
                                        </label>
                                    </div>

                                    <div className={styles.toggleWrapper}>
                                        <div>
                                            <span className={styles.toggleTitle}>Email digest</span>
                                            <span className={styles.toggleDesc}>Receive periodic activity summaries.</span>
                                        </div>
                                        <label className="toggle">
                                            <input
                                                type="checkbox"
                                                checked={notifications.email}
                                                onChange={() => toggleNotification('email')}
                                            />
                                            <span className="toggle-switch"></span>
                                        </label>
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeTab === 'security' && (
                            <section>
                                <div className={styles.sectionHeader}>
                                    <h2 className={styles.sectionTitle}>Security</h2>
                                    <p className={styles.sectionDesc}>Manage account protection and access.</p>
                                </div>

                                <div className={styles.settingsCard}>
                                    <div className={styles.settingGroup}>
                                        <label className={styles.label}>Authentication</label>
                                        <button className={styles.saveButton} style={{ background: '#475569' }}>
                                            Reset password
                                        </button>
                                    </div>

                                    <div className={styles.dangerZone}>
                                        <h3 className={styles.dangerTitle}>Deactivate Account</h3>
                                        <span className={styles.helperText}>Permanently remove all data. This action is irreversible.</span>
                                        <button className={styles.deleteButton}>
                                            Remove account
                                        </button>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                </main>
            </div>

            {showNotification && (
                <div className={styles.notification}>
                    <span></span> {notificationMsg}
                </div>
            )}
        </div>
    );
}
