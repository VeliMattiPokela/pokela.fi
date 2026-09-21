#!/usr/bin/env node
/**
 * Synkkatarkistus — vaihe 6: dokumentaatio ↔ todellisuus
 * ---------------------------------------------------------------
 * Dokumentaatio eriytyy samalla tavalla kuin koodi ja Figma, ja
 * huomaamattomammin: väärä luku README:ssä ei kaada mitään. Tässä
 * projektissa se on pahempi kuin muualla, koska sivuston argumentti
 * on että jokaisen väitteen voi tarkistaa.
 *
 * Auditissa 21.9.2026 löytyi kolme eriytymää: Storybookin etusivu
 * lupasi "ei matkalla käsityötä" ja "ei ikoneita paitsi nuolet",
 * ja pluginin README väitti Border-kokoelmassa olevan 4 muuttujaa
 * (5) eikä tuntenut Icon-kokoelmaa lainkaan.
 *
 * Neljä sääntöä:
 *
 *   1. Luodut lohkot. `<!-- luotu:<id> -->…<!-- /luotu -->` -väli
 *      verrataan generaattorin tulokseen. Korjaa `--korjaa`.
 *   2. Polut. Dokumentissa mainittu tiedostopolku on olemassa.
 *   3. Komennot. Mainittu `npm run x` on package.jsonissa.
 *   4. Kattavuus. Jokainen `scripts/check-*.mjs` on mainittu
 *      README:ssä — uutta tarkistusta ei voi lisätä hiljaa.
 *
 * Proosaa tämä ei voi todentaa. Siksi kaikki mikä on johdettavissa
 * merkitään luoduksi lohkoksi eikä kirjoiteta käsin.
 *
 * Exit 0 = dokumentaatio ajan tasalla. Exit 1 = eriytymä.
 */

import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const fix = process.argv.includes('--korjaa');

const DOCS = [
  'README.md',
  'figma-plugin/README.md',
  'stories/Aloita.mdx',
  ...readdirSync(join(root, 'stories/perusta')).map((f) => `stories/perusta/${f}`),
];

/**
 * Polut jotka saavat puuttua. Jokaisella on syy — sama sääntö kuin
 * kovakoodatuilla arvoilla.
 */
const MISSING_OK = {
  '/cv/veli-matti-pokela-cv.pdf': 'Avoin kohta: CV-PDF puuttuu, linkki on jo paikallaan.',
};

/* ---- generaattorit -------------------------------------------------- */

/** Figman muuttujakokoelmat pluginin omasta spesifikaatiosta. */
function figmaCollections() {
  const source = readFileSync(join(root, 'figma-plugin/code.js'), 'utf8');
  const tokens = JSON.parse(readFileSync(join(root, 'tokens.json'), 'utf8'));
  const head = source.slice(0, source.indexOf('async function apply'));
  const build = new Function('tokens', 'figma', '__html__', `${head}\nreturn buildSpec(tokens);`);
  const spec = build(tokens, { showUI() {}, ui: {} }, '');
  return [
    '| Kokoelma | Moodit | Muuttujia |',
    '|---|---|---|',
    ...spec.map((g) => `| ${g.collection} | ${g.modes.join(', ')} | ${g.variables.length} |`),
  ].join('\n');
}

/** Perusta-sivut Storybookin otsikoista, siinä järjestyksessä kuin ne näkyvät. */
function perustaPages() {
  const order = /order:\s*\[[\s\S]*?'Perusta',\s*\[([\s\S]*?)\]/.exec(
    readFileSync(join(root, '.storybook/preview.tsx'), 'utf8'),
  );
  const listed = order ? [...order[1].matchAll(/'([^']+)'/g)].map((m) => m[1]) : [];

  const titles = new Set();
  for (const file of readdirSync(join(root, 'stories/perusta'))) {
    const match = /title="Perusta\/([^"]+)"/.exec(readFileSync(join(root, 'stories/perusta', file), 'utf8'));
    if (match) titles.add(match[1]);
  }
  for (const file of readdirSync(join(root, 'components')).filter((f) => f.endsWith('.stories.tsx'))) {
    const match = /title: 'Perusta\/([^']+)'/.exec(readFileSync(join(root, 'components', file), 'utf8'));
    if (match) titles.add(match[1]);
  }

  /* Järjestys sivupalkista; loput perään, jottei sivu katoa listasta
     jos se unohtuu preview.tsx:n järjestyksestä. */
  const ordered = [...listed.filter((t) => titles.has(t)), ...[...titles].filter((t) => !listed.includes(t))];
  return ordered.map((t) => t.toLowerCase()).join(', ');
}

