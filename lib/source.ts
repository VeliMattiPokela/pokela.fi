import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Lähdekoodin luku build-aikana.
 * ---------------------------------------------------------------
 * Casesivun komponenttinäkymä näyttää oikeaa koodia oikeista
 * tiedostoista, ei käsin kopioitua otetta. Käsin kopioitu esimerkki
 * vanhenee — ja se on juuri se virhe jonka tämä case lupaa ratkaista.
 *
 * Tiedosto näytetään KOKONAAN. Aiemmin tästä näytettiin vain
 * merkattu alue, mutta se oli huono ratkaisu kahdesta syystä:
 * piilotettu pätkä herättää kysymyksen "mitä muuta siellä on", ja
 * rajaus vaati oman merkkausjärjestelmänsä ja oman tarkistuksensa
 * pysyäkseen ehjänä. Vierittyvä paneeli hoitaa pituuden ilman
 * kumpaakaan.
 *
 * Luku tapahtuu palvelinkomponentissa, joten static exportissa se
 * ajetaan kerran buildissa eikä koodia päädy selaimen bundleen.
 */

const repoRoot = process.cwd();

export type SourceFile = {
  /** Polku repon juuresta, näytetään koodilohkon yllä. */
  path: string;
  /** Kieli syntaksikorostusta varten. */
  lang: 'tsx' | 'ts' | 'css';
  code: string;
  /** Rivimäärä, näytetään otsikkopalkissa. */
  lines: number;
};

/** Lukee tiedoston kokonaan. */
export function readSource(path: string, lang: SourceFile['lang']): SourceFile {
  const code = readFileSync(join(repoRoot, path), 'utf8').replace(/\s+$/, '');
  return { path, lang, code, lines: code.split('\n').length };
}

/**
 * Poimii komponentin käyttämät tokenit sen omasta tyylitiedostosta
 * ja ryhmittelee ne aiheen mukaan.
 *
 * Pelkkä 22 nimen lista on lukukelvoton — ryhmä kertoo mitä
 * komponentti oikeasti säätää: värit, välit, typografia, liike.
 * Ryhmä johdetaan nimen etuliitteestä, joten listaa ei kirjoiteta
 * käsin eikä se voi vanhentua.
 */
const TOKEN_GROUPS: { label: string; match: RegExp }[] = [
  { label: 'Väri', match: /^--(ink|paper|line|invert|badge|placeholder|code)/ },
  { label: 'Typografia', match: /^--(font|text|lh|tr|weight|measure)/ },
  { label: 'Välistys', match: /^--(space|page-padding|gutter|tap-min|section-gap)/ },
  { label: 'Liike', match: /^--(dur|ease|reveal)/ },
  { label: 'Viivat ja reunat', match: /^--(hairline|radius|focus)/ },
];

export type TokenGroup = { label: string; tokens: string[] };

export function readTokenGroups(path: string): { groups: TokenGroup[]; total: number } {
  const source = readFileSync(join(repoRoot, path), 'utf8');
  const found = new Set<string>();
  for (const match of source.matchAll(/var\((--[\w-]+)/g)) found.add(match[1]);
  const all = [...found].sort();

  const groups = TOKEN_GROUPS.map(({ label, match }) => ({
    label,
    tokens: all.filter((t) => match.test(t)),
  })).filter((g) => g.tokens.length > 0);

  const grouped = groups.flatMap((g) => g.tokens);
  const rest = all.filter((t) => !grouped.includes(t));
  if (rest.length) groups.push({ label: 'Muu', tokens: rest });

  return { groups, total: all.length };
}

export type StoryEntry = { name: string; description: string };

/**
 * Listaa storyt ja niiden kuvaukset.
 *
 * Kuvaus luetaan storyn omasta JSDoc-kommentista, ei muuttujan
 * nimestä: `VainNimi` ei kerro lukijalle mitään, mutta "Ilman
 * kuvausta — käytetään tiiviissä listassa" kertoo. Nimi on koodia,
 * kommentti on merkitys — ja molemmat tulevat samasta tiedostosta,
 * joten kumpikaan ei voi vanhentua.
 */
export function readStories(path: string): StoryEntry[] {
  const source = readFileSync(join(repoRoot, path), 'utf8');
  const entries: StoryEntry[] = [];

  for (const match of source.matchAll(/^export const (\w+): Story\b/gm)) {
    const name = match[1];
    /* Vain välittömästi edeltävä kommentti kelpaa: pelkkä
       "etsi lähin /**" ahmaisi koko tiedoston alusta. */
    const before = source.slice(0, match.index).trimEnd();
    const close = before.lastIndexOf('*/');
    const open = before.lastIndexOf('/**');
    const adjacent = close === before.length - 2 && open !== -1 && open < close;

    const description = adjacent
      ? before
          .slice(open + 3, close)
          .split('\n')
          .map((line) => line.replace(/^\s*\*\s?/, '').trim())
          .join(' ')
          .replace(/\s+/g, ' ')
          .replace(/`/g, '')
          .trim()
      : '';

    entries.push({ name, description });
  }

  return entries;
}

export type CodeConnectMap = {
  /** Figma-noodin osoite, `// url=`-otsikosta. */
  url: string | null;
  /** Figman property → koodin propsi. */
  props: { figma: string; code: string; kind: 'string' | 'boolean' | 'enum' }[];
  /** Enum-varianttien arvot sellaisina kuin kytkentä ne tuntee. */
  variants: { name: string; values: string[] }[];
};

/**
 * Code Connect -kytkennän luku.
 * ---------------------------------------------------------------
 * Figman varianttien ja propertyjen nimet asuvat Figmassa, jonne
 * build ei näe. Ne asuvat kuitenkin myös kytkentätiedostossa — ja
 * juuri siinä muodossa jota Figma oikeasti käyttää. Siksi ne
 * luetaan sieltä eikä kirjoiteta tähän käsin: jos kytkentä muuttuu,
 * komponenttinäkymä muuttuu mukana.
 *
 * scripts/check-code-connect.mjs valvoo että tiedosto on ehjä,
 * joten tämä lukija saa olettaa muodon.
 */
export function readCodeConnect(path: string): CodeConnectMap {
  const source = readFileSync(join(repoRoot, path), 'utf8');

  const url = /^\/\/\s*url=(\S+)/m.exec(source)?.[1] ?? null;
  const props: CodeConnectMap['props'] = [];
  const variants: CodeConnectMap['variants'] = [];

  for (const m of source.matchAll(/const (\w+) = figma\.selectedInstance\.getString\('([^']+)'\)/g)) {
    props.push({ code: m[1], figma: m[2], kind: 'string' });
  }
  for (const m of source.matchAll(/const (\w+) = figma\.selectedInstance\.getBoolean\('([^']+)'/g)) {
    props.push({ code: m[1], figma: m[2], kind: 'boolean' });
  }
  for (const m of source.matchAll(
    /const (\w+) = figma\.selectedInstance\.getEnum\('([^']+)',\s*\{([^}]*)\}/g,
  )) {
    props.push({ code: m[1], figma: m[2], kind: 'enum' });
    const values = [...m[3].matchAll(/^\s*(\w+):/gm)].map((v) => v[1]);
    variants.push({ name: m[2], values });
  }

  return { url, props, variants };
}
