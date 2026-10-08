import type { Case } from './types';

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
  tagline: 'Vuokra-asuntopalvelu, joka suunniteltiin koodissa.',
  facts: [
    { label: 'Rooli', value: 'Senior Designer · design, front end, CMS' },
    { label: 'Kesto', value: '6 kuukautta konseptista julkaisuun' },
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
          p: 'Vanha palvelu oli vanhentunut kolmella tasolla yhtä aikaa: tekniikka, ilme ja käyttökokemus. Samaan aikaan liiketoiminta tarvitsi uusia ominaisuuksia, joita vanhan päälle ei voinut rakentaa.',
        },
        {
          h: 'Tehtävä',
          p: 'Uusi palvelu kuudessa kuukaudessa: asuntohaku, verkkovuokraus, sisällönhallinta ja brändin modernisointi. Suunnittelin ja toteutin palvelun itse, joten päätökset siirtyivät suoraan tuotteeseen.',
        },
      ],
    },
    {
      kind: 'text',
      label: 'Päätös',
      lead: 'Tässä projektissa aloitin suoraan koodista.',
      items: [
        {
          h: 'Valinta',
          p: 'Rakensin ensin klikattavan skeletonin suoraan koodiin. Design system ja layoutit syntyivät Storybookiin, eivät Figmaan.',
        },
        {
          h: 'Miksi',
          p: 'Selaimessa toimivasta palvelusta näkee heti, miltä sitä on käyttää, ja jokainen suunnittelupäätös on samalla valmista koodia. Asiakas pääsi kokeilemaan palvelua alusta asti.',
        },
        {
          h: 'Seuraus',
          p: 'Asiakas kommentoi selaimessa toimivaa palvelua. Palaverissa sovitut muutokset olivat valmiina seuraavaan palaveriin.',
        },
      ],
    },
    {
      kind: 'pair',
      label: 'Viikko 1 → julkaisu',
      items: [
        {
          id: 'colliers-viikko-1',
          ratio: '4:3',
          label: 'Viikko 1 — toimiva runko',
          caption: 'Skeleton selaimessa. Screenshot, Git-historia tai varhainen Storybook-näkymä.',
        },
        {
          id: 'colliers-julkaisu',
          ratio: '4:3',
          label: 'Julkaisu — sama rakenne, valmis ilme',
          caption: 'Sama näkymä julkaistussa palvelussa. Sama rajaus kuin vasemmalla.',
        },
      ],
    },
    {
      kind: 'band',
      title: 'Asiakas kommentoi toimivaa palvelua.',
      body: 'Klikattava runko oli selaimessa jo ensimmäisinä viikkoina: hakupolut, hakemuspolku, verkkovuokraus, etusivu ja asuntosivu. Sitä käytettiin myös projektin viestintään, koska kokonaisuuden näki ennen kuin ulkoasua oli viimeistelty.',
    },
    {
      kind: 'trio',
      label: 'Mitä rakensin',
      title: 'Design ja toteutus samoissa käsissä',
      items: [
        {
          media: { id: 'colliers-haku', ratio: '4:5', caption: 'AI-haku: kirjoitettu kuvaus + tulokset' },
          h: 'Asuntohaku, jolle voi kuvailla kodin',
          p: 'Käyttäjä kirjoittaa millaista kotia etsii, ja siitä muodostuu haku. Vastasin käyttöliittymästä ja siitä, miten tulokset esitetään.',
        },
        {
          media: { id: 'colliers-vuokraus', ratio: '4:5', caption: 'Vuokraa heti -polku, yksi vaihe' },
          h: 'Vuokraa heti: vuokraus verkossa',
          p: 'Monivaiheinen polku, joka on suunniteltu keskeytettäväksi ja jatkettavaksi. Suunnittelu ja toteutus iteroitiin suoraan koodissa.',
        },
        {
          media: { id: 'colliers-strapi', ratio: '4:5', caption: 'Strapi-editori sisältöä muokattaessa' },
          h: 'Sisällönhallinta ja whitelabel',
          p: 'Strapi-pohjainen järjestelmä, jolla markkinointi tekee laskeutumissivut itse, tarvittaessa myös asiakkaan omalla ilmeellä.',
        },
      ],
    },
    {
      kind: 'text',
      label: 'Design system',
      lead: 'Design system on koodissa',
      items: [
        {
          p: 'Tokenit, komponentit ja layoutit ovat Storybookissa. Erillistä Figma-tiedostoa ei ollut, joten dokumentaatio ja tuotantokoodi pysyivät samana.',
        },
      ],
    },
    {
      kind: 'text',
      label: 'Vaikeinta',
      items: [
        {
          p: 'Kuusi kuukautta koko palvelulle tarkoitti, että päätöksiä tehtiin nopeasti ja osa niistä jouduttiin perumaan. Perumiseen riitti yleensä muutos koodiin, koska erillistä suunnitelmaa ei tarvinnut päivittää.',
        },
      ],
    },
    { kind: 'todo', text: '"Mitä tekisin toisin" — yksi rehellinen lause tekee casesta uskottavamman.' },
    {
      kind: 'text',
      label: 'Lopputulos',
      lead: 'Palvelu julkaistiin ajallaan ja on nyt käytössä.',
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
          p: 'Taloyhtiön saunat, pesutuvat, kerhotilat ja autopaikat varataan yhä listalla seinällä ja maksut hoidetaan erikseen. Etsin omaan taloyhtiöömme palvelua joka ratkaisisi tämän, eikä sellaista ollut.',
        },
        {
          h: 'Mitä siitä tuli',
          p: 'Varaus- ja hallintapalvelu, jossa varaukset, maksut ja kulunhallinta ovat samassa järjestelmässä. Manuaalinen työ jää pois isännöinniltä ja hallitukselta. Nyt käytössä useammassa taloyhtiössä.',
        },
      ],
    },
    {
      kind: 'text',
      label: 'Päätös',
      lead: 'Rakensin sen itselleni ensin.',
      items: [
        {
          h: 'Valinta',
          p: 'Aloitin ongelmasta, jonka tunsin itse, enkä tehnyt erillistä markkinaselvitystä. Ensimmäinen käyttäjä oli oma taloyhtiö.',
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
      title: 'Kun tekee kaiken itse, päätökset vaikuttavat toisiinsa.',
      body: 'Hinnoittelu muuttaa tuotetta, tuoterajaus muuttaa koodia ja koodivalinta muuttaa sitä, mitä voi myydä. Siksi jokaista valintaa pitää katsoa sekä tuotteena että toteutuksena.',
    },
    {
      kind: 'scope',
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
      lead: 'Palvelu on markkinoilla, ja kehitys jatkuu.',
      items: [
        {
          p: 'Useampi taloyhtiö käyttää palvelua, ja kehitys jatkuu viikoittain. Yritys on omani, joten tuotteen suunta on omissa käsissä.',
        },
      ],
    },
    {
      kind: 'todo',
      text: 'Täydennä: stack, julkaisuvuosi, taloyhtiöiden määrä (jos saa kertoa), isännöitsijän tai hallituksen lause, "mitä tekisin toisin".',
    },
  ],
  next: { slug: 'tama-sivusto', title: 'Tämä sivusto' },
};

