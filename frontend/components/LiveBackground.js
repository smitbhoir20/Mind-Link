'use client';

import styles from './LiveBackground.module.css';

export default function LiveBackground() {
    return (
        <div className={styles.backgroundContainer}>
            <div className={styles.blob1}></div>
            <div className={styles.blob2}></div>
            <div className={styles.blob3}></div>
            <div className={styles.overlay}></div>
        </div>
    );
}
