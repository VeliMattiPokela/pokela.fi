import type { Locale } from '@/lib/i18n';
import fi, { caseRefs as fiRefs } from './fi';
import type { Case } from './types';

const byLocale: Partial<Record<Locale, Case[]>> = { fi };

export function getCases(locale: Locale): Case[] {
  const cases = byLocale[locale];
  if (!cases) throw new Error(`Casedataa ei ole kielelle "${locale}".`);
  return cases;
}

export function getCase(locale: Locale, slug: string): Case | undefined {
  return getCases(locale).find((item) => item.slug === slug);
}

const refsByLocale: Partial<Record<Locale, { text: string; slug: string }[]>> = { fi: fiRefs };

/** Casejen mainnat leipätekstissä, taivutusmuotoineen. */
export function getCaseRefs(locale: Locale): { text: string; slug: string }[] {
  return refsByLocale[locale] ?? [];
}

export type { Case, Block, MediaSlot, CaseFact } from './types';
