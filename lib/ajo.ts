import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { checks } from './checks';

/**
 * Buildin vaiheet sivulla.
 * ---------------------------------------------------------------
 * scripts/ajo.mjs kirjaa jokaisen vaiheen keston ja tuloksen
 * tiedostoon .ajo/ajo.json ennen Next.js:n buildia. Tämä lukee sen,
 * joten case 03 näyttää sen buildin, joka sen rakensi.
 *
 * Tiedostoa ei ole, jos sivu rakennetaan ilman ajo.mjs:ää (next dev,
 * pelkkä next build). Silloin palautetaan null, eikä aikajanaa
 * keksitä.
 */

export type Vaihe = {
  id: string;
  nimi: string;
  /** Alkuhetki buildin alusta, millisekunteina. */
  alku: number;
  kesto: number;
  tulos: string | null;
  ryhma: 'Synkka' | 'Build';
};

export type Ajo = {
  alkoi: string;
  ymparisto: string;
  commit: string | null;
  muutos: string | null;
  vaiheet: Vaihe[];
  /** Next.js:n build alkoi tästä. */
  sivustoAlkoi: number;
  hitain: Vaihe;
};

type Kirjattu = {
  alkoi: string;
  ymparisto: string;
  commit: string | null;
  muutos: string | null;
  vaiheet: { id: string; kesto: number; tulos: string | null }[];
  sivustoAlkoi: number;
};

export function viimeisinAjo(): Ajo | null {
  const tiedosto = join(process.cwd(), '.ajo', 'ajo.json');
  if (!existsSync(tiedosto)) return null;
  const kirjattu = JSON.parse(readFileSync(tiedosto, 'utf8')) as Kirjattu;

  /* Nimi tarkistusrekisteristä, jotta se on sama kuin listassa. */
  const nimet = new Map(checks().map((c) => [c.id, c.title]));
  let alku = 0;
  const vaiheet = kirjattu.vaiheet.map((v): Vaihe => {
    const vaihe: Vaihe = {
      ...v,
      nimi: v.id === 'kuvaputki' ? 'Kuvat ja videot' : (nimet.get(v.id) ?? v.id),
      alku,
      ryhma: v.id === 'kuvaputki' ? 'Build' : 'Synkka',
    };
    alku += v.kesto;
    return vaihe;
  });
  const hitain = vaiheet.reduce((a, b) => (b.kesto > a.kesto ? b : a));
  return { ...kirjattu, vaiheet, hitain };
}

/** 61 000 ms → "1.01" (minuutit.sekunnit), aikajanan kellonaika. */
export const kello = (ms: number) => {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}.${String(s % 60).padStart(2, '0')}`;
};

/** Kesto luettavana: "alle sekunnin", "5 s", "5 min 28 s". */
export const kesto = (ms: number) => {
  if (ms < 1000) return 'alle sekunnin';
  const s = Math.round(ms / 1000);
  return s < 60 ? `${s} s` : `${Math.floor(s / 60)} min ${s % 60} s`;
};
