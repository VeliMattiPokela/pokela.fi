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
 * kirjattava `EXEMPT`-listaan syineen — hiljaista poikkeusta ei ole.
 *
 * Vaihe 3 (Figman muuttujat ja Code Connect -kytkennät) lisätään
 * tähän kun kirjasto on olemassa.
 *
 * Exit 0 = kattavuus täysi. Exit 1 = puuttuva story.
 */

import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const componentsDir = join(root, 'components');

/**
 * Komponentit joilta ei vaadita storya. Jokainen rivi on päätös,
 * ei unohdus — siksi syy on pakollinen.
 */
const EXEMPT = {
  'ThemeScript.tsx': 'Ei renderöi mitään näkyvää: injektoi <script>in ennen hydraatiota.',
  'ThemeToggle.tsx': 'Näkyy Nav-storyssa oikeassa yhteydessään; yksin se on pelkkä sana.',
  'Reveal.tsx': 'Kääre ilman omaa ulkoasua. Liike dokumentoidaan Perusta/Liike-sivulla.',
  'CaseBlocks.tsx': 'Kokoaa casen lohkot datasta; lohkot ovat omia komponenttejaan.',
  'ListRowShowcase.tsx':
    'Palvelinkomponentti: lukee lähdekoodin fs:llä build-aikana, joten se ei voi ajaa selaimessa. Sen UI on ComponentView, jolla on omat storyt.',
};

const files = readdirSync(componentsDir).filter((f) => f.endsWith('.tsx'));
const components = files.filter((f) => !f.endsWith('.stories.tsx'));
const stories = new Set(files.filter((f) => f.endsWith('.stories.tsx')));

const missing = [];
const exemptUsed = [];
const staleExempt = [];

for (const file of components) {
  const storyFile = file.replace(/\.tsx$/, '.stories.tsx');
  if (stories.has(storyFile)) continue;
  if (EXEMPT[file]) {
    exemptUsed.push({ file, reason: EXEMPT[file] });
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
const problems = missing.length + staleExempt.length + weak.length;

if (problems === 0) {
  console.log(
    `✓ Storyt kattavat komponentit — ${covered}/${components.length} storylla, ` +
      `${exemptUsed.length} kirjattua poikkeusta`,
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
