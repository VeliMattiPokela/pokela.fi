/**
 * Lokalisointi.
 * ---------------------------------------------------------------
 * `locales` = kielet jotka julkaistaan. `plannedLocales` = kaikki
 * joille rakenne on olemassa. EN-tekstejä ei ole vielä kirjoitettu,
 * joten se on suunnitelmissa muttei buildissa — reitit syntyvät
 * `locales`-listasta, joten EN kytketään päälle lisäämällä se tähän.
 *
 * Sanakirjan tyyppi johdetaan suomesta, joten epätäydellinen
 * käännös ei mene läpi tyypintarkistuksesta.
 */

export const plannedLocales = ['fi', 'en'] as const;
export type Locale = (typeof plannedLocales)[number];

/** Julkaistut kielet. Lisää 'en' kun tekstit ovat valmiit. */
export const locales: readonly Locale[] = ['fi'];

export const defaultLocale: Locale = 'fi';

export const localeNames: Record<Locale, string> = {
  fi: 'Suomi',
  en: 'English',
};

/** hreflang-koodit. */
export const localeTags: Record<Locale, string> = {
  fi: 'fi-FI',
  en: 'en',
};

export const isLocale = (value: string): value is Locale =>
  (plannedLocales as readonly string[]).includes(value);

/**
 * Polkujen palaset kielittäin. Kun EN otetaan käyttöön, sen slugit
 * voi kääntää tästä yhdestä paikasta ilman että reittitiedostoja
 * tarvitsee koskea.
 */
export const slugs = {
  work: { fi: 'tyot', en: 'work' },
  about: { fi: 'tietoa', en: 'about' },
  system: { fi: 'system', en: 'system' },
} as const;

export type Section = keyof typeof slugs;

/** Rakentaa lokalisoidun polun: path('fi', 'work') → '/fi/tyot/' */
export function path(locale: Locale, section?: Section, ...rest: string[]): string {
  const parts: string[] = [locale];
  if (section) parts.push(slugs[section][locale]);
  parts.push(...rest);
  return `/${parts.join('/')}/`;
}
