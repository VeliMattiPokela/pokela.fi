#!/usr/bin/env node
/**
 * Synkkatarkistus — kuvat ↔ sisältö
 * ---------------------------------------------------------------
 * Kolme asiaa jotka eriytyvät hiljaa:
 *
 *   1. Manifesti vanhenee. `content/media.generated.json` on
 *      johdettu lähteistä ja sisällön kuvasuhteista. Jos suhde
 *      muuttuu tai lähde vaihdetaan eikä `npm run kuvat` ajeta, sivu
 *      pyytää tiedostoja joita ei ole — tai väärän rajauksen.
 *
 *   2. Orpo lähde. `kuvat/`-kansiossa on tiedosto jolle ei ole
 *      paikkaa: nimi on kirjoitettu väärin tai paikka on poistettu.
 *      Kuva on olemassa muttei näy missään, eikä mikään kerro siitä.
 *
 *   3. Tyhjä paikka. Ei virhe — paikanvaraaja on tarkoituksellinen
 *      tila — mutta se raportoidaan, jotta tietää paljonko on
 *      jäljellä.
 *
 * Laskenta tulee scripts/kuvat.mjs:stä, joten tarkistus ei voi laskea
 * eri tavalla kuin generointi. `kirjoita: false` lukee vain
 * metatiedot eikä enkoodaa mitään.
 *
 * Exit 0 = synkassa. Exit 1 = eriytymä.
 */

import { readFileSync } from 'node:fs';
import { rakenna, MANIFESTI } from './kuvat.mjs';

const { manifesti, lista, puuttuvat, orvot } = await rakenna({ kirjoita: false });

const odotettu = JSON.stringify(manifesti, null, 2) + '\n';
let levylla = null;
try {
  levylla = readFileSync(MANIFESTI, 'utf8');
} catch {
  /* Puuttuva manifesti on eriytymä siinä missä väärä. */
}

const virheet = [];
if (levylla !== odotettu) {
  virheet.push({
    kohta: 'content/media.generated.json',
    syy: levylla === null ? 'puuttuu kokonaan' : 'ei vastaa lähteitä ja kuvasuhteita',
  });
}
for (const nimi of orvot) {
  virheet.push({ kohta: `kuvat/${nimi}`, syy: 'lähteellä ei ole paikkaa sisällössä' });
}

const taynna = lista.length - puuttuvat.length;

if (virheet.length === 0) {
  console.log(
    `✓ Kuvat synkassa — ${taynna}/${lista.length} paikkaa täynnä` +
      (puuttuvat.length ? `, ${puuttuvat.length} odottaa kuvaa` : ''),
  );
  process.exit(0);
}

console.error(`\n✗ Kuvat eriytyneet: ${virheet.length} kohtaa\n`);
const leveys = Math.max(...virheet.map((v) => v.kohta.length));
for (const v of virheet) console.error(`  ${v.kohta.padEnd(leveys)}  ${v.syy}`);
console.error('\n  Aja: npm run kuvat\n');
process.exit(1);
