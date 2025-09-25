import Link from 'next/link';
import './globals.css';
import type { Metadata } from 'next';
import { Hanken_Grotesk } from 'next/font/google';

const hanken_grotesk = Hanken_Grotesk({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RIII - #1 Super App for All Home Services',
  description: 'Book trusted professionals for cleaning, repairs, beauty services and more. Quality home services available in major cities.',
  keywords: 'home services, cleaning, repair, beauty, spa, professional services',
  authors: [{ name: 'RIII Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
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
      <body cz-shortcut-listen="false" className={`${hanken_grotesk.className} antialiased`}>
        <div id="root">{children}</div>


        <div className='wa-button absolute z-999 bottom-10 right-10 '>
          <Link href="https://wa.me/971525288716" target="_blank" className='w-[50px] h-[50px]'>
            <img src="/whatsapp-icon-free-png.webp" alt="WhatsApp" className='w-[50px] h-[50px]' />
          </Link>
        </div>


      </body>
    </html>
  );
}