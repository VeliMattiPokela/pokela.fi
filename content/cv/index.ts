import type { Locale } from '@/lib/i18n';
import fi, { type Cv } from './fi';

const byLocale: Partial<Record<Locale, Cv>> = { fi };

export function getCv(locale: Locale): Cv {
  const cv = byLocale[locale];
  if (!cv) throw new Error(`CV-dataa ei ole kielelle "${locale}".`);
  return cv;
}

export type { Cv, Job } from './fi';
