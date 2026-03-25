import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Assuming you have a globals.css for Tailwind

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VoC Pulse',
  description: 'Know What Your Customers Really Think',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