const GENERATORS = {
  'figma-kokoelmat': figmaCollections,
  'perusta-sivut': perustaPages,
};

/* ---- tarkistus ------------------------------------------------------ */

const drift = [];
let blocks = 0;
let paths = 0;
let commands = 0;

const scripts = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).scripts;

for (const doc of DOCS) {
  const file = join(root, doc);
  let source = readFileSync(file, 'utf8');
  let rewritten = false;

  /* 1. luodut lohkot — sekä HTML- että MDX-kommenttimuoto */
  const block = /(<!--|\{\/\*)\s*luotu:([a-z-]+)\s*(-->|\*\/\})([\s\S]*?)(<!--|\{\/\*)\s*\/luotu\s*(-->|\*\/\})/g;
  source = source.replace(block, (whole, open, id, closeOpen, body, endOpen, endClose) => {
    blocks++;
    const generator = GENERATORS[id];
    if (!generator) {
      drift.push({ doc, issue: `tuntematon luotu lohko "${id}"` });
      return whole;
    }
    const expected = `\n${generator()}\n`;
    const actual = body;
    if (actual.trim() === expected.trim()) return whole;
    if (fix) {
      rewritten = true;
      /* Monirivinen lohko omille riveilleen, yksirivinen inlineen.
         MDX katkaisee kappaleen rivinvaihdosta <li>:n sisällä, joten
         yksirivisen on pysyttävä yhdellä rivillä. */
      const body2 = expected.trim();
      const head = whole.slice(0, whole.indexOf(closeOpen) + closeOpen.length);
      const tail = `${endOpen} /luotu ${endClose}`;
      return body2.includes('\n') ? `${head}\n${body2}\n${tail}` : `${head}${body2}${tail}`;
    }
    drift.push({
      doc,
      issue: `lohko "${id}" ei vastaa lähdettä\n      on:      ${actual.trim().split('\n').join(' / ')}\n      pitäisi:  ${expected.trim().split('\n').join(' / ')}`,
    });
    return whole;
  });

  if (rewritten) writeFileSync(file, source);

  /* 2. polut */
  for (const match of source.matchAll(/`([a-zA-Z0-9_.-]+\/[a-zA-Z0-9_./*-]+)`/g)) {
    const target = match[1].replace(/\/\*.*$/, '').replace(/\/$/, '');
    if (target.startsWith('--')) continue; /* token-nimi, ei polku */
    if (target.includes('*')) continue; /* glob, ei yksittäinen tiedosto */
    if (MISSING_OK[match[1]]) continue;
    paths++;
    if (!existsSync(join(root, target))) {
      drift.push({ doc, issue: `viittaa polkuun joka ei ole olemassa: ${match[1]}` });
    }
  }

  /* 3. komennot */
  for (const match of source.matchAll(/npm run ([a-z:-]+)/g)) {
    commands++;
    if (!scripts[match[1]]) drift.push({ doc, issue: `mainitsee komennon jota ei ole: npm run ${match[1]}` });
  }
}

/* 4. jokainen tarkistus on dokumentoitu */
const readme = readFileSync(join(root, 'README.md'), 'utf8');
const checkScripts = readdirSync(join(root, 'scripts')).filter((f) => /^check-.*\.mjs$/.test(f));
for (const script of checkScripts) {
  if (!readme.includes(`scripts/${script}`)) {
    drift.push({ doc: 'README.md', issue: `tarkistus scripts/${script} ei ole dokumentoitu` });
  }
}

/* ---- raportti ------------------------------------------------------ */

if (drift.length === 0) {
  console.log(
    `✓ Dokumentaatio ajan tasalla — ${blocks} luotua lohkoa, ${paths} polkua, ` +
      `${commands} komentoa, ${checkScripts.length} tarkistusta dokumentoitu`,
  );
  process.exit(0);
}

console.error(`\n✗ Dokumentaatio eriytynyt: ${drift.length} kohtaa\n`);
for (const d of drift) console.error(`  ${d.doc}\n      ${d.issue}\n`);
console.error('  Korjaa teksti, tai aja `npm run docs:korjaa` jos kyse on luodusta lohkosta.\n');
process.exit(1);
