'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Profile() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const userData = localStorage.getItem('mindlink-user');
        if (!userData) {
            router.push('/auth');
            return;
        }
        const parsed = JSON.parse(userData);
        if (!user || user.email !== parsed.email) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUser(parsed);
        }
    }, [router, user]);

    if (!user) return null;

    // Extract initial for professional avatar
    const initial = user.username ? user.username.charAt(0).toUpperCase() : '?';

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.avatar}>
                    {initial}
                </div>
                <h1 className={styles.name}>{user.username}</h1>
                <p className={styles.email}>{user.email}</p>

                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Member Since</span>
                        <span className={styles.statValue}>Jan 2026</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Security Status</span>
                        <span className={styles.statValue} style={{ color: '#10b981' }}>Verified</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
