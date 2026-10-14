import type { Locale } from '@/lib/i18n';
import fi, { type Tyotapa } from './fi';

const byLocale: Partial<Record<Locale, Tyotapa>> = { fi };

export function getTyotapa(locale: Locale): Tyotapa {
  const sisalto = byLocale[locale];
  if (!sisalto) throw new Error(`Työtapa-sisältöä ei ole kielelle "${locale}".`);
  return sisalto;
}

export type { Tyotapa } from './fi';
