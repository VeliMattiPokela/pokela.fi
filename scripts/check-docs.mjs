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
 *      README:ssä, ajetaan omana askeleenaan `ci.yml`:ssä ja on
 *      kirjattu `lib/checks.ts`:n rekisteriin — uutta tarkistusta ei
 *      voi lisätä hiljaa eikä vanha voi jäädä ajamatta.
 *
 * Proosaa tämä ei voi todentaa. Siksi kaikki mikä on johdettavissa
 * merkitään luoduksi lohkoksi eikä kirjoiteta käsin.
 *
 * Exit 0 = dokumentaatio ajan tasalla. Exit 1 = eriytymä.
 */

import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
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

/**
 * Onko polku tarkoituksella repon ulkopuolella? `portfolio-pokela/`
 * on .gitignoressa, joten se on olemassa paikallisesti muttei CI:n
 * checkoutissa. Dokumentti saa viitata siihen — README nimenomaan
 * selittää miksi sitä ei ole repossa. Ilman tätä tarkistus menisi
 * läpi koneella ja kaatuisi CI:ssä, mikä on pahin mahdollinen
 * yhdistelmä. Näin kävi ensimmäisellä ajolla.
 *
 * Kauttaviiva on merkitsevä. `.gitignoren` sääntö `kuvat/uudet/`
 * koskee vain hakemistoa, ja ilman päättävää kauttaviivaa git ei voi
 * päätellä onko polku hakemisto silloin kun sitä ei ole levyllä.
 * Paikallisesti hakemisto on olemassa ja sääntö osuu; CI:n tuoreessa
 * checkoutissa se ei ole, eikä osunut. Sama vika kuin edellä, uudessa
 * paikassa — siksi molemmat muodot kokeillaan.
 */
function gitIgnored(path) {
  const muodot = path.endsWith('/') ? [path] : [path, `${path}/`];
  return muodot.some(
    (muoto) => spawnSync('git', ['check-ignore', '-q', muoto], { cwd: root }).status === 0,
  );
}

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

/** Casen lohkotyypit sisältömallista. */
function caseBlockKinds() {
  const source = readFileSync(join(root, 'content/cases/types.ts'), 'utf8');
  const kinds = [...source.matchAll(/kind: '([a-z]+)'/g)].map((m) => m[1]);
  return `${kinds.length} lohkotyyppiä: ${kinds.join(', ')}`;
}

/**
 * Kuvapaikat taulukkona.
 *
 * Tämä oli ennen kuusi käsin kirjoitettua taulukkoa README:ssä. Ne
 * olivat sama tieto toiseen kertaan: kuvapaikka on sisällössä, ja
 * käsin kopioitu luettelo olisi vanhentunut ensimmäisen lisäyksen
 * kohdalla — eikä mikään olisi kertonut siitä.
 *
 * Laskenta tehdään kerran moduulin latautuessa, koska lohkojen
 * korvaus on synkroninen eikä voi odottaa sisällön importtia.
 */
const kuvapaikatRivit = await (async () => {
  const { paikat, lahteet } = await import('./kuvat.mjs');
  const lista = (await paikat()).sort((a, b) => a.jarjestys - b.jarjestys);
  const rivit = ['| | Missä | Tiedosto | Suhde | Mitä kuvassa |', '|---|---|---|---|---|'];
  for (const p of lista) {
    const on = lahteet(p).every((l) => l.tiedosto) ? '✓' : '';
    const nimet = lahteet(p).map((l) => `\`${l.nimi}.png\``).join(' + ');
    rivit.push(`| ${on} | ${p.missa} | ${nimet} | ${p.ratio} | ${p.caption.replace(/\|/g, '\\|')} |`);
  }
  const taynna = lista.filter((p) => lahteet(p).every((l) => l.tiedosto)).length;
  rivit.push('');
  rivit.push(`${taynna}/${lista.length} täynnä. Sama luettelo komennolla \`npm run kuvat:lista\`.`);
  return rivit.join('\n');
})();

const GENERATORS = {
  'figma-kokoelmat': figmaCollections,
  'perusta-sivut': perustaPages,
  'case-lohkot': caseBlockKinds,
  kuvapaikat: () => kuvapaikatRivit,
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
    const raw = match[1];
    if (raw.startsWith('--')) continue; /* token-nimi, ei polku */
    if (raw.includes('*')) continue; /* glob, ei yksittäinen tiedosto */
    if (MISSING_OK[raw]) continue;
    const target = raw.replace(/\/$/, '');
    if (gitIgnored(target)) continue;
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

/* 4. jokainen tarkistus on kirjattu kaikkiin kolmeen rekisteriin
      ------------------------------------------------------------
      Tarkistus elää kolmessa paikassa, ja jokainen niistä voi jäädä
      päivittämättä erikseen:

        README.md            mitä se todistaa ihmiselle
        ci.yml               ajetaanko se oikeasti ennen mergeä
        lib/checks.ts        näkyykö se casesivun listalla

      Kaikki kolme on unohdettu kerran. Viimeisin oli check-favicon:
      se oli check:sync-ketjussa, joten casesivu ilmoitti sen ajossa
      olevaksi — mutta CI ei aja ketjua vaan jokaisen tarkistuksen
      omana askeleenaan, jotta kaatuva kohta näkyy GitHubin
      käyttöliittymässä nimeltä. Askel puuttui, joten tarkistus ei
      ajanut kertaakaan pull requestissa. Vihreä CI väitti enemmän
      kuin se katsoi.

      Tiedostojärjestelmä on totuus: jos scripts/check-<id>.mjs on
      olemassa, sen on löydyttävä kaikista kolmesta.                */
const readme = readFileSync(join(root, 'README.md'), 'utf8');
const ci = readFileSync(join(root, '.github/workflows/ci.yml'), 'utf8');
const rekisteri = readFileSync(join(root, 'lib/checks.ts'), 'utf8');
const checkScripts = readdirSync(join(root, 'scripts')).filter((f) => /^check-.*\.mjs$/.test(f));

for (const script of checkScripts) {
  const id = script.replace(/^check-|\.mjs$/g, '');
  if (!readme.includes(`scripts/${script}`)) {
    drift.push({ doc: 'README.md', issue: `tarkistus scripts/${script} ei ole dokumentoitu` });
  }
  if (!ci.includes(`npm run check:${id}`)) {
    drift.push({
      doc: '.github/workflows/ci.yml',
      issue: `tarkistus check:${id} ei ole omana askeleenaan — se ei aja pull requestissa`,
    });
  }
  if (!new RegExp(`id: '${id}'`).test(rekisteri)) {
    drift.push({
      doc: 'lib/checks.ts',
      issue: `tarkistus check:${id} puuttuu rekisteristä — casesivu kertoo yhden vähemmän kuin todellisuus`,
    });
  }
}

/* ---- raportti ------------------------------------------------------ */

if (drift.length === 0) {
  console.log(
    `✓ Dokumentaatio ajan tasalla — ${blocks} luotua lohkoa, ${paths} polkua, ` +
      `${commands} komentoa, ${checkScripts.length} tarkistusta kolmessa rekisterissä`,
  );
  process.exit(0);
}

console.error(`\n✗ Dokumentaatio eriytynyt: ${drift.length} kohtaa\n`);
for (const d of drift) console.error(`  ${d.doc}\n      ${d.issue}\n`);
console.error('  Korjaa teksti, tai aja `npm run docs:korjaa` jos kyse on luodusta lohkosta.\n');
process.exit(1);
