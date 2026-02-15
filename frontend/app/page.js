import Link from 'next/link';
import FeatureCard from '@/components/FeatureCard';
import LiveBackground from '@/components/LiveBackground';
import styles from './page.module.css';
import Icon from '@/components/Icon';

export default function Home() {
  const features = [
    {
      icon: 'MessageCircle', // peer-support
      title: 'Peer Chat Rooms',
      description: 'Connect anonymously with fellow students in themed chat rooms like Exam Stress, Career Talk, and Positive Vibes.',
      href: '/chat',
      color: 'purple',
    },
    {
      icon: 'Users', // buddy-chat
      title: 'Buddy Chat (P2P)',
      description: 'Match with one peer based on mood and interests, then chat directly in a private session.',
      href: '/buddy',
      color: 'teal',
    },
    {
      icon: 'Bot', // ai-companion
      title: 'AI Mood Bot',
      description: 'Chat with our AI companion that provides supportive, calming, and motivational responses whenever you need someone to talk to.',
      href: '/moodbot',
      color: 'teal',
    },
    {
      icon: 'Heart', // self-care
      title: 'Daily Self-Care',
      description: 'Simple daily mental wellness challenges and positivity prompts to boost your wellbeing.',
      href: '/selfcare',
      color: 'blue',
    },
    {
      icon: 'BookOpen', // exam-stress
      title: 'Exam Stress Room',
      description: 'A dedicated safe space for students facing exam anxiety and academic pressure.',
      href: '/chat?room=exam-stress',
      color: 'orange',
    },
    {
      icon: 'Info', // career-talk -> About
      title: 'About MindLink+',
      description: 'Learn about our platform mission, purpose, and mental health awareness initiatives.',
      href: '/about',
      color: 'pink',
    },
  ];

  return (
    <div className={styles.container}>
      <LiveBackground />
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
            <Link href="/chat" className={styles.btnPrimary}>
              Start Chatting
            </Link>
            <Link href="/moodbot" className={styles.btnSecondary}>
              Talk to MoodBot
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.categories}>
        <div className={styles.maxWidth}>
          <h2 className={styles.sectionTitle}>What kind of support are you looking for?</h2>
          <div className={styles.categoryGrid}>
            <Link href="/chat?room=exam-stress" className={styles.categoryCard}>
              <div className={styles.categoryIconImage}>
                <Icon name="BookOpen" size={48} className={styles.categoryIconSvg} />
              </div>
              <h3>Exam Stress</h3>
            </Link>
            <Link href="/buddy" className={styles.categoryCard}>
              <div className={styles.categoryIconImage}>
                <Icon name="Users" size={48} className={styles.categoryIconSvg} />
              </div>
              <h3>Buddy Chat</h3>
            </Link>
            <Link href="/chat?room=career-talk" className={styles.categoryCard}>
              <div className={styles.categoryIconImage}>
                <Icon name="Briefcase" size={48} className={styles.categoryIconSvg} />
              </div>
              <h3>Career Talk</h3>
            </Link>
            <Link href="/moodbot" className={styles.categoryCard}>
              <div className={styles.categoryIconImage}>
                <Icon name="Bot" size={48} className={styles.categoryIconSvg} />
              </div>
              <h3>AI Companion</h3>
            </Link>
            <Link href="/chat?room=focus-zone" className={styles.categoryCard}>
              <div className={styles.categoryIconImage}>
                <Icon name="Target" size={48} className={styles.categoryIconSvg} />
              </div>
              <h3>Focus Zone</h3>
            </Link>
            <Link href="/selfcare" className={styles.categoryCard}>
              <div className={styles.categoryIconImage}>
                <Icon name="Heart" size={48} className={styles.categoryIconSvg} />
              </div>
              <h3>Self-Care</h3>
            </Link>
            <Link href="/chat?room=peer-support" className={styles.categoryCard}>
              <div className={styles.categoryIconImage}>
                <Icon name="MessageCircle" size={48} className={styles.categoryIconSvg} />
              </div>
              <h3>Peer Support</h3>
            </Link>
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
              &quot;MindLink+ helped me through my toughest exam week. Knowing others were going through the same thing made me feel less alone.&quot;
            </p>
            <div className={styles.testimonialAuthor}>
              <span className={styles.testimonialAvatar}></span>
              <div>
                <strong>Anonymous Fox</strong>
                <span>Computer Science, Year 3</span>
              </div>
            </div>
          </div>
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialText}>
              &quot;The MoodBot is incredible! It&apos;s like having a supportive friend available 24/7 whenever anxiety hits.&quot;
            </p>
            <div className={styles.testimonialAuthor}>
              <span className={styles.testimonialAvatar}></span>
              <div>
                <strong>Anonymous Panda</strong>
                <span>Psychology, Year 2</span>
              </div>
            </div>
          </div>
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialText}>
              &quot;Daily self-care challenges have genuinely improved my mental health routine. Simple but effective!&quot;
            </p>
            <div className={styles.testimonialAuthor}>
              <span className={styles.testimonialAvatar}></span>
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
            It&apos;s free, anonymous, and always here for you.
          </p>
          <Link href="/chat" className={styles.ctaButton}>
            Get Started – It&apos;s Free
          </Link>
          <p className={styles.ctaNote}>No sign-up required. Start chatting in seconds.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <span></span> MindLink+
          </div>
          <div className={styles.footerLinks}>
            <Link href="/">Home</Link>
            <Link href="/chat">Chat</Link>
            <Link href="/moodbot">MoodBot</Link>
            <Link href="/selfcare">Self-Care</Link>
            <Link href="/about">About</Link>
          </div>
          <p className={styles.footerText}>
            Made with  for student wellbeing
          </p>
          <p className={styles.footerDisclaimer}>
            MindLink+ is not a substitute for professional mental health care.
            If you&apos;re in crisis, please contact your local mental health helpline.
          </p>

        </div>
      </footer>
    </div>
  );
}
