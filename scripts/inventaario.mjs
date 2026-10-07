#!/usr/bin/env node
/**
 * Vaihe 0.1 — inventaario ja ero.
 * ---------------------------------------------------------------
 * Tämä EI ole tarkistus. Se ei kaadu, se ei tuomitse, eikä se kerro
 * kumpi puoli on oikeassa. Se kertoo yhden asian: missä nämä kaksi
 * eroavat.
 *
 * Syy on se, että kannanotto kuuluu vaiheeseen 0.2 — ihmisille, jotka
 * käyvät erot läpi ja päättävät. Jos työkalu päättäisi tässä, se olisi
 * jo päättänyt sen puolesta jonka pitäisi päättää. Olemassa olevassa
 * talossa kypsä Figma-kirjasto voi hyvin olla oikeassa ja sekava
 * sovellus väärässä.
 *
 * Tuloste on tarkoitettu luettavaksi palaverissa, ei putkeen. Siksi
 * se on luetteloa eikä pass/fail.
 *
 * MITÄ TÄMÄ EI NÄE
 *
 * Figman muuttujia ei saa rajapinnan yli: file_variables:read on
 * "Enterprise plan only". Kierto on oma plugin — Plugin API ei ole
 * saman rajoitteen takana — mutta se vaatii ihmisen avaamaan Figman.
 * Siihen asti tokeniryhmä raportoidaan vain koodin puolelta, ja
 * puuttuva puoli sanotaan ääneen eikä jätetä huomaamatta.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { lukija, root } from './figma-rajapinta.mjs';

const { hae } = lukija();

const otsikko = (teksti) => console.log(`\n  ${teksti}\n  ${'─'.repeat(teksti.length)}`);
const rivi = (nimi, arvo) => console.log(`  ${String(nimi).padEnd(22)} ${arvo}`);
const lista = (nimi, arvot) => {
  if (!arvot.length) return rivi(nimi, '—');
  rivi(nimi, arvot[0]);
  for (const a of arvot.slice(1)) rivi('', a);
};

/* ---- koodin puoli --------------------------------------------------- */

const komponenttiDir = join(root, 'components');
const tiedostot = readdirSync(komponenttiDir);

const koodinKomponentit = tiedostot
  .filter((f) => f.endsWith('.tsx') && !f.endsWith('.stories.tsx'))
  .map((f) => f.replace('.tsx', ''));

/* Kytkentä voi osoittaa komponenttiin TAI tyylitiedostoon: Button on
   luokkasopimus (.btn) eikä React-komponentti. Siksi kohde luetaan
   mukaan — ilman sitä Button näyttäisi puuttuvan koodista, vaikka se
   on kytketty tarkoituksella eri tavalla. */
const kytkennat = tiedostot
  .filter((f) => f.endsWith('.figma.ts'))
  .map((f) => {
    const lahde = readFileSync(join(komponenttiDir, f), 'utf8');
    return {
      nimi: /\/\/ component=(.+)/.exec(lahde)?.[1]?.trim() ?? f.replace('.figma.ts', ''),
      kohde: /\/\/ source=(.+)/.exec(lahde)?.[1]?.trim() ?? null,
    };
  });
const kytketyt = new Map(kytkennat.map((k) => [k.nimi, k.kohde]));

const tokenit = JSON.parse(readFileSync(join(root, 'tokens.json'), 'utf8'));

/* ---- Figman puoli --------------------------------------------------- */

const puu = await hae('?depth=2');
const figmanKirjasto = [];
const figmanApurit = [];

for (const sivu of puu.document.children) {
  for (const lapsi of sivu.children ?? []) {
    if (lapsi.type !== 'COMPONENT_SET' && lapsi.type !== 'COMPONENT') continue;
    const apuri = lapsi.name.includes(' / ');
    (apuri ? figmanApurit : figmanKirjasto).push({ sivu: sivu.name, nimi: lapsi.name, id: lapsi.id });
  }
}

/* Propertyt haetaan vain kirjastokomponenteille. */
const solmut = figmanKirjasto.length
  ? (await hae(`/nodes?ids=${encodeURIComponent(figmanKirjasto.map((k) => k.id).join(','))}`)).nodes
  : {};

const paljas = (avain) => avain.split('#')[0];
const propertyt = (id) => {
  const maaritykset = solmut[id]?.document?.componentPropertyDefinitions ?? {};
  return Object.entries(maaritykset).map(([avain, m]) => {
    const nimi = paljas(avain);
    if (m.type === 'VARIANT') return `${nimi} = ${(m.variantOptions ?? []).join(' | ')}`;
    return `${nimi} : ${m.type.toLowerCase()}`;
  });
};

/** Tokeneita lasketaan lehdistä, ei ylätason avaimista: color on kaksi
    avainta (light, dark) mutta seitsemäntoista väriä. */
function lehdet(arvo) {
  if (arvo === null || typeof arvo !== 'object') return 1;
  return Object.values(arvo).reduce((n, v) => n + lehdet(v), 0);
}

/* ---- raportti -------------------------------------------------------- */

console.log(`\n  INVENTAARIO — ${puu.name}`);
console.log(`  ${new Date().toISOString().slice(0, 10)} · ei ota kantaa kumpi on oikeassa\n`);

otsikko('Komponentit');
rivi('Figman kirjastossa', figmanKirjasto.length);
rivi('koodissa', koodinKomponentit.length);
rivi('kytkettynä', kytkennat.length);
console.log('');

const figmanNimet = new Set(figmanKirjasto.map((k) => k.nimi));
const koodinNimet = new Set(koodinKomponentit);

lista(
  'vain Figmassa',
  [...figmanNimet].filter((n) => !koodinNimet.has(n) && !kytketyt.has(n)),
);
lista(
  'kytketty muuhun',
  [...figmanNimet]
    .filter((n) => !koodinNimet.has(n) && kytketyt.has(n))
    .map((n) => `${n} → ${kytketyt.get(n)}`),
);
lista(
  'vain koodissa',
  [...koodinNimet].filter((n) => !figmanNimet.has(n)),
);
lista(
  'apukomponentit',
  figmanApurit.map((a) => a.nimi),
);

otsikko('Propertyt ja variantit Figmassa');
for (const komponentti of figmanKirjasto) {
  const p = propertyt(komponentti.id);
  const kytketty = kytketyt.has(komponentti.nimi);
  console.log(`\n  ${komponentti.nimi}${kytketty ? '' : '   (ei kytkentää)'}`);
  if (!p.length) console.log('    —');
  for (const r of p) console.log(`    ${r}`);
}

otsikko('Tokenit');
console.log('  Figman puolta ei voi lukea: file_variables:read on Figman mukaan');
console.log('  "Enterprise plan only". Kierto on pluginin lukutila — ks. docs/kasikirja.md.\n');
for (const [ryhma, arvo] of Object.entries(tokenit)) {
  if (ryhma.startsWith('$') || ryhma.endsWith('Note')) continue;
  rivi(ryhma, `${lehdet(arvo)} koodissa · ? Figmassa`);
}

console.log('\n  Tämä luettelo on vaiheen 0.2 syöte. Päätös siitä kumpi puoli');
console.log('  voittaa tehdään ihmisten kesken, ei täällä.\n');
