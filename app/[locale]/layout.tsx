import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { bodoni, archivo } from '@/app/fonts/fonts';
import '@/styles/index.css';

import { locales, localeTags, isLocale, path, type Locale } from '@/lib/i18n';
import { getDictionary } from '@/content/dictionaries';
import ThemeScript from '@/components/ThemeScript';
import { HeroIntroScript } from '@/components/HeroIntro';
import NavRoute from '@/components/NavRoute';
import PageProgressRoute from '@/components/PageProgressRoute';
import Footer from '@/components/Footer';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

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
        <HeroIntroScript kotipolku={path(locale as Locale)} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          {dict.meta.skipToContent}
        </a>
        <PageProgressRoute />
        <NavRoute locale={locale} dict={dict} />
        <main id="main">{children}</main>
        <Footer
          cta={dict.footer.ctaLines}
          contact={{
            email: dict.footer.email,
            location: dict.footer.location,
            link: { label: dict.footer.linkedin, href: dict.footer.linkedinUrl },
          }}
          legal={[
            `© ${dict.footer.year} ${dict.home.name}`,
            `${dict.footer.colophonLabel} — ${dict.footer.colophon}`,
          ]}
        />
        {/* Vercelin kävijä- ja nopeusmittaus (päätös 59). Evästeetön, joten
            suostumusbanneria ei tarvita. Skriptit tulevat Vercelin omasta
            /_vercel-polusta, ja ne toimivat vain, kun mittaus on
            projektin asetuksissa päällä. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
