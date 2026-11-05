import type { Locale } from '@/lib/i18n';
import fi, { type System } from './fi';
import en from './en';

const byLocale: Partial<Record<Locale, System>> = { fi, en };

export function getSystem(locale: Locale): System {
  const teksti = byLocale[locale];
  if (!teksti) throw new Error(`System-sivun tekstejä ei ole kielelle "${locale}".`);
  return teksti;
}

/** Täyttää `{nimi}`-paikat: täytä('{n} merkkiä', { n: 12 }) → '12 merkkiä'. */
export const tayta = (teksti: string, arvot: Record<string, string | number>) =>
  teksti.replace(/\{(\w+)\}/g, (_, k: string) => String(arvot[k] ?? `{${k}}`));

export type { System } from './fi';
