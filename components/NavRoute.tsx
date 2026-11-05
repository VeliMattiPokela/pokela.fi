'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { path, toinenKieli, vastinpolku, localeTags, type Locale } from '@/lib/i18n';
import type { Dictionary } from '@/content/dictionaries';
import Nav from './Nav';

/** Kytkee Navin sivuston sanakirjaan ja Next.js:n reitittimeen. */
export default function NavRoute({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { footer, nav } = dict;
  const polku = usePathname();
  const kohde = toinenKieli(locale);
  return (
    <Nav
      as={Link}
      brand={dict.meta.siteName}
      brandHref={path(locale)}
      currentPath={polku}
      links={[
        { href: path(locale, 'work'), label: nav.work },
        { href: path(locale, 'method'), label: nav.method },
        { href: path(locale, 'about'), label: nav.about },
      ]}
      contact={{
        label: nav.contact,
        email: footer.email,
        location: footer.location,
        link: { label: footer.linkedin, href: footer.linkedinUrl },
      }}
      labels={nav}
      language={kohde ? { href: vastinpolku(polku, kohde), short: nav.languageShort, label: nav.language, lang: localeTags[kohde] } : undefined}
    />
  );
}
