/**
 * Asiakaslogot.
 *
 * `height` on optinen, ei mekaaninen: leveä ohut sanamerkki ja lähes
 * neliömäinen merkki eivät näytä samankokoisilta samalla
 * pikselikorkeudella. Leveys lasketaan tiedoston kuvasuhteesta.
 *
 * Logot piirretään CSS-maskina (styles/components/logo-row.css), joten
 * ne seuraavat --ink:iä ja toimivat myös tummassa teemassa.
 *
 * `blocked` = tiedosto on olemassa mutta sitä ei näytetä. Syy kerrotaan.
 * Nimi näkyy silloin "Lisäksi"-rivillä, joka ei vaadi käyttölupaa.
 */

export type Logo = {
  name: string;
  /** Lähteen nimi ilman päätettä: kuvat/logo/<file>.svg tai .png. */
  file: string;
  /** Optinen korkeus sivulla, px. */
  height: number;
  blocked?: string;
};

/* Alkuperäiset mitat olivat ennen tässä käsin kirjoitettuina. Ne ovat
   mitattavissa tiedostosta, joten ne luetaan nyt kuvamanifestista —
   käsin kirjoitettu mitta olisi voinut jäädä vanhaan, ja logo olisi
   piirtynyt väärällä leveydellä ilman että mikään huomaa. */

export const logos: Logo[] = [
  { name: 'Sanoma',       file: 'sanoma', height: 13 },
  { name: 'Ilta-Sanomat', file: 'ilta-sanomat', height: 15 },
  { name: 'Finavia',      file: 'finavia', height: 15 },
  { name: 'Oikotie',      file: 'oikotie', height: 16 },
  { name: 'Evira',        file: 'evira', height: 24 },
  { name: 'Elisa',        file: 'elisa', height: 25 },
  { name: 'Pivo',         file: 'pivo', height: 25 },
  { name: 'OP',           file: 'op', height: 24 },

  {
    name: 'Colliers',
    file: 'colliers',
    height: 26,
    blocked:
      'Nykyinen tiedosto on tumma laatikko pyöristetyillä kulmilla ja varjolla — ei yksivärinen sanamerkki. Korvaa ennen käyttöä.',
  },
  {
    name: 'Microsoft',
    file: 'microsoft',
    height: 22,
    blocked:
      'Microsoftin tunnuksen käyttöehdot ovat tiukat eikä yksivärinen versio neliöistä ole yleensä sallittu. Tarkista lupa tai pidä pelkkä nimi.',
  },
];

export const visibleLogos = logos.filter((logo) => !logo.blocked);
export const blockedLogos = logos.filter((logo) => logo.blocked);
