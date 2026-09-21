#!/usr/bin/env node
/**
 * Julkaisee tokens.jsonin sivuston mukana osoitteeseen /tokens.json.
 * ---------------------------------------------------------------
 * Figma-plugin ei pääse paikalliseen tiedostojärjestelmään, joten se
 * hakee tokenit verkosta. Kopio syntyy buildissa eikä ole
 * versionhallinnassa — silloin se ei voi olla vanhentunut.
 *
 * Sivusto julkaisee siis omat designtokeninsa pysyvään osoitteeseen.
 * Se on myös casen kannalta oikea asia: kuka tahansa voi tarkistaa
 * mistä arvoista sivusto on tehty.
 *
 * Kopio menee `out/`:iin, ei `public/`:iin, ja ajetaan vasta
 * `next build`:n jälkeen. Syy on konkreettinen: Storybook mappaa
 * `public/`:n Viten publicDiriksi (.storybook/main.ts staticDirs),
 * ja Vite kieltää publicDirissä olevan tiedoston importoinnin
 * JavaScriptistä. `public/tokens.json` törmäsi siihen samaan
 * `tokens.json`:iin jonka .storybook/preview.tsx importoi, ja koko
 * moduuligraafi hajosi — 12 testitiedostoa kaatui virheeseen joka ei
 * maininnut tokeneita sanallakaan. Generoitu tiedosto ei kuulu
 * lähdehakemistoon.
 */

import { copyFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/* Siivoaa aiemman version jättämän kopion. Jos se jää, Storybookin
   testiajo kaatuu yllä kuvatulla tavalla. */
const stale = join(root, 'public/tokens.json');
if (existsSync(stale)) {
  rmSync(stale);
  console.log('· poistettiin vanha public/tokens.json');
}

const outDir = join(root, 'out');
if (!existsSync(outDir)) {
  console.error('✗ out/ puuttuu — aja tämä vasta `next build`:n jälkeen.');
  process.exit(1);
}

copyFileSync(join(root, 'tokens.json'), join(outDir, 'tokens.json'));

console.log('✓ tokens.json julkaistu → out/tokens.json (/tokens.json)');
