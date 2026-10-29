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

/* Kamera ja vieritys ovat eri vaiheissa: vierittävällä vaiheella ei
   ole kameraa. */
export type Vaihe =
  | { tee: 'odota'; s: number; kamera?: Kamera; otsikko?: string }
  | { tee: 'klikkaa'; kohde: Kohde; s: number; kamera?: Kamera; otsikko?: string }
  | { tee: 'vierita'; kohde: Kohde; s: number; otsikko?: string };

export type Kohtaus =
  | {
      id: string;
      /** Pieni yläotsikko, esim. "03  Storybook". */
      tunniste: string;
      /** Otsikko, joka näkyy kohtauksen alussa. */
      otsikko: string;
      /** Ikkunan yläpalkin osoiteteksti. */
      osoiteteksti: string;
      lahde: 'storybook' | 'sivusto';
      polku: string;
      vaiheet: Vaihe[];
    }
  | {
      /** Väliotsikkokortti ilman ikkunaa. */
      id: string;
      lahde: 'kortti';
      tunniste: string;
      otsikko: string;
      teksti?: string;
      s: number;
    };

const sivupalkki = (nimi: string): Kohde => ({
  valitsin: `.sidebar-container a:text-is("${nimi}")`,
});
const esikatselu: Kohde = { valitsin: '#storybook-root', esikatselu: true, sisalto: true };
const teemavalikko: Kohde = { valitsin: 'button[aria-label^="Teema"]' };
const osio = (nimi: string): Kohde => ({ valitsin: `section:has(h2:text-is("${nimi}"))` });
const otsikko = (nimi: string): Kohde => ({ valitsin: `h2:text-is("${nimi}")` });
const valilehti = (nimi: string): Kohde => ({ valitsin: `[role=tab]:text-is("${nimi}")` });

const vaihe = (nimi: string): Kohde => ({ valitsin: `li.tyotapa__vaihe:has-text("${nimi}")` });

const tarkistus = (nimi: string): Kohde => ({ valitsin: `button[aria-expanded]:has(:text-is("${nimi}"))` });

const CASE = '/fi/tyot/portfolio/';

export const kohtaukset: Kohtaus[] = [
  {
    id: 'avaus',
    lahde: 'kortti',
    tunniste: 'pokela.fi  ·  design system',
    otsikko: 'Design ja koodi yhtenä prosessina',
    teksti: 'Tokenit, komponentit, Figma ja tarkistukset samasta lähteestä',
    s: 4.6,
  },
  {
    id: 'lahde',
    tunniste: '01  Yksi lähde',
    otsikko: 'Komponentti kirjoitetaan kerran koodiin',
    osoiteteksti: 'pokela.fi',
    lahde: 'sivusto',
    polku: CASE,
    /* Sama komponentti välilehdittäin: näkymä, koodi, Figma. */
    vaiheet: [
      { tee: 'odota', s: 0.8 },
      { tee: 'vierita', kohde: otsikko('Yksi komponentti'), s: 2.0 },
      { tee: 'odota', s: 1.3, kamera: { kohde: osio('Yksi komponentti'), zoom: 1.5 } },
      { tee: 'klikkaa', kohde: valilehti('Koodi'), s: 2.6 },
      {
        tee: 'klikkaa',
        kohde: valilehti('Figma'),
        s: 2.8,
        otsikko: 'Figma näyttää saman komponentin samoilla tiloilla',
      },
    ],
  },
  {
    id: 'storybook',
    tunniste: '03  Storybook',
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
  {
    id: 'tarkistukset',
    tunniste: '04  Tarkistukset',
    otsikko: 'Jokainen muutos kulkee tarkistusten läpi',
    osoiteteksti: 'pokela.fi',
    lahde: 'sivusto',
    polku: CASE,
    vaiheet: [
      /* Vieritys pysähtyy listan kohdalle, jotta avautuvalle riville
         jää tilaa näkymän alaosaan. */
      { tee: 'vierita', kohde: tarkistus('Storyt'), s: 2.0 },
      {
        tee: 'klikkaa',
        kohde: tarkistus('Figma'),
        s: 2.2,
        otsikko: 'Tarkistus huomaa, jos tila puuttuu Figmasta',
      },
      { tee: 'odota', s: 2.6, kamera: { kohde: { valitsin: '.accordion:has(button[aria-expanded="true"])' }, zoom: 1.7 } },
    ],
  },
  {
    id: 'sivusto',
    tunniste: '05  Sivusto',
    otsikko: 'Sivusto on rakennettu samoista komponenteista',
    osoiteteksti: 'pokela.fi',
    lahde: 'sivusto',
    polku: '/fi/',
    vaiheet: [
      { tee: 'odota', s: 1.6 },
      { tee: 'vierita', kohde: otsikko('Valitut työt'), s: 2.0 },
      {
        tee: 'klikkaa',
        kohde: { valitsin: 'a:has-text("Colliers Asunnot") >> text="Colliers Asunnot"' },
        s: 3.2,
      },
    ],
  },
  {
    id: 'paketit',
    tunniste: '06  Paketit ja Make',
    otsikko: 'Figma Make käyttää samoja npm-paketteja',
    osoiteteksti: 'pokela.fi',
    lahde: 'sivusto',
    polku: CASE,
    vaiheet: [
      { tee: 'vierita', kohde: vaihe('AI prototypoi'), s: 2.0 },
      { tee: 'odota', s: 2.4, kamera: { kohde: vaihe('AI prototypoi'), zoom: 2 } },
      {
        tee: 'odota',
        s: 3.0,
        kamera: { kohde: [vaihe('AI prototypoi'), vaihe('Takaisin tuotteeseen')], zoom: 2 },
        otsikko: 'Tulossa: Make-muutos palaa tuotteeseen pull requestina',
      },
    ],
  },
  {
    id: 'loppu',
    lahde: 'kortti',
    tunniste: 'pokela.fi',
    otsikko: 'Yksi lähde, ei käsin synkattavaa',
    teksti: 'Veli-Matti Pokela',
    s: 4.0,
  },
];
