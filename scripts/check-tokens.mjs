#!/usr/bin/env node
/**
 * Synkkatarkistus — vaihe 1: tokens.css ↔ tokens.json
 * ---------------------------------------------------------------
 * Ajetaan jokaisessa buildissa ja pull requestissa. Jos arvo on
 * muuttunut vain toisaalla, build pysähtyy ja raportti kertoo MIKÄ
 * eriytyi — ei vain että jokin eriytyi.
 *
 * Myöhemmät vaiheet (oma tiedostonsa kun kirjasto on olemassa):
 *   2. onko jokaisella komponentilla story ja Code Connect -kytkentä
 *   3. vastaavatko tokenien arvot Figman muuttujia
 *
 * Exit 0 = synkassa. Exit 1 = eriytymä.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cssPath = join(root, 'styles/tokens.css');
const jsonPath = join(root, 'tokens.json');

const css = readFileSync(cssPath, 'utf8');
const json = JSON.parse(readFileSync(jsonPath, 'utf8'));

const drift = [];
const checked = { color: 0, type: 0, space: 0, layout: 0, motion: 0, border: 0, icon: 0 };

const report = (group, token, inCss, inJson) =>
  drift.push({ group, token, css: inCss, json: inJson });

/* ---- CSS-jäsennys ------------------------------------------------- */

/** Poimii :root-lohkon ilman media-kyselyitä (= base/mobile-arvot). */
function rootBlock(source) {
  const start = source.indexOf(':root {');
  if (start === -1) throw new Error('tokens.css: :root-lohkoa ei löytynyt');
  let depth = 0;
  for (let i = source.indexOf('{', start); i < source.length; i++) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}' && --depth === 0) return source.slice(start, i);
  }
  throw new Error('tokens.css: :root-lohko jäi sulkematta');
}

/** Poimii yhden min-width-median :root-lohkon sisällön. */
function breakpointBlock(source, minWidth) {
  const re = new RegExp(
    `@media\\s*\\(min-width:\\s*${minWidth}px\\)\\s*\\{\\s*:root\\s*\\{([\\s\\S]*?)\\}`,
    'm',
  );
  return source.match(re)?.[1] ?? '';
}

const declarations = (block) => {
  const out = new Map();
  for (const m of block.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
    out.set(m[1], m[2].trim());
  }
  return out;
};

const base = declarations(rootBlock(css));
const bp = {
  sm: declarations(breakpointBlock(css, 600)),
  md: declarations(breakpointBlock(css, 900)),
  lg: declarations(breakpointBlock(css, 1200)),
};

/** Arvo tietyllä breakpointilla: lähin määrittely alaspäin. */
const at = (name, level) => {
  const chain = { base: [], sm: ['sm'], md: ['sm', 'md'], lg: ['sm', 'md', 'lg'] }[level];
  let value = base.get(name);
  for (const step of chain) if (bp[step].has(name)) value = bp[step].get(name);
  return value;
};

const norm = (v) => (v ?? '').trim().replace(/\s+/g, ' ');
const hex = (v) => norm(v).toUpperCase();

/* ---- 1. värit: arvopari --x-l / --x-d + vaihtolohkot -------------- */

for (const [name, lightExpected] of Object.entries(json.color.light)) {
  const lightValue = base.get(`${name}-l`);
  const darkValue = base.get(`${name}-d`);
  const darkExpected = json.color.dark[name];

  if (lightValue === undefined) { report('color.light', `--${name}-l`, '(puuttuu)', lightExpected); continue; }
  if (darkValue === undefined) { report('color.dark', `--${name}-d`, '(puuttuu)', darkExpected); continue; }

  checked.color++;
  if (hex(lightValue) !== hex(lightExpected)) report('color.light', `--${name}-l`, lightValue, lightExpected);
  if (darkExpected === undefined) report('color.dark', `--${name}-d`, darkValue, '(puuttuu tokens.jsonista)');
  else if (hex(darkValue) !== hex(darkExpected)) report('color.dark', `--${name}-d`, darkValue, darkExpected);

  /* Oletusarvon on osoitettava vaaleaan pariin, ei suoraan hexiin:
     kovakoodattu arvo ei kääntyisi teeman mukana. */
  const fallback = norm(base.get(name));
  if (fallback !== `var(--${name}-l)`) {
    report('color.default', `--${name}`, fallback || '(puuttuu)', `var(--${name}-l)`);
  }
}

for (const name of Object.keys(json.color.dark)) {
  if (!(name in json.color.light)) report('color', `--${name}`, '—', 'vain dark-lohkossa');
}

