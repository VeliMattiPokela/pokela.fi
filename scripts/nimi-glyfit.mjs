#!/usr/bin/env node
/**
 * Etusivun nimen ääriviivat fontista
 * ---------------------------------------------------------------
 * HeroName piirtää nimen fontin omista pisteistä: käyrät, käyräpisteet
 * ja kahvat ovat Bodoni Modan oikeat ääriviivat, eivät piirroksia.
 * Ne luetaan tällä komennolla samasta fontista jonka sivu lataa
 * (Google Fonts, paino 400, oletusoptinen koko) ja kirjoitetaan
 * tiedostoon `content/nimi.generated.json`.
 *
 * Merkit tulevat sanakirjan `home.nameLines`-riveistä, joten nimi ja
 * sen ääriviivat eivät voi erota: jos nimi muuttuu, tämä ajetaan
 * uudelleen. Puuttuvan merkin kohdalla HeroName piirtää tavallisen
 * otsikon eikä keksi muotoa.
 *
 * Fonttia ei tallenneta repoon. Haku tarvitsee verkon, joten komento
 * ajetaan käsin eikä buildissa (sama syy kuin check:figmassa).
 *
 *   npm run nimi
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
export const KOHDE = join(root, 'content/nimi.generated.json');

/* Vanha selaintunniste saa Googlelta TrueType-tiedoston. WOFF2 olisi
   pakattu, eikä sen purkuun ole riippuvuutta. Ääriviivat ovat samat:
   ne on verrattu sivun lataamaan WOFF2:een merkki merkiltä. */
const CSS = 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@400';

const sanakirja = readFileSync(join(root, 'content/dictionaries/fi.ts'), 'utf8');
const rivit = /nameLines:\s*\[([^\]]*)\]/.exec(sanakirja)?.[1];
if (!rivit) throw new Error('home.nameLines ei löytynyt tiedostosta content/dictionaries/fi.ts');
const merkit = [...new Set([...rivit.matchAll(/'([^']*)'/g)].flatMap((m) => [...m[1]]))]
  .filter((m) => m.trim())
  .sort();

const css = await (await fetch(CSS, { headers: { 'User-Agent': 'Mozilla/4.0' } })).text();
const url = /url\((https:[^)]+\.ttf)\)/.exec(css)?.[1];
if (!url) throw new Error('Google Fonts ei palauttanut TrueType-tiedostoa:\n' + css);
const fontti = new DataView(await (await fetch(url)).arrayBuffer());

/* ---- TrueType-taulut -------------------------------------------- */

const taulut = {};
for (let i = 0, n = fontti.getUint16(4); i < n; i++) {
  const o = 12 + i * 16;
  const tunnus = String.fromCharCode(...[0, 1, 2, 3].map((k) => fontti.getUint8(o + k)));
  taulut[tunnus] = fontti.getUint32(o + 8);
}
const u16 = (o) => fontti.getUint16(o);
const i16 = (o) => fontti.getInt16(o);

const yksikot = u16(taulut.head + 18);
const pitkaLoca = i16(taulut.head + 50) === 1;
const metriikoita = u16(taulut.hhea + 34);
const xKorkeus = i16(taulut['OS/2'] + 86);
const versaali = i16(taulut['OS/2'] + 88);

/* cmap: Windows Unicode BMP, muoto 4. */
function glyyfi(merkki) {
  const koodi = merkki.codePointAt(0);
  const c = taulut.cmap;
  for (let i = 0, n = u16(c + 2); i < n; i++) {
    const o = c + 4 + i * 8;
    if (u16(o) !== 3 || u16(o + 2) !== 1) continue;
    const t = c + fontti.getUint32(o + 4);
    const segX2 = u16(t + 6);
    const loput = t + 14, alut = loput + segX2 + 2, deltat = alut + segX2, siirrot = deltat + segX2;
    for (let s = 0; s < segX2; s += 2) {
      if (koodi > u16(loput + s) || koodi < u16(alut + s)) continue;
      const siirto = u16(siirrot + s);
      if (!siirto) return (koodi + i16(deltat + s)) & 0xffff;
      const g = u16(siirrot + s + siirto + (koodi - u16(alut + s)) * 2);
      return g ? (g + i16(deltat + s)) & 0xffff : 0;
    }
  }
  return 0;
}

const leveys = (g) => u16(taulut.hmtx + Math.min(g, metriikoita - 1) * 4);
const sijainti = (g) =>
  pitkaLoca ? fontti.getUint32(taulut.loca + g * 4) : u16(taulut.loca + g * 2) * 2;

/** Ääriviivat: [[x, y, käyrällä], …] jokaiselle umpinaiselle viivalle. */
function aariviivat(g) {
  const o = taulut.glyf + sijainti(g);
  if (sijainti(g + 1) === sijainti(g)) return [];
  const viivoja = i16(o);
  if (viivoja < 0) throw new Error(`Glyyfi ${g} on koostettu. Koosteita ei tueta, koska nimessä ei ole niitä.`);
  const loput = Array.from({ length: viivoja }, (_, i) => u16(o + 10 + i * 2));
  const pisteita = loput.at(-1) + 1;
  let p = o + 10 + viivoja * 2;
  p += 2 + u16(p);
  const liput = [];
  while (liput.length < pisteita) {
    const lippu = fontti.getUint8(p++);
    liput.push(lippu);
    if (lippu & 8) for (let k = fontti.getUint8(p++); k > 0; k--) liput.push(lippu);
  }
  const lue = (lyhyt, sama) => {
    let arvo = 0;
    return liput.map((l) => {
      if (l & lyhyt) { const d = fontti.getUint8(p++); arvo += l & sama ? d : -d; }
      else if (!(l & sama)) { arvo += i16(p); p += 2; }
      return arvo;
    });
  };
  const xs = lue(2, 16), ys = lue(4, 32);
  let alku = 0;
  return loput.map((loppu) => {
    const viiva = [];
    for (let i = alku; i <= loppu; i++) viiva.push([xs[i], ys[i], liput[i] & 1]);
    alku = loppu + 1;
    return viiva;
  });
}

const glyyfit = {};
for (const merkki of merkit) {
  const g = glyyfi(merkki);
  if (!g) throw new Error(`Fontissa ei ole merkkiä "${merkki}".`);
  glyyfit[merkki] = { leveys: leveys(g), viivat: aariviivat(g) };
}

writeFileSync(
  KOHDE,
  JSON.stringify({ lahde: url, yksikot, xKorkeus, versaali, glyyfit }) + '\n',
);
const pisteet = Object.values(glyyfit).reduce((s, g) => s + g.viivat.flat().length, 0);
console.log(`✓ ${merkit.length} merkkiä, ${pisteet} pistettä → content/nimi.generated.json`);
