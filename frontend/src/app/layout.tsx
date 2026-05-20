import type { Metadata } from 'next';
import { Poppins, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import LayoutWrapper from '@/components/layout/LayoutWrapper';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
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
    <html lang="en" className={`${poppins.variable} ${jetbrainsMono.variable}`}>
      <body className={`${poppins.className} min-h-screen bg-void text-textPrimary antialiased`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
