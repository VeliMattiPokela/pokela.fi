/**
 * Lokalisointi.
 * ---------------------------------------------------------------
 * `locales` = kielet jotka julkaistaan. `plannedLocales` = kaikki
 * joille rakenne on olemassa. Reitit syntyvät `locales`-listasta.
 * Suomi on lähdekieli: muut kielet seuraavat sitä, ja check:kielet
 * pitää ne samassa rakenteessa (päätös 60).
 *
 * Sanakirjan tyyppi johdetaan suomesta, joten epätäydellinen
 * käännös ei mene läpi tyypintarkistuksesta.
 */

export const plannedLocales = ['fi', 'en'] as const;
export type Locale = (typeof plannedLocales)[number];

/** Julkaistut kielet. */
export const locales: readonly Locale[] = ['fi', 'en'];

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
  method: { fi: 'tyotapa', en: 'method' },
  about: { fi: 'tietoa', en: 'about' },
} as const;

/** Case, jonka alasivu design system on (päätös 45). */
export const SYSTEM_CASE = 'portfolio';

export type Section = keyof typeof slugs;

/** Rakentaa lokalisoidun polun: path('fi', 'work') → '/fi/tyot/' */
export function path(locale: Locale, section?: Section, ...rest: string[]): string {
  const parts: string[] = [locale];
  if (section) parts.push(slugs[section][locale]);
  parts.push(...rest);
  return `/${parts.join('/')}/`;
}

/** Design systemin polku: path('fi', 'work', 'portfolio', 'system'). */
export const systemPath = (locale: Locale) => path(locale, 'work', SYSTEM_CASE, 'system');

/** Kielivalitsimen kohde: toinen julkaistu kieli, kun kieliä on kaksi. */
export function toinenKieli(locale: Locale): Locale | null {
  const muut = locales.filter((l) => l !== locale);
  return muut.length === 1 ? muut[0] : null;
}

/**
 * Saman sivun polku toisella kielellä: /fi/tyot/colliers/ →
 * /en/work/colliers/. Osion nimi käännetään `slugs`-taulusta; casejen
 * slugit ovat samat kaikilla kielillä.
 */
export function vastinpolku(pathname: string | null, kohde: Locale): string {
  const osat = (pathname ?? '').split('/').filter(Boolean);
  const lahde = osat[0];
  if (!lahde || !isLocale(lahde)) return path(kohde);
  const osio = (Object.keys(slugs) as Section[]).find((s) => slugs[s][lahde] === osat[1]);
  if (!osio) return path(kohde);
  return path(kohde, osio, ...osat.slice(2));
}
