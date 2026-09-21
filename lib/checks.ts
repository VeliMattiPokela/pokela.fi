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
    blind: 'Poikkeuksen perustelu on vapaata tekstiä. Kone tarkistaa että se on olemassa, ei että se on totta.',
  },
  {
    id: 'code-connect',
    title: 'Code Connect',
    proves: 'Jokaisella kirjatulla Figma-komponentilla on kytkentätiedosto, ja se osoittaa oikeaan Figma-tiedostoon.',
    blind: 'Ei avaa Figmaa. Komponentin osoitteen voi vaihtaa keksityksi ja tarkistus menee silti läpi.',
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
      'Figma-tiedoston muuttujat vastaavat tokens.jsonia, jokainen kytkentä osoittaa olemassa olevaan komponenttiin, ja jokaisella Figman komponentilla on kytkentä.',
    blind: '',
  },
  {
    id: 'strings',
    title: 'Tekstit',
    proves: 'Näkyvät tekstit tulevat sanakirjasta, eivät komponenteista.',
    blind: '',
  },
];

/**
 * Mitkä tarkistukset oikeasti ajetaan. Luetaan `check:sync`-ketjusta,
 * koska se on se komento jonka build ja CI ajavat.
 */
function wired(): Set<string> {
  const pkg = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8')) as {
    scripts: Record<string, string>;
  };
  const chain = pkg.scripts['check:sync'] ?? '';
  const ids = new Set<string>();
  for (const match of chain.matchAll(/npm run check:([a-z-]+)/g)) {
    const id = match[1];
    /* Kytketty ei riitä: skriptin on myös oltava olemassa. */
    if (existsSync(join(repoRoot, `scripts/check-${id}.mjs`))) ids.add(id);
  }
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