const thisSite: Case = {
  slug: 'tama-sivusto',
  eyebrow: 'Case 03 · Tämä sivusto',
  title: 'Yksi lähde, kaksi suuntaa',
  titleLines: ['Yksi lähde,', 'kaksi suuntaa'],
  tagline: 'Design system on koodissa. Figma ja AI-työkalut käyttävät samoja arvoja ja komponentteja, ja automaattiset tarkistukset huomaavat, jos ne alkavat erota.',
  facts: [
    { label: 'Rooli', value: 'Kaikki, tämä on oma sivustoni' },
    { label: 'Stack', value: 'Next.js, TypeScript, Storybook, Figma Code Connect' },
    { label: 'Erityistä', value: 'Kaikki artefaktit ovat julkisia ja avattavissa' },
  ],
  blocks: [
    {
      kind: 'text',
      label: 'Miksi tämä on olemassa',
      items: [
        {
          p: 'Suunnittelen itse usein suoraan koodiin. Monessa asiakasorganisaatiossa työ kuitenkin alkaa Figmasta, ja sen ympärillä on suunnittelijoita, sidosryhmiä ja prosesseja.',
        },
        {
          h: 'Mitä tein',
          p: 'Rakensin tämän sivuston niin, että kumpikin tapa toimii samasta lähteestä. Storybook, Figma-tiedosto ja Code Connect -kytkennät ovat julkisia, ja build tarkistaa, että ne vastaavat toisiaan.',
        },
      ],
    },
    {
      kind: 'artefacts',
      label: 'Avaa ja tarkista',
      note: 'Linkit vievät oikeisiin työkaluihin ja tiedostoihin. Se mikä ei vielä ole julkisesti auki, on merkitty tulossa olevaksi.',
    },
    {
      kind: 'ketju',
      label: 'Prosessi',
      title: 'Prosessi vaihe vaiheelta',
      body: 'Prosessi alkaa yrityksen nykytilanteesta ja päättyy siihen, että AI:lla tehty prototyyppi palaa tuotteen koodiin. Useimpia vaiheita valvoo automaattinen tarkistus, ja ne joita ei valvo, on merkitty. Tarkoitus on näyttää, miten tällaisen prosessin voi rakentaa. Koodia ei ole tarkoitettu kopioitavaksi sellaisenaan.',
    },
    {
      kind: 'component',
      label: 'Yksi komponentti',
      title: 'Yksi komponentti neljästä suunnasta',
      body: 'Listarivi on tämän sivuston tunnusomaisin komponentti. Alla se näkyy valmiina, koodina, Storybookissa ja Figmassa. Koodi luetaan suoraan lähdetiedostoista buildin aikana, joten se on aina sama kuin käytössä oleva koodi.',
    },
    {
      kind: 'band',
      title: 'Tarkistuksilla on rajansa.',
      body: 'Jokainen build ajaa tarkistukset, ja ero koodin ja Figman välillä pysäyttää sen. Alla on lista siitä, mitä kukin tarkistus kattaa ja mitä se ei näe.',
    },
    {
      kind: 'checks',
      label: 'Mitä build tarkistaa',
      title: '{n} tarkistusta, ja niiden sokeat kohdat',
      note: 'Lista luetaan suoraan projektin asetuksista (package.json), joten siinä näkyvät vain tarkistukset, jotka oikeasti ajetaan.',
    },
    {
      kind: 'text',
      label: 'Ylläpito',
      items: [
        {
          h: 'Mitä tarkistetaan',
          p: 'Onko jokaisella komponentilla story ja jokaisella Figman komponentilla kytkentä koodiin. Löytyvätkö kytkennän lukemat propertyt ja variantit Figmasta. Figman muuttujia ei tarkisteta, vaikka se olisi hyödyllistä: rajapinta avaa ne vain Enterprise-tasolla. Organisaatiossa, jolla Enterprise on, saman tarkistuksen voi ulottaa myös muuttujiin.',
        },
        {
          h: 'Milloin',
          p: 'Joka buildissa ja jokaisessa pull requestissa, joten ero huomataan samana päivänä.',
        },
        {
          h: 'Miksi',
          p: 'Design system rapistuu yleensä vähitellen, kun koodi ja Figma alkavat erota toisistaan. Automaattinen tarkistus huomaa sen ajoissa.',
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
          note: 'Näin tein Colliersissa ja Blokbookissa.',
        },
        {
          h: 'Figma ensin',
          p: 'Suunnittelijat ja sidosryhmät työskentelevät tutussa työkalussa, ja koodi pysyy silti lähteenä, koska Code Connect kytkee komponentit toisiinsa.',
          note: 'Useimmissa asiakasprojekteissa työ alkaa näin.',
        },
      ],
    },
    {
      kind: 'text',
      label: 'Rajat',
      lead: 'Milloin tämä ei kannata',
      items: [
        {
          p: 'Kytkentä vaatii ylläpitoa ja kannattaa vasta, kun komponentteja on tarpeeksi ja tekijöitä useampi. Yhden hengen projektissa tai kymmenen komponentin kirjastossa se on turhaa työtä.',
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
 */
export const caseRefs: { text: string; slug: string }[] = [
  { text: 'Colliers Asunnot', slug: 'colliers' },
  { text: 'Colliersissa', slug: 'colliers' },
  { text: 'Blokbookissa', slug: 'blokbook' },
  { text: 'Blokbook', slug: 'blokbook' },
];

const cases: Case[] = [colliers, blokbook, thisSite];
export default cases;
