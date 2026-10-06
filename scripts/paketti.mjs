#!/usr/bin/env node
/**
 * Rakentaa npm-paketin tokeneista.
 * ---------------------------------------------------------------
 * Miksi tämä on olemassa: Figma Make osaa lukea design-systeemin
 * vain npm-pakettina. Niin kauan kuin tokenit ovat `tokens.json`
 * tässä repossa, Make ei näe niistä mitään ja arvaa värit itse.
 *
 * Paketti on kokonaan johdettu — myös sen `package.json`. Siksi
 * versio tulee `$meta.version`:stä eikä ole toinen luku jota pitäisi
 * muistaa nostaa, eikä paketti voi sisältää tokenia jota lähteessä
 * ei ole.
 *
 * Koko hakemisto on `.gitignore`ssa ja syntyy komennolla
 * `npm run paketti`. Johdannaista ei säilytetä versionhallinnassa:
 * se olisi kopio joka voi vanhentua, ja koko tämän repon argumentti
 * on ettei sellaisia pidetä.
 *
 * Paketilla ei ole riippuvuuksia. Se on Figma Maken vaatimus
 * (workspace-riippuvuudet eivät toimi siellä) ja muutenkin oikein:
 * tokenit ovat dataa, eivät koodia.
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export const root = join(dirname(fileURLToPath(import.meta.url)), '..');
export const PAKETTI = join(root, 'packages/tokens');

const NIMI = '@pokela/tokens';
const LISENSSI = 'MIT';
const TEKIJA = 'Veli-Matti Pokela';
const VUOSI = 2026;

/* Selitykset ovat lähteessä tokenien sisarina (`typeNote`,
   `spaceNote`, …). Paketissa ne eivät ole dataa vaan dokumentaatiota,
   joten ne irrotetaan ja kiinnitetään siihen vientiin jota ne
   koskevat. Kartta on käsin kirjoitettu tarkoituksella: arvaaminen
   nimen perusteella menisi joskus väärin ja hiljaa. */
const SELITYKSET = {
  type: ['typeNote'],
  weight: ['weightNote'],
  space: ['spaceNote'],
  layout: ['measureNote'],
  icon: ['iconNote'],
  lineHeightScale: ['lineHeightNote'],
};

/* Mitkä lähteen avaimet viedään ja millä nimellä. Järjestys on
   paketin tiedostossa sama kuin tässä. */
const VIENNIT = [
  ['meta', '$meta'],
  ['modes', '$modes'],
  ['color', 'color'],
  ['font', 'font'],
  ['type', 'type'],
  ['typeScale', 'typeScale'],
  ['lineHeightScale', 'lineHeightScale'],
  ['weight', 'weight'],
  ['space', 'space'],
  ['layout', 'layout'],
  ['border', 'border'],
  ['icon', 'icon'],
  ['motion', 'motion'],
];

/* ---- apurit -------------------------------------------------------- */

const onObjekti = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

/** Poistaa `$note`-avaimet syvältä ja palauttaa ne erikseen. */
function irrotaNotet(arvo, kerätyt = []) {
  if (Array.isArray(arvo)) return [arvo.map((a) => irrotaNotet(a, kerätyt)[0]), kerätyt];
  if (!onObjekti(arvo)) return [arvo, kerätyt];
  const ulos = {};
  for (const [avain, sisus] of Object.entries(arvo)) {
    if (avain === '$note') {
      kerätyt.push(sisus);
      continue;
    }
    ulos[avain] = irrotaNotet(sisus, kerätyt)[0];
  }
  return [ulos, kerätyt];
}

/** JS-literaali. Avain lainausmerkeissä vain jos se ei ole tunniste. */
function js(arvo, syvyys = 0) {
  const sisennys = '  '.repeat(syvyys + 1);
  const sulku = '  '.repeat(syvyys);
  if (Array.isArray(arvo)) return `[${arvo.map((a) => js(a, syvyys)).join(', ')}]`;
  if (!onObjekti(arvo)) return JSON.stringify(arvo);
  const rivit = Object.entries(arvo).map(
    ([k, v]) => `${sisennys}${/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${js(v, syvyys + 1)},`,
  );
  return `{\n${rivit.join('\n')}\n${sulku}}`;
}

