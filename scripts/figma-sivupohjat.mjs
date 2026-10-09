#!/usr/bin/env node
/**
 * Sivupohjien tekstit Figmassa
 * ---------------------------------------------------------------
 * Figman sivupohjat (Etusivu, Työlista, Casesivu, Lohkot, Tietoa)
 * ovat kuvia sivuista. Niiden rakenne on kirjaston instansseja, ja
 * check:figma vahtii komponentit, propertyt ja gridit. Tekstejä se ei
 * vahtinut: ne oli kirjoitettu pohjiin käsin.
 *
 * Niin ne vanhenivat. Sivun tekstit kirjoitettiin uudelleen
 * (efc4b09 "Sivun tekstit mutkattomammiksi"), ja Figman etusivupohjassa
 * luki yhä "Rakennan tuotteita, jotka toimivat myös silloin kun demo
 * on ohi" — lause jota sivulla ei ollut enää. Mikään ei punastunut.
 *
 * Sopimus: jokainen näkyvä teksti pohjakehyksessä on löydyttävä siltä
 * sivulta jota pohja kuvaa. Vertailukohta on buildattu sivu (out/),
 * ei sisältötiedostot: sivulla teksti on koottu (otsikon {n},
 * artefaktien tila, "© 2026 …"), ja juuri koottua tekstiä pohja
 * näyttää.
 *
 * Pohjakehys tunnistetaan nimestä "<Pohja> · <moodi> <leveys>", sama
 * sopimus jolla gridit tarkistetaan. Uusi pohja on lisättävä POHJAT-
 * tauluun, muuten tarkistus kaatuu: pohja jonka sivua ei tiedetä on
 * pohja jota ei tarkisteta.
 *
 * Mitä tämä ei näe: suunta on Figmasta sivulle. Vanha teksti
 * pohjassa kaataa ajon, koska sitä ei enää löydy sivulta. Sivulle
 * lisätty uusi osio, jota pohjassa ei ole lainkaan, ei kaada.
 *
 * Ajetaan check:figman osana, buildin jälkeen.
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Pohja → sivut joita se kuvaa (polut out/-kansiossa). Lohkot-pohja
 * on casesivujen lohkokirjasto: sen lohkot ovat case 03:lta ja
 * Blokbookilta, joten teksti saa löytyä kummalta tahansa.
 */
export const POHJAT = {
  Etusivu: ['fi'],
  Työlista: ['fi/tyot'],
  Casesivu: ['fi/tyot/colliers'],
  Lohkot: ['fi/tyot/tama-sivusto', 'fi/tyot/blokbook'],
  Tietoa: ['fi/tietoa'],
};

/**
 * Pohjan huomautus, ei sivun teksti: solmu jonka nimi alkaa
 * `huom:`. Esimerkiksi selitys siitä miksi paneelin sisältöä ei
 * piirretä pohjaan. Nimi on sopimus, kuten generated:.
 */
const HUOMAUTUS = 'huom:';

const entiteetit = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0' };

/** Yhtenäinen välilyönti: nbsp, rivinvaihdot ja tuplavälit samaksi. */
const tasaa = (s) => s.replace(/[\s\u00a0]+/g, ' ').trim();

/** Tekstin sisäiset elementit: eivät katkaise lausetta ("Näin tein <a>Colliersissa</a>"). */
const TEKSTIN_SISAISET = 'a|span|strong|em|b|i|code|small|abbr|mark|time|sub|sup';

/**
 * Sivun tekstit riveinä. Lohkoelementit ovat rivinvaihtoja, joten
 * teksti ei voi osua kahden kappaleen rajan yli; tekstin sisäiset
 * elementit (linkki lauseessa) poistetaan katkaisematta. Reactin
 * `<!-- -->`-erottimet poistetaan: ne ovat yhden JSX-lausekkeen
 * sisällä ("© {year} {name}"), ja sivulla teksti on yhtenäinen.
 *
 * aria-label ja alt kuuluvat mukaan: ne ovat sivun tekstiä
 * ruudunlukijalle. Kuvan kuvateksti on sivulla altina (Media.tsx), ja
 * teemanapin tila ("Auto") on staattisessa HTML:ssä vain aria-labelissa
 * — näkyvä nimi vaihtuu vasta selaimessa.
 */
