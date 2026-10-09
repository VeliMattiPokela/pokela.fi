#!/usr/bin/env node
/**
 * Synkkatarkistus — julkaistu paketti ↔ repo
 * ---------------------------------------------------------------
 * Ketjun viimeinen lenkki jota mikään ei vahtinut. Repo voi muuttua,
 * npm jää paikalleen, ja Figma Make käyttää vanhoja arvoja viikkoja
 * kenenkään huomaamatta: sivusto näyttää yhtä, prototyypit toista.
 *
 * Niin kävi 6.10.2026. ThemeToggle lisättiin pakettiin, ohjeiden
 * komponenttilista päivittyi — ja npm:ssä oli yhä versio ilman sitä.
 * Ohjeet lupasivat Makelle komponentteja joita paketti ei sisältänyt.
 * Tarkistus syntyi siitä.
 *
 * Versio tulee tokens.jsonin $meta.versionista, ja npm EI päästä
 * julkaisemaan samaa versiota uudelleen. Siksi "sisältö eroaa, versio
 * on sama" on oma virheensä: korjaus ei ole julkaise vaan nosta ensin.
 *
 * Tarvitsee verkon, joten tämä ei ole check:sync-ketjussa. Ketjun on
 * toimittava ilman verkkoa — sama syy kuin check:figmassa.
 *
 * Julkaisu on CI:n asia (scripts/julkaise-paketit.mjs, mainin pushilla).
 * Siksi --ennen-julkaisua hyväksyy repon version, joka on npm:n versiota
 * uudempi: pull requestissa nosto on oikein, ja main julkaisee sen.
 * Julkaisun jälkeen tarkistus ajetaan ilman lippua, ja silloin npm:n
 * pitää vastata repoa tavulleen.
 *
 * Exit 0 = npm vastaa repoa. Exit 1 = eriytymä.
 */

import { readFileSync, existsSync, readdirSync, mkdtempSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { tmpdir } from 'node:os';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const PAKETIT = [
  ['@pokela/tokens', 'packages/tokens'],
  ['@pokela/components', 'packages/components'],
];

const ennenJulkaisua = process.argv.includes('--ennen-julkaisua');

/** a > b semver-numeroina (ei esiversioita, paketeilla niitä ei ole). */
const uudempi = (a, b) => {
  const [x, y] = [a, b].map((v) => v.split('.').map(Number));
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] > y[i];
  return false;
};

const drift = [];
const odottaa = [];

/* ---- paketit on rakennettava ensin ---------------------------------
   packages/ on gitignorattu ja syntyy komennolla `npm run paketti`.
   Ilman sitä tarkistus vertaisi tyhjään. */

const aja = (komento, argumentit, cwd = root) =>
  spawnSync(komento, argumentit, { cwd, encoding: 'utf8' });

const rakennus = aja('npm', ['run', 'paketti', '--silent']);
if (rakennus.status !== 0) {
  console.error('\n✗ Pakettien rakennus epäonnistui:\n');
  console.error(rakennus.stdout + rakennus.stderr);
  process.exit(1);
}

/* ---- tiedostojen vertailu ------------------------------------------- */

/** Kaikki tiedostot hakemistossa, polut suhteessa juureen. */
function tiedostot(hakemisto, etuliite = '') {
  const ulos = [];
  for (const kohde of readdirSync(hakemisto, { withFileTypes: true })) {
    const polku = join(hakemisto, kohde.name);
    const nimi = etuliite ? `${etuliite}/${kohde.name}` : kohde.name;
    if (kohde.isDirectory()) ulos.push(...tiedostot(polku, nimi));
    else ulos.push(nimi);
  }
  return ulos.sort();
}

const tmp = mkdtempSync(join(tmpdir(), 'pokela-paketti-'));

