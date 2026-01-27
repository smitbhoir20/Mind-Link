import FeatureCard from '@/components/FeatureCard';
import styles from './page.module.css';

export default function Home() {
  const features = [
    {
      icon: '💬',
      title: 'Peer Chat Rooms',
      description: 'Connect anonymously with fellow students in themed chat rooms like Exam Stress, Career Talk, and Positive Vibes.',
      href: '/chat',
      color: 'purple',
    },
    {
      icon: '🤖',
      title: 'AI Mood Bot',
      description: 'Chat with our AI companion that provides supportive, calming, and motivational responses whenever you need someone to talk to.',
      href: '/moodbot',
      color: 'teal',
    },
    {
      icon: '🌿',
      title: 'Daily Self-Care',
      description: 'Simple daily mental wellness challenges and positivity prompts to boost your wellbeing.',
      href: '/selfcare',
      color: 'blue',
    },
    {
      icon: '📚',
      title: 'Exam Stress Room',
      description: 'A dedicated safe space for students facing exam anxiety and academic pressure.',
      href: '/chat?room=exam-stress',
      color: 'orange',
    },
    {
      icon: 'ℹ️',
      title: 'About MindLink+',
      description: 'Learn about our platform mission, purpose, and mental health awareness initiatives.',
      href: '/about',
      color: 'pink',
    },
  ];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span>🚀</span> Trusted by 10,000+ students
          </div>
          <h1 className={styles.heroTitle}>
            <span className={styles.gradientText}>MindLink+</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Your Personal Peer Support & Wellbeing Platform
          </p>
          <p className={styles.heroDescription}>
            Connect with fellow students, chat with our AI wellness companion,
            and discover daily self-care practices. You're not alone on this journey.
          </p>
          <div className={styles.heroActions}>
            <a href="/chat" className={styles.btnPrimary}>
              <span>💬</span> Start Chatting
            </a>
            <a href="/moodbot" className={styles.btnSecondary}>
              <span>🤖</span> Talk to MoodBot
            </a>
          </div>
          <div className={styles.trustBadges}>
            <span className={styles.trustItem}>🔒 100% Anonymous</span>
            <span className={styles.trustItem}>🛡️ Safe & Moderated</span>
            <span className={styles.trustItem}>💜 Free Forever</span>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.heroGlow}></div>
          <div className={styles.floatingCard}>
            <span className={styles.floatingEmoji}>🧠</span>
          </div>
          <div className={styles.floatingCard} style={{ animationDelay: '0.5s' }}>
            <span className={styles.floatingEmoji}>💜</span>
          </div>
          <div className={styles.floatingCard} style={{ animationDelay: '1s' }}>
            <span className={styles.floatingEmoji}>✨</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>24/7</span>
          <span className={styles.statLabel}>Support Available</span>
        </div>
        <div className={styles.statDivider}></div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>100%</span>
          <span className={styles.statLabel}>Anonymous & Safe</span>
        </div>
        <div className={styles.statDivider}></div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>10K+</span>
          <span className={styles.statLabel}>Students Helped</span>
        </div>
        <div className={styles.statDivider}></div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>∞</span>
          <span className={styles.statLabel}>Community Love</span>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>Features</span>
          <h2 className={styles.sectionTitle}>
            Everything you need for <span className={styles.gradientText}>mental wellness</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Designed by students, for students. Every feature focuses on creating a safe,
            supportive environment for your mental health journey.
          </p>
        </div>
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              href={feature.href}
              color={feature.color}
            />
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>Testimonials</span>
          <h2 className={styles.sectionTitle}>
            What students are <span className={styles.gradientText}>saying</span>
          </h2>
        </div>
        <div className={styles.testimonialGrid}>
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialText}>
              "MindLink+ helped me through my toughest exam week. Knowing others were going through the same thing made me feel less alone."
            </p>
            <div className={styles.testimonialAuthor}>
              <span className={styles.testimonialAvatar}>🦊</span>
              <div>
                <strong>Anonymous Fox</strong>
                <span>Computer Science, Year 3</span>
              </div>
            </div>
          </div>
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialText}>
              "The MoodBot is incredible! It's like having a supportive friend available 24/7 whenever anxiety hits."
            </p>
            <div className={styles.testimonialAuthor}>
              <span className={styles.testimonialAvatar}>🐼</span>
              <div>
                <strong>Anonymous Panda</strong>
                <span>Psychology, Year 2</span>
              </div>
            </div>
          </div>
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialText}>
              "Daily self-care challenges have genuinely improved my mental health routine. Simple but effective!"
            </p>
            <div className={styles.testimonialAuthor}>
              <span className={styles.testimonialAvatar}>🦋</span>
              <div>
                <strong>Anonymous Butterfly</strong>
                <span>Business, Year 1</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            Ready to feel <span className={styles.ctaHighlight}>supported</span>?
          </h2>
          <p className={styles.ctaDescription}>
            Join thousands of students who have found connection and support through MindLink+.
            It's free, anonymous, and always here for you.
          </p>
          <a href="/chat" className={styles.ctaButton}>
            Get Started – It's Free
          </a>
          <p className={styles.ctaNote}>No sign-up required. Start chatting in seconds.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <span>🧠</span> MindLink+
          </div>
          <div className={styles.footerLinks}>
            <a href="/">Home</a>
            <a href="/chat">Chat</a>
            <a href="/moodbot">MoodBot</a>
            <a href="/selfcare">Self-Care</a>
            <a href="/about">About</a>
          </div>
          <p className={styles.footerText}>
            Made with 💜 for student wellbeing
          </p>
          <p className={styles.footerDisclaimer}>
            MindLink+ is not a substitute for professional mental health care.
            If you're in crisis, please contact your local mental health helpline.
          </p>
          <p className={styles.footerCopyright}>
            © 2026 MindLink+. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
