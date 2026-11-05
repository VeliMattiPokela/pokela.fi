/**
 * Design system -sivun ja komponenttinäyttelyn tekstit.
 *
 * Olivat ennen kovakoodattuina sivulla ja näytteissä, jolloin ne
 * olisivat jääneet suomeksi englanninkieliselle sivulle. `{n}`-alkuiset
 * paikat täytetään ajossa luvulla, jota ei kirjoiteta käsin.
 */
const system = {
  description: 'Tokenit, komponentit ja tilat elävinä — sama koodi jota sivusto käyttää.',
  headerMeta: '{varit} väriä · {tyylit} tyyliä · {valit} väliä',
  sovellus: 'Sovellus',
  ryhmat: {
    perusosat: { nimi: 'Perusosat', kuvaus: 'Napit ja ikonit, joista muut komponentit kootaan.' },
    lomakkeet: { nimi: 'Lomakkeet', kuvaus: 'Kentät ja valinnat. Virhe on ainoa tila, jolla on oma väri.' },
    navigaatio: { nimi: 'Navigaatio', kuvaus: 'Liikkuminen sivujen ja sisällön osien välillä.' },
    palaute: { nimi: 'Palaute', kuvaus: 'Ilmoitukset ja vahvistukset käyttäjälle.' },
    data: { nimi: 'Data ja listat', kuvaus: 'Rivit, taulukot ja aikajana.' },
    media: { nimi: 'Media', kuvaus: 'Kuvat, video ja tunnisteet. Kuvat tulevat kuvaputkesta.' },
    rakenne: { nimi: 'Rakenne', kuvaus: 'Sivun kehys. Tämä sivu on koottu niistä.' },
  },
  huom: {
    variantit: 'Variantit',
    koot: 'Koot s · m · l ja ikoninappi',
    ikonit: '{n} merkkiä',
    textField: 'Perus · virhe · vihje · monirivinen',
    select: 'Ja valinnat: Radio, Checkbox, ChoiceGroup, Switch',
    navFooter: 'Tämän sivun ylä- ja alareuna',
    alert: 'Info · onnistui · virhe',
    media: 'Kuva, suhde 4:3',
    video: 'Median kautta, kun paikka on video',
  },
  napit: { eiSaatavilla: 'Ei saatavilla', pieni: 'Pieni', perus: 'Perus', suuri: 'Suuri', lisaa: 'Lisää', valikko: 'Valikko' },
  navFooter: 'Navigaatio ja alatunniste ovat sivun kehyksessä, joten ne näkyvät tämän sivun ylä- ja alareunassa.',
  aikajana: {
    ryhma: 'Tarkistukset',
    tokenit: 'Tokenit',
    tokenitKuvaus: 'tokens.json vastaa tyylejä.',
    kuvat: 'Kuvat',
    kuvatKuvaus: 'Kuvaputki ajettu.',
    sivusto: 'Sivusto rakennetaan',
    sivustoKuvaus: 'Tämä sivu on sen tulos.',
  },
  heroName: {
    alku: 'Nimi on etusivun otsikko, joten se näytetään siellä eikä tällä sivulla toisena pääotsikkona.',
    linkki: 'Etusivulle',
    exploded: 'ExplodedView on osion',
    kerroksina: '00 Kerroksina',
    kuva: 'kuva.',
  },
  rakenne: {
    alku: 'Sivun otsikko on PageHeader, jokainen numeroitu osio on Section, ja',
    loppu: 'näyttää sarakkeet.',
  },
  vari: {
    title: '01 — Väri',
    meta: 'Ei aksenttiväriä',
    note: 'Kaksi teemaa, samat token-nimet, yksi määrittely per token',
  },
  typo: {
    title: '02 — Typografia',
    naytelause: 'Suunnittelen käyttöliittymät ja kirjoitan ne itse tuotantoon.',
  },
  grid: {
    sarakkeita: 'saraketta',
    note: 'Sarakemäärä on token, ei komponentin tieto.',
  },
  valistys: { title: '04 — Välistys', meta: '4 px perusyksikkö' },
  komponentit: {
    title: '05 — Komponentit',
    alku: 'Kaikki {n} komponenttia ryhmiteltynä käyttötarkoituksen mukaan, elävinä: samat komponentit, jotka paketti',
    loppu:
      'vie ja Figman kirjasto kuvaa. Sovellus-merkityt ovat sovellusnäkymiä ja Makea varten; sivusto itse ei käytä niitä.',
  },
  naytteet: {
    nimi: 'Nimi',
    sahkoposti: 'Sähköposti',
    sahkopostiVirhe: 'Tarkista osoite, esim. sara@pokela.fi.',
    yritys: 'Yritys',
    valinnainen: '(valinnainen)',
    yritysVihje: 'Näkyy vain laskulla.',
    viesti: 'Viesti',
    viestiPaikka: 'Kerro lyhyesti, mitä tarvitset.',
    rooli: 'Rooli',
    roolit: { suunnittelija: 'Suunnittelija', kehittaja: 'Kehittäjä', tuoteomistaja: 'Tuoteomistaja', tutkija: 'Tutkija' },
    laskutus: 'Laskutus',
    kuukausittain: 'Kuukausittain',
    vuosittain: 'Vuosittain',
    vuosittainVihje: 'Kaksi kuukautta ilmaiseksi.',
    ilmoitukset: 'Ilmoitukset',
    kommentit: 'Uudet kommentit',
    kooste: 'Viikkokooste',
    tumma: 'Tumma teema työpöydällä',
    asetukset: 'Asetukset',
    tabs: {
      yleiset: 'Yleiset',
      yleisetPaneeli: 'Nimi, kieli ja aikavyöhyke.',
      tiimi: 'Tiimi',
      tiimiPaneeli: 'Neljä jäsentä. Kutsu lisää tai muuta rooleja.',
      laskutusPaneeli: 'Tilaus, maksutapa ja laskut.',
      arkisto: 'Arkisto',
      arkistoPaneeli: 'Arkisto on tyhjä.',
    },
    accordion: {
      tokenit: 'Tokenit',
      tokenitKuvaus: 'Yksi lähde: tokens.json.',
      kirjasto: 'Kirjasto',
      kirjastoKuvaus: 'Komponentit koodiin ja Figmaan.',
      vaihe: 'Vaihe {n}',
      paneeli: 'Vain yksi rivi on auki kerrallaan.',
    },
    alert: {
      kutsu: 'Kutsu vanhenee 7 päivässä',
      kutsuTeksti: 'Kutsutut näkevät tiimin vasta, kun hyväksyvät kutsun.',
      uudelleen: 'Näytä ilmoitus uudelleen',
      tallennettu: 'Asetukset tallennettu',
      tallennettuTeksti: 'Muutokset näkyvät tiimille heti.',
      virhe: 'Laskua ei voitu veloittaa',
      virheToiminto: 'Päivitä maksutapa',
      virheTeksti: 'Kortti hylättiin 3.10. Päivitä maksutapa, ettei tilaus keskeydy.',
    },
    dialog: {
      avaa: 'Poista jäsen',
      title: 'Poistetaanko Sara Niemi tiimistä?',
      description: 'Pääsy tiimin projekteihin päättyy heti. Voit kutsua jäsenen takaisin myöhemmin.',
      peruuta: 'Peruuta',
    },
    taulukko: {
      caption: 'Tiimin jäsenet',
      muutoksia: 'Muutoksia',
      tila: 'Tila',
      kutsuttu: 'Kutsuttu',
      aktiivinen: 'Aktiivinen',
      maksuEpaonnistui: 'Maksu epäonnistui',
      numerot: 'fi-FI',
    },
  },
};

export type System = typeof system;
export default system;
