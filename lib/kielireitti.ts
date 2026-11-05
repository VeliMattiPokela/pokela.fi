import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { locales, slugs, type Locale, type Section } from './i18n';

/**
 * Osioiden osoitteet ovat kielen mukaan (`slugs` lib/i18n.ts:ssä):
 * /fi/tyot/ ja /en/work/. Next.js rakentaa sivun kansion nimestä,
 * joten kummallakin osoitteella on oma ohut page.tsx, ja sisältö on
 * yhteinen (app/_sivut/). Kansio näytetään vain kielillä, joiden
 * osoite se on — muuten /en/tyot/ ja /fi/work/ syntyisivät myös.
 */
export const kansionKielet = (osio: Section, kansio: string): Locale[] =>
  locales.filter((l) => slugs[osio][l] === kansio);

/** Kääre sivulle, joka ei itse saa kansiotaan propsina. */
export function kansiolle<P extends { params: Promise<{ locale: string }> }>(
  osio: Section,
  kansio: string,
  Sivu: (props: P) => Promise<ReactNode>,
) {
  const kielet = kansionKielet(osio, kansio);
  return async function Kielisivu(props: P) {
    const { locale } = await props.params;
    if (!kielet.includes(locale as Locale)) notFound();
    return Sivu(props);
  };
}