/**
 * TypeScript-muoto. Avaimet säilyvät, arvot levennetään
 * (`string` / `number`). Niin autotäydennys toimii, mutta tokenin
 * arvon muuttaminen ei ole rikkova tyyppimuutos.
 */
function ts(arvo, syvyys = 0) {
  const sisennys = '  '.repeat(syvyys + 1);
  const sulku = '  '.repeat(syvyys);
  if (Array.isArray(arvo)) {
    const alkiot = [...new Set(arvo.map((a) => ts(a, syvyys)))];
    return `readonly ${alkiot.length === 1 ? alkiot[0] : `(${alkiot.join(' | ')})`}[]`;
  }
  if (!onObjekti(arvo)) return typeof arvo === 'number' ? 'number' : 'string';
  const rivit = Object.entries(arvo).map(
    ([k, v]) =>
      `${sisennys}readonly ${/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${ts(v, syvyys + 1)};`,
  );
  return `{\n${rivit.join('\n')}\n${sulku}}`;
}

/** Monirivinen JSDoc, tai tyhjä jos selitystä ei ole. */
function jsdoc(tekstit) {
  const osat = tekstit.filter(Boolean);
  if (!osat.length) return '';
  const rivit = osat.flatMap((t) => rivitä(t, 72));
  return `/**\n${rivit.map((r) => ` * ${r}`).join('\n')}\n */\n`;
}

function rivitä(teksti, leveys) {
  const sanat = teksti.split(/\s+/);
  const rivit = [];
  let rivi = '';
  for (const sana of sanat) {
    if (rivi && rivi.length + 1 + sana.length > leveys) {
      rivit.push(rivi);
      rivi = sana;
    } else {
      rivi = rivi ? `${rivi} ${sana}` : sana;
    }
  }
  if (rivi) rivit.push(rivi);
  return rivit;
}

/* ---- rakennus ------------------------------------------------------ */

export function rakenna({ kirjoita = true } = {}) {
  const lahde = JSON.parse(readFileSync(join(root, 'tokens.json'), 'utf8'));
  const css = readFileSync(join(root, 'styles/tokens.css'), 'utf8');

  const tiedostot = {};

  /* --- index.js ja index.d.ts --- */
  const jsOsat = [];
  const tsOsat = [];
  const viedytNimet = [];

  for (const [vientiNimi, lahdeAvain] of VIENNIT) {
    const raaka = lahde[lahdeAvain];
    if (raaka === undefined) throw new Error(`tokens.json: avain ${lahdeAvain} puuttuu`);

    const [data, sisaisetNotet] = irrotaNotet(raaka);
    const ulkoiset = (SELITYKSET[vientiNimi] ?? []).map((a) => lahde[a]);
    const doc = jsdoc([...ulkoiset, ...sisaisetNotet]);

    jsOsat.push(`${doc}export const ${vientiNimi} = ${js(data)};`);
    tsOsat.push(`${doc}export declare const ${vientiNimi}: ${ts(data)};`);
    viedytNimet.push(vientiNimi);
  }

  const oletus = `{ ${viedytNimet.join(', ')} }`;
  const otsikko =
    `/* ${NIMI} — generoitu tiedostosta tokens.json.\n` +
    `   Älä muokkaa: aja \`npm run paketti\`. */\n\n`;

  tiedostot['index.js'] = `${otsikko}${jsOsat.join('\n\n')}\n\nexport default ${oletus};\n`;
  tiedostot['index.d.ts'] =
    `${otsikko}${tsOsat.join('\n\n')}\n\n` +
    `declare const _default: { ${viedytNimet.map((n) => `${n}: typeof ${n}`).join('; ')} };\n` +
    `export default _default;\n`;

  /* --- tokens.css ja tokens.json sellaisenaan ---
     CSS on se artefakti jota selain oikeasti lukee, ja tokens.json
     on lähde jota työkalut osaavat lukea. Molemmat kuuluvat
     pakettiin: ilman CSS:ää paketin käyttäjä joutuisi kirjoittamaan
     muuttujat itse. */
  tiedostot['tokens.css'] = css;
  tiedostot['tokens.json'] = JSON.stringify(lahde, null, 2) + '\n';

  /* --- package.json ---
     Lisenssi on MIT ja koskee VAIN tätä pakettia, ei repoa. Paketissa
     on omat väri- ja mitta-arvot, joilla ei ole arvoa muille, joten
     vapaa lisenssi ei anna pois mitään. Ilman lisenssiä paketti taas
     olisi monelle yritykselle automaattinen ei.

     Repon juuressa ei ole LICENSE-tiedostoa eikä sellaista lisätä
     tässä: repossa on asiakastyön kuvia ja casetekstejä, joita ei voi
     lisensoida ohjelmistolisenssillä. */
  tiedostot['package.json'] =
    JSON.stringify(
      {
        name: NIMI,
        version: lahde.$meta.version,
        description: `Design-tokenit: ${lahde.$meta.name}. Generoitu, ei käsin ylläpidetty.`,
        license: LISENSSI,
        author: TEKIJA,
        type: 'module',
        sideEffects: ['*.css'],
        exports: {
          '.': { types: './index.d.ts', import: './index.js' },
          './tokens.css': './tokens.css',
          './tokens.json': './tokens.json',
        },
        files: ['index.js', 'index.d.ts', 'tokens.css', 'tokens.json', 'README.md', 'LICENSE'],
        repository: {
          type: 'git',
          url: 'git+https://github.com/VeliMattiPokela/pokela.fi.git',
          directory: 'packages/tokens',
        },
      },
      null,
      2,
    ) + '\n';

  /* --- LICENSE --- */
  tiedostot['LICENSE'] = lisenssiteksti();

  /* --- README --- */
  tiedostot['README.md'] = lueMinut(lahde, viedytNimet);

  if (kirjoita) {
    if (existsSync(PAKETTI)) rmSync(PAKETTI, { recursive: true });
    mkdirSync(PAKETTI, { recursive: true });
    for (const [nimi, sisalto] of Object.entries(tiedostot)) {
      writeFileSync(join(PAKETTI, nimi), sisalto);
    }
  }

  return { tiedostot, viedytNimet, versio: lahde.$meta.version };
}

