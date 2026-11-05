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
 * `blind` kertoo, mitä tarkistus EI näe. Se on kehittäjän tietoa:
 * käsikirja ja tämä rekisteri kertovat sen, mutta casesivu ei
 * (päätös 50, tarkennus 3.11.2026). Showcasessa raja vei huomion
 * siihen, mitä ei tehdä.
 */

const repoRoot = process.cwd();

export type Check = {
  /** npm-skriptin nimi ilman `check:`-etuliitettä. */
  id: string;
  title: string;
  /** Rivin lause: millaisen virheen tarkistus pysäyttää. Ks. päätös 50. */
  huomaa: string;
  /** Mitä avattu paneeli lisää rivin lauseeseen. Paneeli näyttää
      huomaa-lauseen ja tämän peräkkäin, joten tämä ei toista sitä.
      Tyhjä, kun rivin lause riittää. */
  proves: string;
  /** Lista proves-tekstin perään, kun luettelo on selkeämpi kuin lause. */
  items?: string[];
  /** Mitä se ei näe. Kappaleet erotetaan tyhjällä rivillä (\n\n). */
  blind: string;
  /** Design system vai tämän sivuston oma tarkistus. Ks. päätökset 42 ja 50. */
  group: CheckGroupId;
  /**
   * Tarkistus, joka ei ole `check:*`-skripti vaan muu npm-komento
   * (saavutettavuus ajetaan storyjen testien mukana). Se on ajossa,
   * kun komento on olemassa ja CI ajaa sen.
   */
  komento?: string;
  /** Onko se kytketty ketjuun ja onko skripti olemassa. Johdettu. */
  runs: boolean;
};

export type CheckGroupId = 'ydin' | 'tuote';

/**
 * Ryhmät näkyvät viimeisimmän ajon aikajanalla. Casen listassa on vain
 * ydin: sivuston omat tarkistukset (favicon, kuvat) ovat saman
 * menetelmän sovelluksia, mutta lukijalle sivupolku (päätös 50).
 */
export const CHECK_GROUPS: { id: CheckGroupId; title: string }[] = [
  { id: 'ydin', title: 'Design system' },
  { id: 'tuote', title: 'Sivuston omat tarkistukset' },
];

