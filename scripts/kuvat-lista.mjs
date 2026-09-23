#!/usr/bin/env node
/**
 * Kuvapaikkojen luettelo
 * ---------------------------------------------------------------
 * Vastaa kahteen kysymykseen joihin ei muuten saa vastausta ilman
 * lähdekoodin lukemista: **miksi tiedosto pitää nimetä** ja **missä
 * kuva näkyy**.
 *
 * Luettelo johdetaan samasta lähteestä kuin putki itse, joten se ei
 * voi kertoa paikoista joita ei ole eikä unohtaa niitä jotka ovat.
 * Käsin ylläpidetty lista olisi vanhentunut ensimmäisen lisäyksen
 * kohdalla.
 *
 * Aja:  npm run kuvat:lista
 */

import { paikat, lahteet } from './kuvat.mjs';

const LOHKO = {
  media: 'yksittäinen kuva',
  pair: 'kuvapari',
  trio: 'kolmikko',
  compare: 'ennen/jälkeen',
};

const lista = (await paikat()).sort((a, b) => a.jarjestys - b.jarjestys);
const tila = (p) => (lahteet(p).every((l) => l.tiedosto) ? '✓' : ' ');

const ryhmat = new Map();
for (const p of lista) {
  if (!ryhmat.has(p.missa)) ryhmat.set(p.missa, []);
  ryhmat.get(p.missa).push(p);
}

const taynna = lista.filter((p) => tila(p) === '✓').length;

console.log(`\nKuvapaikat — ${taynna}/${lista.length} täynnä\n`);
console.log('Tiedoston nimi = tunniste. Pudota kuvat/uudet/-kansioon ja aja `npm run kuvat`.\n');

for (const [missa, omat] of ryhmat) {
  console.log(`── ${missa} ${'─'.repeat(Math.max(0, 62 - missa.length))}`);
  for (const p of omat) {
    /* Pääte on tarkoituksella pois: pudotettavan tiedoston muodolla
       ei ole väliä, vain nimellä. Putki muuntaa sen kerran. */
    const nimet = lahteet(p).map((l) => l.nimi);
    console.log(`  ${tila(p)} ${nimet.join('  +  ').padEnd(46)} ${p.ratio.padEnd(6)} ${LOHKO[p.lohko] ?? p.lohko}`);
    console.log(`      ${p.caption}`);
  }
  console.log();
}

console.log('Kuvasuhteet: hero = 4:5 mobiilissa, 16:9 tabletissa, 21:9 työpöydällä.');
console.log('Muut ovat kiinteitä. Rajaus on keskeltä — ohitus: kuvat/<nimi>.json { "rajaus": "top" }\n');
