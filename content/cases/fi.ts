import type { Case, CaseRef } from './types';

/**
 * Kärkicasejen sisältö. Tekstit ovat suoraan casetiedostoista
 * (Colliers Case / Blokbook Case / This Site Case .dc.html).
 *
 * Kaikki puuttuva on merkitty `todo`-lohkolla tai `null`-arvolla —
 * mitään ei ole keksitty täytteeksi.
 */

const colliers: Case = {
  slug: 'colliers',
  eyebrow: 'Case 01 · 2026 · Colliers',
  title: 'Colliers Asunnot',
  tagline: 'Vuokra-asuntopalvelu, joka suunniteltiin suoraan koodissa.',
  facts: [
    { label: 'Rooli', value: 'Senior Designer · design, front end, CMS' },
    { label: 'Kesto', value: '8 kuukautta konseptista julkaisuun' },
    { label: 'Tiimi', value: 'Pieni monialainen tiimi' },
    { label: 'Stack', value: 'Next.js, React, TypeScript, Storybook, Strapi' },
  ],
  blocks: [
    {
      kind: 'media',
      media: {
        id: 'colliers-hero',
        ratio: 'hero',
        caption: 'Kohdesivu isona — terävä, tarkoituksella rajattu, min. 2800 px leveä',
      },
    },
    {
      kind: 'text',
      label: 'Lähtötilanne',
      items: [
        {
          p: 'Palvelu oli ollut käytössä pitkään, ja tekniikka, ilme ja käyttökokemus kaipasivat uudistusta. Samaan aikaan liiketoiminta tarvitsi uusia ominaisuuksia, joille tarvittiin uusi pohja.',
        },
        {
          h: 'Tehtävä',
          p: 'Uusi palvelu kahdeksassa kuukaudessa: asuntohaku, verkkovuokraus, sisällönhallinta ja brändin modernisointi. Suunnittelin palvelun ja toteutin sen front endin, joten suunnittelupäätökset siirtyivät suoraan tuotteeseen.',
        },
      ],
    },
    {
      kind: 'text',
      label: 'Päätös',
      lead: 'Suunnittelu tehtiin suoraan koodissa',
      items: [
        {
          h: 'Valinta',
          p: 'Ensin syntyi klikattava rautalankamalli suoraan koodiin. Design system ja layoutit syntyivät Storybookiin koodina, eivät Figmaan.',
        },
        {
          h: 'Miksi',
          p: 'Selaimessa toimivasta palvelusta näkee heti, miltä sitä on käyttää, ja jokainen suunnittelupäätös on samalla valmista koodia. Asiakas pystyi näkemään ja kokeilemaan palvelua alusta asti.',
        },
        {
          h: 'Seuraus',
          p: 'Asiakas kommentoi selaimessa toimivaa palvelua. Sovitut muutokset olivat valmiina seuraavaan läpikäyntiin.',
        },
      ],
    },
    {
      kind: 'compare',
      label: 'Viikko 1 → julkaisu',
      id: 'colliers-runko',
      ratio: '4:3',
      tarveLeveys: 1344,
      beforeLabel: 'Viikko 1',
      afterLabel: 'Julkaisu',
      caption:
        'Sama näkymä viikolla 1 ja julkaisussa: toimiva runko ja siitä jatkokehitetty valmis ilme.',
    },
    {
      kind: 'band',
      title: 'Iteroitiin toimivaa palvelua, ei kuvia',
      body: 'Klikattava runko oli selaimessa jo ensimmäisinä viikkoina: hakupolut, hakemuspolku, verkkovuokraus, etusivu ja asuntosivu. Sitä käytettiin myös projektin viestintään, koska kokonaisuuden näki ennen kuin ulkoasua oli viimeistelty.',
    },
    {
      kind: 'trio',
      surface: 'tint',
      label: 'Mitä rakennettiin',
      title: 'Design ja toteutus samoissa käsissä',
      items: [
        {
          media: { id: 'colliers-haku', ratio: '4:5', caption: 'AI-haku: kirjoitettu kuvaus + tulokset' },
          h: 'Asuntohaku tekoälyllä ja kartalla',
          p: 'Käyttäjä voi kuvailla omin sanoin, millaista kotia etsii, tai hakea asuntoja kartalta. Vastasin käyttöliittymästä ja front end -toteutuksesta.',
        },
        {
          media: { id: 'colliers-vuokraus', ratio: '4:5', caption: 'Vuokraa heti -polku, yksi vaihe' },
          h: 'Vuokraa heti: vuokraus verkossa',
          p: 'Monivaiheinen polku, jolla asunnon voi vuokrata alusta loppuun verkossa. Suunnittelu ja toteutus iteroitiin suoraan koodissa.',
        },
        {
          media: { id: 'colliers-strapi', ratio: '4:5', caption: 'Strapi-editori sisältöä muokattaessa' },
          h: 'Sisällönhallinta ja whitelabel',
          p: 'Strapi-pohjainen sisällönhallinta, jolla markkinointi tekee laskeutumissivut itse, tarvittaessa myös asiakkaan omalla ilmeellä. Suunnittelin ja toteutin Strapiin kymmeniä komponentteja variantteineen. Niistä kootaan sivupohjat eri tarpeisiin, kuten markkinointikampanjoihin ja sisältösivuihin.',
        },
      ],
    },
    {
      kind: 'text',
      surface: 'tint',
      label: 'Design system',
      lead: 'Design system on koodissa',
      items: [
        {
          p: 'Tokenit, komponentit ja layoutit ovat Storybookissa. Erillistä Figma-tiedostoa ei ollut, joten dokumentaatio vastaa aina tuotannossa olevaa koodia.',
        },
      ],
    },
    {
      kind: 'text',
      label: 'Työtapa',
      items: [
        {
          p: 'Tiivis aikataulu vaati nopeita päätöksiä. Projekti tehtiin UX engineering -työtavalla: suunnittelu ja toteutus iteroitiin samassa koodissa.',
        },
      ],
    },
    { kind: 'todo', text: '"Mitä tekisin toisin" — yksi rehellinen lause tekee casesta uskottavamman.' },
    {
      kind: 'text',
      label: 'Lopputulos',
      lead: 'Palvelu on julkaistu ja käytössä',
      items: [
        { p: 'Mittareita ei ole vielä julkaistu. Ne lisätään tähän kun dataa on.' },
      ],
    },
    { kind: 'todo', text: 'Asiakkaan sitaatti — yksi lause, nimi ja titteli. Odottaa lupaa.' },
  ],
  next: { slug: 'blokbook', title: 'Blokbook' },
};