export function sivunTekstit(html) {
  const attribuutit = [...html.matchAll(/\s(?:aria-label|alt)="([^"]*)"/g)].map((m) => m[1]);
  const runko = [html, ...attribuutit]
    .join('\n')
    .replace(/<!-- -->/g, '')
    .replace(/<(script|style|svg|template)\b[\s\S]*?<\/\1>/gi, '\n')
    .replace(new RegExp(`<\\/?(${TEKSTIN_SISAISET})\\b[^>]*>`, 'gi'), '')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (koko, k) => {
      if (k[0] === '#') {
        const heksa = k[1] === 'x' || k[1] === 'X';
        return String.fromCodePoint(parseInt(k.slice(heksa ? 2 : 1), heksa ? 16 : 10));
      }
      return entiteetit[k.toLowerCase()] ?? koko;
    });
  return runko
    .split('\n')
    .map(tasaa)
    .filter(Boolean)
    .join('\n');
}

/**
 * Figman teksti paloina. Rivinvaihto Figmassa on usein sivulla kaksi
 * elementtiä (nimen rivit), joten kukin rivi etsitään erikseen.
 * Nuoli on sivulla ikoni (Icon.tsx), ei merkki, joten se riisutaan.
 */
const palat = (teksti) =>
  teksti
    .split(/[\n\u2028]+/)
    .map((rivi) => tasaa(rivi.replace(/\s*→\s*$/, '')))
    .filter(Boolean);

/**
 * @param dokumentti Figman tiedostopuun `document`.
 * @param out buildatun sivuston kansio.
 * @param moodit tokenien viewport-moodit (kehyksen nimestä).
 */
export function tarkistaPohjat(dokumentti, out, moodit) {
  const drift = [];
  const tarkistetut = new Set();
  let tekstejä = 0;

  const sivuja = new Map();
  const sivu = (polku) => {
    if (!sivuja.has(polku)) {
      const tiedosto = join(out, polku, 'index.html');
      sivuja.set(polku, existsSync(tiedosto) ? sivunTekstit(readFileSync(tiedosto, 'utf8')) : null);
    }
    return sivuja.get(polku);
  };

  const nimi = new RegExp(`^(.+?) · (${moodit.join('|')}) \\d+$`);

  for (const figmaSivu of dokumentti.children ?? []) {
    for (const kehys of figmaSivu.children ?? []) {
      const osuma = nimi.exec(kehys.name ?? '');
      if (!osuma) continue;
      const pohja = osuma[1];
      const polut = POHJAT[pohja];
      if (!polut) {
        drift.push({
          file: `Figma: ${kehys.name}`,
          issue: `pohjalle ei ole sivua — lisää "${pohja}" POHJAT-tauluun (scripts/figma-sivupohjat.mjs)`,
        });
        continue;
      }
      const tekstit = polut.map(sivu);
      if (tekstit.some((t) => t === null)) {
        const puuttuu = polut.filter((_, i) => tekstit[i] === null);
        drift.push({
          file: `Figma: ${kehys.name}`,
          issue: `buildattua sivua ei löydy (${puuttuu.map((p) => `out/${p}/`).join(', ')}) — aja ensin npx next build`,
        });
        continue;
      }
      tarkistetut.add(pohja);

      const kay = (solmu) => {
        if (solmu.visible === false) return;
        if (solmu.type === 'TEXT') {
          if ((solmu.name ?? '').startsWith(HUOMAUTUS) || (solmu.name ?? '').startsWith('generated:')) return;
          tekstejä++;
          for (const pala of palat(solmu.characters ?? '')) {
            if (!tekstit.some((t) => t.includes(pala))) {
              drift.push({
                file: `Figma: ${kehys.name}`,
                issue: `teksti ei ole sivulla (${polut.map((p) => `/${p}/`).join(', ')})\n${' '.repeat(6)}"${pala}"`,
              });
            }
          }
        }
        for (const lapsi of solmu.children ?? []) kay(lapsi);
      };
      kay(kehys);
    }
  }

  for (const pohja of Object.keys(POHJAT)) {
    if (!tarkistetut.has(pohja)) {
      drift.push({ file: `POHJAT: ${pohja}`, issue: 'Figmassa ei ole pohjakehystä tällä nimellä' });
    }
  }

  return { drift, tekstejä, pohjia: tarkistetut.size };
}
