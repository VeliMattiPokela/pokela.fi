#!/usr/bin/env node
/**
 * Favicon — johdettu artefakti
 * ---------------------------------------------------------------
 * Faviconin värit tulevat tokens.css:stä, eivät tästä tiedostosta.
 * Merkki on käännetty pinta: --invert-surface taustana ja
 * --invert-ink kirjaimena, eli sama pari jota sivusto käyttää
 * käännetyissä lohkoissaan. Kun paletti muuttuu, favicon muuttuu
 * mukana eikä jää vanhaan sävyyn.
 *
 * Kirjain on P, sama joka aloittaa navin sanamerkin. Se on piirretty
 * tämän järjestelmän omana vektorina 32×32-ruudukolle, ei jäljennetty
 * kirjasimesta: Bodonin hiusviivat katoaisivat 16 pikselissä eikä
 * Archivon ääriviivaa voi lukea tokeneista. Suhteet noudattavat
 * groteskia — tasapaksu 4 yksikön varsi ja yhtä paksu kaari.
 * Kulmat ovat terävät, koska --radius on 0.
 *
 * Kaikki suorat koordinaatit ovat parillisia. 16 pikselin renderöinti
 * puolittaa ruudukon, joten pariton arvo osuisi puolikkaalle
 * pikselille ja varsi sumenisi kolmen pikselin harmaaksi. Siksi
 * kirjain on yhden yksikön oikealla geometrisesta keskeltä: se on
 * 0,5 pikseliä pienimmässä koossa, eikä sitä erota — sumean varren
 * erottaa. Siirto on myös oikeaan suuntaan, koska P:n massa on
 * vasemmalla ja oikea alanurkka tyhjä.
 *
 * Tuotettavat tiedostot:
 *   public/favicon.svg          skaalautuva, oma tumma tila
 *   public/favicon.ico          16/32/48 — myös tämä poistaa
 *                               /favicon.ico -pyynnön 500-virheen
 *   public/apple-touch-icon.png 180×180
 *
 * Tämä tiedosto laskee ja kirjoittaa. Vertailun tekee erillinen
 * scripts/check-favicon.mjs, joka kutsuu samaa `tiedostot()`-
 * funktiota — tarkistus ei siis voi laskea eri tavalla kuin
 * generointi. Se on oma tiedostonsa siksi, että lib/checks.ts ja
 * check-docs.mjs löytävät tarkistukset nimikaavalla check-<id>.mjs.
 * Generaattori tämän nimisenä jäisi molemmilta näkemättä, ja
 * casesivun tarkistuslista kertoisi yhden vähemmän kuin todellisuus.
 *
 * Aja:  npm run build:favicon
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/* ---- värit tokeneista ---------------------------------------------- */

const css = readFileSync(join(root, 'styles/tokens.css'), 'utf8');

function token(name) {
  const hit = css.match(new RegExp(`--${name}:\\s*(#[0-9A-Fa-f]{3,8})\\s*;`));
  if (!hit) throw new Error(`tokens.css: --${name} ei löytynyt tai se ei ole heksa-arvo`);
  return hit[1];
}

const vari = {
  vaaleaPinta: token('invert-surface-l'),
  vaaleaMuste: token('invert-ink-l'),
  tummaPinta: token('invert-surface-d'),
  tummaMuste: token('invert-ink-d'),
};

/* ---- merkki --------------------------------------------------------
   Ulkoreuna ja sisäaukko omina polkuinaan, evenodd puhkaisee aukon.
   Kaaret ovat puolikkaita ympyröitä: ulko r=6, sisä r=2 — erotus 4 on
   sama kuin varren leveys, joten kaari ei ohene missään kohdassa.
   Aukko on 4 yksikköä korkea eli 2 pikseliä pienimmässä koossa: se on
   raja jonka alle counter umpeutuisi.                               */

