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
  /** Mitä tarkistus todistaa. Rivillä näkyy ensimmäinen lause. */
  proves: string;
  /** Lista proves-tekstin perään, kun luettelo on selkeämpi kuin lause. */
  items?: string[];
  /** Mitä se ei näe. Kappaleet erotetaan tyhjällä rivillä (\n\n). */
  blind: string;
  /** Yleinen ydin vai tämän tuotteen oma vartija. Ks. päätös 42. */
  group: CheckGroupId;
  /** Onko se kytketty ketjuun ja onko skripti olemassa. Johdettu. */
  runs: boolean;
};

export type CheckGroupId = 'ydin' | 'tuote';

/**
 * Ryhmät näkyvät sivulla tässä järjestyksessä. Ydin siirtyy mihin
 * tahansa tuotteeseen sellaisenaan. Tuotekohtaiset vartijat ovat saman
 * menetelmän sovelluksia tämän sivuston omiin johdettuihin
 * tiedostoihin, joten ne näytetään ryhmänä eivätkä ytimen rinnalla.
 */
export const CHECK_GROUPS: { id: CheckGroupId; title: string; note: string }[] = [
  {
    id: 'ydin',
    title: 'Yleinen ydin',
    note: 'Koodi, Figma ja paketit pidetään samana. Ydin sopii mihin tahansa tuotteeseen.',
  },
  {
    id: 'tuote',
    title: 'Tuotekohtaiset vartijat',
    note: 'Sama menetelmä tämän sivuston omiin tiedostoihin: favicon ja kuvat lasketaan lähteestä, ja tarkistus käyttää samaa laskentaa.',
  },
];

