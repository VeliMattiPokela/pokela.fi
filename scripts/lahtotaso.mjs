#!/usr/bin/env node
/**
 * Lähtötaso ja räikkä.
 * ---------------------------------------------------------------
 * Tämän repon tarkistukset ovat ehdottomia: nolla rikkomusta tai
 * build kaatuu. Se toimii täällä, koska tämä on rakennettu puhtaalta
 * pöydältä. Olemassa olevassa koodipohjassa sama tarkistus antaa
 * ensimmäisellä ajolla tuhansia virheitä — ja kytketään pois samana
 * päivänä. Tarkistus joka ei voi olla vihreä ei ole tarkistus.
 *
 * Räikkä ratkaisee sen. Nykyinen rikkomustaso kirjataan kerran, ja
 * build kaatuu vain jos se KASVAA. Vanhaa velkaa saa maksaa pois
 * omassa tahdissa; uutta ei synny.
 *
 * KAKSI ASIAA JOTKA EIVÄT OLE SAMA ASIA
 *
 *   EXEMPT (check-hardcoded.mjs)  poikkeus vaatii kirjoitetun syyn.
 *                                 Kymmeniä kappaleita. Pysyvä.
 *   Lähtötaso (tämä)              vanha velka hyväksytään ILMAN syytä.
 *                                 Tuhansia. Tilapäinen, saa vain laskea.
 *
 * Neljäätuhatta rikkomusta ei perustella yksitellen. Mutta niitä ei
 * myöskään hyväksytä pysyvästi — siksi nämä ovat eri mekanismit eikä
 * toista venytetä toisen tilalle.
 *
 * TUNNISTEET, EI LUKUMÄÄRÄ
 *
 * Lähtötaso tallentaa rikkomusten tunnisteet ja niiden lukumäärän,
 * ei pelkkää kokonaislukua. Muuten yhden korjaaminen ja toisen
 * lisääminen menisi läpi nollasummana. Tunniste ei sisällä
 * rivinumeroa: rivit siirtyvät kun yläpuolelle lisätään koodia, ja
 * koskematon rikkomus näyttäisi uudelta.
 *
 * MYYNNILLINEN MITTARI
 *
 * `alku` kirjataan kerran eikä se muutu. Siksi edistymisen voi
 * näyttää: lähtötaso 423 → nyt 180, 57 % maksettu. Laskeva luku on
 * se näyttö jolla asetelman toimivuus osoitetaan — räikkä ei ole
 * vain sietomekanismi vaan mittari.
 *
 * TÄSSÄ REPOSSA TÄMÄ ON LEPOTILASSA. Rikkomuksia ei ole, joten
 * `lahtotaso.json`-tiedostoa ei ole. Ilman sitä kaikki on uutta ja
 * tarkistukset käyttäytyvät täsmälleen kuten ennenkin.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export const root = join(dirname(fileURLToPath(import.meta.url)), '..');
export const TIEDOSTO = join(root, 'lahtotaso.json');

const SELITE =
  'Kirjattu rikkomustaso. Build kaatuu vain jos rikkomus on uusi — vanhaa velkaa ' +
  'saa maksaa pois omassa tahdissa. "alku" ei muutu: se on se luku jota vasten ' +
  'edistyminen mitataan. Luvut saavat vain laskea. Luotu: npm run lahtotaso:kirjaa';

/** Koko tiedosto, tai tyhjä rakenne jos sitä ei ole. */
export function lue() {
  if (!existsSync(TIEDOSTO)) return { $selite: SELITE };
  return JSON.parse(readFileSync(TIEDOSTO, 'utf8'));
}

/**
 * Vertaa nykyiset rikkomukset kirjattuun lähtötasoon.
 *
 * @param {string} id          tarkistuksen tunnus, esim. 'hardcoded'
 * @param {Map<string,number>} nykyiset  tunniste → montako kertaa
 */
