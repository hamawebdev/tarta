import type { Metadata } from "next";
import { Manrope, Tajawal } from 'next/font/google';
import "./globals.css";
import { ThemeProvider } from '@/components/theme-provider';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import { LanguageSwitcher } from '@/components/language-switcher';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
});

const tajawal = Tajawal({
  variable: '--font-tajawal',
  subsets: ['arabic'],
  weight: ['400', '700'],
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');

  return {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={`${manrope.variable} ${tajawal.variable} font-sans`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <LanguageSwitcher />
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}