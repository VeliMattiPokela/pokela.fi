#!/usr/bin/env node
/**
 * Synkkatarkistus — vaihe 3: Code Connect -kytkennät
 * ---------------------------------------------------------------
 * Vaiheet 1 ja 2 valvovat koodin sisäistä totuutta: tokenit vastaavat
 * toisiaan ja jokaisella komponentilla on story. Tämä vaihe valvoo
 * rajaa koodin ja Figman välillä.
 *
 * Mitä *ei* tarkisteta ja miksi: Figman muuttujien REST-API on
 * Enterprise-tason ominaisuus, eikä sitä ole käytettävissä. Siksi
 * muuttujia ei verrata rajapinnan kautta — ne generoidaan
 * `tokens.json`:sta, jolloin eriytymä on rakenteellisesti mahdoton.
 * Se mitä tässä voidaan tarkistaa, on kytkentätiedostojen oma
 * eheys — ja se on juuri se kohta joka käytännössä vanhenee:
 *
 *   · kytkentä osoittaa komponenttiin jota ei enää ole
 *   · kytkentä osoittaa väärään Figma-tiedostoon
 *   · kirjastoon luvattu komponentti on jäänyt kytkemättä
 *
 * Itse julkaisun kelpoisuus tarkistetaan erikseen:
 * `npm run figma:check` (vaatii FIGMA_ACCESS_TOKENin).
 *
 * Exit 0 = kytkennät ehjät. Exit 1 = eriytymä.
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const componentsDir = join(root, 'components');

/**
 * Komponentit jotka ovat Figma-kirjastossa ja siksi vaativat
 * kytkennän. Lista kasvaa kun kirjasto kasvaa; se on päätös eikä
 * johdettavissa koodista, koska koodi ei tiedä mitä Figmassa on.
 *
 * Kaikki eivät ole React-komponentteja. Nappi on luokkasopimus
 * (`.btn`, `.btn--primary`) eikä `Button.tsx`:ää ole — se on
 * tarkoituksellista, koska sama luokka toimii sekä `<a>`- että
 * `<button>`-elementillä ilman `as`-propia. Silloin kytkentä
 * osoittaa tyylitiedostoon, ja se kerrotaan `// source=`-otsikolla.
 */
const IN_FIGMA = ['ListRow', 'Button', 'Nav', 'Media', 'Footer', 'Accordion', 'LogoRow', 'Icon'];

/* Figma-tiedoston avain luetaan sieltä missä osoite asuu, ei tästä. */
const artefacts = readFileSync(join(root, 'content/artefacts.ts'), 'utf8');
const figmaUrl = /figma:\s*'([^']+)'/.exec(artefacts)?.[1] ?? null;
const fileKey = figmaUrl ? /\/design\/([0-9a-zA-Z]+)/.exec(figmaUrl)?.[1] ?? null : null;

const connectFiles = readdirSync(componentsDir).filter((f) => f.endsWith('.figma.ts'));

const problems = { missing: [], broken: [], wrongFile: [], stale: [] };
const ok = [];

for (const file of connectFiles) {
  const source = readFileSync(join(componentsDir, file), 'utf8');
  const name = file.replace(/\.figma\.ts$/, '');

  const url = /^\/\/\s*url=(\S+)/m.exec(source)?.[1] ?? null;
  const component = /^\/\/\s*component=(\S+)/m.exec(source)?.[1] ?? null;
  const id = /id:\s*'([^']+)'/.exec(source)?.[1] ?? null;
  /* Vapaaehtoinen: mihin kytkentä osoittaa, jos ei komponenttiin. */
  const target = /^\/\/\s*source=(\S+)/m.exec(source)?.[1] ?? null;

  if (!url) problems.broken.push(`${file} — puuttuu \`// url=\``);
  if (!component) problems.broken.push(`${file} — puuttuu \`// component=\``);

  /* Kytkentä joka osoittaa poistettuun komponenttiin on pahempi kuin
     puuttuva kytkentä: se näyttää Dev Modessa koodia jota ei ole. */
  if (target) {
    if (!existsSync(join(root, target))) {
      problems.stale.push(`${file} — \`// source=${target}\` ei ole olemassa`);
    }
  } else if (!existsSync(join(componentsDir, `${name}.tsx`))) {
    problems.stale.push(
      `${file} — components/${name}.tsx ei ole olemassa (jos kytkentä ei osoita komponenttiin, kerro kohde \`// source=\`-otsikolla)`,
    );
  }
  if (component && component !== name) {
    problems.broken.push(`${file} — \`// component=${component}\` ≠ tiedostonimi ${name}`);
  }
  if (id && id !== name) {
    problems.broken.push(`${file} — \`id: '${id}'\` ≠ tiedostonimi ${name}`);
  }
  if (url && fileKey && !url.includes(fileKey)) {
    problems.wrongFile.push(`${file} — osoittaa eri Figma-tiedostoon kuin content/artefacts.ts`);
  }
  if (url && !/node-id=\d+-\d+/.test(url)) {
    problems.broken.push(`${file} — url:ssa ei ole node-id:tä, kytkentä ei osu noodiin`);
  }

  if (component === name && id === name) ok.push(name);
}

for (const name of IN_FIGMA) {
  if (!connectFiles.includes(`${name}.figma.ts`)) {
    problems.missing.push(`${name} — on Figma-kirjastossa, mutta components/${name}.figma.ts puuttuu`);
  }
}

if (!fileKey) {
  problems.broken.push('content/artefacts.ts — Figma-osoitetta ei löytynyt, tiedostoa ei voi tarkistaa');
}

const count = Object.values(problems).reduce((n, list) => n + list.length, 0);

if (count === 0) {
  console.log(
    `✓ Code Connect ehjä — ${ok.length}/${IN_FIGMA.length} kytkentää, Figma-tiedosto ${fileKey}`,
  );
  process.exit(0);
}

console.error(`\n✗ Code Connect: ${count} kohtaa\n`);

const section = (title, list) => {
  if (!list.length) return;
  console.error(`  ${title}:`);
  for (const line of list) console.error(`    ${line}`);
  console.error('');
};

section('Puuttuva kytkentä', problems.missing);
section('Vanhentunut kytkentä', problems.stale);
section('Väärä Figma-tiedosto', problems.wrongFile);
section('Rikkinäinen kytkentä', problems.broken);

console.error('  Korjaa kytkentä tai päivitä IN_FIGMA-lista, ja aja uudelleen.\n');
process.exit(1);
