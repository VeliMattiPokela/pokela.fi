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
  /** Mihin kamera tähtää. Ilman kohdetta koko näkymä. */
  kohde?: Kohde;
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

export const kohtaukset: Kohtaus[] = [
  {
    id: 'storybook',
    tunniste: '04  Storybook',
    otsikko: 'Sama komponentti ja sen tilat yhdessä paikassa',
    osoiteteksti: 'Pokela — design system',
    lahde: 'storybook',
    polku: '/?path=/story/komponentit-button--variantit&panel=false',
    vaiheet: [
      { tee: 'odota', s: 1.4 },
      { tee: 'odota', s: 2.2, kamera: { kohde: esikatselu, zoom: 1.7 } },
      { tee: 'klikkaa', kohde: sivupalkki('Koot'), s: 2.2, kamera: { zoom: 1 } },
      { tee: 'odota', s: 2.2, kamera: { kohde: esikatselu, zoom: 1.6 } },
      {
        tee: 'klikkaa',
        kohde: sivupalkki('Tumma'),
        s: 2.4,
        kamera: { zoom: 1 },
        otsikko: 'Tumma teema syntyy samoista tokeneista',
      },
      { tee: 'odota', s: 2.4, kamera: { kohde: esikatselu, zoom: 1.6 } },
    ],
  },
];
