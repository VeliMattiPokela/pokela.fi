import type { Locale } from '@/lib/i18n';
import fi, { type Work } from './fi';
import en from './en';

const byLocale: Partial<Record<Locale, Work>> = { fi, en };

export function getWork(locale: Locale): Work {
  const work = byLocale[locale];
  if (!work) throw new Error(`Työdataa ei ole kielelle "${locale}".`);
  return work;
}

export type { Work, Lead, Previous, PreviousMedia, PreviousMediaGroup } from './fi';
