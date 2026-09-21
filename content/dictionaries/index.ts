import type { Locale } from '@/lib/i18n';
import fi, { type Dictionary } from './fi';

/** Sanakirjat kielittäin. EN lisätään tähän kun tekstit on kirjoitettu. */
const dictionaries: Partial<Record<Locale, Dictionary>> = { fi };

export function getDictionary(locale: Locale): Dictionary {
  const dict = dictionaries[locale];
  if (!dict) {
    throw new Error(
      `Sanakirjaa ei ole kielelle "${locale}". Lisää content/dictionaries/${locale}.ts ja rekisteröi se tähän.`,
    );
  }
  return dict;
}

export type { Dictionary };
