/**
 * Prosessin kuvaus — pystytys ja jatkuva kehitys.
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

export type Vaihe = {
  /** Järjestysnumero. Vaiheet ovat riippuvaisia edellisestä. */
  numero: number;
  otsikko: string;
  teksti: string;
};

export const pystytys: Vaihe[] = [
  {
    numero: 1,
    otsikko: 'Tokenit yhdeksi lähteeksi',
    teksti:
      'Värit, typografia, välistys ja liike yhteen koneluettavaan tiedostoon (tokens.json). Tyylit ja Figman muuttujat lukevat samaa lähdettä, eikä kumpikaan saa oikeutta poiketa siitä.',
  },
  {
    numero: 2,
    otsikko: 'Komponentit koodiin',
    teksti:
      'Komponentti rakennetaan kerran, koodiin, tokeneita käyttäen. Storybook (komponenttien selainkatalogi) on sen katselmointipinta ja testialusta samalla — sama koodi jota tuote ajaa.',
  },
  {
    numero: 3,
    otsikko: 'Muuttujat Figmaan generoituna',
    teksti:
      'Oma Figma-plugin (repossa, figma-plugin/) lukee tokens.jsonin ja kirjoittaa kokoelmat, moodit ja arvot Figmaan. Käsin kopiointia ei ole missään vaiheessa, joten arvot eivät voi syntyä erilaisina.',
  },
  {
    numero: 4,
    otsikko: 'Kirjasto Figmaan',
    teksti:
      'Komponentit rakennetaan Figmaan koodin rajapinnan mukaan: samat variantit, samat propertyt, samat nimet. Suunnittelija saa työkalut joilla ei voi piirtää jotain mitä ei voi toteuttaa.',
  },
  {
    numero: 5,
    otsikko: 'Code Connect -kytkennät',
    teksti:
      'Jokainen Figman komponentti osoitetaan koodin komponenttiin Figman Code Connectilla. Dev Modessa näkyy oikea koodi oikean komponentin kohdalla — ei arvausta eikä käsin ylläpidettyä taulukkoa.',
  },
  {
    numero: 6,
    otsikko: 'Tarkistukset CI:hin',
    teksti:
      'Jokainen väite jonka setup tekee ajetaan tarkistuksena joka buildissa (CI). Eriytymä pysäyttää putken ja kertoo mikä eriytyi — ei vain että jokin eriytyi.',
  },
];

/** Jatkuvan kehityksen kaksi suuntaa. */
export const suunnat: { otsikko: string; teksti: string }[] = [
  {
    otsikko: 'Muutos koodissa',
    teksti:
      'Komponentti tai token muuttuu. Tarkistusketju ajetaan ennen mergeä ja kertoo mikä Figman puolella on nyt jäljessä. Muuttujat päivitetään pluginilla, kirjasto käsin — mutta kumpikaan ei jää huomaamatta.',
  },
  {
    otsikko: 'Muutos Figmassa',
    teksti:
      'Suunnittelija poistaa variantin tai nimeää propertyn uudelleen. Figma-tarkistus avaa tiedoston rajapinnalla ja kaataa ajon nimeten kohdan. Tämä on se suunta joka yleensä puuttuu.',
  },
];

/** Mitä setup ei lupaa. Rajat kuuluvat tuotekuvaukseen. */
export const rajat =
  'Tarkistus näkee rakenteen, ei laatua. Se tietää että komponentilla on story, ei sitä onko story hyvä. Se tietää että kytkentä osoittaa olemassa olevaan komponenttiin, ei sitä onko toteutus oikea. Jokaisen tarkistuksen sokea kohta on kirjattu ja näkyvissä.';
