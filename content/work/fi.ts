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

export type PreviousMediaGroup = {
  title?: string;
  intro?: string;
  items: PreviousMedia[];
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
    /**
     * Kuva- ja videopaikat osioittain. Tyhjä lista = ei vielä
     * materiaalia. Otsikoton osio on pelkkä kuvarivi; otsikollinen
     * saa otsikon ja ingressin, jotta eri aiheiden kuvat eivät
     * näytä yhdeltä riviltä.
     */
    media: PreviousMediaGroup[];
  };
};

const leads: Lead[] = [
  {
    slug: 'colliers',
    number: '01',
    title: 'Colliers Asunnot',
    tagline: 'Vuokra-asuntopalvelu, joka suunniteltiin koodissa',
    lede:
      'Vuokra-asuntopalvelu alusta loppuun: asuntohaku, verkkovuokraus ja sisällönhallinta. Suunnittelin palvelun ja toteutin sen front endin.',
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
    meta: 'Perustaja · tuote, design, toteutus',
    next: 'portfolio',
  },
  {
    slug: 'portfolio',
    number: '03',
    title: 'Designer portfolio',
    tagline: 'Portfolio, joka on itsessään näyte työtavasta',
    lede:
      'Portfolio suunniteltiin ja rakennettiin koodissa. Design system on sama koodissa ja Figmassa, ja Storybook, Code Connect -kytkennät ja tarkistukset ovat julkisia.',
    meta: 'Design, front end, design system',
    next: 'himat',
  },
  {
    slug: 'himat',
    number: '04',
    title: 'Himat',
    tagline: 'Asuntoilmoituksesta ymmärrettäväksi päätökseksi',
    lede:
      'Palvelu asunnon ostajalle: ilmoituksen linkistä syntyy kohdenäkymä, joka kertoo riskit, kulut ja sen, mitä koti tarkoittaisi omalle taloudelle. Oma tuote, betana pilottikäytössä.',
    meta: 'Oma tuote · tuote, design, toteutus',
    next: 'colliers',
  },
];

const previous: Previous[] = [
  {
    slug: 'pivo',
    number: '05',
    title: 'Pivo',
    tagline: 'Maksusovellus 1,2 milj. käyttäjälle',
    meta: 'Service design · UX/UI',
    detail: {
      heading: 'Maksusovellus yli miljoonalle käyttäjälle',
      intro:
        'Mobiilimaksamisen sovellus rahan lähettämiseen, yhteisten kulujen jakamiseen ja verkkomaksuihin.',
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
      sectionsTitle: 'Työ Pivossa',
      sections: [
        {
          title: 'Käyttäjäymmärrys ja konseptointi',
          body: 'Haastattelut, kyselyt, analytiikka ja käytettävyystestit. Niiden pohjalta tehtiin uusien ominaisuuksien konseptit ennen kuin näkymiä piirrettiin valmiiksi.',
        },
        {
          title: 'Käyttöliittymä ja interaktiot',
          body: 'Näkymät ja vuorovaikutus iOS:lle ja Androidille. Prototyypit testattiin asiakkailla ennen toteutusta, ja animaatiot suunniteltiin samalla kuin muu käyttöliittymä.',
        },
        {
          title: 'Saavutettavuus koko sovelluksessa',
          body: 'Kävimme sovelluksen läpi näkymä näkymältä ja korjasimme värikontrastit, kosketuskohteiden koon ja ruudunlukijatuen. Sen jälkeen saavutettavuus kuului tiimin tavalliseen työhön.',
        },
        {
          title: 'Designista toteutukseen',
          body: 'Kehitin tiimin tapaa siirtää design toteutukseen. Siitä alkoi kiinnostus suunnitella suoraan koodissa.',
        },
      ],
      media: [
        {
          title: 'Polut, prototyypit ja liike',
          intro:
            'Suunnittelin käyttöliittymäpolut, prototyypit, interaktiot ja animaatiot. Liike kertoo käyttäjälle, mitä juuri tapahtui: ryhmä syntyy, kulu tasataan ja saapuneeseen maksuun vastataan reaktiolla.',
          items: [
            { id: 'pivo-ryhma', kind: 'video', ratio: '3:4', caption: 'Ryhmän luominen: valmis pohja, jäsenet ja ensimmäinen kulu' },
            { id: 'pivo-kulut', kind: 'video', ratio: '3:4', caption: 'Ryhmän kulut: kortti nousee kosketuksesta, ja tasattu kulu hiljenee listaan' },
            { id: 'pivo-reaktio', kind: 'video', ratio: '3:4', caption: 'Saapunut maksu: reaktio valitaan palkista pyyhkäisemällä' },
          ],
        },
        {
          title: 'Saavutettavuus ennen ja jälkeen',
          intro:
            'Sovellus käytiin saavutettavuuden osalta läpi kokonaisuutena. Kirjautumisnäkymä näyttää, miltä sovellus näytti ennen parannuksia ja miltä niiden jälkeen.',
          items: [
            {
              id: 'pivo-kirjautuminen',
              kind: 'compare',
              ratio: '3:4',
              caption:
                'Kirjautuminen ennen ja jälkeen: vaalea teksti kylläisellä gradientilla ei täyttänyt kontrastivaatimuksia, harvennetut versaalit hidastivat lukemista ja syötetyt merkit näkyivät vain ohuina pisteinä.',
            },
          ],
        },
      ],
    },
  },
  {
    slug: 'elisa-aisti',
    number: '06',
    title: 'Elisa Aisti',
    tagline: 'Tilannekuvapalvelu Elisan yritysasiakkaille',
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
          body: 'Järjestelmä on auki pitkiä jaksoja, joten tumma teema valittiin, koska se on silmille kevyempi. Palvelu toimii mobiilista työpöydälle.',
        },
      ],
      media: [
        {
          items: [
            { id: 'aisti-tyopoyta', kind: 'image', ratio: '4:3', caption: 'Päänäkymä: toimipistelista ja kartta työpöydällä' },
            { id: 'aisti-mobiili', kind: 'image', ratio: '4:5', caption: 'Mobiilikartta ja toimipisteen tila' },
            { id: 'aisti-tiketti', kind: 'image', ratio: '4:3', caption: 'Tiketti aikaennusteineen' },
          ],
        },
      ],
    },
  },
  {
    slug: 'op-vahinkoapuri',
    number: '07',
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
        {
          items: [
            { id: 'op-aloitus', kind: 'image', ratio: '4:3', caption: 'Ilmoituksen aloitus: mitä tarvitaan ja kauanko kestää' },
            { id: 'op-vaurio', kind: 'image', ratio: '4:5', caption: 'Vaurionvalitsin: auto ylhäältä, klikattavat osat' },
            { id: 'op-polku', kind: 'image', ratio: '4:3', caption: 'Mukautuva kysymyspolku' },
          ],
        },
      ],
    },
  },
];

const work = { leads, previous };
export type Work = typeof work;
export default work;