try {
  for (const [nimi, hakemisto] of PAKETIT) {
    const paikallinen = join(root, hakemisto);
    const repoVersio = JSON.parse(readFileSync(join(paikallinen, 'package.json'), 'utf8')).version;

    /* --- mikä on julkaistu --- */
    const haku = await fetch(`https://registry.npmjs.org/${encodeURIComponent(nimi)}`);
    if (haku.status === 404) {
      drift.push({ paketti: nimi, syy: `ei ole julkaistu npm:ään (repossa ${repoVersio})` });
      continue;
    }
    if (!haku.ok) {
      console.error(`\n✗ npm vastasi ${haku.status} paketille ${nimi}\n`);
      process.exit(1);
    }
    const tiedot = await haku.json();
    const julkaistuVersio = tiedot['dist-tags'].latest;

    /* --- lataa ja pura julkaistu --- */
    const pack = aja('npm', ['pack', `${nimi}@${julkaistuVersio}`, '--pack-destination', tmp, '--silent'], tmp);
    if (pack.status !== 0) {
      console.error(`\n✗ Julkaistun paketin lataus epäonnistui: ${nimi}@${julkaistuVersio}\n`);
      console.error(pack.stdout + pack.stderr);
      process.exit(1);
    }
    const tgz = readdirSync(tmp).find((f) => f.endsWith('.tgz'));
    const puretut = join(tmp, nimi.replace('/', '-').replace('@', ''));
    aja('mkdir', ['-p', puretut], tmp);
    const purku = aja('tar', ['-xzf', join(tmp, tgz), '-C', puretut, '--strip-components=1'], tmp);
    if (purku.status !== 0) {
      console.error(`\n✗ Purku epäonnistui: ${tgz}\n${purku.stderr}`);
      process.exit(1);
    }
    rmSync(join(tmp, tgz));

    /* --- vertaa --- */
    const npmTiedostot = tiedostot(puretut);
    const erot = [];

    for (const tiedosto of npmTiedostot) {
      const repoPolku = join(paikallinen, tiedosto);
      if (!existsSync(repoPolku)) {
        erot.push(`${tiedosto} — on npm:ssä muttei enää repossa`);
        continue;
      }
      const a = readFileSync(join(puretut, tiedosto), 'utf8');
      const b = readFileSync(repoPolku, 'utf8');
      if (a !== b) erot.push(`${tiedosto} — sisältö eroaa`);
    }

    /* Repon puolella voi olla tiedostoja joita julkaistussa ei ole,
       mutta vain ne jotka package.jsonin `files` päästäisi mukaan. */
    const sallitut = new Set(npmTiedostot);
    for (const tiedosto of tiedostot(paikallinen)) {
      if (!sallitut.has(tiedosto) && !tiedosto.startsWith('node_modules')) {
        erot.push(`${tiedosto} — on repossa muttei npm:ssä`);
      }
    }

    /* Pelkkä versioero riittää, vaikka sisältö täsmäisi. Paketit
       jakavat version, ja components ilmoittaa riippuvuudekseen
       `@pokela/tokens@^<versio>` — jos sitä versiota ei ole npm:ssä,
       asennus hajoaa vaikka tiedostot olisivat identtiset. */
    if (!erot.length && repoVersio === julkaistuVersio) continue;

    /* Versio on sama mutta sisältö eroaa: npm ei päästä julkaisemaan
       samaa versiota uudelleen, joten korjaus alkaa nostosta. */
    if (repoVersio === julkaistuVersio) {
      drift.push({
        paketti: `${nimi}@${julkaistuVersio}`,
        syy: `sisältö eroaa mutta versio on sama — nosta tokens.jsonin $meta.version ja julkaise`,
        erot,
      });
    } else if (ennenJulkaisua && uudempi(repoVersio, julkaistuVersio)) {
      odottaa.push(`${nimi}: npm ${julkaistuVersio} → ${repoVersio}`);
    } else {
      drift.push({
        paketti: nimi,
        syy: erot.length
          ? `npm: ${julkaistuVersio}, repo: ${repoVersio} — julkaisematta`
          : `npm: ${julkaistuVersio}, repo: ${repoVersio} — sisältö sama, mutta versiota ${repoVersio} ei ole npm:ssä`,
        erot,
      });
    }
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

/* ---- raportti -------------------------------------------------------- */

if (!drift.length && odottaa.length) {
  console.log('✓ Uusi versio odottaa julkaisua — main julkaisee sen:');
  for (const rivi of odottaa) console.log(`  ${rivi}`);
  process.exit(0);
}

if (!drift.length) {
  const versiot = PAKETIT.map(([nimi, hakemisto]) => {
    const v = JSON.parse(readFileSync(join(root, hakemisto, 'package.json'), 'utf8')).version;
    return `${nimi}@${v}`;
  });
  console.log(`✓ Paketit vastaavat npm:ää — ${versiot.join(', ')}`);
  process.exit(0);
}

console.error(`\n✗ Paketti eriytynyt npm:stä: ${drift.length} kohtaa\n`);
for (const d of drift) {
  console.error(`  ${d.paketti}`);
  console.error(`      ${d.syy}`);
  for (const ero of d.erot ?? []) console.error(`      · ${ero}`);
  console.error('');
}
console.error('  Figma Make lukee npm:ää, ei repoa. Niin kauan kuin nämä eroavat,');
console.error('  prototyypit tehdään eri komponenteilla kuin sivusto.\n');

/* Korjausohje. Julkaisu on mainin CI:n asia, joten ihmisen osa on
   versionnosto, kun sisältö on muuttunut samalla versiolla. */
const vainNosto = drift.every((d) => d.syy.includes('versio on sama'));
console.error('  Korjaus:');
if (vainNosto) {
  console.error('    Nosta tokens.jsonin $meta.version samassa pull requestissa.');
  console.error('    Main julkaisee uuden version, kun muutos yhdistetään.');
} else {
  console.error('    Tarkista mainin CI:n vaihe "Paketit npm:ään". Se julkaisee');
  console.error('    repon version ja kertoo, jos NPM_TOKEN puuttuu tai on vanhentunut.');
}
console.error('');
process.exit(1);
