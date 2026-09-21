#!/usr/bin/env node
/**
 * Synkkatarkistus — vaihe 4: kovakoodatut arvot tyyleissä
 * ---------------------------------------------------------------
 * Tokenit eivät hajoa kerralla vaan yksi kiire kerrallaan: joku
 * kirjoittaa `padding: 13px` koska asteikolla ei satu olemaan 13:a,
 * ja puolen vuoden päästä asteikko on koriste jonka vieressä elää
 * toinen, kirjoittamaton asteikko.
 *
 * Tämä tarkistus ei kiellä poikkeusta. Se vaatii poikkeukselle syyn:
 * jokainen kovakoodattu mitta tai väri on joko siirrettävä
 * tokeniksi tai kirjattava `EXEMPT`-listaan perusteluineen.
 *
 * Skannattavat: styles/base.css ja styles/components/*.css.
 * tokens.css on ulkona — se on se paikka jossa arvot määritellään.
 *
 * Exit 0 = ei kirjaamattomia arvoja. Exit 1 = on.
 */

import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const stylesDir = join(root, 'styles');

/**
 * Kirjatut poikkeukset. Avain on `ominaisuus:arvo`, ja jokaisella on
 * syy — ilman syytä riviä ei oteta vastaan. Näistä jokainen on
 * katsottu erikseen: kyse ei ole siitä ettei tokenia löytynyt, vaan
 * siitä ettei token ole oikea työkalu.
 */
const EXEMPT = {
  'base.css': {
    'width:1px': 'Ruudunlukijalle jätetty teksti: 1px + clip-path on vakioresepti, ei mitta jota säädetään.',
    'height:1px': 'Sama resepti kuin yllä.',
    'margin:-1px': 'Sama resepti kuin yllä.',
  },
  'about.css': {
    '-webkit-mask-image:#000': 'Maskissa väri on alfakanava, ei väri: #000 tarkoittaa "täysin näkyvä".',
    'mask-image:#000': 'Sama kuin yllä.',
    'grid-template-columns:300px': 'CV-rivin vuosisarake mitoitettu pisimmän vuosiluvun mukaan, ei asteikolta.',
  },
  'case.css': {
    'grid-template-columns:200px': 'Osion otsikkosarake mitoitettu sisällön mukaan.',
    'grid-template-columns:170px': 'Metasarake mitoitettu pisimmän roolitekstin mukaan.',
  },
  'compare.css': {
    'max-width:440px':
      'Kuvatekstin leveys, ei lukumitta: teksti on keskitetty 320px kehyksen alle, ja lukumitta (62ch = 497px) irrottaisi sen kuvasta. Sama 4 saraketta kuin home.css:n roolirivillä.',
    'max-width:320px': 'Ennen/jälkeen-kuvan luettavuusraja, mitoitettu kuvasisällön mukaan.',
    'width:2px': 'Jakajan kahva: piirros, ei layout-mitta.',
    'margin-left:-1px': 'Kahvan keskitys omalle leveydelleen.',
    'letter-spacing:0.1em': 'Kahvan oma välistys; meta-asteikko (0.16/0.2em) on tähän liian väljä.',
  },
  'component-view.css': {
    'grid-template-columns:180px': 'Faktalistan otsikkosarake mitoitettu pisimmän otsikon mukaan.',
    'max-height:560px': 'Koodipaneelin korkeusraja, jotta paneeli ei valtaa sivua.',
    'padding-left:3.25em': 'Rivinumerokaista skaalautuu koodin fonttikoon mukana — siksi em eikä px.',
    'width:2em': 'Sama kaista kuin yllä.',
  },
  'home.css': {
    'max-width:440px':
      'Roolirivin taittovarmistus, ei lukumitta: ilman rajaa rivi venyisi 860 pikseliin saatavuustekstiä vasten. ch ei kelpaa, koska metateksti on harvennettua eikä ch tunne letter-spacingia. Arvo on 4 saraketta 12:sta lg-tasolla (4 × 92 + 3 × 24), eli se on johdettu gridistä eikä silmällä haettu.',
  },
  'logo-row.css': {
    'height:20px': 'Fallback custom propertylle (--logo-h), ei itsenäinen arvo.',
  },
  'icon.css': {
    'vertical-align:-0.125em':
      'Ikonin optinen perusviiva. Suhteellinen fonttikokoon (1/8 em), joten se skaalautuu tekstin mukana eikä ole pituus jonka voisi tokenoida — ikoni istuu tekstin seassa kuin kirjasin, ei laatikkona sen vieressä.',
  },
  'system.css': {
    'grid-template-columns:110px': 'Tokenitaulukon nimisarake mitoitettu pisimmän tokenin nimen mukaan.',
  },
  'list-row.css': {
    'grid-template-columns:260px': 'Ison rivin roolisarake mitoitettu pisimmän roolitekstin mukaan.',
  },
};

