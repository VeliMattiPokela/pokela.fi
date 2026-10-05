#!/usr/bin/env node
/**
 * Synkkatarkistus — kuvasuhteet: rajaus ↔ esitys
 * ---------------------------------------------------------------
 * Sama kuvasuhde on kirjoitettu kahteen paikkaan, ja kumpikin on
 * elossa:
 *
 *   scripts/kuvat.mjs   SUHTEET — tällä kuva RAJATAAN levylle ja
 *                       tällä kirjoitetaan <picture>:n media-kyselyt
 *   styles/base.css     .media-* — tällä kuva PIIRRETÄÄN selaimeen
 *
 * Jos ne eriytyvät, mikään ei kaadu. Kuva rajataan yhteen muotoon ja
 * näytetään toisessa: selain venyttää tai rajaa uudelleen, ja
 * lopputulos on huonompi kuin kumpikaan luku lupasi. Virhe näkyy
 * vain silmällä, ja vain jos sattuu katsomaan oikeaa kuvaa oikealla
 * leveydellä.
 *
 * Kolmas lähde on nimilista: `Ratio` tiedostossa components/Media.tsx
 * on se mitä sisältö saa kirjoittaa. Jos suhde lisätään kahteen
 * paikkaan kolmesta, se on rikki — joko sisältö ei voi käyttää sitä,
 * tai se ei piirry, tai sitä ei rajata.
 *
 * Laskenta tulee scripts/kuvat.mjs:stä, joten tarkistus ei voi lukea
 * suhteita eri tavalla kuin generointi ne käyttää.
 *
 * Exit 0 = synkassa. Exit 1 = eriytymä.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { SUHTEET } from './kuvat.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const CSS = join(root, 'styles/base.css');
const TYYPPI = join(root, 'components/Media.tsx');

const css = readFileSync(CSS, 'utf8');
const tsx = readFileSync(TYYPPI, 'utf8');

const virheet = [];
const kerro = (mika, odotettu, todellinen) => virheet.push({ mika, odotettu, todellinen });

/* ---- nimimuunnos -------------------------------------------------
   Media.tsx tekee luokkanimen samalla tavalla: `ratio.replace(':', '-')`.
   Tämä on ainoa kohta jossa tieto on kahdennettu, ja se on kirjattu
   tarkistuksen sokeaan pisteeseen (lib/checks.ts). */
const luokaksi = (avain) => `media-${avain.replace(':', '-')}`;

/* ---- 1. base.css: mitä selain piirtää ----------------------------
   Perussääntö on omalla rivillään; media-kyselyn sisällä oleva
   sääntö on yhdellä rivillä @median kanssa. Siksi perussäännön
   hahmo on ankkuroitu rivin alkuun — muuten se osuisi myös
   media-kyselyn sisältöön. */
const PERUS = /^\s*\.(media-[\w-]+)\s*\{\s*aspect-ratio:\s*([\d.]+)\s*\/\s*([\d.]+)\s*;?\s*\}/gm;
const MEDIASSA =
  /@media\s*(\([^)]*\))\s*\{\s*\.(media-[\w-]+)\s*\{\s*aspect-ratio:\s*([\d.]+)\s*\/\s*([\d.]+)\s*;?\s*\}\s*\}/g;

/** luokka -> { perus: number|null, mediat: Map<mediaehto, number> } */
const cssSuhteet = new Map();
const haeTaiLuo = (luokka) => {
  if (!cssSuhteet.has(luokka)) cssSuhteet.set(luokka, { perus: null, mediat: new Map() });
  return cssSuhteet.get(luokka);
};

for (const [, luokka, a, b] of css.matchAll(PERUS)) {
  haeTaiLuo(luokka).perus = Number(a) / Number(b);
}
for (const [, ehto, luokka, a, b] of css.matchAll(MEDIASSA)) {
  haeTaiLuo(luokka).mediat.set(ehto.trim(), Number(a) / Number(b));
}

