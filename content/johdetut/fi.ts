/**
 * Case 03:n johdettujen lohkojen tekstit (CaseBlockDerived): ne
 * lukevat sisältönsä tiedostoista build-aikana, mutta niiden ympärillä
 * on kieltä, joka kääntyy sivun mukana. Tarkistusten ja prosessin
 * omat tekstit asuvat lähteissään (lib/checks.ts, content/prosessi.ts);
 * muut kielet antavat niille käännöksen tunnisteen mukaan
 * (content/johdetut/en.ts).
 */
const johdetut = {
  artefaktit: {
    otsikko: '{n} paikkaa, joissa työn voi tarkistaa',
    avaa: 'Avaa',
    tehty: 'Tehty',
    eiJulkinen: 'ei vielä julkinen',
    tulossa: 'Tulossa',
    figmaTiedosto: 'Figma-tiedosto',
    kytkennat: 'Code Connect -kytkennät',
    storybook: 'Komponentit, tokenit ja tilat selaimessa. Sama koodi, jota tämä sivu käyttää.',
    figma: 'Sama kirjasto Figmassa: komponentit, variantit ja tokenit.',
    codeConnect: 'Määrittelyt jotka kertovat Figmalle, mikä koodikomponentti vastaa mitä.',
    codeConnectTila: '{n} kytkentää, julkaistu Figmaan. Näkyvät Dev Modessa, joka vaatii Figma-tilin',
    repo: 'Koko sivusto, tokenit, build ja tarkistukset.',
  },
  tarkistukset: {
    tarkistaa: 'Tarkistaa',
    avaa: 'Avaa',
    sulje: 'Sulje',
    lapi: 'Läpi',
    paivays: 'fi-FI',
    sivusto: 'Sivusto rakennetaan',
    sivustoKuvaus: 'Tämä sivu on sen tulos.',
    kuvaputki: 'Kuvat ja videot',
    build: 'Build',
    oletusryhma: 'Tarkistukset',
    alleSekunnin: 'alle sekunnin',
    /* Tarkistusajon tulosrivit ovat skriptien omaa tulostetta. */
    naytaTulos: true,
  },
  ketju: {
    tulossa: 'Tulossa',
    tarkistus: 'Tarkistus',
    tarkistukset: 'Tarkistukset',
  },
};

export type Johdetut = typeof johdetut;
export default johdetut;
