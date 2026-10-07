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
      'Yksikään yritys ei aloita tyhjästä. Kone listaa missä koodi ja Figma eroavat, ottamatta kantaa. Ihminen päättää asiaryhmä kerrallaan kumpi on oikeassa, ja päätös kirjataan. Vanha velka sallitaan, uusi ei.',
    vartijat: [],
  },
  {
    numero: 1,
    otsikko: 'Yksi lähde',
    teksti:
      'Värit, typografia, välistys ja liike kirjataan yhteen tiedostoon. Kaikki muu lukee sitä. Kenelläkään ei ole omaa versiotaan arvoista.',
    vartijat: ['tokens', 'hardcoded'],
  },
  {
    numero: 2,
    otsikko: 'Komponentit koodiin',
    teksti:
      'Komponentti rakennetaan kerran, koodiin. Storybook näyttää sen selaimessa kaikissa tiloissaan — sama koodi jota valmis tuote ajaa, ei erillinen malli.',
    vartijat: ['stories'],
  },
  {
    numero: 3,
    otsikko: 'Arvot Figmaan',
    teksti:
      'Setupin mukana tulee Figma-plugin. Kun arvot muuttuvat, suunnittelija painaa nappia, ja värit, tekstityylit ja välistykset päivittyvät kerralla. Mikään ei kahdennu eikä katoa.',
    vartijat: [],
  },
  {
    numero: 4,
    otsikko: 'Kirjasto Figmaan',
    teksti:
      'Komponentit rakennetaan Figmaan kerran, samoilla nimillä ja tiloilla kuin koodissa. Sitä ei voi generoida, mutta sen voi tehdä AI-avusteisesti koodin pohjalta. Sen jälkeen suunnittelija ei voi vahingossa piirtää jotain mitä ei voi toteuttaa.',
    vartijat: ['figma'],
  },
  {
    numero: 5,
    otsikko: 'Kytkennät',
    teksti:
      'Jokainen Figman komponentti kytketään koodin vastineeseensa. Kehittäjä näkee Figmassa suoraan oikean koodin eikä joudu arvailemaan.',
    vartijat: ['code-connect', 'figma'],
  },
  {
    numero: 6,
    otsikko: 'AI prototypoi oikeilla osilla',
    teksti:
      'Tokenit ja komponentit julkaistaan paketteina, ja Figma Make lukee ne. Ohjeet kertovat milloin mitäkin käytetään. Prototyyppi tehdään samoilla komponenteilla kuin tuote, ei mallin arvauksilla.',
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
      'Kehittäjä muuttaa komponenttia tai väriä. Tarkistus kertoo heti mikä Figman puolella on nyt jäljessä, eikä muutos mene läpi ennen kuin molemmat ovat samaa mieltä.',
  },
  {
    otsikko: 'Muutos Figmassa',
    teksti:
      'Suunnittelija poistaa tilan tai nimeää jotain uudelleen. Sama tarkistus avaa Figma-tiedoston ja kertoo mikä koodissa ei enää vastaa sitä. Tämä suunta puuttuu useimmista setupeista.',
  },
];

/** Mitä setup ei lupaa. Rajat kuuluvat tuotekuvaukseen. */
export const rajat =
  'Kone tarkistaa rakenteen, ei laatua: se tietää onko komponentista esimerkki, ei sitä onko esimerkki hyvä. Yksi kohta jää myös ihmisen muistin varaan — kun arvot muuttuvat koodissa, mikään ei muistuta suunnittelijaa ajamaan työkalua, joten Figman arvot voivat olla jäljessä. Jokaisen tarkistuksen sokea kohta on kirjattu näkyviin.';
