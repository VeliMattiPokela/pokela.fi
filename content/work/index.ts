import type { Locale } from '@/lib/i18n';
import fi, { type Work } from './fi';

const byLocale: Partial<Record<Locale, Work>> = { fi };

export function getWork(locale: Locale): Work {
  const work = byLocale[locale];
  if (!work) throw new Error(`Työdataa ei ole kielelle "${locale}".`);
  return work;
}

export type { Work, Lead, Previous } from './fi';
