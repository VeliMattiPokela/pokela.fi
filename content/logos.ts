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
  file: string;
  /** Alkuperäisen tiedoston mitat, kuvasuhdetta varten. */
  w: number;
  h: number;
  /** Optinen korkeus sivulla, px. */
  height: number;
  blocked?: string;
};

export const logos: Logo[] = [
  { name: 'Sanoma',       file: 'logo-sanoma.png',       w: 1356, h: 128, height: 13 },
  { name: 'Ilta-Sanomat', file: 'logo-ilta-sanomat.png', w: 1480, h: 204, height: 15 },
  { name: 'Finavia',      file: 'logo-finavia.png',      w: 1232, h: 184, height: 15 },
  { name: 'Oikotie',      file: 'logo-oikotie.png',      w: 928,  h: 248, height: 16 },
  { name: 'Evira',        file: 'logo-evira.png',        w: 1212, h: 360, height: 24 },
  { name: 'Elisa',        file: 'logo-elisa.png',        w: 1076, h: 424, height: 25 },
  { name: 'Pivo',         file: 'logo-pivo.png',         w: 868,  h: 424, height: 25 },
  { name: 'OP',           file: 'logo-op.png',           w: 504,  h: 336, height: 24 },

  {
    name: 'Colliers',
    file: 'logo-colliers.png',
    w: 1040,
    h: 588,
    height: 26,
    blocked:
      'Nykyinen tiedosto on tumma laatikko pyöristetyillä kulmilla ja varjolla — ei yksivärinen sanamerkki. Korvaa ennen käyttöä.',
  },
  {
    name: 'Microsoft',
    file: 'logo-microsoft.png',
    w: 872,
    h: 640,
    height: 22,
    blocked:
      'Microsoftin tunnuksen käyttöehdot ovat tiukat eikä yksivärinen versio neliöistä ole yleensä sallittu. Tarkista lupa tai pidä pelkkä nimi.',
  },
];

export const visibleLogos = logos.filter((logo) => !logo.blocked);
export const blockedLogos = logos.filter((logo) => logo.blocked);
