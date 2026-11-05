#!/usr/bin/env node
/**
 * Synkkatarkistus — kieliversiot: suomi ↔ englanti
 * ---------------------------------------------------------------
 * Suomi on lähdekieli, ja muut kielet kirjoitetaan sen pohjalta
 * (päätös 60). Kieliversio jää jälkeen hiljaa: suomeen lisätty
 * kappale tai muutettu lause ei kaada mitään, ja englanninkielinen
 * sivu jatkaa vanhalla tekstillä. Virhe näkyy vain, jos joku lukee
 * molemmat kielet rinnakkain.
 *
 * Tarkistus vertaa jokaisen sisältömoduulin (content/<moduuli>/fi.ts
 * ja <kieli>.ts) kolmella tavalla:
 *
 *   1. Rakenne   samat avaimet, sama määrä kappaleita ja kuvia ja
 *                sama järjestys. Tunnisteet (slug, id, kind, ratio,
 *                href …) ovat samat, koska ne eivät ole kieltä.
 *   2. Ajantasaisuus  jokainen suomenkielinen teksti on kirjattu
 *                tiedostoon content/kielet.lukko.json sellaisena kuin
 *                se oli, kun käännös viimeksi tarkistettiin. Jos
 *                suomi muuttuu, tarkistus kertoo mikä kohta, ja
 *                käännös päivitetään ennen kuin muutos menee läpi.
 *   3. Kääntämättä  käännös ei saa olla sama kuin suomenkielinen
 *                teksti, jossa on suomen kirjaimia (ä, ö), eikä
 *                sisältää niitä itse.
 *
 * Lisäksi lib/checks.ts:n tarkistuksilla, sen ryhmillä ja
 * content/prosessi.ts:n lenkeillä on oltava käännös tunnisteen
 * mukaan (content/johdetut/<kieli>.ts).
 *
 * Kun käännös on päivitetty: `npm run kielet:kuittaa` kirjaa suomen
 * nykyiset tekstit lukkoon. Kuittaus on ihmisen lupaus, että
 * käännös vastaa suomea; tarkistus näkee vain, että se on annettu.
 *
 * Exit 0 = synkassa. Exit 1 = eriytymä.
 */

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const LUKKO = join(root, 'content/kielet.lukko.json');
const kuittaa = process.argv.includes('--kuittaa');

const tuo = async (polku) => import(pathToFileURL(join(root, polku)).href);
const { locales, defaultLocale } = await tuo('lib/i18n.ts');

/** Sisältömoduulit, joilla on teksti jokaiselle kielelle. */
const MODUULIT = ['dictionaries', 'cases', 'work', 'tyotapa', 'cv', 'system', 'johdetut'];

/**
 * Avaimet, joiden arvo on tunniste eikä kieltä. Niiden on oltava
 * samat kaikilla kielillä: eri slug tai kuvan id rikkoisi linkin tai
 * kuvan vain toisella kielellä.
 */
const TUNNISTEET = new Set([
  'slug', 'id', 'kind', 'ratio', 'aihe', 'href', 'number', 'surface', 'esitys', 'to',
  'email', 'linkedinUrl', 'period', 'year', 'company', 'siteName',
]);

/** Kentät, joiden arvo saa erota kielittäin, vaikka se ei ole tekstiä. */
const VAPAAT = new Set(['naytaTulos', 'paivays', 'numerot']);

const SUOMEN_KIRJAIMET = /[äöåÄÖÅ]/;
const tiiviste = (teksti) => createHash('sha1').update(teksti).digest('hex').slice(0, 10);

const virheet = [];
/** Suomen tekstit polkuineen: lukon sisältö. */
const lahde = {};

/** Kulkee suomen ja käännöksen rinnakkain ja kirjaa erot. */
function vertaa(fi, kaannos, polku, kieli, avain) {
  const kohta = polku || '(juuri)';
  if (fi === null || kaannos === null) {
    if (fi !== kaannos) virheet.push(`${kohta}: toisella kielellä arvo puuttuu (null)`);
    return;
  }
  if (Array.isArray(fi) !== Array.isArray(kaannos) || typeof fi !== typeof kaannos) {
    virheet.push(`${kohta}: eri tyyppi (${kieli})`);
    return;
  }
  if (Array.isArray(fi)) {
    if (fi.length !== kaannos.length) {
      virheet.push(`${kohta}: suomessa ${fi.length} kohtaa, ${kieli}ssa ${kaannos.length}`);
      return;
    }
    fi.forEach((arvo, i) => vertaa(arvo, kaannos[i], `${polku}[${i}]`, kieli, avain));
    return;
  }
  if (typeof fi === 'object') {
    const a = Object.keys(fi);
    const b = Object.keys(kaannos);
    for (const k of a) if (!(k in kaannos)) virheet.push(`${polku}.${k}: puuttuu (${kieli})`);
    for (const k of b) if (!(k in fi)) virheet.push(`${polku}.${k}: ylimääräinen, suomessa ei ole (${kieli})`);
    for (const k of a) if (k in kaannos) vertaa(fi[k], kaannos[k], polku ? `${polku}.${k}` : k, kieli, k);
    return;
  }
  if (VAPAAT.has(avain)) return;
  if (typeof fi !== 'string' || TUNNISTEET.has(avain)) {
    if (fi !== kaannos) virheet.push(`${kohta}: tunniste eroaa — "${fi}" / "${kaannos}" (${kieli})`);
    return;
  }
  /* Teksti. */
  if (kieli === locales.find((l) => l !== defaultLocale)) lahde[polku] = tiiviste(fi);
  if (SUOMEN_KIRJAIMET.test(kaannos)) {
    virheet.push(
      fi === kaannos
        ? `${kohta}: kääntämättä — "${fi.slice(0, 60)}"`
        : `${kohta}: käännöksessä on suomen kirjaimia — "${kaannos.slice(0, 60)}"`,
    );
  }
}

