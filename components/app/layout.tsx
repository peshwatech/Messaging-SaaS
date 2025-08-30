import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './components/app/globals.css';

const geistSans = localFont({
  src: './GeistSans-Variable.woff', // Adjust the path if necessary
  variable: '--font-sans',
});

const geistMono = localFont({
  src: './GeistMono-Variable.woff', // Adjust the path if necessary
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'CampaignPro',
  description: 'A professional dashboard for managing campaigns.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
