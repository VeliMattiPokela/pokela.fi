#!/usr/bin/env node
/**
 * Synkkatarkistus — vaihe 5: koodi ↔ Figma-tiedosto
 * ---------------------------------------------------------------
 * Tämä on ainoa tarkistus joka oikeasti avaa Figma-tiedoston. Neljä
 * muuta lukevat vain paikallisia tiedostoja, joten ne eivät voi
 * nähdä mitään mikä tapahtuu Figman puolella.
 *
 * Aukko oli todellinen: ennen tätä `check-code-connect` tarkisti
 * vain että kytkentätiedosto on olemassa. Vaihdoin kokeeksi yhden
 * `node-id`:n keksityksi ja tarkistus sanoi "ehjä". Ensimmäinen ajo
 * tällä löysi oikean eriytymän — LogoRow-kytkentä osoitti yhteen
 * varianttiin ("Breakpoint=sm+") eikä komponenttiin, jolloin koodi
 * olisi näkynyt Dev Modessa vain sen yhden variantin kohdalla.
 *
 * Kolme asiaa:
 *
 *   1. Jokaisen `.figma.ts`:n node-id osoittaa olemassa olevaan
 *      komponenttiin, ja sen nimi täsmää `// component=`-riviin.
 *   2. Jokaisella kirjaston komponentilla on kytkentä. Kirjaston
 *      komponentti = komponenttisetti jonka nimi on sama kuin sivun
 *      jolla se on. Lista johdetaan tiedostosta, ei ylläpidetä käsin.
 *   3. Muuttujia EI voi tarkistaa: Figman variables-rajapinta vaatii
 *      Enterprise-tason. Tarkistus sanoo sen ääneen eikä mene
 *      hiljaa läpi.
 *
 * Ajetaan CI:ssä omana vaiheenaan, ei `check:sync`-ketjussa: ketjun
 * pitää toimia ilman verkkoa ja ilman salaisuuksia, eikä Figman
 * katkos saa estää sivuston buildia.
 *
 * Tunnus: FIGMA_ACCESS_TOKEN ympäristöstä tai .env.localista.
 * Exit 0 = synkassa. Exit 1 = eriytymä tai puuttuva tunnus.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const componentsDir = join(root, 'components');

/* ---- tunnus -------------------------------------------------------- */

function token() {
  if (process.env.FIGMA_ACCESS_TOKEN) return process.env.FIGMA_ACCESS_TOKEN.trim();
  const envFile = join(root, '.env.local');
  if (existsSync(envFile)) {
    const match = /^FIGMA_ACCESS_TOKEN=(.+)$/m.exec(readFileSync(envFile, 'utf8'));
    if (match) return match[1].trim();
  }
  return null;
}

const accessToken = token();
if (!accessToken) {
  console.error('\n✗ FIGMA_ACCESS_TOKEN puuttuu.\n');
  console.error('  Paikallisesti:  .env.local → FIGMA_ACCESS_TOKEN=…');
  console.error('  CI:ssä:         gh secret set FIGMA_ACCESS_TOKEN\n');
  console.error('  Tarvittava oikeus: Files → "Read the contents of … files".\n');
  process.exit(1);
}

/* ---- tiedoston avain luetaan sieltä missä osoite asuu --------------- */

const artefacts = readFileSync(join(root, 'content/artefacts.ts'), 'utf8');
const figmaUrl = /figma:\s*'([^']+)'/.exec(artefacts)?.[1] ?? null;
const fileKey = figmaUrl ? /\/design\/([0-9a-zA-Z]+)/.exec(figmaUrl)?.[1] : null;

if (!fileKey) {
  console.error('\n✗ Figma-tiedoston avainta ei löydy content/artefacts.ts:stä.\n');
  process.exit(1);
}

/* ---- haku ---------------------------------------------------------- */

async function figma(path) {
  const response = await fetch(`https://api.figma.com/v1/files/${fileKey}${path}`, {
    headers: { 'X-Figma-Token': accessToken },
  });
  if (!response.ok) {
    const body = await response.text();
    console.error(`\n✗ Figma vastasi ${response.status} ${response.statusText}`);
    console.error(`  ${body.slice(0, 200)}\n`);
    process.exit(1);
  }
  return response.json();
}

/* ---- kytkentätiedostot --------------------------------------------- */

