import styles from './page.module.css';

export default function AboutPage() {
    const problems = [
        { icon: "😰", title: "Stress & Anxiety", text: "70% of college students report feeling overwhelming anxiety" },
        { icon: "😔", title: "Loneliness", text: "Many students struggle to find genuine connections" },
        { icon: "🤐", title: "Stigma", text: "Fear of judgment prevents students from seeking help" },
        { icon: "⏰", title: "Accessibility", text: "Limited access to mental health resources" },
    ];

    const solutions = [
        { icon: "💬", title: "Anonymous Peer Support", text: "Connect with fellow students who understand your struggles without revealing your identity" },
        { icon: "🤖", title: "AI Wellness Companion", text: "24/7 access to MoodBot for instant emotional support and coping strategies" },
        { icon: "🌿", title: "Daily Self-Care", text: "Simple, actionable challenges to build mental wellness habits" },
        { icon: "🛡️", title: "Safe Space", text: "Moderated chat rooms designed to foster empathy and support" },
    ];

    const techStack = [
        { icon: "⚛️", name: "Next.js", description: "React Framework" },
        { icon: "🎨", name: "CSS3", description: "Modern Styling" },
        { icon: "🟢", name: "Node.js", description: "Backend Runtime" },
        { icon: "🚂", name: "Express.js", description: "Server Framework" },
        { icon: "⚡", name: "Socket.io", description: "Real-time Chat" },
        { icon: "🗄️", name: "MySQL", description: "Database" },
        { icon: "🤖", name: "groq API", description: "AI Companion" },
    ];

    const team = [
        { emoji: "👨‍💻", role: "Developer", text: "Built with love for student wellbeing" },
    ];

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <span className={styles.heroEmoji}>🧠</span>
                    <h1 className={styles.heroTitle}>
                        About <span className={styles.gradientText}>MindLink+</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Empowering students with peer support, AI assistance, and self-care tools
                        to navigate life's challenges together.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className={styles.section}>
                <div className={styles.sectionContent}>
                    <h2 className={styles.sectionTitle}>Our Mission</h2>
                    <p className={styles.missionText}>
                        MindLink+ was created with a simple belief: <strong>no student should face their struggles alone</strong>.
                        We're building a community where mental health is prioritized, stigma is broken,
                        and every student has access to support when they need it most.
                    </p>
                </div>
            </section>

            {/* Problem Section */}
            <section className={styles.section + ' ' + styles.problemSection}>
                <div className={styles.sectionContent}>
                    <h2 className={styles.sectionTitle}>The Problem</h2>
                    <p className={styles.sectionSubtitle}>
                        College students face unique mental health challenges
                    </p>
                    <div className={styles.cardGrid}>
                        {problems.map((problem, index) => (
                            <div key={index} className={styles.problemCard}>
                                <span className={styles.cardIcon}>{problem.icon}</span>
                                <h3 className={styles.cardTitle}>{problem.title}</h3>
                                <p className={styles.cardText}>{problem.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Solution Section */}
            <section className={styles.section + ' ' + styles.solutionSection}>
                <div className={styles.sectionContent}>
                    <h2 className={styles.sectionTitle}>Our Solution</h2>
                    <p className={styles.sectionSubtitle}>
                        A comprehensive platform designed for student wellbeing
                    </p>
                    <div className={styles.cardGrid}>
                        {solutions.map((solution, index) => (
                            <div key={index} className={styles.solutionCard}>
                                <span className={styles.cardIcon}>{solution.icon}</span>
                                <h3 className={styles.cardTitle}>{solution.title}</h3>
                                <p className={styles.cardText}>{solution.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className={styles.section}>
                <div className={styles.sectionContent}>
                    <h2 className={styles.sectionTitle}>How It Works</h2>
                    <div className={styles.steps}>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>1</div>
                            <h3>Join Anonymously</h3>
                            <p>Get a random anonymous identity to protect your privacy</p>
                        </div>
                        <div className={styles.stepConnector}></div>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>2</div>
                            <h3>Connect & Share</h3>
                            <p>Join chat rooms or talk to MoodBot about how you're feeling</p>
                        </div>
                        <div className={styles.stepConnector}></div>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>3</div>
                            <h3>Grow Together</h3>
                            <p>Practice daily self-care and support fellow students</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className={styles.section + ' ' + styles.techSection}>
                <div className={styles.sectionContent}>
                    <h2 className={styles.sectionTitle}>Built With</h2>
                    <div className={styles.techGrid}>
                        {techStack.map((tech, index) => (
                            <div key={index} className={styles.techCard}>
                                <span className={styles.techIcon}>{tech.icon}</span>
                                <span className={styles.techName}>{tech.name}</span>
                                <span className={styles.techDesc}>{tech.description}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className={styles.section}>
                <div className={styles.sectionContent}>
                    <h2 className={styles.sectionTitle}>Our Values</h2>
                    <div className={styles.valuesGrid}>
                        <div className={styles.valueCard}>
                            <span className={styles.valueIcon}>💜</span>
                            <h3>Empathy First</h3>
                            <p>We believe in listening without judgment and supporting without conditions</p>
                        </div>
                        <div className={styles.valueCard}>
                            <span className={styles.valueIcon}>🔒</span>
                            <h3>Privacy Always</h3>
                            <p>Your identity and conversations are protected. Safety is our priority</p>
                        </div>
                        <div className={styles.valueCard}>
                            <span className={styles.valueIcon}>🌈</span>
                            <h3>Inclusive Community</h3>
                            <p>Everyone is welcome here, regardless of background or identity</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.ctaSection}>
                <div className={styles.ctaContent}>
                    <h2>Ready to Feel Better?</h2>
                    <p>Join our community of supportive students today</p>
                    <div className={styles.ctaButtons}>
                        <a href="/chat" className={styles.ctaPrimary}>
                            <span>💬</span> Join Chat Rooms
                        </a>
                        <a href="/moodbot" className={styles.ctaSecondary}>
                            <span>🤖</span> Talk to MoodBot
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer Note */}
            <section className={styles.disclaimer}>
                <p>
                    <strong>Important:</strong> MindLink+ is a peer support platform and not a substitute
                    for professional mental health care. If you're experiencing a crisis, please contact
                    your local mental health helpline or emergency services.
                </p>
            </section>
        </div>
    );
}