/* Molempien vaihtolohkojen on katettava sama lista. Jos token
   lisätään vain toiseen, teema rikkoutuu vain toisessa tilassa —
   juuri se hiljainen eriytymä jota vastaan tämä on olemassa. */
const switchBlocks = {
  "data-theme='dark'": /:root\[data-theme='dark'\]\s*\{([\s\S]*?)\n\}/,
  'prefers-color-scheme': /@media \(prefers-color-scheme: dark\)\s*\{\s*:root:not\(\[data-theme='light'\]\)\s*\{([\s\S]*?)\n  \}/,
};
const expectedSwitch = Object.keys(json.color.light).sort();
for (const [label, re] of Object.entries(switchBlocks)) {
  const block = css.match(re)?.[1];
  if (!block) { report('theme', label, '(lohkoa ei löydy)', 'tumma paletti'); continue; }
  const mapped = [...block.matchAll(/--([\w-]+):\s*var\(--[\w-]+-d\)/g)].map((m) => m[1]).sort();
  for (const name of expectedSwitch) {
    if (!mapped.includes(name)) report(`theme:${label}`, `--${name}`, '(puuttuu)', `var(--${name}-d)`);
  }
  for (const name of mapped) {
    if (!expectedSwitch.includes(name)) report(`theme:${label}`, `--${name}`, 'ylimääräinen', '—');
  }
  checked.color++;
}

/* ---- 2. typografia: lg-koot + rivivälit + tracking ---------------- */

for (const [name, spec] of Object.entries(json.type)) {
  const sizeVar = `text-${name}`;
  if (!base.has(sizeVar)) { report('type', `--${sizeVar}`, '(puuttuu)', spec.size); continue; }
  checked.type++;
  if (norm(at(sizeVar, 'lg')) !== norm(spec.size)) {
    report('type.size@lg', `--${sizeVar}`, at(sizeVar, 'lg'), spec.size);
  }
  const lhVar = `lh-${name}`;
  if (base.has(lhVar) && norm(at(lhVar, 'lg')) !== norm(spec.lineHeight)) {
    report('type.lineHeight@lg', `--${lhVar}`, at(lhVar, 'lg'), spec.lineHeight);
  }
  if (spec.tracking) {
    const trVar = `tr-${name}`;
    if (!base.has(trVar)) report('type.tracking', `--${trVar}`, '(puuttuu)', spec.tracking);
    else if (norm(at(trVar, 'lg')) !== norm(spec.tracking)) {
      report('type.tracking', `--${trVar}`, at(trVar, 'lg'), spec.tracking);
    }
  }
}

/* display-kokojen koko asteikko, ei vain lg */
for (const [name, scale] of Object.entries(json.typeScale ?? {})) {
  for (const [level, expected] of Object.entries(scale)) {
    const actual = at(`text-${name}`, level);
    if (norm(actual) !== norm(expected)) {
      report(`type.size@${level}`, `--text-${name}`, actual, expected);
    }
  }
}

/* Rivivälit breakpointeittain. Aiemmin tarkistettiin vain lg-arvo,
   jolloin base-tason --lh-display-xl olisi voinut ajautua huomaamatta. */
for (const [name, scale] of Object.entries(json.lineHeightScale ?? {})) {
  for (const [level, expected] of Object.entries(scale)) {
    checked.type++;
    const actual = at(`lh-${name}`, level);
    if (norm(actual) !== norm(expected)) {
      report(`type.lineHeight@${level}`, `--lh-${name}`, actual, expected);
    }
  }
}

/* ---- 3. spacing --------------------------------------------------- */

for (const [key, expected] of Object.entries(json.space)) {
  const name = `space-${key}`;
  if (!base.has(name)) { report('space', `--${name}`, '(puuttuu)', expected); continue; }
  checked.space++;
  if (norm(base.get(name)) !== norm(expected)) report('space', `--${name}`, base.get(name), expected);
  if (`${key}px` !== expected) report('space', `--${name}`, `nimi ${key}`, `arvo ${expected} — nimen pitää olla arvo`);
}
for (const name of base.keys()) {
  if (name.startsWith('space-') && !(name.slice(6) in json.space)) {
    report('space', `--${name}`, base.get(name), '(puuttuu tokens.jsonista)');
  }
}

/* ---- 3b. fonttipainot ---------------------------------------------
   Sama sääntö kuin välistyksessä: nimi on arvo. Lisäksi asteikon on
   katettava vain ladatut leikkaukset — paino jota fontista ei ole
   jäisi huomaamatta, koska font-synthesis-weight on pois päältä. */

for (const [key, expected] of Object.entries(json.weight ?? {})) {
  const name = `weight-${key}`;
  if (!base.has(name)) { report('weight', `--${name}`, '(puuttuu)', expected); continue; }
  checked.space++;
  if (Number(base.get(name)) !== Number(expected)) report('weight', `--${name}`, base.get(name), expected);
  if (Number(key) !== Number(expected)) {
    report('weight', `--${name}`, `nimi ${key}`, `arvo ${expected} — nimen pitää olla arvo`);
  }
}
for (const name of base.keys()) {
  if (name.startsWith('weight-') && !(name.slice(7) in (json.weight ?? {}))) {
    report('weight', `--${name}`, base.get(name), '(puuttuu tokens.jsonista)');
  }
}

/* ---- 4. layout (responsiiviset) ----------------------------------- */

const layoutMap = {
  'max-width': json.layout.maxWidth,
  'tap-min': json.layout.tapMin,
  measure: json.layout.measure,
};
for (const [name, expected] of Object.entries(layoutMap)) {
  if (!base.has(name)) { report('layout', `--${name}`, '(puuttuu)', expected); continue; }
  checked.layout++;
  if (norm(base.get(name)) !== norm(expected)) report('layout', `--${name}`, base.get(name), expected);
}

const responsive = {
  'page-padding': json.layout.pagePadding,
  gutter: json.layout.gutter,
  'section-gap': json.layout.sectionGap,
  columns: json.layout.columns,
};
for (const [name, scale] of Object.entries(responsive)) {
  for (const [level, expected] of Object.entries(scale)) {
    checked.layout++;
    const actual = at(name, level);
    if (norm(actual) !== norm(String(expected))) {
      report(`layout@${level}`, `--${name}`, actual, String(expected));
    }
  }
}

/* ---- 5. reunat ja motion ------------------------------------------ */

/* Reunat ja fontit johdetaan jsonista, ei luetella tässä. Lista oli
   ennen käsin ylläpidetty, jolloin tokens.jsoniin lisätty arvo jäi
   hiljaa tarkistuksen ulkopuolelle — juuri se eriytymä jota tämä
   skripti on vastaan. camelCase → kebab-case, `$`-alkuiset ohitetaan
   (ne ovat muistiinpanoja, eivät arvoja). */
const kebab = (key) => key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const fromGroup = (group, prefix = '') =>
  Object.fromEntries(
    Object.entries(group)
      .filter(([key]) => !key.startsWith('$'))
      .map(([key, value]) => [`${prefix}${kebab(key)}`, value]),
  );

const simple = {
  ...fromGroup(json.border),
  ...fromGroup(json.icon, 'icon-'),
  ...fromGroup(json.font, 'font-'),
  /* Motion on yhä käsin: `reveal.translate` on CSS:ssä
     `--reveal-shift`, eikä nimenmuutos ole johdettavissa. */
  'dur-fast': json.motion.duration.fast,
  'dur-base': json.motion.duration.base,
  'dur-slow': json.motion.duration.slow,
  'dur-reveal': json.motion.duration.reveal,
  'ease-standard': json.motion.easing.standard,
  'ease-out': json.motion.easing.out,
  'reveal-shift': json.motion.reveal.translate,
  'reveal-stagger': json.motion.reveal.stagger,
};
for (const [name, expected] of Object.entries(simple)) {
  if (!base.has(name)) { report('token', `--${name}`, '(puuttuu)', expected); continue; }
  const bucket = name.startsWith('dur') || name.startsWith('ease') || name.startsWith('reveal')
    ? 'motion'
    : name.startsWith('icon-')
      ? 'icon'
      : 'border';
  checked[bucket]++;
  if (norm(base.get(name)) !== norm(expected)) report('token', `--${name}`, base.get(name), expected);
}

/* ---- raportti ------------------------------------------------------ */

const total = Object.values(checked).reduce((a, b) => a + b, 0);

if (drift.length === 0) {
  console.log(`✓ Tokenit synkassa — ${total} tokenia tarkistettu (styles/tokens.css ↔ tokens.json)`);
  process.exit(0);
}

console.error(`\n✗ Token-eriytymä: ${drift.length} kohtaa (${total} tarkistettu)\n`);
const width = Math.max(...drift.map((d) => d.token.length));
for (const d of drift) {
  console.error(
    `  ${d.group.padEnd(22)} ${d.token.padEnd(width)}  css: ${String(d.css).padEnd(28)} json: ${d.json}`,
  );
}
console.error('\n  Korjaa kumpi tahansa niin että ne vastaavat, ja aja uudelleen.\n');
process.exit(1);
