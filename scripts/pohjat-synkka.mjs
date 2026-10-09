#!/usr/bin/env node
/**
 * Sivupohjien tekstit Figmaan
 * ---------------------------------------------------------------
 * check:figma vaatii, että jokainen Figman sivupohjan teksti löytyy
 * buildatulta sivulta (päätös 15). Tarkistus huomaa vanhan tekstin,
 * mutta korjaus oli käsityötä: sama lause vaihdettiin käsin jokaiseen
 * pohjaan ja leveyteen. Tämä tekee sen.
 *
 * Suunta päätellään muutoksesta, ei arvata:
 *
 *   sivu muuttui    Muutoksen diff (lähteiden merkkijonot ennen ja
 *                   jälkeen) kertoo vanhan ja uuden lauseen. Pohjan
 *                   teksti jossa on vanha lause saa uuden — mutta vain
 *                   jos tulos löytyy sivulta. Muuten se raportoidaan.
 *   luku muuttui    Sama lause, eri luvut. Luvut johdetaan koodista
 *                   (kytkentöjen määrä), joten diffissä ei ole paria.
 *                   Pohjaan kirjoitetaan sivun luku.
 *   Figma muuttui   Pohjan teksti ei ole sivulla, eikä mikään muutos
 *                   selitä sitä. Sitä ei kirjoiteta yli: se on
 *                   Figmassa tehty muokkaus, ja se viedään koodiin.
 *                   Raportti näyttää lähimmän sivun rivin.
 *
 * Figman REST-rajapinta on vain luku, joten kirjoitus tapahtuu
 * Figman Plugin API:lla. Skripti tuottaa jokaiselle pohjalle
 * ajettavan koodin (.scratch/pohjat/<Pohja>.js), joka sisältää sivun
 * tekstit ja muutosparit. Koodi ajetaan Figmassa (MCP:n use_figma tai
 * pluginin konsoli): ensin ilman --kirjoita, jolloin se palauttaa
 * suunnitelman, sitten --kirjoita-lipulla.
 *
 * Aja:  npx next build && npm run pohjat [-- --kirjoita] [-- --pohja <ref>]
 *       <ref> on vertailukohta, oletuksena origin/main.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { POHJAT, sivunTekstit, tasaa } from './figma-sivupohjat.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const kirjoita = args.includes('--kirjoita');
const ref = args.includes('--pohja') ? args[args.indexOf('--pohja') + 1] : 'origin/main';

/** Lähteet joista sivun teksti tulee. */
const LAHTEET = ['content', 'lib', 'app', 'components'].filter((d) => existsSync(join(root, d)));