export function vertaa(id, nykyiset) {
  const taso = lue()[id];
  const kirjatut = new Map(Object.entries(taso?.rikkomukset ?? {}));

  const uudet = [];
  const tunnetut = [];
  for (const [tunniste, maara] of nykyiset) {
    const sallittu = kirjatut.get(tunniste) ?? 0;
    if (maara > sallittu) uudet.push({ tunniste, maara, sallittu });
    if (sallittu > 0) tunnetut.push({ tunniste, maara: Math.min(maara, sallittu) });
  }

  /* Rikkomus joka on kirjattu muttei enää esiinny on maksettua velkaa. */
  const korjatut = [];
  for (const [tunniste, sallittu] of kirjatut) {
    const nyt = nykyiset.get(tunniste) ?? 0;
    if (nyt < sallittu) korjatut.push({ tunniste, oli: sallittu, nyt });
  }

  const summa = (m) => [...m.values()].reduce((a, b) => a + b, 0);
  return {
    kaytossa: kirjatut.size > 0,
    uudet,
    tunnetut,
    korjatut,
    nyt: summa(nykyiset),
    kirjattu: summa(kirjatut),
    alku: taso?.alku ?? null,
  };
}

/**
 * Kirjaa nykytilan lähtötasoksi. `alku` asetetaan vain ensimmäisellä
 * kerralla — se on koko mittarin perusta eikä saa liikkua. Luvut
 * saavat vain laskea: jos nykytila on kirjattua suurempi, kirjaus
 * hylätään, koska silloin oltaisiin nostamassa kattoa.
 */
export function kirjaa(id, nykyiset, { salliNosto = false } = {}) {
  const data = lue();
  const vanha = data[id];
  const summa = (m) => [...m.values()].reduce((a, b) => a + b, 0);
  const nyt = summa(nykyiset);

  if (vanha && !salliNosto) {
    const ennen = Object.values(vanha.rikkomukset ?? {}).reduce((a, b) => a + b, 0);
    if (nyt > ennen) {
      throw new Error(
        `Lähtötasoa ei nosteta: ${id} oli ${ennen}, nyt ${nyt}.\n` +
          `  Räikkä saa kiertyä vain yhteen suuntaan. Korjaa uudet rikkomukset,\n` +
          `  tai jos nosto on tietoinen päätös, perustele se ja aja --salli-nosto.`,
      );
    }
  }

  data.$selite = SELITE;
  data[id] = {
    alku: vanha?.alku ?? { maara: nyt, pvm: new Date().toISOString().slice(0, 10) },
    rikkomukset: Object.fromEntries([...nykyiset.entries()].sort((a, b) => a[0].localeCompare(b[0]))),
  };

  writeFileSync(TIEDOSTO, JSON.stringify(data, null, 2) + '\n');
  return { nyt, alku: data[id].alku };
}

/** Yhden rivin tilannekuva, sama muoto kuin tarkistusten tulosteissa. */
export function edistyminen(id) {
  const taso = lue()[id];
  if (!taso?.alku) return null;
  const nyt = Object.values(taso.rikkomukset ?? {}).reduce((a, b) => a + b, 0);
  const alku = taso.alku.maara;
  const maksettu = alku === 0 ? 0 : Math.round(((alku - nyt) / alku) * 100);
  return { alku, nyt, maksettu, pvm: taso.alku.pvm };
}

/* ---- komentorivi --------------------------------------------------- */

if (import.meta.url === `file://${process.argv[1]}`) {
  const data = lue();
  const idt = Object.keys(data).filter((k) => !k.startsWith('$'));

  if (!idt.length) {
    console.log('\n  Lähtötasoa ei ole kirjattu — ei rikkomuksia hyväksyttynä.');
    console.log('  Tämä on oikea tila repolle joka on rakennettu puhtaalta.\n');
    process.exit(0);
  }

  console.log('\n  Velan maksu\n');
  for (const id of idt) {
    const e = edistyminen(id);
    const palkki = '█'.repeat(Math.round(e.maksettu / 5)).padEnd(20, '·');
    console.log(`  ${id.padEnd(16)} ${palkki}  ${String(e.maksettu).padStart(3)} %`);
    console.log(`  ${''.padEnd(16)} ${e.alku} → ${e.nyt}   (lähtötaso kirjattu ${e.pvm})\n`);
  }
}