const blokbook: Case = {
  slug: 'blokbook',
  eyebrow: 'Case 02 · Oma tuote',
  title: 'Blokbook',
  tagline: 'Oman taloyhtiön ongelmasta myytäväksi palveluksi.',
  facts: [
    { label: 'Rooli', value: 'Perustaja · tuote, design, toteutus' },
    { label: 'Palvelun nykytila', value: 'Markkinoilla, käytössä useammassa taloyhtiössä' },
    { label: 'Alustat', value: 'Web, iOS, Android' },
    { label: 'Stack', value: null },
  ],
  blocks: [
    {
      kind: 'media',
      media: {
        id: 'blokbook-hero',
        ratio: 'hero',
        caption:
          'Blokbookin näkymiä puhelimessa: pesutuvan ja saunan vuorot, korttimaksu, oven etäavaus ja chat.',
      },
    },
    {
      kind: 'text',
      label: 'Miksi',
      items: [
        {
          p: 'Taloyhtiön saunat, pesutuvat, kerhotilat ja autopaikat varataan yhä listalla seinällä ja maksut hoidetaan erikseen. Omaan taloyhtiöön etsittiin palvelua, joka ratkaisisi tämän, eikä sopivaa ollut.',
        },
        {
          h: 'Mitä siitä tuli',
          p: 'Varaus- ja hallintapalvelu, jossa varaukset, maksut, kulunhallinta ja muu tilojen älyohjaus ovat samassa järjestelmässä. Manuaalinen työ jää pois isännöinniltä ja hallitukselta. Nyt käytössä useammassa taloyhtiössä.',
        },
      ],
    },
    {
      kind: 'text',
      label: 'Päätös',
      lead: 'Ensin omaan käyttöön',
      items: [
        {
          h: 'Valinta',
          p: 'Lähtökohta oli oma, tuttu ongelma eikä erillinen markkinaselvitys. Ensimmäinen käyttäjä oli oma taloyhtiö.',
        },
        {
          h: 'Miksi',
          p: 'Oikeasta käytöstä näki nopeasti, mikä toimii. Palvelu oli tuotannossa oikeilla varauksilla ja oikeilla maksuilla ennen kuin sitä myytiin kenellekään.',
        },
        {
          h: 'Seuraus',
          p: 'Konsepti kypsyi käytössä ja laajeni: web-sovelluksesta natiiviin iOS- ja Android-sovellukseen, ja yhdestä taloyhtiöstä tuotteeksi.',
        },
      ],
    },
    {
      kind: 'pair',
      label: 'Kaksi näkökulmaa',
      items: [
        {
          id: 'blokbook-asukas',
          ratio: '4:3',
          label: 'Asukas varaa ja maksaa',
          caption: 'Varaus asukkaan näkökulmasta: vapaat vuorot ja maksu.',
        },
        {
          id: 'blokbook-hallinta',
          ratio: '4:3',
          label: 'Isännöinti hallinnoi',
          caption: 'Hallintanäkymä: tilat, vuorot, maksut ja käyttöoikeudet.',
        },
      ],
    },
    {
      kind: 'band',
      title: 'Suunnittelupöydältä valmiiksi palveluksi',
      body: 'Hinnoittelu muuttaa tuotetta, tuoterajaus muuttaa koodia ja koodivalinta muuttaa sitä, mitä voi myydä. Siksi jokaista valintaa pitää katsoa sekä tuotteena että toteutuksena.',
    },
    {
      kind: 'scope',
      surface: 'tint',
      label: 'Vastuualueet',
      title: 'Mistä kaikesta vastaan',
      body: 'Tuotteen kaikki osa-alueet konseptista ylläpitoon, hinnoittelusta asiakastukeen.',
      items: [
        'Konseptointi ja liikeidea',
        'Brändi ja ilme',
        'UX ja käyttöliittymä',
        'Design system ja Storybook',
        'Front end',
        'Backend ja tietokanta',
        'Infra ja julkaisu',
        'Hinnoittelu ja tuotteistus',
        'Tuki ja ylläpito',
      ],
    },
    {
      kind: 'trio',
      surface: 'tint',
      label: 'Kolme alustaa',
      title: 'Sama palvelu, kolme alustaa',
      items: [
        {
          media: { id: 'blokbook-web', ratio: '3:4', caption: 'Web — varausnäkymä kapeana' },
          h: 'Web',
          p: 'Ensimmäinen alusta. Design system ja Storybook syntyivät tässä.',
        },
        {
          media: { id: 'blokbook-ios', ratio: '3:4', caption: 'iOS — natiivisovellus, ei laitekehystä' },
          h: 'iOS',
          p: 'Natiivi sovellus, samat komponentit ja sama ilme kuin webissä.',
        },
        {
          media: { id: 'blokbook-android', ratio: '3:4', caption: 'Android — sama näkymä' },
          h: 'Android',
          p: 'Sama työtapa kuin Colliersissa, mutta nyt myös mobiilissa.',
        },
      ],
    },
    {
      kind: 'text',
      label: 'Tilanne nyt',
      lead: 'Palvelu on markkinoilla, ja kehitys jatkuu',
      items: [
        {
          p: 'Useampi taloyhtiö käyttää palvelua, ja kehitys jatkuu viikoittain. Yritys on oma, joten tuotteen suunta on omissa käsissä.',
        },
      ],
    },
    {
      kind: 'todo',
      text: 'Täydennä: stack, julkaisuvuosi, taloyhtiöiden määrä (jos saa kertoa), isännöitsijän tai hallituksen lause, "mitä tekisin toisin".',
    },
  ],
  next: { slug: 'portfolio', title: 'Designer portfolio' },
};