function lisenssiteksti() {
  return `MIT License

Copyright (c) ${VUOSI} ${TEKIJA}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;
}

function lueMinut(lahde, nimet) {
  const moodit = Object.entries(lahde.$modes)
    .filter(([k]) => !k.startsWith('$'))
    .map(([k, v]) => `- \`${k}\` — ${v.values.join(', ')}`)
    .join('\n');

  return `# ${NIMI}

Design-tokenit: **${lahde.$meta.name}**, versio ${lahde.$meta.version}.

> Tämä paketti on generoitu tiedostosta \`tokens.json\`. Älä muokkaa sitä
> käsin — muutokset tehdään lähteeseen ja paketti rakennetaan uudelleen
> komennolla \`npm run paketti\`.

## Käyttö

\`\`\`js
import tokens, { color, space } from '${NIMI}';
import '${NIMI}/tokens.css';

color.light.ink;   // '${lahde.color.light.ink}'
space['24'];       // '${lahde.space['24']}'
\`\`\`

CSS-muuttujat tulevat \`tokens.css\`:stä, esimerkiksi \`var(--ink)\` ja
\`var(--space-24)\`. Teema vaihtuu attribuutilla \`data-theme\`, ja ilman
sitä se seuraa käyttöjärjestelmää.

## Viennit

${nimet.map((n) => `- \`${n}\``).join('\n')}

## Lisenssi

${LISENSSI}. Koskee tätä pakettia, ei sitä repoa josta se on generoitu.

## Moodit

Moodi on ulottuvuus jolla tokenin arvo vaihtelee.

${moodit}

Teema (vaalea/tumma) hoituu CSS:ssä \`data-theme\`-attribuutilla, joten
sitä ei tarvitse valita koodista.
`;
}

/* ---- komentorivi --------------------------------------------------- */

if (import.meta.url === `file://${process.argv[1]}`) {
  const { tiedostot, viedytNimet, versio } = rakenna();
  console.log(`\n✓ Paketti rakennettu — ${NIMI} ${versio}`);
  console.log(`  ${Object.keys(tiedostot).length} tiedostoa, ${viedytNimet.length} vientiä`);
  console.log(`  packages/tokens/\n`);
}
