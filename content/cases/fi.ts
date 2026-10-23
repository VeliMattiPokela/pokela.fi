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
  next: { slug: 'portfolio', title: 'Designer portfolio 2026' },
};

const thisSite: Case = {
  slug: 'portfolio',
  eyebrow: 'Case 03 · 2026 · Oma portfolio',
  title: 'Designer portfolio 2026',
  tagline: 'Portfolio, joka on itsessään näyte työtavasta. Se suunniteltiin koodissa, ja Figma ja AI-työkalut käyttävät samaa design systemiä.',
  facts: [
    { label: 'Rooli', value: 'Design, front end, design system' },
    { label: 'Stack', value: 'Next.js, TypeScript, Storybook, Figma Code Connect' },
    { label: 'Julkista', value: 'Storybook, Figma-tiedosto ja koodi' },
  ],
  blocks: [
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
      title: '{n} tarkistusta joka buildissa',
      note: 'Design system rapistuu yleensä vähitellen, kun koodi ja Figma alkavat erota. Tässä projektissa tarkistukset ajetaan joka buildissa ja pull requestissa, joten ero huomataan samana päivänä. Jokaisella tarkistuksella on myös rajansa, ja se kerrotaan auki.',
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

const cases: Case[] = [colliers, blokbook, thisSite];
export default cases;
