/**
 * Työt datana, ei JSX:ään kirjoitettuna — sama rakenne joka casella,
 * jotta datan lähteen voi myöhemmin vaihtaa CMS:ään koskematta
 * sivuihin.
 *
 * Tekstit ovat casetiedostoista (Colliers/Blokbook/This Site Case).
 * Kaikki puuttuva on `null`, ei keksitty arvo: portfolion luku joka
 * ei kestä kysymystä on pahempi kuin puuttuva luku.
 */

export type Lead = {
  slug: string;
  number: string;
  /** Työn nimi. Ei käännetä. */
  title: string;
  /** Yksi lause listaukseen. */
  tagline: string;
  /** Pidempi ingressi työlistaukselle. */
  lede: string;
  /** Rooli metarivillä. */
  meta: string;
  next: string;
};

/**
 * Avautuvan rivin media. Erotettu unioniksi, jotta vertailulohkoa ei
 * voi kirjoittaa ilman kuvaparia: ennen kuvat olivat kovakoodattuina
 * komponentissa, jolloin jokainen vertailu olisi näyttänyt Pivon
 * kaappaukset riippumatta siitä kenen työstä on kyse.
 */
export type PreviousMedia =
  /**
   * `id` on paikan tunniste ja samalla tiedoston nimi: kuva
   * `kuvat/<id>.*` päätyy tähän paikkaan. Vertailuparilla lähteitä on
   * kaksi, `<id>-ennen` ja `<id>-jalkeen`.
   *
   * Pakollinen, jottei paikkaa voi lisätä ilman että kuvaputki tietää
   * siitä. Sama syy kuin casejen MediaSlotissa.
   */
  | { kind: 'image' | 'video'; id: string; ratio: string; caption: string }
  | {
      kind: 'compare';
      id: string;
      ratio: string;
      caption: string;
    };

/* Vertailuparin tiedostopolut ja mitat olivat ennen tässä. Ne ovat
   nyt content/media.generated.json:ssa, jonka `npm run kuvat`
   kirjoittaa lähteistä — käsin kirjoitettuina ne olisivat voineet
   osoittaa väärään tiedostoon tai vanhaan mittaan, eikä mikään olisi
   huomannut. */

export type Previous = {
  slug: string;
  number: string;
  title: string;
  tagline: string;
  meta: string;
  /** Avautuva sisältö. */
  detail: {
    heading: string;
    intro: string;
    roleTitle: string;
    roleNote: string;
    /** Omistajuus eroteltuna: mistä vastasin vs. mihin osallistuin. */
    responsible: string[];
    contributed: string[];
    sectionsTitle: string;
    sections: { title: string; body: string }[];
    /** Kuva- ja videopaikat. Tyhjä lista = ei vielä materiaalia. */
    media: PreviousMedia[];
  };
};

const leads: Lead[] = [
  {
    slug: 'colliers',
    number: '01',
    title: 'Colliers Asunnot',
    tagline: 'Vuokra-asuntopalvelu, joka suunniteltiin koodissa',
    lede:
      'Vuokra-asuntopalvelu kuudessa kuukaudessa: asuntohaku, verkkovuokraus ja sisällönhallinta. Design ja toteutus samoissa käsissä.',
    meta: 'Design, front end, CMS',
    next: 'blokbook',
  },
  {
    slug: 'blokbook',
    number: '02',
    title: 'Blokbook',
    tagline: 'Oman taloyhtiön ongelmasta myytäväksi palveluksi',
    lede:
      'Taloyhtiöiden tilojen varaus ja maksut webissä, iOS:llä ja Androidilla. Oma tuote ja yritys.',
    meta: 'Perustaja — tuote, design, toteutus',
    next: 'tama-sivusto',
  },
  {
    slug: 'tama-sivusto',
    number: '03',
    title: 'Tämä sivusto',
    tagline: 'Yksi lähde, kaksi suuntaa — design system koodissa ja Figmassa',
    lede:
      'Design system elää koodissa ja pysyy synkassa Figman kanssa. Storybook, Code Connect ja automaattinen synkkatarkistus — kaikki avattavissa.',
    meta: 'Design system, Storybook, Code Connect',
    next: 'colliers',
  },
];