const connections = readdirSync(componentsDir)
  .filter((file) => file.endsWith('.figma.ts'))
  .map((file) => {
    const source = readFileSync(join(componentsDir, file), 'utf8');
    return {
      file,
      /* node-id on osoitteessa muodossa 12-28, API:ssa 12:28. */
      nodeId: /node-id=([\d-]+)/.exec(source)?.[1]?.replace('-', ':') ?? null,
      component: /\/\/ component=(.+)/.exec(source)?.[1]?.trim() ?? null,
    };
  });

const drift = [];

/* ---- 1. osoittaako jokainen kytkentä oikeaan komponenttiin? -------- */

const ids = connections.map((c) => c.nodeId).filter(Boolean);
const nodes = (await figma(`/nodes?ids=${encodeURIComponent(ids.join(','))}`)).nodes;

for (const connection of connections) {
  if (!connection.nodeId) {
    drift.push({ file: connection.file, issue: 'node-id puuttuu osoitteesta' });
    continue;
  }
  const node = nodes[connection.nodeId]?.document;
  if (!node) {
    drift.push({ file: connection.file, issue: `node-id ${connection.nodeId} ei ole tiedostossa` });
    continue;
  }
  if (node.type !== 'COMPONENT_SET' && node.type !== 'COMPONENT') {
    drift.push({ file: connection.file, issue: `osoittaa tyyppiin ${node.type}, ei komponenttiin` });
    continue;
  }
  if (node.name !== connection.component) {
    drift.push({
      file: connection.file,
      issue: `osoittaa komponenttiin "${node.name}", mutta tiedosto sanoo "${connection.component}"`,
    });
  }
}

/* ---- 2. onko jokaisella kirjaston komponentilla kytkentä? ----------
   Kirjaston komponentti tunnistetaan rakenteesta, ei listasta: sivun
   ylimmän tason komponenttisetti on kirjastoa, paitsi jos sen nimessä
   on ryhmäerotin (" / "). Se on Figman oma konventio alikomponentille
   — "Nav / Link" on osa Navia eikä oma kirjastokomponenttinsa.

   Ensin kokeilin sääntöä "nimi on sama kuin sivun nimi", mutta se
   kaatui heti: Icon asuu sivulla Ikonit, koska Perustan sivut ovat
   suomeksi ja komponentit englanniksi. Sääntö olisi pakottanut
   nimeämään sivun uudelleen tarkistuksen takia. */

const tree = await figma('?depth=2');
const library = [];
const helpers = [];

for (const page of tree.document.children) {
  for (const child of page.children ?? []) {
    if (child.type !== 'COMPONENT_SET' && child.type !== 'COMPONENT') continue;
    const isHelper = child.name.includes(' / ');
    (isHelper ? helpers : library).push({ page: page.name, name: child.name, id: child.id });
  }
}

const connected = new Set(connections.map((c) => c.component));
for (const component of library) {
  if (!connected.has(component.name)) {
    drift.push({
      file: `Figma: ${component.page}`,
      issue: `komponentilla "${component.name}" ei ole kytkentää (components/${component.name}.figma.ts puuttuu)`,
    });
  }
}

/* Kytkentä komponenttiin jota ei enää ole kirjastossa. */
const libraryNames = new Set(library.map((c) => c.name));
for (const connection of connections) {
  if (connection.component && !libraryNames.has(connection.component)) {
    drift.push({
      file: connection.file,
      issue: `"${connection.component}" ei ole enää kirjaston komponentti Figmassa`,
    });
  }
}

/* ---- raportti ------------------------------------------------------ */

if (drift.length === 0) {
  console.log(
    `✓ Figma synkassa — ${library.length}/${library.length} komponenttia kytketty, ` +
      `${connections.length} osoitetta tarkistettu (${tree.name})`,
  );
  if (helpers.length) {
    console.log(`  · ${helpers.length} apukomponenttia ei vaadi kytkentää: ${helpers.map((h) => h.name).join(', ')}`);
  }
  console.log('  · Muuttujia ei tarkisteta: Figman variables-rajapinta vaatii Enterprise-tason.');
  process.exit(0);
}

console.error(`\n✗ Figma-eriytymä: ${drift.length} kohtaa\n`);
const width = Math.max(...drift.map((d) => d.file.length));
for (const d of drift) console.error(`  ${d.file.padEnd(width)}  ${d.issue}`);
console.error('\n  Korjaa kytkentä tai Figma-tiedosto, ja aja uudelleen.\n');
process.exit(1);
