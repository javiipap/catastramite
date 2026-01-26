import type React from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
// import { Analytics } from "@vercel/analytics/next"
import './globals.css';
import Providers from '@/lib/providers';
import { cn } from '@/lib/utils';
import NextTopLoader from 'nextjs-toploader';

const _geist = Geist({ subsets: ['latin'], variable: '--font-sans' });
const _geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: {
    template: '%s | Catastramite',
    default: 'Catastramite',
  },
  description: 'Bureaucracy for your Bedroom. Streamline your power dynamics with official forms, request tracking, and automated compliance auditing.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        _geist.variable,
        _geistMono.variable
      )}>
        <Providers>
          <NextTopLoader />

          {children}
        </Providers>
        {/* <Analytics /> */}
      </body>
    </html>
  );
}
