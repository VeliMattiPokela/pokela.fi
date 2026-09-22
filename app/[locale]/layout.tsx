import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Archivo, Bodoni_Moda } from 'next/font/google';
import '@/styles/index.css';

import { locales, localeTags, isLocale, path, type Locale } from '@/lib/i18n';
import { getDictionary } from '@/content/dictionaries';
import ThemeScript from '@/components/ThemeScript';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

/* Fontit itse tarjoiltuina: ei ulkoista pyyntöä, ei layout-hyppyä.
   Muuttujat menevät tokens.css:n --font-display / --font-ui taakse. */
const bodoni = Bodoni_Moda({
  subsets: ['latin-ext'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-bodoni',
});

const archivo = Archivo({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-archivo',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);

  return {
    title: { default: dict.meta.title, template: `%s — ${dict.meta.siteName}` },
    description: dict.meta.description,
    alternates: {
      canonical: path(locale),
      languages: Object.fromEntries(locales.map((l) => [localeTags[l], path(l)])),
    },
    /* Tiedostot syntyvät scripts/build-favicon.mjs:llä tokeneista.
       .ico on listalla ensin myös siksi että selain pyytää
       /favicon.ico:ta joka tapauksessa — ilman sitä pyyntö osuisi
       [locale]-reittiin ja kaatuisi 500:aan. */
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '48x48' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
      ],
      apple: '/apple-touch-icon.png',
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      locale: localeTags[locale],
      type: 'website',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || !locales.includes(locale)) notFound();
  const dict = getDictionary(locale as Locale);

  return (
    /* ThemeScript asettaa data-themen ennen hydraatiota, joten
       palvelimen ja selaimen <html> eroavat tarkoituksella.
       suppressHydrationWarning koskee vain tätä elementtiä. */
    <html
      lang={localeTags[locale]}
      className={`${bodoni.variable} ${archivo.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <a href="#main" className="skip-link">
          {dict.meta.skipToContent}
        </a>
        <Nav locale={locale} dict={dict} />
        <main id="main">{children}</main>
        <Footer dict={dict} />
      </body>
    </html>
  );
}
