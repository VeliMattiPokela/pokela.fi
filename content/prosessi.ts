/**
 * Prosessin kuvaus — ketju ja jatkuva kehitys.
 *
 * Tämä on tuotteen teksti, ei tämän projektin kuvaus: se kertoo
 * miten setup pystytetään organisaatiossa ja miten se toimii sen
 * jälkeen. Yksi lähde, koska sama sisältö renderöityy kahteen
 * pintaan — Figman prosessisivuille ja sivustolle.
 *
 * Jatkuvan kehityksen tarkistuslistaa EI kirjoiteta tähän. Se
 * johdetaan lib/checks.ts:stä, joka lukee package.jsonin ja CI:n
 * työnkulun. Käsin kirjoitettuna se lupaisi tarkistuksia joita ei
 * ajeta — niin kävi kerran jo.
 */

export type Lenkki = {
  /** Järjestysnumero. Lenkki nojaa edelliseen. 0 tehdään kerran, ja
      vain olemassa olevassa talossa. */
  numero: number;
  otsikko: string;
  teksti: string;
  /**
   * Tarkistukset jotka vahtivat tätä lenkkiä: tunnisteet
   * lib/checks.ts:stä. Tyhjä lista on rehellinen vastaus silloin kun
   * konetta ei ole.
   */
  vartijat: string[];
  /** Lenkki joka ei vielä toimi. Näytetään, mutta erotettuna. */
  tulossa?: true;
};

/**
 * Prosessi yhtenä ketjuna. Sama ketju renderöityy casesivulle ja
 * Figman prosessisivulle, ja käsikirja viittaa siihen.
 */
export const ketju: Lenkki[] = [
  {
    numero: 0,
    otsikko: 'Lähtötilanne',
    teksti:
      'Yrityksellä on yleensä jo koodia ja Figma-tiedostoja. Ensin listataan automaattisesti, missä ne eroavat. Sen jälkeen ihminen päättää asia kerrallaan, kumpi on oikein, ja päätös kirjataan. Vanhat erot saavat jäädä, uusia ei tule.',
    vartijat: [],
  },
  {
    numero: 1,
    otsikko: 'Yksi lähde',
    teksti:
      'Värit, typografia, välistys ja liike kirjataan yhteen tiedostoon, ja kaikki muu lukee arvot sieltä. Arvoja ei kopioida muualle käsin.',
    vartijat: ['tokens', 'hardcoded'],
  },
  {
    numero: 2,
    otsikko: 'Komponentit koodiin',
    teksti:
      'Komponentti tehdään kerran, koodiin. Storybook näyttää sen selaimessa kaikissa tiloissaan, ja se on sama koodi, jota valmis tuote käyttää.',
    vartijat: ['stories'],
  },
  {
    numero: 3,
    otsikko: 'Arvot Figmaan',
    teksti:
      'Arvot viedään Figmaan pluginilla. Kun arvot muuttuvat, suunnittelija ajaa pluginin, ja värit, tekstityylit ja välistykset päivittyvät kerralla.',
    vartijat: [],
  },
  {
    numero: 4,
    otsikko: 'Kirjasto Figmaan',
    teksti:
      'Komponentit tehdään Figmaan kerran, samoilla nimillä ja tiloilla kuin koodissa. Kirjastoa ei voi generoida, mutta sen voi tehdä AI:n avulla koodin pohjalta. Sen jälkeen suunnittelija käyttää samoja osia, jotka on jo toteutettu.',
    vartijat: ['figma'],
  },
  {
    numero: 5,
    otsikko: 'Kytkennät',
    teksti:
      'Jokainen Figman komponentti kytketään vastaavaan koodiin. Kehittäjä näkee Figmassa suoraan oikean koodin.',
    vartijat: ['code-connect', 'figma'],
  },
  {
    numero: 6,
    otsikko: 'AI prototypoi oikeilla osilla',
    teksti:
      'Tokenit ja komponentit julkaistaan npm-paketteina, ja Figma Make käyttää niitä. Ohjeet kertovat, milloin mitäkin käytetään. Näin prototyyppi tehdään samoilla komponenteilla kuin tuote.',
    vartijat: ['paketti', 'docs'],
  },
  {
    numero: 7,
    otsikko: 'Takaisin tuotteeseen',
    teksti:
      'Prototyypistä tulee muutosehdotus tuotteen koodiin, ja se kulkee samojen tarkistusten läpi kuin mikä tahansa muu muutos.',
    vartijat: [],
    tulossa: true,
  },
];

/** Jatkuvan kehityksen kaksi suuntaa. */
export const suunnat: { otsikko: string; teksti: string }[] = [
  {
    otsikko: 'Muutos koodissa',
    teksti:
      'Kehittäjä muuttaa komponenttia tai väriä. Tarkistus näyttää heti, mikä Figmassa on nyt jäljessä, eikä muutos mene läpi ennen kuin ne vastaavat toisiaan.',
  },
  {
    otsikko: 'Muutos Figmassa',
    teksti:
      'Suunnittelija poistaa tilan tai nimeää jotain uudelleen. Sama tarkistus avaa Figma-tiedoston ja kertoo, mikä koodissa ei enää vastaa sitä.',
  },
];

/** Mitä setup ei lupaa. Rajat kuuluvat tuotekuvaukseen. */
export const rajat =
  'Tarkistukset katsovat rakennetta, eivät laatua: ne tietävät, onko komponentilla esimerkki, mutta eivät sitä, onko esimerkki hyvä. Yksi kohta jää myös ihmisen muistin varaan. Kun arvot muuttuvat koodissa, mikään ei muistuta suunnittelijaa ajamaan pluginia, joten Figman arvot voivat jäädä jälkeen. Jokaisen tarkistuksen rajat on kirjattu näkyviin.';