const thisSite: Case = {
  slug: 'portfolio',
  eyebrow: 'Case 03 · 2026 · Oma portfolio',
  title: 'Designer portfolio',
  tagline: 'Portfolio, joka on itsessään näyte työtavasta. Se suunniteltiin koodissa, ja Figma ja AI-työkalut käyttävät samaa design systemiä.',
  facts: [
    { label: 'Rooli', value: 'Design, front end, design system' },
    { label: 'Stack', value: 'Next.js, TypeScript, Storybook, Figma Code Connect' },
    { label: 'Julkista', value: 'Storybook, Figma-tiedosto ja koodi' },
  ],
  blocks: [
    {
      /* Prosessidemo (video/kasikirjoitus.ts, npm run video) kokonaisena
         levyllä: video on vaakakuva, jonka tekstit leikkautuisivat
         heron rajauksessa. */
      kind: 'media',
      media: {
        id: 'portfolio-prosessi',
        ratio: '4:3',
        caption: 'Prosessi alusta loppuun: koodi, Figma, Storybook, tarkistukset, sivusto ja Figma Make.',
      },
    },
    {
      kind: 'text',
      label: 'Lähtötilanne',
      items: [
        {
          h: 'Tehtävä',
          p: 'Portfolio, joka on itse näyte työtavasta. Omissa projekteissa suunnittelu tehdään usein suoraan koodiin UX engineering -työtavalla, mutta asiakasorganisaatioissa työ alkaa yleensä Figmasta. Tavoite oli osoittaa, että kumpikin tapa toimii.',
        },
      ],
    },
    {
      kind: 'text',
      label: 'Päätös',
      lead: 'Koodi on ainoa lähde, ja Figma seuraa sitä',
      items: [
        {
          h: 'Valinta',
          p: 'Portfolio rakennettiin toimivaksi design systemiksi. Figma ja AI-työkalut käyttävät samoja arvoja ja komponentteja kuin sivusto.',
        },
        {
          h: 'Miksi',
          p: 'Työn voi aloittaa koodista tai Figmasta, eikä kumpikaan jää jälkeen. Sama ratkaisu toimii asiakkaan tiimissä, jossa suunnittelijat työskentelevät Figmassa.',
        },
      ],
    },
    {
      kind: 'choices',
      label: 'Kaksi tapaa aloittaa',
      title: 'Kumpi sopii, riippuu tiimistä',
      items: [
        {
          h: 'Koodi ensin',
          p: 'Nopein tapa, kun tiimi on pieni ja sama ihminen suunnittelee ja koodaa. Muutokset tehdään suoraan tuotteeseen.',
          note: 'Näin tehtiin Colliersissa ja Blokbookissa.',
        },
        {
          h: 'Figma ensin',
          p: 'Suunnittelijat ja sidosryhmät työskentelevät tutussa työkalussa, ja koodi pysyy silti lähteenä, koska Code Connect kytkee komponentit toisiinsa. Figma Make tekee prototyypin samoilla osilla.',
          note: 'Useimmissa asiakasprojekteissa työ alkaa näin.',
        },
      ],
    },
    {
      kind: 'band',
      title: 'Yksi design system koodissa, Figmassa ja AI-työkaluissa',
      body: 'Tokenit, komponentit ja sivut ovat samaa koodia. Figman kirjasto ja Figma Make käyttävät samoja osia npm-paketteina.',
      link: { label: 'Design system elävänä', to: 'system' },
    },
    {
      kind: 'kerrokset',
      surface: 'tint',
      label: 'Kerroksina',
      title: 'Sama sivu kolmena kerroksena',
      body: 'Alimpana ovat tokenit, keskellä niistä tehdyt komponentit ja päällimmäisenä valmis sivu. Kerrokset ovat sivuston omaa koodia, eivät kuvia.',
    },
    {
      kind: 'component',
      surface: 'tint',
      label: 'Yksi komponentti',
      title: 'Yksi komponentti neljästä suunnasta',
      body: 'Listarivi on sivuston tunnusomaisin komponentti. Se näkyy tässä valmiina, koodina, Storybookissa ja Figmassa. Koodi luetaan lähdetiedostoista buildin aikana.',
    },
    {
      kind: 'ketju',
      surface: 'tint',
      label: 'Prosessi',
      title: 'Prosessi vaihe vaiheelta',
      body: 'Prosessi kulkee yrityksen nykyisestä koodista ja Figmasta siihen, että Figma Makessa tehty muutos julkaistaan tuotteeseen.',
    },
    {
      kind: 'checks',
      label: 'Tarkistukset',
      title: '{n} tarkistusta pitää koodin ja Figman samana',
      note: 'Design system rapistuu yleensä vähitellen, kun koodi ja Figma alkavat erota. Täällä jokainen muutos kulkee tarkistusten läpi, ja jos jokin ei täsmää, muutos pysähtyy ennen julkaisua. Jokaisen tarkistuksen raja kerrotaan auki.',
      pending: {
        id: 'tulossa',
        title: 'Tulossa',
        note: 'Tarkistus on kirjoitettu, mutta sitä ei vielä ajeta, joten se ei ole otsikon luvussa.',
      },
      paivitys: {
        title: 'Sivuston päivitys',
        note: 'Jokainen päivitys kulkee tarkistusten läpi ennen julkaisua. Tämä sivu on alla olevan päivityksen tulos.',
        row: 'Viimeisin päivitys',
      },
    },
    {
      kind: 'text',
      label: 'Lopputulos',
      lead: 'Portfolio on samalla työnäyte ja toimiva design system',
      items: [
        {
          p: 'Sivu on rakennettu samoista komponenteista, jotka näkyvät Storybookissa ja Figmassa. Tokenit ja komponentit julkaistaan npm-paketteina, ja jokainen muutos kulkee samojen tarkistusten läpi.',
        },
        {
          h: 'Milloin tämä ei kannata',
          p: 'Kytkentä vaatii ylläpitoa ja kannattaa vasta, kun komponentteja on tarpeeksi ja tekijöitä useampi. Yhden hengen projektissa tai kymmenen komponentin kirjastossa se on turhaa työtä.',
        },
      ],
    },
    {
      kind: 'artefacts',
      label: 'Avaa ja tarkista',
      note: 'Linkit vievät oikeisiin työkaluihin ja tiedostoihin.',
    },
  ],
  next: { slug: 'himat', title: 'Himat' },
};

