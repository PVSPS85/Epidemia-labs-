import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Epidemia-Labs | Disease Spread Simulation Platform',
  description:
    'Professional-grade epidemiological research platform for real-time disease tracking, SIR/SEIR simulation modeling, and global outbreak analytics.',
  keywords: ['epidemiology', 'SIR model', 'disease simulation', 'outbreak tracking'],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className={`${inter.className} min-h-screen bg-background text-textPrimary antialiased`}>
        {children}
      </body>
    </html>
  );
}
