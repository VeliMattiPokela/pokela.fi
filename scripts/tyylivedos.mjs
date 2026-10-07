#!/usr/bin/env node
/**
 * Tyylivedos — lasketut tyylit ennen ja jälkeen muutoksen.
 * ---------------------------------------------------------------
 * Luokkanimen vaihtaminen voi pudottaa tyylin hiljaa: JSX viittaa
 * nimeen jota CSS ei enää tunne, mitään ei kaadu, ja teksti vain
 * näyttää hieman erilaiselta. Yksikään tarkistus ei näe sitä —
 * check:hardcoded katsoo CSS:ää, testit katsovat renderöintiä ja
 * saavutettavuutta, eikä kumpikaan vertaa lopputulosta entiseen.
 *
 * Tämä ottaa vedoksen siitä mitä selain OIKEASTI laskee jokaiselle
 * tekstielementille: fontti, koko, paino, riviväli, välistys ja väri.
 * Muutoksen jälkeen sama vedos uudelleen, ja ne verrataan.
 *
 * Vedos EI ole tarkistus eikä kuulu ketjuun. Se on työkalu yhtä
 * muutosta varten, ja sen arvo on siinä että se mittaa lopputuloksen
 * eikä lähdettä.
 *
 *   node scripts/tyylivedos.mjs ennen
 *   node scripts/tyylivedos.mjs jalkeen
 *   node scripts/tyylivedos.mjs vertaa
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { chromium } from 'playwright';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const KANSIO = join(root, '.tyylivedos');
const PALVELIN = process.env.VEDOS_URL ?? 'http://localhost:3001';

const SIVUT = [
  '/fi/',
  '/fi/tyot/',
  '/fi/tietoa/',
  '/fi/system/',
  '/fi/tyot/colliers/',
  '/fi/tyot/tama-sivusto/',
];

/** Mitattavat ominaisuudet. Vain ne jotka muutos voi rikkoa. */
const MITAT = [
  'fontFamily',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
  'textTransform',
  'textWrap',
  'marginTop',
  'marginBottom',
  'color',
];

async function vedos(nimi) {
  const selain = await chromium.launch();
  const sivu = await selain.newPage({ viewport: { width: 1440, height: 900 } });
  const tulos = {};

  for (const polku of SIVUT) {
    await sivu.goto(PALVELIN + polku, { waitUntil: 'networkidle' });
    tulos[polku] = await sivu.evaluate((mitat) => {
      const ulos = [];
      let i = 0;
      for (const el of document.querySelectorAll('body *')) {
        /* Vain elementit joissa on omaa tekstiä — muuten mitataan
           säiliöitä joiden typografia ei näy missään. */
        const oma = [...el.childNodes].some(
          (n) => n.nodeType === 3 && n.textContent.trim().length > 0,
        );
        if (!oma) continue;
        const t = getComputedStyle(el);
        ulos.push({
          /* Polku juuresta: kestää luokkanimen vaihdon, toisin kuin
             valitsin. Sen pitää nimenomaan kestää, koska luokat ovat
             se mikä muuttuu. */
          kohta: `${i++}:${el.tagName.toLowerCase()}`,
          teksti: el.textContent.trim().slice(0, 40),
          ...Object.fromEntries(mitat.map((m) => [m, t[m]])),
        });
      }
      return ulos;
    }, MITAT);
  }

  await selain.close();
  if (!existsSync(KANSIO)) mkdirSync(KANSIO);
  writeFileSync(join(KANSIO, `${nimi}.json`), JSON.stringify(tulos, null, 2));

  const n = Object.values(tulos).reduce((a, b) => a + b.length, 0);
  console.log(`\n✓ Vedos "${nimi}" — ${SIVUT.length} sivua, ${n} tekstielementtiä\n`);
}

function vertaa() {
  const a = JSON.parse(readFileSync(join(KANSIO, 'ennen.json'), 'utf8'));
  const b = JSON.parse(readFileSync(join(KANSIO, 'jalkeen.json'), 'utf8'));
  const erot = [];

  for (const polku of Object.keys(a)) {
    const ennen = a[polku];
    const jalkeen = b[polku] ?? [];
    if (ennen.length !== jalkeen.length) {
      erot.push({ polku, syy: `elementtejä ${ennen.length} → ${jalkeen.length}` });
      continue;
    }
    ennen.forEach((e, i) => {
      const j = jalkeen[i];
      for (const m of MITAT) {
        if (e[m] !== j[m]) {
          erot.push({ polku, kohta: e.kohta, teksti: e.teksti, mitta: m, ennen: e[m], jalkeen: j[m] });
        }
      }
    });
  }

  if (!erot.length) {
    const n = Object.values(a).reduce((x, y) => x + y.length, 0);
    console.log(`\n✓ Lasketut tyylit identtiset — ${n} tekstielementtiä, ${MITAT.length} mittaa kussakin\n`);
    process.exit(0);
  }

  console.error(`\n✗ Lasketut tyylit muuttuivat: ${erot.length} kohtaa\n`);
  for (const e of erot.slice(0, 40)) {
    if (e.syy) { console.error(`  ${e.polku}  ${e.syy}`); continue; }
    console.error(`  ${e.polku} ${e.kohta}  "${e.teksti}"`);
    console.error(`      ${e.mitta}: ${e.ennen} → ${e.jalkeen}`);
  }
  if (erot.length > 40) console.error(`\n  … ja ${erot.length - 40} muuta`);
  console.error('');
  process.exit(1);
}

const komento = process.argv[2];
if (komento === 'vertaa') vertaa();
else if (komento === 'ennen' || komento === 'jalkeen') await vedos(komento);
else {
  console.error('\nKäyttö: node scripts/tyylivedos.mjs ennen | jalkeen | vertaa\n');
  process.exit(1);
}
