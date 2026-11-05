import type { Locale } from '@/lib/i18n';
import fi, { type Dictionary } from './fi';
import en from './en';

/** Sanakirjat kielittäin. */
const dictionaries: Partial<Record<Locale, Dictionary>> = { fi, en };

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
