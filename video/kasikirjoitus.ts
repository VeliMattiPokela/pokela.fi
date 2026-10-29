/**
 * Prosessidemon käsikirjoitus. Video generoidaan tästä tiedostosta
 * komennolla `npm run video` (scripts/video.mjs): tallennus ottaa
 * jokaisesta tilasta pysäytyskuvan 2× tarkkuudella, ja sommittelu
 * piirtää kameran, osoittimen ja tekstit ruutu ruudulta. Video
 * tehdään aina uudelleen tästä, ei leikata käsin.
 *
 * Tekstit ovat sivuston sisältöä: passiivi, ei pistettä otsikon
 * lopussa (päätös 39).
 */

export type Kohde = {
  /** Playwright-valitsin. */
  valitsin: string;
  /** Valitsin osuu Storybookin esikatselukehykseen eikä työkaluun. */
  esikatselu?: boolean;
  /** Kamera rajaa kohteen sisältöön (teksti, kuvat, kentät) eikä laatikkoon. */
  sisalto?: boolean;
};

export type Kamera = {
  /** Mihin kamera tähtää. Useampi kohde rajataan yhdessä. Ilman kohdetta koko näkymä. */
  kohde?: Kohde | Kohde[];
  /** 1 = koko näkymä, 2 = kaksinkertainen. */
  zoom: number;
};

export type Vaihe =
  | { tee: 'odota'; s: number; kamera?: Kamera; otsikko?: string }
  | { tee: 'klikkaa'; kohde: Kohde; s: number; kamera?: Kamera; otsikko?: string };

export type Kohtaus = {
  id: string;
  /** Pieni yläotsikko, esim. "04 Storybook". */
  tunniste: string;
  /** Otsikko, joka näkyy kohtauksen alussa. */
  otsikko: string;
  /** Ikkunan yläpalkin osoiteteksti. */
  osoiteteksti: string;
  lahde: 'storybook' | 'sivusto';
  polku: string;
  vaiheet: Vaihe[];
};

const sivupalkki = (nimi: string): Kohde => ({
  valitsin: `.sidebar-container a:text-is("${nimi}")`,
});
const esikatselu: Kohde = { valitsin: '#storybook-root', esikatselu: true, sisalto: true };
const teemavalikko: Kohde = { valitsin: 'button[aria-label^="Teema"]' };

export const kohtaukset: Kohtaus[] = [
  {
    id: 'storybook',
    tunniste: '04  Storybook',
    otsikko: 'Sama komponentti ja sen tilat yhdessä paikassa',
    osoiteteksti: 'Pokela — design system',
    lahde: 'storybook',
    polku: '/?path=/story/komponentit-button--variantit&panel=false',
    /* Yksi liike: kokonaiskuva, siirtymä koko-tilaan, yksi tarkennus,
       ja teema vaihdetaan tarkennuksen sisällä työkalurivistä. */
    vaiheet: [
      { tee: 'odota', s: 1.3 },
      { tee: 'klikkaa', kohde: sivupalkki('Koot'), s: 1.9 },
      { tee: 'odota', s: 1.5, kamera: { kohde: [teemavalikko, esikatselu], zoom: 1.8 } },
      { tee: 'klikkaa', kohde: teemavalikko, s: 1.5 },
      {
        tee: 'klikkaa',
        kohde: { valitsin: 'p:text-is("Tumma")' },
        s: 2.6,
        otsikko: 'Tumma teema syntyy samoista tokeneista',
      },
      { tee: 'odota', s: 1.4 },
    ],
  },
];
