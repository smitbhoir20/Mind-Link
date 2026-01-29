import './globals.css';
import ClientLayout from '@/components/ClientLayout';

export const metadata = {
  title: 'MindLink+ | Student Mental Wellbeing Platform',
  description: 'Your personal peer support & wellbeing platform. Connect with fellow students, get AI-powered support, and practice daily self-care.',
  keywords: 'mental health, student wellbeing, peer support, mindfulness, self-care, college stress',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
