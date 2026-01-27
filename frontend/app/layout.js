import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'MindLink+ | Student Mental Wellbeing Platform',
  description: 'Your personal peer support & wellbeing platform. Connect with fellow students, get AI-powered support, and practice daily self-care.',
  keywords: 'mental health, student wellbeing, peer support, mindfulness, self-care, college stress',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
