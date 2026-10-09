#!/usr/bin/env node
/**
 * Build, joka kirjaa omat vaiheensa
 * ---------------------------------------------------------------
 * Sivuston build ajaa ensin synkkatarkistukset ja kuvaputken, sitten
 * Next.js:n. Tähän asti vaiheet näkyivät vain lokissa. Nyt ne
 * kirjataan tiedostoon .ajo/ajo.json ennen Next.js:n buildia, ja case
 * 03 näyttää ne aikajanana (CaseBlockDerived, lohko `ajo`).
 *
 * Sivu näyttää siis sen buildin, joka sen rakensi. Jos jokin vaihe
 * kaatuu, sivua ei rakenneta lainkaan, joten aikajanalla ei voi olla
 * punaista vaihetta. Se on totta rakenteeltaan, ei koristelua.
 *
 * Vaiheet luetaan package.jsonin check:sync-ketjusta, ei listata
 * tässä: ketjuun lisätty tarkistus näkyy aikajanalla itsestään.
 *
 * Aja:  npm run build (tämä + publish:tokens). CI ajaa tämän
 *       "Sivuston build" -askeleena.
 */

import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

/** check:sync = "npm run check:tokens && npm run check:stories && …" */
const tarkistukset = [...pkg.scripts['check:sync'].matchAll(/npm run (check:[a-z-]+)/g)].map((m) => m[1]);
const vaiheet = [...tarkistukset, 'kuvat'];

/** Ajaa npm-skriptin, näyttää tulosteen ja palauttaa sen. */
function aja(skripti) {
  return new Promise((valmis) => {
    const lapsi = spawn('npm', ['run', '--silent', skripti], { cwd: root, stdio: ['ignore', 'pipe', 'inherit'] });
    let ulos = '';
    lapsi.stdout.on('data', (d) => {
      ulos += d;
      process.stdout.write(d);
    });
    lapsi.on('close', (koodi) => valmis({ koodi, ulos }));
  });
}

/** Tarkistuksen yhteenvetorivi: "✓ Kuvat synkassa — 7/23 paikkaa…" → "7/23 paikkaa…". */
function tulos(ulos) {
  const rivi = ulos.split('\n').find((r) => r.startsWith('✓'));
  if (!rivi) return null;
  const teksti = rivi.slice(1).trim();
  const i = teksti.indexOf(' — ');
  return i === -1 ? teksti : teksti.slice(i + 3);
}

const git = (...a) => {
  try {
    return execFileSync('git', a, { cwd: root, encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
};

/** Mergen otsikko on "Merge pull request #12 from …"; muutoksen nimi on rungon ensimmäinen rivi. */
function muutos() {
  const otsikko = git('log', '-1', '--format=%s');
  if (otsikko?.startsWith('Merge pull request')) return git('log', '-1', '--format=%b')?.split('\n')[0] || otsikko;
  return otsikko;
}

const ymparisto = process.env.NETLIFY ? 'Netlify' : process.env.GITHUB_ACTIONS ? 'GitHub Actions' : 'paikallinen';
const alkoi = new Date();
const kirjatut = [];

for (const vaihe of vaiheet) {
  const t0 = performance.now();
  const { koodi, ulos } = await aja(vaihe);
  if (koodi !== 0) {
    console.error(`\n✗ ${vaihe} kaatui — sivua ei rakenneta.`);
    process.exit(koodi ?? 1);
  }
  kirjatut.push({ id: vaihe.startsWith('check:') ? vaihe.slice(6) : vaihe === 'kuvat' ? 'kuvaputki' : vaihe, kesto: Math.round(performance.now() - t0), tulos: tulos(ulos) });
}

const kansio = join(root, '.ajo');
mkdirSync(kansio, { recursive: true });
writeFileSync(
  join(kansio, 'ajo.json'),
  JSON.stringify(
    {
      alkoi: alkoi.toISOString(),
      ymparisto,
      commit: (process.env.COMMIT_REF ?? git('rev-parse', 'HEAD'))?.slice(0, 7) ?? null,
      muutos: muutos(),
      vaiheet: kirjatut,
      /* Next.js:n build alkaa tästä; sen kestoa ei voi kirjata sivulle,
         joka rakennetaan juuri nyt. */
      sivustoAlkoi: Date.now() - alkoi.getTime(),
    },
    null,
    2,
  ) + '\n',
);
console.log(`\n✓ Ajo kirjattu — ${kirjatut.length} vaihetta (.ajo/ajo.json)\n`);

const next = spawn('npx', ['next', 'build'], { cwd: root, stdio: 'inherit' });
next.on('close', (koodi) => process.exit(koodi ?? 1));
