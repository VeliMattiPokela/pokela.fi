#!/usr/bin/env node
/**
 * Synkkatarkistus — favicon ↔ tokenit
 * ---------------------------------------------------------------
 * public/-kansion favicon-tiedostot ovat johdettuja artefakteja: ne
 * lasketaan tokens.css:n käännetystä väriparista. Binääri repossa ei
 * kerro mistä se on tullut, joten ilman tätä tarkistusta paletin
 * muutos jättäisi ikonin vanhaan sävyyn kenenkään huomaamatta.
 *
 * Laskenta tulee scripts/build-favicon.mjs:stä. Tarkistus ei siis voi
 * laskea eri tavalla kuin generointi — se vain vertaa tulosta levyyn.
 *
 * Havaitsee myös käsin muokatun tiedoston, koska vertailu on
 * tavu tavulta.
 *
 * Exit 0 = ajan tasalla. Exit 1 = eriytymä.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tiedostot, varit, root } from './build-favicon.mjs';

const lista = await tiedostot();

const eriytyneet = lista.filter(({ polku, sisalto }) => {
  try {
    return !readFileSync(join(root, polku)).equals(sisalto);
  } catch {
    return true;
  }
});

if (eriytyneet.length === 0) {
  console.log(
    `✓ Favicon ajan tasalla — ${lista.length} tiedostoa vastaa tokeneita ` +
      `(pinta ${varit.vaaleaPinta} / muste ${varit.vaaleaMuste})`,
  );
  process.exit(0);
}

console.error(`\n✗ Favicon eriytynyt tokeneista: ${eriytyneet.length}/${lista.length} tiedostoa\n`);
for (const t of eriytyneet) console.error(`  ${t.polku}`);
console.error('\n  Aja: npm run build:favicon\n');
process.exit(1);
