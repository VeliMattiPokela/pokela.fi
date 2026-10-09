#!/usr/bin/env node
/**
 * Pakettien julkaisu npm:ään — ajetaan CI:ssä mainin pushilla
 * ---------------------------------------------------------------
 * Julkaisu tehtiin ennen käsin Vellun koneelta, ja se oli ketjun ainoa
 * lenkki, joka oli ihmisen muistin varassa: muutos meni mainiin, ja
 * Figma Make luki vanhaa pakettia, kunnes joku muisti julkaista.
 * Kahdesti julkaisu meni myös väärin, koska komento ajettiin haarasta,
 * jossa versio oli vielä vanha.
 *
 * Nyt main julkaisee itse. Skripti julkaisee vain version, jota npm:ssä
 * ei vielä ole, joten ajo ilman versionnostoa ei tee mitään. Tokenit
 * ensin, koska komponentit riippuvat niistä samalla versiolla.
 *
 * Julkaisun jälkeen odotetaan, että npm jakaa uuden tarballin: npm view
 * näyttää version jo ennen kuin sen voi ladata, ja silloin
 * check:paketti kaatuisi syyttä.
 *
 * Tarvitsee NPM_TOKENin (npm:n granular token, oikeus Read and write
 * @pokela-paketteihin). Ilman sitä ajo kaatuu vain, jos julkaistavaa on.
 *
 * Exit 0 = npm:ssä on repon versio. Exit 1 = julkaisu epäonnistui.
 */

import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const PAKETIT = [
  ['@pokela/tokens', 'packages/tokens'],
  ['@pokela/components', 'packages/components'],
];

const aja = (komento, argumentit, env = process.env) =>
  spawnSync(komento, argumentit, { cwd: root, encoding: 'utf8', env });

const rakennus = aja('npm', ['run', 'paketti', '--silent']);
if (rakennus.status !== 0) {
  console.error('\n✗ Pakettien rakennus epäonnistui:\n');
  console.error(rakennus.stdout + rakennus.stderr);
  process.exit(1);
}

/** Onko tämä versio npm:ssä. 404 = ei ole. */
async function julkaistu(nimi, versio) {
  const haku = await fetch(`https://registry.npmjs.org/${encodeURIComponent(nimi)}/${versio}`);
  if (haku.status === 404) return false;
  if (!haku.ok) throw new Error(`npm vastasi ${haku.status} paketille ${nimi}@${versio}`);
  return true;
}

/**
 * Odottaa, että tarball on ladattavissa. npm jakaa sen viiveellä.
 *
 * Jokaisessa haussa on oma kyselyparametri, jottei liian aikainen 404
 * jää CDN:n välimuistiin. 9.10.2026 tokens@2.8.0:n tarball ei näkynyt
 * viiteen minuuttiin, vaikka se latautui heti sen jälkeen. Todennäköisin
 * syy on välimuistiin jäänyt 404 (päätelty, ei todennettu), ja ajo
 * kaatui ennen kuin komponentit julkaistiin.
 */
async function odotaTarball(nimi, versio) {
  const lyhyt = nimi.split('/')[1];
  const osoite = `https://registry.npmjs.org/${nimi}/-/${lyhyt}-${versio}.tgz`;
  for (let i = 0; i < 30; i++) {
    const haku = await fetch(`${osoite}?t=${Date.now()}`, { method: 'HEAD' });
    if (haku.ok) return true;
    await new Promise((r) => setTimeout(r, 10_000));
  }
  return false;
}

const julkaistavat = [];
for (const [nimi, hakemisto] of PAKETIT) {
  const versio = JSON.parse(readFileSync(join(root, hakemisto, 'package.json'), 'utf8')).version;
  if (await julkaistu(nimi, versio)) {
    console.log(`· ${nimi}@${versio} on jo npm:ssä`);
  } else {
    julkaistavat.push([nimi, hakemisto, versio]);
  }
}

if (!julkaistavat.length) {
  console.log('✓ Ei julkaistavaa: npm:ssä on repon versio');
  process.exit(0);
}

const token = process.env.NPM_TOKEN;
if (!token) {
  console.error('\n✗ Julkaistavaa on, mutta NPM_TOKEN puuttuu:\n');
  for (const [nimi, , versio] of julkaistavat) console.error(`  ${nimi}@${versio}`);
  console.error('\n  Lisää repon salaisuuksiin NPM_TOKEN (npm → Access Tokens →');
  console.error('  Granular, Read and write @pokela-paketteihin) ja aja CI uudelleen.\n');
  process.exit(1);
}

/* Token omaan asetustiedostoon, ei repon eikä käyttäjän .npmrc:hen. */
const tmp = mkdtempSync(join(tmpdir(), 'pokela-julkaisu-'));
const npmrc = join(tmp, '.npmrc');
writeFileSync(npmrc, `//registry.npmjs.org/:_authToken=${token}\n`);

/* Ensin kaikki julkaisut, sitten odotus. Odotus paketin perässä jätti
   komponentit julkaisematta, kun tokenien tarball viipyi. */
try {
  for (const [nimi, hakemisto, versio] of julkaistavat) {
    const julkaisu = aja('npm', ['publish', `./${hakemisto}`, '--access', 'public', '--userconfig', npmrc]);
    if (julkaisu.status !== 0) {
      console.error(`\n✗ ${nimi}@${versio} julkaisu epäonnistui:\n`);
      console.error(julkaisu.stdout + julkaisu.stderr);
      process.exit(1);
    }
    console.log(`✓ Julkaistu ${nimi}@${versio}`);
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

const viipyvat = [];
for (const [nimi, , versio] of julkaistavat) {
  if (!(await odotaTarball(nimi, versio))) viipyvat.push(`${nimi}@${versio}`);
}
if (viipyvat.length) {
  console.error(`\n✗ Julkaistu, mutta tarballia ei saa ladattua viiteen minuuttiin: ${viipyvat.join(', ')}`);
  console.error('  Julkaisu on tehty. Seuraava ajo julkaisee vain puuttuvan ja tarkistaa npm:n.\n');
  process.exit(1);
}
