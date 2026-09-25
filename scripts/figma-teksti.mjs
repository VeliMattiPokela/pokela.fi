#!/usr/bin/env node
/**
 * Figman luodut tekstit
 * ---------------------------------------------------------------
 * Figma-tiedostossa on väitteitä prosessista: montako kokoelmaa,
 * mitä build tarkistaa, miten setup pystytetään. Ne ovat samaa lajia
 * kuin README:n `<!-- luotu -->` -lohkot — johdettavissa olevaa
 * tietoa, joka käsin kirjoitettuna vanhenee hiljaa.
 *
 * Niin kävikin. Kannessa luki "6 kokoelmaa · 77 muuttujaa ·
 * 9 tekstityyliä" kun todellisuus oli 7 · 83 · 10. Tiedostossa jonka
 * kansi lupaa ettei yhtäkään arvoa ole kopioitu käsin.
 *
 * Sopimus: Figman tekstisolmu jonka **nimi** on `luotu:<id>` saa
 * sisältönsä täältä. `check:figma` lukee solmut rajapinnalla ja
 * vertaa. Nimi on sopimus, sisältö on johdettu.
 *
 * Lähteitä on kahta lajia:
 *   repo    pluginin spesifikaatio, lib/checks.ts, content/prosessi.ts
 *   Figma   tyylien määrä — rajapinta ei anna niitä erikseen
 *           (403 file_variables:read), mutta tiedostopuu listaa ne
 *
 * Aja:  ei erikseen. check:figma kutsuu tätä.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Pluginin oma spesifikaatio: kokoelmat ja muuttujat tokens.jsonista. */
function spec() {
  const source = readFileSync(join(root, 'figma-plugin/code.js'), 'utf8');
  const tokens = JSON.parse(readFileSync(join(root, 'tokens.json'), 'utf8'));
  const head = source.slice(0, source.indexOf('async function apply'));
  const build = new Function('tokens', 'figma', '__html__', `${head}\nreturn buildSpec(tokens);`);
  return build(tokens, { showUI() {}, ui: {} }, '');
}

const monikko = (n, yksi, moni) => `${n} ${n === 1 ? yksi : moni}`;

/**
 * Luodut tekstit id:n mukaan.
 *
 * @param tiedosto Figma-tiedoston puu rajapinnalta. Tarvitaan
 *   tyylien laskemiseen — `/styles`-päätepiste vastaa 403, mutta
 *   puun `styles`-kartta listaa ne.
 */
export async function tekstit(tiedosto) {
  const kokoelmat = spec();
  const muuttujia = kokoelmat.reduce((a, k) => a + k.variables.length, 0);
  const tyylit = Object.values(tiedosto?.styles ?? {});
  const tekstityylit = tyylit.filter((s) => s.styleType === 'TEXT').length;

  const { pystytys, suunnat, rajat } = await import(join(root, 'content/prosessi.ts'));
  const { checks } = await import(join(root, 'lib/checks.ts'));
  const ajossa = checks().filter((c) => c.runs);

  const ulos = {
    'kansi-luvut': [
      monikko(kokoelmat.length, 'kokoelma', 'kokoelmaa'),
      monikko(muuttujia, 'muuttuja', 'muuttujaa'),
      monikko(tekstityylit, 'tekstityyli', 'tekstityyliä'),
    ].join(' · '),

    /* Tarkistuslista johdetaan lib/checks.ts:stä, joka lukee
       package.jsonin ja CI:n työnkulun. Figma saa yleiskuvan,
       casesivu yksityiskohdat sokeine kohtineen — sama lähde, ei
       samaa tekstiä kahdesti. */
    tarkistukset:
      `${monikko(ajossa.length, 'tarkistus', 'tarkistusta')} joka buildissa: ` +
      ajossa.map((c) => c.title).join(' · '),

    rajat,
  };

  for (const v of pystytys) {
    /* Numero otsikkoon eikä erilliseksi staattiseksi tekstiksi:
       vaiheiden järjestys on sisältöä, ja käsin kirjoitettu numero
       jäisi paikalleen jos vaiheet järjestetään uudelleen. */
    ulos[`pystytys-${v.numero}-otsikko`] =
      `${String(v.numero).padStart(2, '0')} · ${v.otsikko}`;
    ulos[`pystytys-${v.numero}-teksti`] = v.teksti;
  }
  suunnat.forEach((s, i) => {
    ulos[`suunta-${i + 1}-otsikko`] = s.otsikko;
    ulos[`suunta-${i + 1}-teksti`] = s.teksti;
  });

  return ulos;
}
