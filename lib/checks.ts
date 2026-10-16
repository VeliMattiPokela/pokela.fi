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
    proves: 'styles/tokens.css ja tokens.json ovat samat arvot jokaisella breakpointilla.',
    blind: 'Ei kerro käyttääkö arvoa kukaan: kuollut token on molemmissa tiedostoissa ja täsmää itsensä kanssa.',
  },
  {
    id: 'stories',
    group: 'ydin',
    title: 'Storyt',
    proves: 'Jokaisella komponentilla on story, ja siinä on tumma teema ja mobiilikoko.',
    blind: 'Ei näe onko story hyvä, vain että se on olemassa ja kattaa tumman teeman ja mobiilikoon. Poikkeuksen syy valitaan kolmesta vaihtoehdosta, ja jokaisella on oma sääntönsä.',
  },
  {
    id: 'code-connect',
    group: 'ydin',
    title: 'Code Connect',
    proves: 'Jokaisella kirjatulla Figma-komponentilla on kytkentätiedosto, ja se osoittaa oikeaan Figma-tiedostoon.',
    blind: 'Ei avaa Figmaa itse. Sen tekee Figma-tarkistus, joka ajetaan erikseen CI:ssä.',
  },
  {
    id: 'hardcoded',
    group: 'ydin',
    title: 'Kovakoodatut arvot',
    proves: 'Tyyleissä ei ole kirjaamatonta mittaa, väriä eikä fonttipainoa.',
    blind: 'Sama kuin storyilla: poikkeuksen syy on tekstiä.',
  },
  {
    id: 'favicon',
    group: 'tuote',
    title: 'Favicon',
    proves:
      'public/-kansion favicon-tiedostot vastaavat tavu tavulta sitä mitä tokens.css:n käännetty väripari tuottaa. Sama laskenta ajetaan tarkistuksessa ja generoinnissa, joten ne eivät voi erota toisistaan.',
    blind:
      'Ei arvioi merkin laatua. Muoto on koordinaatteina generaattorissa, ja sen luettavuus 16 pikselissä on tarkistettu silmällä — mikään ei valvo ettei seuraava muutos riko sitä.',
  },
  {
    id: 'kuvat',
    group: 'tuote',
    title: 'Kuvat',
    proves:
      'Kuvamanifesti vastaa lähdetiedostoja ja sisällössä ilmoitettuja kuvasuhteita, eikä kuvat-kansiossa ole lähdettä jolle ei ole paikkaa. Sama laskenta ajetaan tarkistuksessa ja generoinnissa.',
    blind:
      'Ei arvioi kuvaa. Rajaus on oletuksena keskeltä, eikä mikään huomaa jos kuvan olennainen kohta jää sen ulkopuolelle. Tyhjä paikka ei ole virhe vaan tila, joten puuttuva kuva ei kaada buildia. Se vain raportoidaan.',
  },
  {
    id: 'suhteet',
    group: 'tuote',
    title: 'Kuvasuhteet',
    proves:
      'Sama kuvasuhde rajaa kuvan levylle (scripts/kuvat.mjs) ja piirtää sen selaimeen (styles/base.css), ja sisältö saa kirjoittaa vain niitä nimiä jotka molemmat tuntevat (Ratio tiedostossa components/Media.tsx). Suhteet luetaan samasta taulusta jota generointi käyttää.',
    blind:
      'Ei arvioi onko suhde oikea, vain että kolme lähdettä sanovat samaa. Ei myöskään näe luokkanimen muunnosta: Media.tsx kirjoittaa 4:3 -> media-4-3 omalla rivillään, ja jos se muuttuisi, tarkistus vertaisi yhä vanhaa nimeä. Figman neljäs paikka (Media-komponentin Ratio-variantti) on katettu, mutta check:figmassa: se tarvitsee verkon eikä kuulu tähän ketjuun.',
  },
  {
    id: 'figma',
    group: 'ydin',
    title: 'Figma',
    proves:
      'Jokainen kytkentä osoittaa olemassa olevaan Figma-komponenttiin ja nimi täsmää, jokaisella kirjaston komponentilla on kytkentä, ja jokainen property ja variantti jonka kytkentä lukee on oikeasti Figmassa. Kirjaston sisältö luetaan Figma-tiedostosta, ei käsin ylläpidetystä listasta. Lisäksi: sivupohjien layout grid vastaa layout-tokeneita jokaisella moodilla, Media-komponentin Ratio-variantti vastaa kuvaputken SUHTEET-taulua, ja jokainen sivupohjan teksti löytyy siltä buildatulta sivulta, jota pohja kuvaa.',
    blind:
      'Ei tarkista muuttujia: rajapinta vaatii oikeuden file_variables:read, jota ei ole tämän tilin tunnusvalikoimassa. Kokeiltu 21.9.2026, vastaus 403. Muuttujat generoidaan tokens.jsonista, mutta generoinnin jälkeen tehtyä käsimuokkausta mikään ei huomaa. Sivupohjista se huomaa vanhentuneen tekstin mutta ei puuttuvaa osiota: sivulle lisätty uusi osio, jota pohjassa ei ole, ei kaada ajoa.',
  },
  {
    id: 'paketti',
    group: 'ydin',
    title: 'Paketit',
    proves:
      'npm:ssä julkaistu @pokela/tokens ja @pokela/components vastaavat tavulleen sitä mitä repo rakentaisi. Jos sisältö eroaa mutta versio on sama, se sanotaan erikseen. npm ei päästä julkaisemaan samaa versiota uudelleen, joten korjaus alkaa versionnostosta.',
    blind:
      'Ei julkaise mitään eikä voi. Se kertoo että npm on jäljessä, ei korjaa sitä. Eikä se tiedä mitä versiota Figman Make kit osoittaa — kit voi olla kiinnitetty vanhaan versioon vaikka npm ja repo vastaisivat toisiaan.',
  },
  {
    id: 'docs',
    group: 'ydin',
    title: 'Dokumentaatio',
    proves:
      'Dokumentissa mainittu tiedostopolku ja komento on olemassa, jokainen tarkistus on dokumentoitu, ja johdettavissa olevat kohdat (Figman kokoelmat, Perusta-sivut) vastaavat lähdettään.',
    blind:
      'Ei voi todentaa proosaa. Väärä perustelu tai vanhentunut kuvaus menee läpi, jos se ei ole luotu lohko eikä sisällä polkua. Siksi kaikki mikä on johdettavissa merkitään luoduksi.',
  },
  {
    id: 'strings',
    group: 'ydin',
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
