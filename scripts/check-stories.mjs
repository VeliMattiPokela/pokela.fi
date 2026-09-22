#!/usr/bin/env node
/**
 * Synkkatarkistus — vaihe 2: onko jokaisella komponentilla story
 * ---------------------------------------------------------------
 * Design systemit eivät kuole huonoon suunnitteluun vaan hiljaiseen
 * eriytymiseen. Yleisin muoto on komponentti joka lisätään koodiin
 * mutta ei koskaan Storybookiin — se on olemassa, mutta kukaan ei
 * löydä sitä, joten seuraava tekijä kirjoittaa sen uudestaan.
 *
 * Tämä tarkistus estää sen. Poikkeus on sallittu, mutta se on
 * kirjattava `EXEMPT`-listaan — hiljaista poikkeusta ei ole.
 *
 * POIKKEUKSEN SYY EI OLE VAPAA TEKSTI.
 *
 * Aiemmin se oli, ja se osoittautui aukoksi. `CaseBlocks.tsx`illa luki
 * "lohkot ovat omia komponenttejaan", mikä tarkoitti "nämä on testattu
 * muualla". Se ei ollut totta: casesivun 12 lohkoa olivat yhden
 * funktion sisällä eikä yhtäkään ollut koskaan renderöity testissä.
 * Tarkistus näytti vihreää koko ajan, koska se tarkisti että perustelu
 * on olemassa — ei että se on totta.
 *
 * Nyt syy on valinta kolmesta, ja jokaisella on sääntö jonka tämä
 * skripti ajaa:
 *
 *   palvelinkomponentti   lukee tiedostoja build-aikana → ei voi ajaa
 *                         selaimessa. Testi: tiedosto tai jokin sen
 *                         importeista käyttää node:fs:ää.
 *   katettu-muualla       näkyy toisen komponentin storyssa tai
 *                         dokumenttisivulla. Testi: se sivu on
 *                         olemassa JA viittaa tähän komponenttiin.
 *   ei-näkyvää            ei piirrä ruudulle mitään. Testi: JSX:ssä
 *                         ei ole yhtään näkyvää elementtiä.
 *
 * `huom` on ihmiselle, eikä se korvaa sääntöä.
 *
 * Exit 0 = kattavuus täysi. Exit 1 = puuttuva story.
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const componentsDir = join(root, 'components');

/**
 * Komponentit joilta ei vaadita storya. Jokainen rivi on päätös,
 * ei unohdus — siksi syy on pakollinen.
 */
const EXEMPT = {
  'ThemeScript.tsx': {
    syy: 'ei-näkyvää',
    huom: 'Injektoi <script>in <head>iin ennen hydraatiota, jottei teema välähdä.',
  },
  'ThemeToggle.tsx': {
    syy: 'katettu-muualla',
    missä: 'Nav',
    huom: 'Yksin se on pelkkä sana; merkitys syntyy navin yhteydessä.',
  },
  'Reveal.tsx': {
    syy: 'katettu-muualla',
    missä: 'Liike',
    huom: 'Kääre ilman omaa ulkoasua. Liike on Perusta/Liike-sivun aihe.',
  },
  'CaseBlocks.tsx': {
    syy: 'katettu-muualla',
    missä: 'CaseBlock',
    huom: 'Valitsee vain kumpi piirtää, CaseBlock vai CaseBlockDerived.',
  },
  'CaseBlockDerived.tsx': {
    syy: 'palvelinkomponentti',
    huom: 'Lukee artefaktien tilan, tarkistuslistan ja komponentin lähdekoodin build-aikana.',
  },
  'ListRowShowcase.tsx': {
    syy: 'palvelinkomponentti',
    huom: 'Lukee lähdekoodin build-aikana. Sen UI on ComponentView, jolla on omat storyt.',
  },
};

/* ---- syiden säännöt ------------------------------------------------ */

const SYYT = ['palvelinkomponentti', 'katettu-muualla', 'ei-näkyvää'];

/** Paikallisten importtien polut, jotta ketjua voi seurata askeleen. */
function imports(source) {
  const out = [];
  for (const m of source.matchAll(/from\s+'(\.\/[^']+|@\/[^']+)'/g)) {
    const raw = m[1];
    const base = raw.startsWith('@/') ? join(root, raw.slice(2)) : join(componentsDir, raw.slice(2));
    for (const ext of ['.ts', '.tsx', '/index.ts']) {
      if (existsSync(base + ext)) { out.push(base + ext); break; }
    }
  }
  return out;
}

/** Lukeeko tiedosto tai jokin sen importeista tiedostojärjestelmää? */
function lukeeTiedostoja(file) {
  const source = readFileSync(join(componentsDir, file), 'utf8');
  if (/node:fs/.test(source)) return true;
  return imports(source).some((p) => /node:fs/.test(readFileSync(p, 'utf8')));
}

/** Onko kattava sivu olemassa ja viittaako se tähän komponenttiin? */
function katettuMuualla(file, missä) {
  const name = file.replace(/\.tsx$/, '');
  const story = join(componentsDir, `${missä}.stories.tsx`);
  const komponentti = join(componentsDir, `${missä}.tsx`);
  const mdxKansio = join(root, 'stories/perusta');
  const mdx = existsSync(mdxKansio)
    ? readdirSync(mdxKansio).map((f) => join(mdxKansio, f)).filter((p) => p.endsWith('.mdx'))
    : [];

  /* Storyn kautta: story on olemassa ja sen komponentti käyttää tätä. */
  if (existsSync(story)) {
    const lähteet = [story, komponentti].filter(existsSync).map((p) => readFileSync(p, 'utf8'));
    if (lähteet.some((src) => new RegExp(`\\b${name}\\b`).test(src))) return true;
  }
  /* Dokumenttisivun kautta: sivu on olemassa ja mainitsee tämän. */
  for (const p of mdx) {
    const src = readFileSync(p, 'utf8');
    if (!new RegExp(`title="Perusta/${missä}"`).test(src)) continue;
    if (new RegExp(`\\b${name}\\b`, 'i').test(src)) return true;
  }
  return false;
}

