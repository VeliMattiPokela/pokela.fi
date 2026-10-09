/**
 * Sivuston fontit
 * ---------------------------------------------------------------
 * Sivusto lataa fontit next/fontilla (app/[locale]/layout.tsx).
 * Paketin käyttäjällä ei ole next/fontia, joten paketin styles.css
 * lataa samat fontit Google Fontsista. Lista luetaan layoutista,
 * jottei paketti ja sivu voi ladata eri painoja.
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** next/fontin kutsut layoutista: [{ nimi: 'Bodoni Moda', painot: ['400', '500'] }]. */
export function ladatutFontit() {
  const layout = readFileSync(join(root, 'app/[locale]/layout.tsx'), 'utf8');
  return [...layout.matchAll(/=\s*([A-Z][A-Za-z_]+)\(\{([\s\S]*?)\}\);/g)]
    .map(([, kutsu, asetukset]) => ({
      nimi: kutsu.replace(/_/g, ' '),
      painot: [...(asetukset.match(/weight:\s*\[([^\]]*)\]/)?.[1] ?? '').matchAll(/'(\d+)'/g)].map((m) => m[1]),
    }))
    .sort((a, b) => a.nimi.localeCompare(b.nimi));
}

/** Google Fontsin CSS-osoite samoille perheille ja painoille. */
export function fonttiOsoite() {
  const perheet = ladatutFontit()
    .map((f) => `family=${f.nimi.replace(/ /g, '+')}:wght@${f.painot.join(';')}`)
    .join('&');
  return `https://fonts.googleapis.com/css2?${perheet}&display=swap`;
}