const LENGTH = /(-?\d*\.?\d+)(px|rem|em|ch)\b/g;
const COLOR = /#[0-9a-fA-F]{3,8}\b|\brgba?\(/g;

const files = ['base.css', ...readdirSync(join(stylesDir, 'components')).map((f) => `components/${f}`)];

const unrecorded = [];
const usedExemptions = new Set();
let scanned = 0;

for (const file of files) {
  const short = file.replace('components/', '');
  const source = readFileSync(join(stylesDir, file), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

  source.split('\n').forEach((rawLine, index) => {
    /* Breakpointit ovat rajoja, eivät mittoja. */
    if (/^\s*@media/.test(rawLine)) return;
    const line = rawLine.includes('{') ? rawLine.slice(rawLine.lastIndexOf('{') + 1) : rawLine;

    for (const decl of line.split(';')) {
      if (!decl.includes(':')) continue;
      const prop = decl.slice(0, decl.indexOf(':')).trim();
      if (prop.startsWith('--')) continue; /* komponentin oma custom property */

      const values = [
        ...[...decl.matchAll(LENGTH)].filter((m) => m[1] !== '0').map((m) => m[0]),
        ...[...decl.matchAll(COLOR)].map((m) => m[0]),
        /* Paino on yksikötön, joten se ei osu pituusregexiin — ja jäi
           siksi aluksi kokonaan tarkistuksen ulkopuolelle. */
        ...(prop === 'font-weight' && /^\s*\d+\s*$/.test(decl.slice(decl.indexOf(':') + 1))
          ? [decl.slice(decl.indexOf(':') + 1).trim()]
          : []),
      ];

      for (const value of values) {
        scanned++;
        const key = `${prop}:${value}`;
        const reason = EXEMPT[short]?.[key];
        if (reason) {
          usedExemptions.add(`${short}|${key}`);
          continue;
        }
        unrecorded.push({ file, line: index + 1, key, decl: decl.trim() });
      }
    }
  });
}

/* Poikkeus joka ei enää päde kertoo että lista on jäänyt jälkeen. */
const stale = [];
for (const [short, entries] of Object.entries(EXEMPT)) {
  for (const key of Object.keys(entries)) {
    if (!usedExemptions.has(`${short}|${key}`)) stale.push(`${short} — ${key}`);
  }
}

if (unrecorded.length === 0 && stale.length === 0) {
  const recorded = Object.values(EXEMPT).reduce((n, e) => n + Object.keys(e).length, 0);
  console.log(
    `✓ Ei kovakoodattuja arvoja — ${scanned} arvoa tarkistettu, ${recorded} kirjattua poikkeusta`,
  );
  process.exit(0);
}

console.error(`\n✗ Kovakoodatut arvot: ${unrecorded.length + stale.length} kohtaa\n`);

if (unrecorded.length) {
  console.error('  Kirjaamaton arvo:');
  for (const hit of unrecorded) {
    console.error(`    ${`${hit.file}:${hit.line}`.padEnd(38)} ${hit.decl.slice(0, 50)}`);
  }
  console.error('');
}

if (stale.length) {
  console.error('  Vanhentunut poikkeus (scripts/check-hardcoded.mjs, EXEMPT):');
  for (const line of stale) console.error(`    ${line}`);
  console.error('');
}

console.error('  Siirrä arvo tokeniksi tai kirjaa poikkeus syineen, ja aja uudelleen.\n');
process.exit(1);
