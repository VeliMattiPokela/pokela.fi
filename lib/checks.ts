import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Synkkatarkistusten rekisteri.
 * ---------------------------------------------------------------
 * Case 03 väitti pitkään että "jokainen build tarkistaa että tokenit,
 * Storybook ja Figma vastaavat toisiaan". Väite oli kirjoitettu
 * casetekstiin käsin, eikä mikään sitonut sitä todellisuuteen — ja
 * se oli väärin: yksikään tarkistus ei lue Figma-tiedostoa.
 *
 * Nyt lista johdetaan `package.json`ista. Tarkistus näkyy sivulla
 * vain jos se on oikeasti kytketty `check:sync`-ketjuun ja sen
 * skripti on olemassa. Väitettä ei siis voi kirjoittaa suuremmaksi
 * kuin todellisuus — sama periaate kuin artefaktien tilassa
 * (lib/artefacts.ts).
 *
 * `blind` on tarkoituksella näkyvissä. Se kertoo mitä tarkistus EI
 * näe. Sivun argumentti on että jokaisen väitteen voi tarkistaa;
 * silloin myös tarkistuksen rajan on oltava luettavissa.
 */

const repoRoot = process.cwd();

export type Check = {
  /** npm-skriptin nimi ilman `check:`-etuliitettä. */
  id: string;
  title: string;
  /** Mitä tarkistus todistaa. */
  proves: string;
  /** Mitä se ei näe. Tyhjä vain jos rajaa ei ole. */
  blind: string;
  /** Onko se kytketty ketjuun ja onko skripti olemassa. Johdettu. */
  runs: boolean;
};

/** Kuvaukset. Arvot `runs` ja järjestys tulevat package.jsonista. */
const DESCRIPTIONS: Omit<Check, 'runs'>[] = [
  {
    id: 'tokens',
    title: 'Tokenit',
    proves: 'styles/tokens.css ja tokens.json ovat samat arvot jokaisella breakpointilla.',
    blind: 'Ei kerro käyttääkö arvoa kukaan: kuollut token on molemmissa tiedostoissa ja täsmää itsensä kanssa.',
  },
  {
    id: 'stories',
    title: 'Storyt',
    proves: 'Jokaisella komponentilla on story, ja siinä on tumma teema ja mobiilikoko.',
    blind: 'Poikkeuksen syy on nyt valinta kolmesta, ja jokaisella on sääntö jonka kone ajaa. Mutta se ei näe onko story hyvä — vain että se on olemassa ja kattaa tumman teeman ja mobiilikoon.',
  },
  {
    id: 'code-connect',
    title: 'Code Connect',
    proves: 'Jokaisella kirjatulla Figma-komponentilla on kytkentätiedosto, ja se osoittaa oikeaan Figma-tiedostoon.',
    blind: 'Ei avaa Figmaa itse — sen tekee Figma-tarkistus, joka ajetaan erikseen CI:ssä.',
  },
  {
    id: 'hardcoded',
    title: 'Kovakoodatut arvot',
    proves: 'Tyyleissä ei ole kirjaamatonta mittaa, väriä eikä fonttipainoa.',
    blind: 'Sama kuin storyilla: poikkeuksen syy on tekstiä.',
  },
  {
    id: 'figma',
    title: 'Figma',
    proves:
      'Jokainen kytkentä osoittaa olemassa olevaan Figma-komponenttiin ja nimi täsmää, jokaisella kirjaston komponentilla on kytkentä, ja jokainen property ja variantti jonka kytkentä lukee on oikeasti Figmassa. Kirjaston sisältö luetaan Figma-tiedostosta, ei käsin ylläpidetystä listasta.',
    blind:
      'Ei tarkista muuttujia: rajapinta vaatii oikeuden file_variables:read, jota ei ole tämän tilin tunnusvalikoimassa. Kokeiltu 21.9.2026, vastaus 403. Muuttujat generoidaan tokens.jsonista, mutta generoinnin jälkeen tehtyä käsimuokkausta mikään ei huomaa.',
  },
  {
    id: 'docs',
    title: 'Dokumentaatio',
    proves:
      'Dokumentissa mainittu tiedostopolku ja komento on olemassa, jokainen tarkistus on dokumentoitu, ja johdettavissa olevat kohdat (Figman kokoelmat, Perusta-sivut) vastaavat lähdettään.',
    blind:
      'Ei voi todentaa proosaa. Väärä perustelu tai vanhentunut kuvaus menee läpi, jos se ei ole luotu lohko eikä sisällä polkua. Siksi kaikki mikä on johdettavissa merkitään luoduksi.',
  },
  {
    id: 'strings',
    title: 'Tekstit',
    proves: 'Näkyvät tekstit tulevat sanakirjasta, eivät komponenteista.',
    blind: '',
  },
];

/**
 * Mitkä tarkistukset oikeasti ajetaan.
 *
 * Kaksi lähdettä, koska kaikki eivät ole samassa ketjussa:
 * `check:sync` on se mitä `npm run build` ajaa, ja CI:n työnkulku on
 * se mikä estää rikkinäisen muutoksen menemästä läpi. `check:figma`
 * on vain jälkimmäisessä — se tarvitsee verkon ja salaisuuden, joten
 * se ei kuulu buildiin.
 */
function wired(): Set<string> {
  const pkg = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8')) as {
    scripts: Record<string, string>;
  };
  const ciPath = join(repoRoot, '.github/workflows/ci.yml');
  const sources = [
    pkg.scripts['check:sync'] ?? '',
    existsSync(ciPath) ? readFileSync(ciPath, 'utf8') : '',
  ].join('\n');

  const ids = new Set<string>();
  for (const match of sources.matchAll(/npm run check:([a-z-]+)/g)) {
    const id = match[1];
    /* Kytketty ei riitä: skriptin on myös oltava olemassa. */
    if (existsSync(join(repoRoot, `scripts/check-${id}.mjs`))) ids.add(id);
  }
  ids.delete('sync');
  return ids;
}

/** Kaikki tunnetut tarkistukset, ajossa olevat ensin. */
export function checks(): Check[] {
  const live = wired();
  return DESCRIPTIONS.map((d) => ({ ...d, runs: live.has(d.id) })).sort(
    (a, b) => Number(b.runs) - Number(a.runs),
  );
}

/** Ajossa olevien määrä — luku joka vanhenisi käsin kirjoitettuna. */
export function liveCheckCount(): number {
  return checks().filter((c) => c.runs).length;
}
