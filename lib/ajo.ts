import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CHECK_GROUPS, checks } from './checks';
import type { Locale } from './i18n';
import { getJohdetut, kaannaRyhma, kaannaTarkistus } from '@/content/johdetut';

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
  /** Ryhmän nimi: tarkistuksen ryhmä rekisteristä tai Build. */
  ryhma: string;
};

export type Ajo = {
  alkoi: string;
  ymparisto: string;
  commit: string | null;
  muutos: string | null;
  vaiheet: Vaihe[];
  /** Next.js:n build alkoi tästä. */
  sivustoAlkoi: number;
};

type Kirjattu = {
  alkoi: string;
  ymparisto: string;
  commit: string | null;
  muutos: string | null;
  vaiheet: { id: string; kesto: number; tulos: string | null }[];
  sivustoAlkoi: number;
};

export function viimeisinAjo(locale: Locale): Ajo | null {
  const t = getJohdetut(locale).tarkistukset;
  const tiedosto = join(process.cwd(), '.ajo', 'ajo.json');
  if (!existsSync(tiedosto)) return null;
  const kirjattu = JSON.parse(readFileSync(tiedosto, 'utf8')) as Kirjattu;

  /* Nimi ja ryhmä tarkistusrekisteristä, jotta ne ovat samat kuin
     listassa. Sivuston omat tarkistukset näkyvät vain täällä, joten
     ryhmän nimi erottaa ne design systemin tarkistuksista (päätös 50). */
  const rekisteri = new Map(checks().map((c) => [c.id, kaannaTarkistus(locale, c)]));
  const ryhmat = new Map(CHECK_GROUPS.map((g) => [g.id, kaannaRyhma(locale, g.id, g.title)]));
  let alku = 0;
  const vaiheet = kirjattu.vaiheet.map((v): Vaihe => {
    const vaihe: Vaihe = {
      ...v,
      nimi: v.id === 'kuvaputki' ? t.kuvaputki : (rekisteri.get(v.id)?.title ?? v.id),
      tulos: t.naytaTulos ? v.tulos : null,
      alku,
      ryhma: v.id === 'kuvaputki' ? t.build : (ryhmat.get(rekisteri.get(v.id)?.group ?? 'ydin') ?? t.oletusryhma),
    };
    alku += v.kesto;
    return vaihe;
  });
  return { ...kirjattu, vaiheet };
}

/** 61 000 ms → "1.01" (minuutit.sekunnit), aikajanan kellonaika. */
export const kello = (ms: number) => {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}.${String(s % 60).padStart(2, '0')}`;
};

/** Kesto luettavana: "alle sekunnin", "5 s", "5 min 28 s". */
export const kesto = (ms: number, alleSekunnin = 'alle sekunnin') => {
  if (ms < 1000) return alleSekunnin;
  const s = Math.round(ms / 1000);
  return s < 60 ? `${s} s` : `${Math.floor(s / 60)} min ${s % 60} s`;
};
