import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RIII - #1 Super App for All Home Services',
  description: 'Book trusted professionals for cleaning, repairs, beauty services and more. Quality home services available in major cities.',
  keywords: 'home services, cleaning, repair, beauty, spa, professional services',
  authors: [{ name: 'RIII Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'RIII - #1 Super App for All Home Services',
    description: 'Book trusted professionals for cleaning, repairs, beauty services and more.',
    url: 'https://riii.com',
    siteName: 'RIII',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RIII - #1 Super App for All Home Services',
    description: 'Book trusted professionals for cleaning, repairs, beauty services and more.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#2563eb" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}