const ULKO = 'M10 6 H18 A6 6 0 0 1 18 18 H14 V26 H10 Z';
const AUKKO = 'M14 10 H18 A2 2 0 0 1 18 14 H14 Z';

const merkki = (pinta, muste) =>
  `<rect width="32" height="32" fill="${pinta}"/>` +
  `<path fill-rule="evenodd" fill="${muste}" d="${ULKO} ${AUKKO}"/>`;

/** Yksivärinen versio rasteroitavaksi. */
const svgKiintea = (pinta, muste) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">${merkki(pinta, muste)}</svg>`;

/** Selaimeen menevä versio, joka kääntyy järjestelmän teeman mukana. */
const svgTeemalla = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <style>
    .pinta { fill: ${vari.vaaleaPinta} }
    .muste { fill: ${vari.vaaleaMuste} }
    @media (prefers-color-scheme: dark) {
      .pinta { fill: ${vari.tummaPinta} }
      .muste { fill: ${vari.tummaMuste} }
    }
  </style>
  <rect class="pinta" width="32" height="32"/>
  <path class="muste" fill-rule="evenodd" d="${ULKO} ${AUKKO}"/>
</svg>
`;

/* ---- rasterointi ---------------------------------------------------
   Rasteri käyttää vaaleaa paria: se on tumma laatta jolla on oma
   tausta, joten se erottuu sekä vaalealla että tummalla
   selainkehyksellä. .ico ei osaa kääntyä teeman mukana.            */

const pohja = Buffer.from(svgKiintea(vari.vaaleaPinta, vari.vaaleaMuste));
const png = (koko) => sharp(pohja, { density: 384 }).resize(koko, koko).png().toBuffer();

/** ICO = otsake, hakemisto ja PNG-ruumiit peräkkäin. */
function ico(kuvat) {
  const otsake = Buffer.alloc(6);
  otsake.writeUInt16LE(0, 0);
  otsake.writeUInt16LE(1, 2);
  otsake.writeUInt16LE(kuvat.length, 4);

  const hakemisto = Buffer.alloc(16 * kuvat.length);
  let siirtyma = otsake.length + hakemisto.length;

  kuvat.forEach(({ koko, data }, i) => {
    const k = i * 16;
    hakemisto.writeUInt8(koko >= 256 ? 0 : koko, k);
    hakemisto.writeUInt8(koko >= 256 ? 0 : koko, k + 1);
    hakemisto.writeUInt16LE(1, k + 4);
    hakemisto.writeUInt16LE(32, k + 6);
    hakemisto.writeUInt32LE(data.length, k + 8);
    hakemisto.writeUInt32LE(siirtyma, k + 12);
    siirtyma += data.length;
  });

  return Buffer.concat([otsake, hakemisto, ...kuvat.map((k) => k.data)]);
}

const koot = [16, 32, 48];

/**
 * Faviconin tiedostot sisältöineen, laskettuna tokeneista.
 * Sekä generointi että tarkistus lukevat tämän — ei kahta laskentaa.
 */
export async function tiedostot() {
  const rasterit = await Promise.all(koot.map(async (koko) => ({ koko, data: await png(koko) })));
  return [
    { polku: 'public/favicon.svg', sisalto: Buffer.from(svgTeemalla) },
    { polku: 'public/favicon.ico', sisalto: ico(rasterit) },
    { polku: 'public/apple-touch-icon.png', sisalto: await png(180) },
  ];
}

/** Värit raporttia varten. */
export const varit = vari;

export { root };

/* ---- suoraan ajettaessa: kirjoita ---------------------------------- */

if (import.meta.url === `file://${process.argv[1]}`) {
  const lista = await tiedostot();
  for (const { polku, sisalto } of lista) writeFileSync(join(root, polku), sisalto);
  console.log(
    `✓ Favicon luotu tokeneista — pinta ${vari.vaaleaPinta} / muste ${vari.vaaleaMuste}\n` +
      lista.map((t) => `    ${t.polku}`).join('\n'),
  );
}
