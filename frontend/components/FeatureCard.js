import Link from 'next/link';
import Image from 'next/image';
import styles from './FeatureCard.module.css';

export default function FeatureCard({ icon, title, description, href, color = 'purple' }) {
    const colorClasses = {
        purple: styles.colorPurple,
        teal: styles.colorTeal,
        blue: styles.colorBlue,
        pink: styles.colorPink,
        orange: styles.colorOrange,
    };

    return (
        <Link href={href} className={`${styles.card} ${colorClasses[color] || colorClasses.purple}`}>
            <div className={styles.iconWrapper}>
                <Image src={icon} alt={title} width={40} height={40} className={styles.icon} />
            </div>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.description}>{description}</p>
            <div className={styles.arrow}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
            </div>
        </Link>
    );
}
