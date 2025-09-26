import Link from 'next/link';
import './globals.css';
import type { Metadata } from 'next';
import { Hanken_Grotesk } from 'next/font/google';
import Image from 'next/image';

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


        <div className='fixed z-50 bottom-[15%] right-10 sm:bottom-[15%] sm:right-10 md:bottom-[15%] md:right-8 lg:bottom-[15%] lg:right-10'>
          <Link href="https://wa.me/971525288716" target="_blank" rel="noopener noreferrer" className='block w-10 h-10 sm:w-10 sm:h-10 md:w-10 md:h-10 relative'>
            <Image 
              src="/whatsapp-icon-free-png.webp" 
              alt="WhatsApp" 
              fill 
              className='object-contain hover:scale-110 transition-transform duration-200' 
              sizes="(max-width: 640px) 48px, (max-width: 768px) 56px, 64px"
            />
          </Link>
        </div>


      </body>
    </html>
  );
}