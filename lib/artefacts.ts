import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { readStories } from './source';
import { artefactUrls } from '@/content/artefacts';

/**
 * Artefaktien tila.
 * ---------------------------------------------------------------
 * Case 03 väittää että jokaisen kohdan voi tarkistaa. Silloin myös
 * artefaktin tilan on oltava totta — eikä "tulossa" saa tarkoittaa
 * kahta eri asiaa.
 *
 * Kolme tilaa, ei kahta:
 *
 *   julkaistu   julkinen osoite olemassa → linkki
 *   olemassa    tehty, mutta ei vielä julkisessa osoitteessa
 *   tulossa     ei ole vielä olemassa
 *
 * `olemassa` johdetaan tiedostojärjestelmästä build-aikana, joten se
 * ei voi jäädä jälkeen. Osoitteet ovat yhdessä paikassa
 * (content/artefacts.ts) — kun jokin julkaistaan, sinne lisätään
 * yksi rivi ja tila vaihtuu kaikkialla.
 */

const repoRoot = process.cwd();
const has = (path: string) => existsSync(join(repoRoot, path));

export type ArtefactState = 'julkaistu' | 'olemassa' | 'tulossa';

export type Artefact = {
  label: string;
  state: ArtefactState;
  href: string | null;
  /** Mitä siitä voi juuri nyt sanoa. Näkyy kun osoitetta ei ole. */
  note: string;
};

/** Onko repolla etäosoite? Jos on, siitä saadaan suora linkki. */
export function readGitRemote(): string | null {
  const configPath = join(repoRoot, '.git/config');
  if (!existsSync(configPath)) return null;

  const config = readFileSync(configPath, 'utf8');
  const url = /\[remote "origin"\][^[]*?url\s*=\s*(\S+)/.exec(config)?.[1];
  if (!url) return null;

  /* git@github.com:omistaja/repo.git → https://github.com/omistaja/repo */
  return url
    .replace(/^git@([^:]+):/, 'https://$1/')
    .replace(/\.git$/, '');
}

/** Onko Code Connect -kytkentöjä kirjoitettu? */
function countCodeConnect(): number {
  const dirs = ['components', '.'];
  let count = 0;
  for (const dir of dirs) {
    const full = join(repoRoot, dir);
    if (!existsSync(full)) continue;
    count += readdirSync(full).filter((f) => f.endsWith('.figma.ts')).length;
  }
  return count;
}

const state = (href: string | null, exists: boolean): ArtefactState =>
  href ? 'julkaistu' : exists ? 'olemassa' : 'tulossa';

/**
 * Teksti johdetaan tilasta, ei kirjoiteta sinne missä se näytetään.
 * Aiemmin nämä olivat kiinteitä merkkijonoja, ja jokainen julkaisu
 * jätti niihin vanhan totuuden — "Tulossa" asiasta joka oli jo tehty.
 */
const note = (s: ArtefactState, detail?: string): string => {
  /* Ei nuolta: nuoli on ikoni, ja ikoni kuuluu linkkiin joka sen
     piirtää — ei tilasta johdettuun merkkijonoon. Ks. Icon.tsx. */
  if (s === 'julkaistu') return 'Avaa';
  if (s === 'olemassa') return detail ? `Tehty · ${detail}` : 'Tehty · ei vielä julkinen';
  return 'Tulossa';
};

/**
 * Yhden komponentin artefaktit — komponenttinäkymän alarivi.
 */
export function componentArtefacts(storyPath: string): Artefact[] {
  const storyCount = has(storyPath) ? readStories(storyPath).length : 0;
  const remote = artefactUrls.repo ?? readGitRemote();
  const connections = countCodeConnect();

  const storybook = state(artefactUrls.storybook, storyCount > 0);
  const figma = state(artefactUrls.figma, connections > 0);
  const github = state(remote, false);

  return [
    {
      label: 'Storybook',
      state: storybook,
      href: artefactUrls.storybook,
      note: note(storybook, `${storyCount} storya, ei vielä julkinen`),
    },
    {
      label: 'Figma',
      state: figma,
      href: artefactUrls.figma,
      note: note(figma, `${connections} Code Connect -kytkentä`),
    },
    {
      label: 'GitHub',
      state: github,
      href: remote,
      note: note(github, 'repo ei ole vielä julkinen'),
    },
  ];
}

/**
 * Case 03:n viisi artefaktia. Sama totuus kuin yllä, laajempana.
 */
export function caseArtefacts(): (Artefact & { number: string; body: string })[] {
  const remote = artefactUrls.repo ?? readGitRemote();
  const connections = countCodeConnect();
  const hasStorybook = has('.storybook/main.ts');
  const hasFigma = has('components/IndexRow.figma.ts');

  const items: (Omit<Artefact, 'note'> & { number: string; body: string; detail?: string })[] = [
    {
      number: '01',
      label: 'Storybook',
      body: 'Komponentit, tokenit ja tilat elävinä. Sama koodi jota tämä sivu käyttää.',
      state: state(artefactUrls.storybook, hasStorybook),
      href: artefactUrls.storybook,
      detail: 'ei vielä julkinen',
    },
    {
      number: '02',
      label: 'Figma-tiedosto',
      body: 'Sama kirjasto Figman puolella — komponentit, variantit ja tokenit.',
      state: state(artefactUrls.figma, hasFigma),
      href: artefactUrls.figma,
    },
    {
      number: '03',
      label: 'Code Connect -kytkennät',
      body: 'Määrittelyt jotka kertovat Figmalle, mikä koodikomponentti vastaa mitä.',
      state: state(artefactUrls.codeConnect, connections > 0),
      href: artefactUrls.codeConnect,
      detail: `${connections} kytkentä, julkaistaan repon mukana`,
    },
    {
      number: '04',
      label: 'Repo',
      body: 'Koko sivusto, tokenit ja build-putki. Myös synkkatarkistus.',
      state: state(remote, false),
      href: remote,
    },
    {
      number: '05',
      label: 'Tämä sivu',
      body: 'Jokaisesta osiosta pääsee sen omaan storyyn ja Figma-noodiin.',
      state: 'julkaistu',
      href: null,
    },
  ];

  return items.map(({ detail, ...item }) => ({
    ...item,
    /* "Tämä sivu" on julkaistu ilman osoitetta: sitä katsotaan juuri nyt. */
    note: item.state === 'julkaistu' && !item.href ? 'Katsot sitä' : note(item.state, detail),
  }));
}