const previous: Previous[] = [
  {
    slug: 'pivo',
    number: '04',
    title: 'Pivo',
    tagline: 'Maksusovellus 1,2 milj. käyttäjälle',
    meta: 'Service design · UX/UI',
    detail: {
      heading: 'Maksusovellus, jota käyttää yli miljoona ihmistä',
      intro:
        'Pivo on mobiilimaksamisen sovellus, jolla lähetetään rahaa, jaetaan yhteisiä kuluja ja maksetaan verkossa.',
      roleTitle: 'Service Designer / UX/UI Designer',
      roleNote: 'iOS ja Android. Prototyypit testattiin asiakkailla ennen toteutusta.',
      responsible: [
        'Käyttöliittymä- ja interaktiosuunnittelu',
        'Varhainen konseptointi',
        'Käyttäjäymmärrys: haastattelut, kyselyt, analytiikka, testit',
        'Saavutettavuustyö',
      ],
      contributed: [
        'Design-to-dev -käytäntöjen kehittäminen',
        'Yhteistyö liiketoiminnan, kehityksen, markkinoinnin ja datan kanssa',
      ],
      sectionsTitle: 'Työni Pivossa',
      sections: [
        {
          title: 'Käyttäjäymmärrys ja konseptointi',
          body: 'Haastattelut, kyselyt, analytiikka ja käytettävyystestit. Näiden pohjalta rakennettiin uusien ominaisuuksien konseptit — ennen kuin yhtäkään näyttöä oli piirretty valmiiksi.',
        },
        {
          title: 'Käyttöliittymä ja interaktiot',
          body: 'Näkymät ja vuorovaikutus iOS:lle ja Androidille. Prototyypit testattiin asiakkailla ennen toteutusta, ja animaatiot suunniteltiin osaksi käyttöliittymää — ei koristeeksi sen päälle.',
        },
        {
          title: 'Saavutettavuus koko sovelluksessa',
          body: 'Kävimme sovelluksen läpi näkymä näkymältä ja korjasimme värikontrastit, kosketuskohteiden koon ja ruudunlukijatuen. Kertaluonteisen korjauksen sijaan siitä tuli osa tapaa tehdä.',
        },
        {
          title: 'Designista toteutukseen',
          body: 'Kehitin tiimin tapaa siirtää design toteutukseen. Se lanka johtaa suoraan siihen, että suunnittelen nykyään koodissa.',
        },
      ],
      media: [
        {
          id: 'pivo-kirjautuminen',
          kind: 'compare',
          ratio: '3:4',
          caption:
            'Kirjautuminen ennen ja jälkeen: vaalea teksti kylläisellä gradientilla ei täyttänyt kontrastivaatimuksia, harvennetut versaalit hidastivat lukemista ja syötetyt merkit näkyivät vain ohuina pisteinä.',
        },
      ],
    },
  },
  {
    slug: 'elisa-aisti',
    number: '05',
    title: 'Elisa Aisti',
    tagline: 'Palveluiden reaaliaikainen seuranta',
    meta: 'UI/UX · Konsepti · Front end',
    detail: {
      heading: 'Tilannekuva, jonka voi lukea yhdellä silmäyksellä',
      intro:
        'Elisan tilannekuvapalvelu yritysasiakkaille oli teknisesti ja visuaalisesti jäänyt jälkeen, eikä se enää vastannut käyttäjien tarpeita. Uusi versio rakennettiin aiemman tutkimuksen päälle, täydennettynä uusilla haastatteluilla ja käytettävyystesteillä.',
      roleTitle: 'UI/UX Designer',
      roleNote: 'Työparina palvelumuotoilija ja kehitystiimi.',
      responsible: [
        'Tuotteen UI/UX-suunnittelu',
        'Käyttäjätutkimus ja käytettävyystestaus',
        'Tutkimusaineiston analyysi',
      ],
      contributed: ['Konseptisuunnittelu', 'Asiakashaastattelut', 'Front end -toteutus'],
      sectionsTitle: 'Ratkaisu',
      sections: [
        {
          title: 'Reaaliaikainen seuranta',
          body: 'Yritysasiakas näkee palveluidensa ja yhteyksiensä tilan reaaliajassa, seuraa kehitystä ja ennakoi ongelmat.',
        },
        {
          title: 'Selkokieli ja hälytykset',
          body: 'Data esitetään yksinkertaisin visualisoinnein. Järjestelmä hälyttää poikkeamista ja neuvoo mitä tehdä seuraavaksi.',
        },
        {
          title: 'Läpinäkyvät virhetilanteet',
          body: 'Tiketteihin lisättiin tarkempi tieto ja jokaiselle vaiheelle aikaennuste. Käyttäjä tietää mitä tapahtuu ja milloin.',
        },
        {
          title: 'Tumma teema, kaikki laitekoot',
          body: 'Järjestelmä on auki pitkiä jaksoja, joten tumma teema valittiin katselumukavuuden takia — ei tyylin. Palvelu toimii mobiilista työpöydälle.',
        },
      ],
      media: [
        { id: 'aisti-tyopoyta', kind: 'image', ratio: '4:3', caption: 'Toimipistelista ja kartta työpöydällä — päänäkymä' },
        { id: 'aisti-mobiili', kind: 'image', ratio: '4:5', caption: 'Mobiilikartta ja toimipisteen tila' },
        { id: 'aisti-tiketti', kind: 'image', ratio: '4:3', caption: 'Tiketti aikaennusteineen' },
      ],
    },
  },
  {
    slug: 'op-vahinkoapuri',
    number: '06',
    title: 'OP Vahinkoapuri',
    tagline: 'Keskusteleva vahinkoilmoitus',
    meta: 'UI/UX · Konsepti · Testaus',
    detail: {
      heading: 'Lomake vaihtui keskusteluksi',
      intro:
        'Vanha vahinkoilmoitus oli sekava, joten asiakkaat soittivat tai täyttivät paperilomakkeen. Se kuormitti asiakaspalvelua ja turhautti molempia osapuolia. Taustalla oli toinen ongelma: järjestelmä ei tuottanut rakenteista dataa, joten korvauskäsittely oli hidasta ja manuaalista.',
      roleTitle: 'UI/UX Designer',
      roleNote: 'Tiivis yhteistyö kehitystiimin kanssa läpi projektin.',
      responsible: [
        'Keskustelevan ilmoituspalvelun UI/UX',
        'UI-prototyypit',
        'Validointi käytettävyystesteillä loppukäyttäjillä',
      ],
      contributed: ['Varhainen konseptointi', 'Asiakashaastattelut', 'Palvelumuotoilun työvaiheet'],
      sectionsTitle: 'Ratkaisu',
      sections: [
        {
          title: 'Keskusteleva polku',
          body: 'Sovellus korvasi kaikki vanhat lomakkeet. Käyttäjä valitsee valmiita vastauksia yhdellä klikkauksella.',
        },
        {
          title: 'Mukautuu vastauksiin',
          body: 'Polku muotoutuu vastausten mukaan: vain olennaiset kysymykset, eikä väärää lomaketta voi enää valita.',
        },
        {
          title: 'Testattu ennen toteutusta',
          body: 'Ilmoituspolku validoitiin käytettävyystesteillä loppukäyttäjillä ennen kuin kehitys aloitettiin.',
        },
        {
          title: 'Rakenteinen data',
          body: 'Uudistus muutti myös sen, mitä ilmoituksesta jää järjestelmään. Rakenteinen data vähensi käsityötä ja nopeutti korvauskäsittelyä.',
        },
      ],
      media: [
        { id: 'op-aloitus', kind: 'image', ratio: '4:3', caption: 'Ilmoituksen aloitus: mitä tarvitaan ja kauanko kestää' },
        { id: 'op-vaurio', kind: 'image', ratio: '4:5', caption: 'Vaurionvalitsin: auto ylhäältä, klikattavat osat' },
        { id: 'op-polku', kind: 'image', ratio: '4:3', caption: 'Mukautuva kysymyspolku' },
      ],
    },
  },
];

/** "Lisäksi"-rivi. Nimet ilman logoja, ei vaadi käyttölupaa. */
const also = ['Oikotie', 'Sanoma', 'Microsoft', 'Finavia', 'Ilta-Sanomat', 'Evira'];

const work = { leads, previous, also };
export type Work = typeof work;
export default work;