const muut = locales.filter((l) => l !== defaultLocale);

for (const moduuli of MODUULIT) {
  const fiPolku = `content/${moduuli}/${defaultLocale}.ts`;
  const fi = (await tuo(fiPolku)).default;
  for (const kieli of muut) {
    const polku = `content/${moduuli}/${kieli}.ts`;
    if (!existsSync(join(root, polku))) {
      virheet.push(`${polku}: puuttuu — kieli ${kieli} on julkaistu (lib/i18n.ts)`);
      continue;
    }
    const kaannos = await tuo(polku);
    /* caseRefs ei kuulu vertailuun: mainintojen muodot ovat kielen
       omia (suomessa taivutus), eikä niiden määrä vastaa toisiaan. */
    vertaa(fi, kaannos.default, moduuli, kieli, '');
  }
}

/* Lähteissään suomeksi asuvat tekstit: tarkistukset ja prosessi. */
const { DESCRIPTIONS, CHECK_GROUPS } = await tuo('lib/checks.ts');
const { ketju } = await tuo('content/prosessi.ts');
for (const kieli of muut) {
  const k = await tuo(`content/johdetut/${kieli}.ts`);
  const lahdeTeksti = (polku, teksti) => {
    lahde[polku] = tiiviste(teksti);
  };
  for (const d of DESCRIPTIONS) {
    const t = k.tarkistukset?.[d.id];
    if (!t) {
      virheet.push(`tarkistus ${d.id}: käännös puuttuu (content/johdetut/${kieli}.ts)`);
      continue;
    }
    for (const kentta of ['title', 'huomaa', 'proves']) lahdeTeksti(`tarkistukset.${d.id}.${kentta}`, d[kentta]);
    (d.items ?? []).forEach((teksti, i) => lahdeTeksti(`tarkistukset.${d.id}.items[${i}]`, teksti));
    if ((d.items?.length ?? 0) !== (t.items?.length ?? 0)) virheet.push(`tarkistus ${d.id}: eri määrä kohtia (items)`);
  }
  for (const id of Object.keys(k.tarkistukset ?? {})) {
    if (!DESCRIPTIONS.some((d) => d.id === id)) virheet.push(`tarkistus ${id}: käännös tarkistukselle, jota ei ole`);
  }
  for (const g of CHECK_GROUPS) {
    if (!k.ryhmat?.[g.id]) virheet.push(`tarkistusryhmä ${g.id}: käännös puuttuu`);
    lahdeTeksti(`ryhmat.${g.id}`, g.title);
  }
  for (const l of ketju) {
    if (!k.ketju?.[l.numero]) virheet.push(`prosessin lenkki ${l.numero}: käännös puuttuu`);
    lahdeTeksti(`ketju.${l.numero}.otsikko`, l.otsikko);
    lahdeTeksti(`ketju.${l.numero}.teksti`, l.teksti);
  }
  if (Object.keys(k.ketju ?? {}).length !== ketju.length) virheet.push('prosessi: käännöksiä on eri määrä kuin lenkkejä');
}

/* Ajantasaisuus: suomi verrattuna lukkoon. */
if (kuittaa) {
  if (virheet.length) {
    console.error('✗ Kieliversioita ei kuitattu: rakenne ei vastaa suomea. Korjaa ensin:\n');
    for (const v of virheet) console.error(`  ${v}`);
    process.exit(1);
  }
  const jarjestetty = Object.fromEntries(Object.entries(lahde).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(LUKKO, `${JSON.stringify(jarjestetty, null, 2)}\n`);
  console.log(`✓ Kuitattu — ${Object.keys(lahde).length} suomenkielistä tekstiä kirjattu lukkoon`);
  process.exit(0);
}

const lukko = existsSync(LUKKO) ? JSON.parse(readFileSync(LUKKO, 'utf8')) : {};
const muuttuneet = [];
for (const [polku, h] of Object.entries(lahde)) {
  if (!(polku in lukko)) muuttuneet.push(`${polku}: uusi suomenkielinen teksti`);
  else if (lukko[polku] !== h) muuttuneet.push(`${polku}: suomi muuttui`);
}
for (const polku of Object.keys(lukko)) if (!(polku in lahde)) muuttuneet.push(`${polku}: poistunut suomesta`);

if (virheet.length === 0 && muuttuneet.length === 0) {
  console.log(`✓ Kieliversiot synkassa — ${Object.keys(lahde).length} tekstiä, kielet ${locales.join(', ')}`);
  process.exit(0);
}

if (virheet.length) {
  console.error(`✗ Kieliversiot eroavat rakenteeltaan (${virheet.length}):\n`);
  for (const v of virheet) console.error(`  ${v}`);
  console.error('');
}
if (muuttuneet.length) {
  console.error(`✗ Suomi on muuttunut käännöksen jälkeen (${muuttuneet.length}):\n`);
  for (const v of muuttuneet) console.error(`  ${v}`);
  console.error(
    `\n  Päivitä vastaava kohta tiedostoon content/<moduuli>/${muut.join('|')}.ts` +
      ' ja kuittaa sitten: npm run kielet:kuittaa',
  );
}
process.exit(1);