/* ---- 2. Media.tsx: mitä sisältö saa kirjoittaa -------------------- */
const unioni = /export type Ratio\s*=\s*([^;]+);/.exec(tsx);
if (!unioni) {
  console.error('✗ components/Media.tsx: Ratio-tyyppiä ei löytynyt.');
  process.exit(1);
}
const tyypinNimet = new Set([...unioni[1].matchAll(/'([^']+)'/g)].map((m) => m[1]));

/* ---- 3. nimijoukot: kaikkien kolmen on oltava samat --------------- */
const suhteenNimet = new Set(Object.keys(SUHTEET));
const cssNimet = new Set([...cssSuhteet.keys()]);

for (const avain of suhteenNimet) {
  if (!tyypinNimet.has(avain)) {
    kerro(`nimi ${avain}`, 'Ratio-tyypissä (components/Media.tsx)', 'puuttuu tyypistä');
  }
  if (!cssNimet.has(luokaksi(avain))) {
    kerro(`nimi ${avain}`, `.${luokaksi(avain)} (styles/base.css)`, 'puuttuu CSS:stä');
  }
}
for (const nimi of tyypinNimet) {
  if (!suhteenNimet.has(nimi)) {
    kerro(`nimi ${nimi}`, 'SUHTEET (scripts/kuvat.mjs)', 'vain Ratio-tyypissä');
  }
}
for (const luokka of cssNimet) {
  const avain = [...suhteenNimet].find((a) => luokaksi(a) === luokka);
  if (!avain) kerro(`luokka .${luokka}`, 'SUHTEET (scripts/kuvat.mjs)', 'vain CSS:ssä');
}

/* ---- 4. arvot: rajaus ja esitys ovat sama luku -------------------- */
let verrattuja = 0;
const sama = (a, b) => Math.abs(a - b) < 1e-9;
const murto = (n) => n.toFixed(4).replace(/0+$/, '').replace(/\.$/, '');

for (const [avain, portaat] of Object.entries(SUHTEET)) {
  const luokka = luokaksi(avain);
  const css = cssSuhteet.get(luokka);
  if (!css) continue; /* puuttuva luokka on jo raportoitu nimenä */

  for (const porras of portaat) {
    verrattuja++;
    const missa = porras.media ? `${porras.media} ` : '';
    const cssArvo = porras.media ? css.mediat.get(porras.media) : css.perus;

    if (cssArvo === undefined || cssArvo === null) {
      kerro(
        `.${luokka} ${missa}`.trim(),
        `aspect-ratio ≈ ${murto(porras.suhde)} (kuvat.mjs: ${porras.nimi})`,
        'sääntöä ei ole base.css:ssä',
      );
      continue;
    }
    if (!sama(cssArvo, porras.suhde)) {
      kerro(
        `.${luokka} ${missa}`.trim(),
        `${murto(porras.suhde)} (kuvat.mjs rajaa tähän)`,
        `${murto(cssArvo)} (base.css piirtää tähän)`,
      );
    }
  }

  /* Ylimääräinen media-sääntö: CSS vaihtaa muotoa kohdassa jota
     rajaus ei tunne, joten siinä leveydessä näytetään väärä rajaus. */
  for (const [ehto, arvo] of css.mediat) {
    if (!portaat.some((p) => p.media === ehto)) {
      kerro(
        `.${luokka} ${ehto}`,
        'vastaava porras SUHTEET-taulussa (scripts/kuvat.mjs)',
        `vain base.css:ssä (${murto(arvo)})`,
      );
    }
  }
}

/* ---- raportti ----------------------------------------------------- */
if (virheet.length) {
  console.error('\n✗ Kuvasuhteet eriytyivät — rajaus ja esitys eivät vastaa toisiaan\n');
  for (const v of virheet) {
    console.error(`  ${v.mika}`);
    console.error(`     odotettu:   ${v.odotettu}`);
    console.error(`     todellinen: ${v.todellinen}`);
  }
  console.error(
    `\n  Lähteet: scripts/kuvat.mjs (SUHTEET) · styles/base.css (.media-*) ·` +
      ` components/Media.tsx (Ratio)\n`,
  );
  process.exit(1);
}

console.log(
  `✓ Kuvasuhteet synkassa — ${suhteenNimet.size} suhdetta, ${verrattuja} porrasta` +
    ` (kuvat.mjs ↔ base.css ↔ Media.tsx)`,
);
