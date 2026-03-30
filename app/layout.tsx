import type { Metadata } from 'next';
import { DM_Sans, Raleway } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
});

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'TaxClaim Pro — Form 843 Preparation for Tax Professionals',
  description:
    'Help your clients claim IRS penalties using the Kwong v. US ruling. Branded landing pages for tax professionals. $10/month.',
  icons: {
    icon: 'https://virtuallaunch.pro/assets/favicon.ico',
    apple: 'https://virtuallaunch.pro/assets/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${raleway.variable}`}>
      <body style={{ fontFamily: 'var(--font-body)' }}>{children}</body>
    </html>
  );
}
