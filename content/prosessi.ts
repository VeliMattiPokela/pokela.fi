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
      'Värit, typografia, välistys ja liike kirjataan yhteen tiedostoon. Sekä koodi että Figma lukevat sitä. Kummallakaan ei ole omaa versiotaan arvoista.',
  },
  {
    numero: 2,
    otsikko: 'Komponentit koodiin',
    teksti:
      'Komponentti rakennetaan kerran, koodiin. Storybook näyttää sen selaimessa kaikissa tiloissaan — sama koodi jota valmis tuote ajaa, ei erillinen malli.',
  },
  {
    numero: 3,
    otsikko: 'Arvot Figmaan automaattisesti',
    teksti:
      'Setupin mukana tulee pieni työkalu, joka asennetaan Figmaan kerran. Kun arvot muuttuvat, suunnittelija avaa sen ja painaa nappia — värit, tekstityylit ja välistykset päivittyvät kerralla. Ajaa voi niin usein kuin haluaa: mikään ei kahdennu eikä katoa.',
  },
  {
    numero: 4,
    otsikko: 'Kirjasto Figmaan',
    teksti:
      'Komponentit rakennetaan Figmaan käsin, kerran, samoilla nimillä ja tiloilla kuin koodissa. Tämä on ainoa vaihe jota ei voi automatisoida. Sen jälkeen suunnittelija ei voi vahingossa piirtää jotain mitä ei voi toteuttaa.',
  },
  {
    numero: 5,
    otsikko: 'Kytkennät koodin ja Figman välille',
    teksti:
      'Jokainen Figman komponentti kytketään koodin vastineeseensa. Kehittäjä näkee Figmassa suoraan oikean koodin eikä joudu arvailemaan mikä komponentti on kyseessä.',
  },
  {
    numero: 6,
    otsikko: 'Tarkistukset automaattisiksi',
    teksti:
      'Jokainen lupaus tarkistetaan koneella aina kun koodia muutetaan. Jos jokin on mennyt eri suuntaan, työ pysähtyy ja kone kertoo mikä.',
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