const git = (...a) => execFileSync('git', a, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

/* ---- muutosparit ---------------------------------------------------- */

/**
 * Rivin merkkijonot: lainausmerkeissä olevat (template literalin
 * `${…}` katkaisee) ja JSX:n teksti tagien välissä. Lyhyet ja
 * kirjaimettomat pois — "10" → "11" osuisi minne tahansa.
 */
function merkkijonot(rivi, jsx) {
  const ulos = [];
  for (const m of rivi.matchAll(/(['"`])((?:\\.|(?!\1).)*)\1/g)) {
    const sisalto = m[2].replace(/\\(['"`\\])/g, '$1');
    ulos.push(...(m[1] === '`' ? sisalto.split(/\$\{[^}]*\}/) : [sisalto]));
  }
  if (jsx) for (const m of rivi.matchAll(/>([^<>{}]+)</g)) ulos.push(m[1]);
  return ulos.map(tasaa).filter((s) => s.length >= 3 && /\p{L}/u.test(s));
}

/** Kahden merkkijonon samankaltaisuus (bigrammien Dice), 0–1. */
export function samankaltaisuus(a, b) {
  const bi = (s) => {
    const m = new Map();
    for (let i = 0; i < s.length - 1; i++) m.set(s.slice(i, i + 2), (m.get(s.slice(i, i + 2)) ?? 0) + 1);
    return m;
  };
  const x = bi(a.toLowerCase());
  const y = bi(b.toLowerCase());
  let yhteiset = 0;
  for (const [k, n] of x) yhteiset += Math.min(n, y.get(k) ?? 0);
  const koko = a.length + b.length - 2;
  return koko > 0 ? (2 * yhteiset) / koko : 0;
}

/**
 * Vanha → uusi -parit muutoksen diffistä. Saman hunkin poistetut ja
 * lisätyt merkkijonot paritetaan: yhtä monta → järjestyksessä, muuten
 * kukin poistettu lähimpään lisättyyn (samankaltaisuus ≥ 0,5).
 */
export function muutosparit(diff) {
  const parit = [];
  const hunkit = [];
  let nykyinen = null;
  let jsx = false;
  for (const rivi of diff.split('\n')) {
    if (rivi.startsWith('+++ ')) {
      jsx = /\.(tsx|jsx)$/.test(rivi);
      continue;
    }
    if (rivi.startsWith('--- ')) continue;
    if (rivi.startsWith('@@')) {
      nykyinen = { pois: [], lisatty: [] };
      hunkit.push(nykyinen);
      continue;
    }
    if (!nykyinen) continue;
    if (rivi[0] === '-') nykyinen.pois.push(...merkkijonot(rivi.slice(1), jsx));
    if (rivi[0] === '+') nykyinen.lisatty.push(...merkkijonot(rivi.slice(1), jsx));
  }
  for (const { pois, lisatty } of hunkit) {
    pois.forEach((vanha, i) => {
      const uusi =
        pois.length === lisatty.length
          ? lisatty[i]
          : lisatty
              .map((l) => [l, samankaltaisuus(vanha, l)])
              .filter(([, s]) => s >= 0.5)
              .sort((a, b) => b[1] - a[1])[0]?.[0];
      if (uusi !== undefined && uusi !== vanha) parit.push([vanha, uusi]);
    });
  }
  /* Pisin ensin: kokonainen lause ennen sen osaa. */
  return [...new Map(parit.map((p) => [p.join('\u0000'), p])).values()].sort((a, b) => b[0].length - a[0].length);
}

/* ---- Figmassa ajettava osa ----------------------------------------- */

/**
 * Ajetaan Figman Plugin API:ssa. Ei saa viitata mihinkään tämän
 * funktion ulkopuolella: se sarjallistetaan tekstiksi.
 */
async function synkka({ pohja, rivit, parit, kirjoita }) {
  const tasaa = (s) => s.replace(/[\s\u00a0]+/g, ' ').trim();
  const sivulla = (pala) => rivit.some((r) => r.includes(pala));
  const bi = (s) => {
    const m = new Map();
    for (let i = 0; i < s.length - 1; i++) m.set(s.slice(i, i + 2), (m.get(s.slice(i, i + 2)) || 0) + 1);
    return m;
  };
  const sama = (a, b) => {
    const x = bi(a.toLowerCase());
    const y = bi(b.toLowerCase());
    let n = 0;
    for (const [k, c] of x) n += Math.min(c, y.get(k) || 0);
    return a.length + b.length > 2 ? (2 * n) / (a.length + b.length - 2) : 0;
  };
  const lahin = (pala) =>
    rivit.map((r) => [r, sama(pala, r)]).sort((a, b) => b[1] - a[1])[0] || ['', 0];

  /* Sama paloittelu kuin check:figmassa: rivinvaihto ja U+2028
     erottavat, loppunuoli on sivulla ikoni. */
  const erotin = new RegExp(`(\\n|${String.fromCharCode(0x2028)})`);

  const muutokset = [];
  const eiSivulla = [];

  const aseta = async (solmu, teksti) => {
    const viite = solmu.componentPropertyReferences && solmu.componentPropertyReferences.characters;
    if (viite) {
      let p = solmu.parent;
      while (p && !(p.type === 'INSTANCE' && viite in p.componentProperties)) p = p.parent;
      if (p) {
        p.setProperties({ [viite]: teksti });
        return 'property';
      }
    }
    for (const f of solmu.getRangeAllFontNames(0, solmu.characters.length)) await figma.loadFontAsync(f);
    solmu.characters = teksti;
    return 'teksti';
  };

  const kay = async (kehys, solmu) => {
    if (solmu.visible === false) return;
    if (solmu.type === 'TEXT' && !['huom:', 'vaihtuu:', 'generated:'].some((e) => solmu.name.startsWith(e))) {
      const osat = solmu.characters.split(erotin);
      let muuttui = false;
      for (let i = 0; i < osat.length; i += 2) {
        const nuoli = (osat[i].match(/\s*→\s*$/) || [''])[0];
        const ydin = tasaa(osat[i].slice(0, osat[i].length - nuoli.length));
        if (!ydin || sivulla(ydin)) continue;
        let uusi = null;
        for (const [vanha, u] of parit) {
          if (!ydin.includes(vanha)) continue;
          const ehdokas = tasaa(ydin.split(vanha).join(u));
          if (sivulla(ehdokas)) {
            uusi = ehdokas;
            break;
          }
        }
        if (uusi === null) {
          let kertyva = ydin;
          for (const [vanha, u] of parit) if (kertyva.includes(vanha)) kertyva = tasaa(kertyva.split(vanha).join(u));
          if (kertyva !== ydin && sivulla(kertyva)) uusi = kertyva;
        }
        /* Luku muuttui: sama lause, eri luvut ("10 kytkentää" →
           "11 kytkentää"). Luvut johdetaan koodista, joten diffissä ei
           ole merkkijonoa, ja lukua ei voi muokata Figmassa merkityksellä. */
        if (uusi === null && /\d/.test(ydin)) {
          const kuvio = new RegExp(ydin.split(/\d+/).map((o) => o.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\d+'));
          for (const r of rivit) {
            const m = r.match(kuvio);
            if (m) {
              uusi = m[0];
              break;
            }
          }
        }
        if (uusi !== null) {
          osat[i] = uusi + nuoli;
          muuttui = true;
        } else {
          const [rivi, s] = lahin(ydin);
          eiSivulla.push({ kehys: kehys.name, id: solmu.id, figmassa: ydin, lahinSivulla: rivi, samankaltaisuus: Math.round(s * 100) / 100 });
        }
      }
      if (muuttui) {
        const uusi = osat.join('');
        const vanha = solmu.characters;
        const sekatyyli = solmu.getRangeAllFontNames(0, vanha.length).length > 1;
        const tapa = kirjoita ? await aseta(solmu, uusi) : null;
        muutokset.push({ kehys: kehys.name, id: solmu.id, vanha, uusi, tapa, sekatyyli });
      }
    }
    if ('children' in solmu) for (const lapsi of solmu.children) await kay(kehys, lapsi);
  };

  let kehyksia = 0;
  for (const sivu of figma.root.children) {
    await sivu.loadAsync();
    for (const kehys of sivu.children) {
      if (!new RegExp(`^${pohja} · (base|sm|md|lg) \\d+$`).test(kehys.name)) continue;
      kehyksia++;
      await kay(kehys, kehys);
    }
  }
  return { pohja, kehyksia, kirjoitettu: kirjoita, muutokset, eiSivulla };
}

/* ---- ajo ------------------------------------------------------------ */

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const out = join(root, 'out');
  const base = git('merge-base', ref, 'HEAD').trim();
  const parit = muutosparit(git('diff', '-U0', base, '--', ...LAHTEET));

  const kansio = join(root, '.scratch', 'pohjat');
  mkdirSync(kansio, { recursive: true });

  console.log(`Vertailukohta ${ref} (${base.slice(0, 7)}): ${parit.length} muuttunutta merkkijonoa`);
  for (const [pohja, polut] of Object.entries(POHJAT)) {
    const rivit = polut.flatMap((p) => {
      const tiedosto = join(out, p, 'index.html');
      if (!existsSync(tiedosto)) {
        console.error(`✗ out/${p}/ puuttuu — aja ensin npx next build`);
        process.exit(1);
      }
      return sivunTekstit(readFileSync(tiedosto, 'utf8')).split('\n');
    });
    const koodi = `return (${synkka.toString()})(${JSON.stringify({ pohja, rivit, parit, kirjoita })});\n`;
    const tiedosto = join(kansio, `${pohja}.js`);
    writeFileSync(tiedosto, koodi);
    console.log(`  ${pohja.padEnd(9)} .scratch/pohjat/${pohja}.js (${Math.round(koodi.length / 1024)} kt)`);
  }
  console.log(
    `\nAja kukin tiedosto Figmassa (tiedosto PVyeKV6J1Rzyj2VL4X27FR). ${kirjoita ? 'Koodi kirjoittaa muutokset.' : 'Koodi palauttaa suunnitelman eikä kirjoita; kirjoita lipulla --kirjoita.'}\n` +
      '  muutokset   sivun muutos, joka viedään pohjaan\n' +
      '  eiSivulla   pohjan teksti, jota mikään muutos ei selitä: Figmassa tehty\n' +
      '              muokkaus. Vie se koodiin (lahinSivulla näyttää kohdan).',
  );
}

export { synkka };