/** Kuvaukset. Arvot `runs` ja järjestys tulevat package.jsonista. */
export const DESCRIPTIONS: Omit<Check, 'runs'>[] = [
  {
    id: 'tokens',
    group: 'ydin',
    title: 'Tokenit',
    huomaa: 'Huomaa, jos väri tai mitta muuttuu koodissa mutta ei Figmassa.',
    proves: 'Vertailu tehdään jokaisella näyttökoolla.',
    blind: 'Ei kerro, käytetäänkö tokenia missään. Käyttämätön token on molemmissa tiedostoissa ja menee läpi.',
  },
  {
    id: 'stories',
    group: 'ydin',
    title: 'Storyt',
    huomaa: 'Huomaa, jos komponentilta puuttuu Storybook-story, tumma teema tai mobiilikoko.',
    proves: '',
    blind: 'Ei arvioi storyn laatua, vain sen että se on olemassa. Jos story puuttuu tarkoituksella, syy valitaan kolmesta vakiovaihtoehdosta.',
  },
  {
    id: 'code-connect',
    group: 'ydin',
    title: 'Code Connect',
    huomaa: 'Huomaa, jos Figma-komponenttia ei ole kytketty koodin komponenttiin.',
    proves: '',
    blind: 'Katsoo vain koodin puolta. Sen, että komponentti todella löytyy Figmasta, varmistaa Figma-tarkistus (05).',
  },
  {
    id: 'hardcoded',
    group: 'ydin',
    title: 'Kovakoodatut arvot',
    huomaa: 'Huomaa, jos tyyliin kirjoitetaan väri tai mitta suoraan tokenin ohi.',
    proves: 'Sama koskee fonttipainoja.',
    blind: 'Poikkeus on sallittu, kun sen syy kirjataan. Tarkistus näkee, että syy on kirjattu, mutta ei sitä, onko syy hyvä.',
  },
  {
    id: 'favicon',
    group: 'tuote',
    title: 'Favicon',
    huomaa: 'Huomaa, jos teeman väri muuttuu mutta favicon ei.',
    proves: 'Varmistaa, että favicon vastaa teeman värejä. Sama laskenta tuottaa faviconin ja tarkistaa sen, joten ne eivät voi erota toisistaan.',
    blind: 'Ei arvioi merkin ulkonäköä. Luettavuus 16 pikselin koossa on katsottu silmällä, eikä mikään valvo sitä jatkossa.',
  },
  {
    id: 'kuvat',
    group: 'tuote',
    title: 'Kuvat',
    huomaa: 'Huomaa, jos kuva puuttuu, on väärän muotoinen tai jää ilman paikkaa.',
    proves: 'Varmistaa, että sivun kuvat vastaavat lähdekuvia ja sisällön kuvasuhteita, eikä kansiossa ole kuvia, joille ei ole paikkaa. Kuvista pidetään luetteloa, joka luodaan lähdekuvista. Sama laskenta luo luettelon ja tarkistaa sen.',
    blind: 'Ei arvioi kuvaa. Kuva rajataan keskeltä, eikä mikään huomaa, jos olennainen kohta jää rajauksen ulkopuolelle.\n\nPuuttuva kuva ei kaada buildia. Paikka näytetään odottavana.',
  },
  {
    id: 'suhteet',
    group: 'tuote',
    title: 'Kuvasuhteet',
    huomaa: 'Huomaa, jos kuvasuhde on eri rajauksessa, tyyleissä ja sisällössä.',
    proves: 'Varmistaa, että kuvasuhteet ovat samat kuvien rajauksessa, sivun tyyleissä ja sisällössä. Suhteet luetaan samasta taulukosta, jota kuvien rajaus käyttää. Figman osuus tarkistetaan Figma-tarkistuksessa (05).',
    blind: 'Ei arvioi, onko suhde oikea, vain sen, että kaikki lähteet sanovat samaa.',
  },
  {
    id: 'figma',
    group: 'ydin',
    title: 'Figma',
    huomaa: 'Huomaa, jos komponentti tai variantti on koodissa mutta ei Figma-kirjastossa.',
    proves: 'Kirjaston sisältö luetaan suoraan Figmasta. Lisäksi tarkistus varmistaa, että',
    items: ['sivupohjien gridit vastaavat layout-tokeneita', 'kuvasuhteet ovat samat Figmassa ja kuvien käsittelyssä', 'sivupohjien tekstit ovat samat kuin julkaistulla sivulla.'],
    blind: 'Ei tarkista Figman muuttujia, koska Figman rajapinta ei anna niihin lukuoikeutta tällä tilillä. Muuttujat luodaan tokens.jsonista, mutta Figmassa jälkikäteen tehtyä muutosta mikään ei huomaa.\n\nSivupohjista tarkistus huomaa vanhentuneen tekstin, mutta ei kokonaan puuttuvaa osiota.',
  },
  {
    id: 'paketti',
    group: 'ydin',
    title: 'Paketit',
    huomaa: 'Huomaa, jos npm-paketti on muuttunut mutta versiota ei ole nostettu.',
    proves: 'Julkaistua pakettia verrataan tavu tavulta siihen, mitä koodista syntyisi. Kun muutos yhdistetään, uusi versio julkaistaan npm:ään automaattisesti.',
    blind: 'Ei näe, mihin versioon Figma Maken kit on kiinnitetty. Kitin päivitys tehdään Figmassa käsin.',
  },
  {
    id: 'docs',
    group: 'ydin',
    title: 'Dokumentaatio',
    huomaa: 'Huomaa, jos ohje viittaa tiedostoon tai komentoon, jota ei enää ole.',
    proves: 'Lisäksi jokaisen tarkistuksen pitää olla dokumentoitu. Koodista johdettavat kohdat luodaan automaattisesti ja tarkistetaan lähdettään vasten.',
    blind: 'Ei voi tarkistaa vapaata tekstiä, joten väärä perustelu menee läpi. Siksi kaikki, mikä voidaan johtaa koodista, luodaan automaattisesti.',
  },
  {
    id: 'saavutettavuus',
    komento: 'test:stories',
    group: 'ydin',
    title: 'Saavutettavuus',
    huomaa: 'Huomaa, jos komponentissa on saavutettavuusvirhe, kuten liian heikko kontrasti tai puuttuva nimi ruudunlukijalle.',
    proves: 'Jokainen Storybook-story renderöidään selaimessa ja tarkistetaan automaattisesti axe-työkalulla. Virhe pysäyttää muutoksen.',
    blind: 'Tarkistaa komponentit storyissa, ei valmiita sivuja. Kone löytää vain osan ongelmista: lukujärjestys ja näppäimistön järkevyys testataan käsin.',
  },
  {
    id: 'kielet',
    group: 'tuote',
    title: 'Kieliversiot',
    huomaa: 'Huomaa, jos suomenkielinen teksti muuttuu tai lisätään eikä englanninkielinen versio seuraa.',
    proves: 'Kummallakin kielellä on sama rakenne, samat kuvat ja samat linkit. Jokainen englanninkielinen teksti on sidottu siihen suomenkieliseen versioon, josta se on kirjoitettu.',
    blind: 'Ei arvioi käännöksen laatua. Se näkee, että käännös on kuitattu suomen muutoksen jälkeen, mutta ei sitä, vastaako se suomea.\n\nKomponenttiin kirjoitettua tekstiä se ei näe, vaan sen huomaisi Tekstit-tarkistus, jota ei vielä ajeta.',
  },
  {
    id: 'strings',
    group: 'ydin',
    title: 'Tekstit',
    huomaa: 'Huomaa, jos teksti kirjoitetaan komponenttiin sanakirjan ohi.',
    proves: '',
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

/** Muu kuin `check:*`-tarkistus on ajossa, kun komento on olemassa ja CI ajaa sen. */
function komentoAjossa(komento: string): boolean {
  const pkg = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8')) as {
    scripts: Record<string, string>;
  };
  const ciPath = join(repoRoot, '.github/workflows/ci.yml');
  const ci = existsSync(ciPath) ? readFileSync(ciPath, 'utf8') : '';
  return Boolean(pkg.scripts[komento]) && ci.includes(`npm run ${komento}`);
}

/** Kaikki tunnetut tarkistukset ryhmittäin, ryhmän sisällä ajossa olevat ensin. */
export function checks(): Check[] {
  const live = wired();
  const ryhma = (c: Check) => CHECK_GROUPS.findIndex((g) => g.id === c.group);
  return DESCRIPTIONS.map((d) => ({ ...d, runs: d.komento ? komentoAjossa(d.komento) : live.has(d.id) })).sort(
    (a, b) => ryhma(a) - ryhma(b) || Number(b.runs) - Number(a.runs),
  );
}

/** Ajossa olevien ytimen tarkistusten määrä — luku joka vanhenisi käsin kirjoitettuna. */
export function liveCheckCount(): number {
  return checks().filter((c) => c.runs && c.group === 'ydin').length;
}
