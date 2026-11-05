import type { Locale } from '@/lib/i18n';
import fi, { type Johdetut } from './fi';
import en, { tarkistukset as enTarkistukset, ryhmat as enRyhmat, ketju as enKetju } from './en';

const byLocale: Partial<Record<Locale, Johdetut>> = { fi, en };

export function getJohdetut(locale: Locale): Johdetut {
  const teksti = byLocale[locale];
  if (!teksti) throw new Error(`Johdettuja tekstejä ei ole kielelle "${locale}".`);
  return teksti;
}

/**
 * Käännökset tunnisteen mukaan. Suomi on lähde, joten sille ei ole
 * karttaa: lähteen oma teksti näytetään sellaisenaan.
 */
const kaannokset: Partial<
  Record<
    Locale,
    {
      tarkistukset: Record<string, { title: string; huomaa: string; proves: string; items?: string[] }>;
      ryhmat: Record<string, string>;
      ketju: Record<number, { otsikko: string; teksti: string }>;
    }
  >
> = { en: { tarkistukset: enTarkistukset, ryhmat: enRyhmat, ketju: enKetju } };

/** Tarkistuksen tekstit kielellä; puuttuva käännös kaatuu (check:kielet huomaa sen jo ennen). */
export function kaannaTarkistus<T extends { id: string; title: string; huomaa: string; proves: string; items?: string[] }>(
  locale: Locale,
  check: T,
): T {
  const k = kaannokset[locale];
  if (!k) return check;
  const t = k.tarkistukset[check.id];
  if (!t) throw new Error(`Tarkistukselta "${check.id}" puuttuu käännös kielelle "${locale}".`);
  return { ...check, title: t.title, huomaa: t.huomaa, proves: t.proves, items: t.items ?? check.items };
}

export function kaannaRyhma(locale: Locale, id: string, fallback: string): string {
  return kaannokset[locale]?.ryhmat[id] ?? fallback;
}

export function kaannaLenkki<T extends { numero: number; otsikko: string; teksti: string }>(locale: Locale, lenkki: T): T {
  const k = kaannokset[locale];
  if (!k) return lenkki;
  const t = k.ketju[lenkki.numero];
  if (!t) throw new Error(`Prosessin lenkiltä ${lenkki.numero} puuttuu käännös kielelle "${locale}".`);
  return { ...lenkki, ...t };
}

export { kaannokset };
export type { Johdetut } from './fi';