/** Kuvaukset. Arvot `runs` ja järjestys tulevat package.jsonista. */
const DESCRIPTIONS: Omit<Check, 'runs'>[] = [
  {
    id: 'tokens',
    group: 'ydin',
    title: 'Tokenit',
    proves: 'Varmistaa, että koodin ja Figman tokenit ovat samat jokaisella näyttökoolla. Vertailussa ovat tokens.css ja tokens.json.',
    blind: 'Ei kerro, käytetäänkö tokenia missään. Käyttämätön token on molemmissa tiedostoissa ja menee läpi.',
  },
  {
    id: 'stories',
    group: 'ydin',
    title: 'Storyt',
    proves: 'Varmistaa, että jokaisella komponentilla on Storybook-story, jossa on myös tumma teema ja mobiilikoko.',
    blind: 'Ei arvioi storyn laatua, vain sen että se on olemassa. Jos story puuttuu tarkoituksella, syy valitaan kolmesta vakiovaihtoehdosta.',
  },
  {
    id: 'code-connect',
    group: 'ydin',
    title: 'Code Connect',
    proves: 'Varmistaa, että jokaisella Figma-komponentilla on kytkentä koodin komponenttiin.',
    blind: 'Katsoo vain koodin puolta. Sen, että komponentti todella löytyy Figmasta, varmistaa Figma-tarkistus (05).',
  },
  {
    id: 'hardcoded',
    group: 'ydin',
    title: 'Kovakoodatut arvot',
    proves: 'Varmistaa, että tyyleissä ei ole mittoja, värejä tai fonttipainoja tokenien ohi.',
    blind: 'Poikkeus on sallittu, kun sen syy kirjataan. Tarkistus näkee, että syy on kirjattu, mutta ei sitä, onko syy hyvä.',
  },
  {
    id: 'favicon',
    group: 'tuote',
    title: 'Favicon',
    proves: 'Varmistaa, että favicon vastaa teeman värejä. Sama laskenta tuottaa faviconin ja tarkistaa sen, joten ne eivät voi erota toisistaan.',
    blind: 'Ei arvioi merkin ulkonäköä. Luettavuus 16 pikselin koossa on katsottu silmällä, eikä mikään valvo sitä jatkossa.',
  },
  {
    id: 'kuvat',
    group: 'tuote',
    title: 'Kuvat',
    proves: 'Varmistaa, että sivun kuvat vastaavat lähdekuvia ja sisällön kuvasuhteita, eikä kansiossa ole kuvia, joille ei ole paikkaa. Kuvista pidetään luetteloa, joka luodaan lähdekuvista. Sama laskenta luo luettelon ja tarkistaa sen.',
    blind: 'Ei arvioi kuvaa. Kuva rajataan keskeltä, eikä mikään huomaa, jos olennainen kohta jää rajauksen ulkopuolelle.\n\nPuuttuva kuva ei kaada buildia. Paikka näytetään odottavana.',
  },
  {
    id: 'suhteet',
    group: 'tuote',
    title: 'Kuvasuhteet',
    proves: 'Varmistaa, että kuvasuhteet ovat samat kuvien rajauksessa, sivun tyyleissä ja sisällössä. Suhteet luetaan samasta taulukosta, jota kuvien rajaus käyttää. Figman osuus tarkistetaan Figma-tarkistuksessa (05).',
    blind: 'Ei arvioi, onko suhde oikea, vain sen, että kaikki lähteet sanovat samaa.',
  },
  {
    id: 'figma',
    group: 'ydin',
    title: 'Figma',
    proves: 'Varmistaa, että koodin komponentit ja Figma-kirjasto vastaavat toisiaan, variantteja myöten. Kirjaston sisältö luetaan suoraan Figmasta, ei käsin ylläpidetystä listasta. Lisäksi tarkistus varmistaa, että',
    items: ['sivupohjien gridit vastaavat layout-tokeneita', 'kuvasuhteet ovat samat Figmassa ja kuvien käsittelyssä', 'sivupohjien tekstit ovat samat kuin julkaistulla sivulla.'],
    blind: 'Ei tarkista Figman muuttujia, koska Figman rajapinta ei anna niihin lukuoikeutta tällä tilillä. Muuttujat luodaan tokens.jsonista, mutta Figmassa jälkikäteen tehtyä muutosta mikään ei huomaa.\n\nSivupohjista tarkistus huomaa vanhentuneen tekstin, mutta ei kokonaan puuttuvaa osiota.',
  },
  {
    id: 'paketti',
    group: 'ydin',
    title: 'Paketit',
    proves: 'Varmistaa, että npm:ssä julkaistut paketit ovat samat kuin repo rakentaisi. Paketit ovat @pokela/tokens ja @pokela/components, ja vertailu tehdään tavu tavulta. Jos sisältö on muuttunut mutta versio ei, korjaus on nostaa versiota pull requestissa. Kun muutos yhdistetään, main julkaisee uuden version npm:ään automaattisesti.',
    blind: 'Ei näe, mihin versioon Figma Maken kit on kiinnitetty. Kitin päivitys tehdään Figmassa käsin.',
  },
  {
    id: 'docs',
    group: 'ydin',
    title: 'Dokumentaatio',
    proves: 'Varmistaa, että dokumentaatiossa mainitut tiedostot ja komennot ovat olemassa ja jokainen tarkistus on dokumentoitu. Koodista johdettavat kohdat, kuten Figman kokoelmat, luodaan automaattisesti ja tarkistetaan lähdettään vasten.',
    blind: 'Ei voi tarkistaa vapaata tekstiä, joten väärä perustelu menee läpi. Siksi kaikki, mikä voidaan johtaa koodista, luodaan automaattisesti.',
  },
  {
    id: 'strings',
    group: 'ydin',
    title: 'Tekstit',
    proves: 'Varmistaa, että sivun tekstit tulevat sanakirjasta eivätkä ole kirjoitettuina komponentteihin.',
    blind: 'Tarkistusta ei vielä ajeta, joten se ei vielä estä mitään.',
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

/** Kaikki tunnetut tarkistukset ryhmittäin, ryhmän sisällä ajossa olevat ensin. */
export function checks(): Check[] {
  const live = wired();
  const ryhma = (c: Check) => CHECK_GROUPS.findIndex((g) => g.id === c.group);
  return DESCRIPTIONS.map((d) => ({ ...d, runs: live.has(d.id) })).sort(
    (a, b) => ryhma(a) - ryhma(b) || Number(b.runs) - Number(a.runs),
  );
}

/** Ajossa olevien määrä — luku joka vanhenisi käsin kirjoitettuna. */
export function liveCheckCount(): number {
  return checks().filter((c) => c.runs).length;
}
