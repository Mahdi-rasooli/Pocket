import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/components/ThemeProvider';
import { I18nProvider } from '@/lib/i18n/i18n-context';
import LocaleHtmlSync from '@/components/LocaleHtmlSync';
import { CurrencyProvider } from '@/lib/currency-context';

const heading = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-heading', display: 'swap' });
const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

export const metadata: Metadata = {
  title: 'Pocket — Personal Finance Tracker',
  description: 'Track income, expenses, and savings goals.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${heading.variable} ${body.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <I18nProvider>
            <LocaleHtmlSync />
            <CurrencyProvider>
              <AuthProvider>{children}</AuthProvider>
            </CurrencyProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
