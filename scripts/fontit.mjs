/**
 * Sivuston fontit
 * ---------------------------------------------------------------
 * Sivusto lataa fontit repon tiedostoista next/font/localilla
 * (app/fonts/fonts.ts).
 * Paketin käyttäjällä ei ole next/fontia, joten paketin styles.css
 * lataa samat fontit Google Fontsista. Lista luetaan layoutista,
 * jottei paketti ja sivu voi ladata eri painoja.
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * localFont-kutsut tiedostosta app/fonts/fonts.ts:
 * [{ nimi: 'Bodoni Moda', painot: ['400', '500'] }]. Nimi tulee
 * tiedostonimestä (BodoniModa.woff2) ja painot painoalueesta
 * ('400 500') sadan välein.
 */
export function ladatutFontit() {
  const fontit = readFileSync(join(root, 'app/fonts/fonts.ts'), 'utf8');
  return [...fontit.matchAll(/localFont\(\{([\s\S]*?)\}\);/g)]
    .map(([, asetukset]) => {
      const tiedosto = asetukset.match(/src:\s*'\.\/([A-Za-z]+)\.woff2'/)[1];
      const [min, max = min] = asetukset.match(/weight:\s*'(\d+)(?:\s+(\d+))?'/).slice(1).filter(Boolean).map(Number);
      const painot = [];
      for (let p = min; p <= max; p += 100) painot.push(String(p));
      return { nimi: tiedosto.replace(/([a-z])([A-Z])/g, '$1 $2'), painot };
    })
    .sort((a, b) => a.nimi.localeCompare(b.nimi));
}

/** Google Fontsin CSS-osoite samoille perheille ja painoille. */
export function fonttiOsoite() {
  const perheet = ladatutFontit()
    .map((f) => `family=${f.nimi.replace(/ /g, '+')}:wght@${f.painot.join(';')}`)
    .join('&');
  return `https://fonts.googleapis.com/css2?${perheet}&display=swap`;
}