/** Piirtääkö tiedosto mitään näkyvää? <script> ja <head> eivät ole. */
function eiNäkyvää(file) {
  const source = readFileSync(join(componentsDir, file), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const tagit = [...source.matchAll(/<([A-Za-z][A-Za-z0-9]*)/g)].map((m) => m[1]);
  const näkymättömät = new Set(['script', 'head', 'meta', 'title', 'link']);
  return tagit.every((t) => näkymättömät.has(t));
}

/** Ajaa syyn säännön. Palauttaa null jos kunnossa, muuten virheen. */
function tarkistaSyy(file, poikkeus) {
  const { syy, missä } = poikkeus;
  if (!SYYT.includes(syy)) return `tuntematon syy "${syy}" — sallitut: ${SYYT.join(', ')}`;
  if (syy === 'palvelinkomponentti') {
    return lukeeTiedostoja(file) ? null : 'ei lue tiedostojärjestelmää, joten se voisi ajaa selaimessa';
  }
  if (syy === 'katettu-muualla') {
    if (!missä) return 'syy on katettu-muualla, mutta `missä` puuttuu';
    return katettuMuualla(file, missä)
      ? null
      : `"${missä}" ei kata tätä: sivua ei ole, tai se ei viittaa tähän komponenttiin`;
  }
  if (syy === 'ei-näkyvää') {
    return eiNäkyvää(file) ? null : 'renderöi näkyviä elementtejä';
  }
  return null;
}

const files = readdirSync(componentsDir).filter((f) => f.endsWith('.tsx'));
const components = files.filter((f) => !f.endsWith('.stories.tsx'));
const stories = new Set(files.filter((f) => f.endsWith('.stories.tsx')));

const missing = [];
const exemptUsed = [];
const staleExempt = [];
const badExempt = [];

for (const file of components) {
  const storyFile = file.replace(/\.tsx$/, '.stories.tsx');
  if (stories.has(storyFile)) continue;
  if (EXEMPT[file]) {
    const virhe = tarkistaSyy(file, EXEMPT[file]);
    if (virhe) badExempt.push({ file, syy: EXEMPT[file].syy, virhe });
    else exemptUsed.push({ file, syy: EXEMPT[file].syy });
    continue;
  }
  missing.push(file);
}

/* Poikkeus joka ei enää päde on yhtä lailla eriytymä: se kertoo
   että lista ei vastaa koodia. */
for (const file of Object.keys(EXEMPT)) {
  if (!components.includes(file)) staleExempt.push(`${file} — ei ole enää olemassa`);
  else if (stories.has(file.replace(/\.tsx$/, '.stories.tsx'))) {
    staleExempt.push(`${file} — sillä on story, poista poikkeus`);
  }
}

/* Onko storyssa vähintään yksi tumma ja yksi mobiilitila? Molemmat
   ovat lupauksia joita tämä sivusto antaa, joten ne tarkistetaan. */
const weak = [];
for (const storyFile of stories) {
  const source = readFileSync(join(componentsDir, storyFile), 'utf8');
  const gaps = [];
  if (!/theme:\s*'dark'/.test(source)) gaps.push('tumma teema');
  if (!/viewport:\s*\{\s*value:\s*'base'/.test(source)) gaps.push('mobiilikoko');
  if (gaps.length) weak.push({ storyFile, gaps });
}

const covered = components.length - missing.length - exemptUsed.length;
const problems = missing.length + staleExempt.length + weak.length + badExempt.length;

if (problems === 0) {
  console.log(
    `✓ Storyt kattavat komponentit — ${covered}/${components.length} storylla, ` +
      `${exemptUsed.length} poikkeusta joiden sääntö tarkistettu ` +
      `(${[...new Set(exemptUsed.map((e) => e.syy))].join(', ')})`,
  );
  process.exit(0);
}

console.error(`\n✗ Story-kattavuus: ${problems} kohtaa\n`);

if (missing.length) {
  console.error('  Komponentti ilman storya:');
  for (const file of missing) {
    console.error(`    ${file.padEnd(24)} → puuttuu ${file.replace(/\.tsx$/, '.stories.tsx')}`);
  }
  console.error('');
}

if (badExempt.length) {
  console.error('  Poikkeus jonka sääntö ei päde:');
  for (const { file, syy, virhe } of badExempt) {
    console.error(`    ${file.padEnd(24)} syy: ${syy}`);
    console.error(`    ${' '.repeat(24)} ${virhe}`);
  }
  console.error('');
}

if (staleExempt.length) {
  console.error('  Vanhentunut poikkeus (scripts/check-stories.mjs, EXEMPT):');
  for (const line of staleExempt) console.error(`    ${line}`);
  console.error('');
}

if (weak.length) {
  console.error('  Story ilman pakollista tilaa:');
  for (const { storyFile, gaps } of weak) {
    console.error(`    ${storyFile.padEnd(30)} puuttuu: ${gaps.join(', ')}`);
  }
  console.error('');
}

console.error('  Lisää puuttuva story tai kirjaa poikkeus syineen, ja aja uudelleen.\n');
process.exit(1);
