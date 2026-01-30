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
          <h1 className={styles.heroTitle}>
            Find Your <span className={styles.highlight}>Headspace</span>
          </h1>
          <p className={styles.heroDescription}>
            Connect with peers, talk to AI, practice wellness
          </p>
          <div className={styles.heroActions}>
            <a href="/chat" className={styles.btnPrimary}>
              Start Chatting
            </a>
            <a href="/moodbot" className={styles.btnSecondary}>
              Talk to MoodBot
            </a>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.categories}>
        <div className={styles.maxWidth}>
          <h2 className={styles.sectionTitle}>What kind of support are you looking for?</h2>
          <div className={styles.categoryGrid}>
            <a href="/chat?room=exam-stress" className={styles.categoryCard}>
              <div className={styles.categoryIcon}>📚</div>
              <h3>Exam Stress</h3>
            </a>
            <a href="/chat?room=career-talk" className={styles.categoryCard}>
              <div className={styles.categoryIcon}>💼</div>
              <h3>Career Talk</h3>
            </a>
            <a href="/moodbot" className={styles.categoryCard}>
              <div className={styles.categoryIcon}>🤖</div>
              <h3>AI Companion</h3>
            </a>
            <a href="/chat?room=positive-vibes" className={styles.categoryCard}>
              <div className={styles.categoryIcon}>✨</div>
              <h3>Positive Vibes</h3>
            </a>
            <a href="/selfcare" className={styles.categoryCard}>
              <div className={styles.categoryIcon}>🌿</div>
              <h3>Self-Care</h3>
            </a>
            <a href="/chat" className={styles.categoryCard}>
              <div className={styles.categoryIcon}>💬</div>
              <h3>Peer Support</h3>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.maxWidth}>
          <h2 className={styles.sectionTitle}>Features designed for your wellness</h2>
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
