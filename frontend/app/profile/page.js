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
        setUser(JSON.parse(userData));
    }, [router]);

    if (!user) return null;

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.avatar}>
                    {user.avatar || '😊'}
                </div>
                <h1 className={styles.name}>{user.username}</h1>
                <p className={styles.email}>{user.email}</p>

                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Member Since</span>
                        <span className={styles.statValue}>Jan 2026</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Status</span>
                        <span className={styles.statValue}>Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