const himat: Case = {
  slug: 'himat',
  eyebrow: 'Case 04 · 2026 · Oma tuote',
  title: 'Himat',
  tagline: 'Asuntoportaalit auttavat löytämään kodin. Himat auttaa ymmärtämään, mitä sen ostaminen tarkoittaisi.',
  facts: [
    { label: 'Rooli', value: 'Oma tuote · tuote, design, toteutus' },
    { label: 'Palvelun nykytila', value: 'Beta, rajattu ulkoinen pilotti' },
    { label: 'Alusta', value: 'Web, mobiili edellä' },
    { label: 'Stack', value: 'Next.js, TypeScript, Supabase, Claude' },
  ],
  blocks: [
    {
      kind: 'media',
      media: {
        id: 'himat-hero',
        ratio: 'hero',
        caption: 'Ilmoituksen linkistä kohdesivulle: Himat lukee ilmoituksen, kokoaa kannen ja laskee kulut.',
      },
    },
    {
      kind: 'text',
      label: 'Lähtötilanne',
      items: [
        {
          p: 'Asunnon ostaminen on useimmille elämän suurin taloudellinen päätös, mutta siihen tarvittava tieto on hajallaan: ilmoitus yhdessä palvelussa, taloyhtiön dokumentit PDF:inä, lainalaskelma pankin sivulla ja oma talous taulukossa. Nykyiset työkalut lisäävät dataa ostajan eteen.',
        },
        {
          h: 'Tehtävä',
          p: 'Palvelu, joka vähentää ostajan tulkintatyötä. Ilmoituksen linkistä syntyy kohdenäkymä, joka kertoo heti, mitä kohteesta kannattaa huomata ja mitä se maksaisi juuri tälle kotitaloudelle. Ei uusi asuntoportaali, ei pankkilaskuri eikä yksi pistemäärä.',
        },
      ],
    },
    {
      kind: 'text',
      label: 'Päätös',
      lead: 'Tekoäly lukee ja selittää, koodi laskee ja arvioi',
      items: [
        {
          h: 'Valinta',
          p: 'Kielimalli poimii tiedot ilmoituksesta ja taloyhtiön dokumenteista, luokittelee ne ja kirjoittaa yhteenvedon. Laskelmat ja arvioiden tasot tehdään testatulla koodilla.',
        },
        {
          h: 'Miksi',
          p: 'Asuntokaupassa väärä luku on kallis. Mallin vastaus tarkistetaan skeemaa ja lähdettä vasten, ja koodi hylkää yhteenvedon, jonka lukuja lähteestä ei löydy.',
        },
        {
          h: 'Seuraus',
          p: 'Jokainen väite johtaa lähteeseen tai laskelmaan, ja puuttuva tieto näytetään puuttuvana eikä arvattuna.',
        },
      ],
    },
    {
      kind: 'text',
      label: 'Linkistä päätökseen',
      lead: 'Ilmoituksen linkki riittää alkuun',
      items: [
        {
          p: 'Ilmoituksen linkki liitetään, ja Himat lukee loput. Kohteen kansi kertoo ensin olennaisen, eli mikä kohteessa on hyvää ja mitä kannattaa vielä selvittää. Yksityiskohdat lähteineen ovat kannen alla, ja kulut lasketaan lainasta, vastikkeista ja kaupan hetken rahoista. Talouden tiedot kysytään yksi kerrallaan, ei pitkänä lomakkeena.',
        },
      ],
    },
    {
      kind: 'pair',
      label: 'Kansi ja kulut',
      items: [
        {
          id: 'himat-kansi',
          ratio: '3:4',
          label: 'Olennainen ensin',
          caption: 'Kohteen kansi: arvio, huomioitavaa ja hyvää',
        },
        {
          id: 'himat-kulut',
          ratio: '3:4',
          label: 'Mitä koti maksaisi',
          caption: 'Kuukausikulut: laina, vastikkeet ja kaupan hetken rahat',
        },
      ],
    },
    {
      kind: 'band',
      title: 'Fakta, laskelma ja arvio pidetään erillään',
      body: 'Ostaja näkee aina, mikä on lähteen tietoa, mikä on laskettu ja mikä on arvio. Siksi tulkintaan voi luottaa, ja sen voi tarkistaa.',
    },
    {
      kind: 'text',
      label: 'Arvolupaus',
      lead: 'Vähemmän tulkintaa, ei lisää dataa',
      items: [
        {
          h: 'Arvoa ennen kirjautumista',
          p: 'Ensimmäisen kodin voi tuoda ja lukea ilman tiliä. Tili tarvitaan vasta, kun koteja tallennetaan tai verrataan.',
        },
        {
          h: 'Ei yhtä pistemäärää',
          p: 'Kustannustaso, taloudellinen liikkumavara ja sopivuus ovat erillisiä tulkintoja, ja jokaisen taustalla oleva sääntö on avattavissa.',
        },
        {
          h: 'Epävarmuus näkyy',
          p: 'Kun tieto puuttuu, palvelu sanoo sen ja kertoo, mistä tiedon saa, esimerkiksi isännöitsijäntodistuksesta.',
        },
        {
          h: 'Koko kotitalous',
          p: 'Kodit ja talous voidaan jakaa kumppanin kanssa, ja laskelmat tehdään kotitalouden omista luvuista.',
        },
      ],
    },
    {
      kind: 'pair',
      label: 'Arki ja vertailu',
      items: [
        {
          id: 'himat-sijainti',
          ratio: '3:4',
          label: 'Sopiiko arkeen',
          caption: 'Sijainti: matkat, palvelut, luonto ja melu',
        },
        {
          id: 'himat-vertailu',
          ratio: '3:4',
          label: 'Kaksi kotia rinnakkain',
          caption: 'Vertailu: kulut, taloyhtiö ja sijainti samoilla riveillä',
        },
      ],
    },
    {
      kind: 'scope',
      surface: 'tint',
      label: 'Vastuualueet',
      title: 'Ideasta betaan yhdellä tekijällä',
      body: 'Tuotteen kaikki osa-alueet, ja tekoäly työn keskiössä alusta asti.',
      items: [
        'Tuotekonsepti ja rajaus',
        'Brändi ja ilme',
        'UX ja käyttöliittymä',
        'Design system ja tokenit',
        'Front end',
        'Backend, tietokanta ja tietoturva',
        'Tekoälyn poiminta ja sen mittaus',
        'Saavutettavuus ja laatuportit',
        'Infra ja julkaisu',
      ],
    },
    {
      kind: 'text',
      label: 'Laatu',
      lead: 'Säännöt ovat rekisterissä, eivät kehotteessa',
      items: [
        {
          h: 'Mitattu tekoäly',
          p: 'Jokainen poiminnan sääntö ja normalisointi on kirjattu syineen, ja sen takana on testiaineisto, joka todistaa sen. Kehotteen muutos mitataan aineistoa vasten ennen käyttöönottoa.',
        },
        {
          h: 'Samat portit joka muutoksessa',
          p: 'Saavutettavuus WCAG 2.2 AA -tasolla, rivitason tietoturva jokaisessa taulussa, tiukka sisältöturvakäytäntö sekä yksikkö-, komponentti- ja E2E-testit.',
        },
        {
          h: 'Päätökset kirjattuina',
          p: 'Arkkitehtuuripäätökset on kirjattu perusteluineen, joten tekoälyagentti ja ihminen työskentelevät samoilla säännöillä.',
        },
      ],
    },
    {
      kind: 'text',
      label: 'Lopputulos',
      lead: 'Beta on rajatussa ulkoisessa pilotissa',
      items: [
        {
          p: 'Himat lukee ilmoituksen, taloyhtiön dokumentit ja sijainnin, laskee kulut kotitalouden taloudesta ja vertaa koteja rinnakkain. Kehitys jatkuu pilotin palautteen pohjalta.',
        },
      ],
    },
  ],
  next: { slug: 'colliers', title: 'Colliers Asunnot' },
};

/**
 * Casejen mainnat leipätekstissä.
 *
 * Suomen taivutus estää johtamasta linkkitekstiä casen nimestä:
 * "Colliersissa" ei ole "Colliers Asunnot". Siksi muodot luetellaan
 * tässä, sisällön puolella, jossa kieli asuu.
 *
 * Järjestys on merkitsevä: pisin osuma ensin, jotta "Colliers
 * Asunnot" voittaa pelkän "Colliers".
 *
 * Sama mekanismi linkittää Työtapa-sivulle: maininta, jolla on
 * `section`, vie sille sivulle eikä caseen (päätös 38).
 */
export const caseRefs: CaseRef[] = [
  { text: 'UX engineering -työtavalla', section: 'method' },
  { text: 'Colliers Asunnot', slug: 'colliers' },
  { text: 'Colliersissa', slug: 'colliers' },
  { text: 'Blokbookissa', slug: 'blokbook' },
  { text: 'Blokbook', slug: 'blokbook' },
];

const cases: Case[] = [colliers, blokbook, thisSite, himat];
export default cases;
