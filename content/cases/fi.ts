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
    { label: 'Rooli', value: 'Senior Designer — design, front end, CMS' },
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
          p: 'Uusi palvelu kuudessa kuukaudessa: asuntohaku, verkkovuokraus, sisällönhallinta ja brändin modernisointi. Suunnittelu ja toteutus samoissa käsissä, koska aikataulu ei kestänyt käännösvaihetta.',
        },
      ],
    },
    {
      kind: 'text',
      label: 'Päätös',
      lead: 'Ei Figmaa ensin. Koodi ensin.',
      items: [
        {
          h: 'Valinta',
          p: 'Rakensin ensin klikattavan skeletonin suoraan koodiin. Design system ja layoutit syntyivät Storybookiin, eivät Figmaan.',
        },
        {
          h: 'Miksi',
          p: 'Kuva palvelusta ei kerro miltä palvelu tuntuu. Kuuden kuukauden aikataulussa ei myöskään ollut tilaa piirtää samaa asiaa kahdesti.',
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
      title: 'Asiakas kommentoi toimivaa palvelua, ei kuvaa siitä.',
      body: 'Klikattava skeleton oli hakupolut, hakemuspolku, verkkovuokraus, etusivu ja asuntosivu myöten olemassa jo ensimmäisinä viikkoina. Se toimi samalla projektin viestintävälineenä: kokonaisuus oli nähtävissä ennen kuin yhtäkään pikseliä oli viimeistelty.',
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
          h: 'Vuokraa heti — vuokraus verkossa',
          p: 'Monivaiheinen polku, joka on suunniteltu keskeytettäväksi ja jatkettavaksi. Suunnittelu ja toteutus iteroitiin suoraan koodissa.',
        },
        {
          media: { id: 'colliers-strapi', ratio: '4:5', caption: 'Strapi-editori sisältöä muokattaessa' },
          h: 'Sisällönhallinta ja whitelabel',
          p: 'Strapi-pohjainen järjestelmä, jolla markkinointi tekee laskeutumissivut itse — myös asiakkaan omalla ilmeellä.',
        },
      ],
    },
    {
      kind: 'text',
      label: 'Design system',
      lead: 'Yksi lähde, ja se on koodi',
      items: [
        {
          p: 'Tokenit, komponentit ja layoutit elävät Storybookissa. Ei erillistä designtiedostoa, joka vanhenee ensimmäisen sprintin aikana — dokumentaatio on sama asia kuin tuotantokoodi.',
        },
      ],
    },
    {
      kind: 'text',
      label: 'Vaikeinta',
      items: [
        {
          p: 'Kuusi kuukautta koko palvelulle tarkoitti, että päätöksiä tehtiin nopeasti ja osa niistä jouduttiin perumaan. Se oli mahdollista vain koska muutos syntyi siihen samaan paikkaan jossa tuote eli.',
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
    { label: 'Rooli', value: 'Perustaja — tuote, design, toteutus' },
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
          'Varausnäkymä työpöydällä — tuotteen ydin yhdessä kuvassa. Oikeaa dataa, ei demosisältöä.',
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
          p: 'En lähtenyt validoimaan markkinaa vaan ratkaisemaan ongelman jonka tunsin itse. Ensimmäinen käyttäjä oli oma taloyhtiö.',
        },
        {
          h: 'Miksi',
          p: 'Oikea käyttö kertoo enemmän kuin haastattelu. Palvelu oli tuotannossa oikeilla varauksilla ja oikeilla maksuilla ennen kuin sitä myytiin kenellekään.',
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
          label: 'Asukas — varaa ja maksaa',
          caption: 'Varaus asukkaan näkökulmasta: vapaat vuorot ja maksu.',
        },
        {
          id: 'blokbook-hallinta',
          ratio: '4:3',
          label: 'Isännöinti — hallinnoi',
          caption: 'Hallintanäkymä: tilat, vuorot, maksut ja käyttöoikeudet.',
        },
      ],
    },
    {
      kind: 'band',
      title: 'Kun vastaa kaikesta, kokonaisuus on ainoa asia joka ratkaisee.',
      body: 'Yksin tehdessä jokainen päätös osuu johonkin toiseen päätökseen: hinnoittelu muuttaa tuotetta, tuoterajaus muuttaa koodia, koodivalinta muuttaa sitä mitä voi myydä. Se vaatii vahvan käsityksen siitä mitä valinta tarkoittaa sekä tuotteena että toteutuksena — eikä kukaan ole tarkistamassa jälkiä.',
    },
    {
      kind: 'scope',
      label: 'Vastuualueet',
      title: 'Mistä kaikesta vastaan',
      body: 'Tuotteen jokainen osa-alue konseptista ylläpitoon. Sama ihminen päättää hinnan, piirtää käyttöliittymän ja vastaa puhelimeen.',
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
      lead: 'Palvelu on markkinoilla ja kehittyy jatkuvasti.',
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
  tagline: 'Design system elää koodissa. Figma pysyy synkassa. Asiakas valitsee lähtökohdan.',
  facts: [
    { label: 'Rooli', value: 'Kaikki — tämä on oma sivustoni' },
    { label: 'Stack', value: 'Next.js, TypeScript, Storybook, Figma Code Connect' },
    { label: 'Erityistä', value: 'Kaikki artefaktit ovat julkisia ja avattavissa' },
  ],
  blocks: [
    {
      kind: 'text',
      label: 'Miksi tämä on olemassa',
      items: [
        {
          p: 'Oma tapani on suunnitella suoraan koodiin. Mutta konsulttina työskentelen asiakkaiden todellisuudessa, ja monessa organisaatiossa Figma on annettu lähtökohta — suunnittelijoita, sidosryhmiä ja prosesseja joita ei muuteta yhden tekijän mieltymyksen takia.',
        },
        {
          h: 'Mitä tein',
          p: 'Rakensin tämän sivuston niin, että molemmat suunnat toimivat samasta lähteestä — ja niin, että sen voi tarkistaa. Storybook, Figma-tiedosto ja Code Connect -kytkennät ovat julkisia, ja build varmistaa että ne pysyvät synkassa.',
        },
      ],
    },
    {
      kind: 'artefacts',
      label: 'Avaa ja tarkista',
      note: 'Jokainen väite tällä sivulla on tarkistettavissa. Tehty ja tulossa ovat eri asioita, eikä niitä esitetä samana — linkki ilmestyy sinä päivänä kun artefakti saa julkisen osoitteen.',
    },
    {
      kind: 'steps',
      label: 'Putki',
      title: 'Viisi askelta, jokainen avattavissa',
      body: 'Ketju kulkee tokeneista Figman komponenttiin. Osa askelista on automatisoitu — Figman muuttujat generoidaan tokens.jsonista — ja osa on käsityötä, jonka tarkistus vahtii. Jokainen askel on julkinen, joten ketjua ei tarvitse uskoa.',
      items: [
        { h: 'Tokenit', p: 'CSS-muuttujat, light ja dark. Yksi tiedosto.' },
        { h: 'Komponentti koodissa', p: 'Lukee tokenit, ei kovakoodattuja arvoja.' },
        { h: 'Story', p: 'Dokumentaatio ja tilat. Syntyy komponentista, ei erikseen.' },
        { h: 'Figma-komponentti', p: 'Sama komponentti suunnittelijan työkalussa.' },
        { h: 'Code Connect -kytkentä', p: 'Figmassa näkyy komponentin oikea koodi, ei arvaus.' },
      ],
    },
    {
      kind: 'component',
      label: 'Yksi komponentti',
      title: 'Sama artefakti, neljä pintaa',
      body: 'Listarivi on tämän sivuston tunnusomaisin komponentti. Alla se on auki kokonaan: renderöitynä, koodina, storynä ja Figman puolella. Ei neljä versiota samasta asiasta, vaan yksi asia neljästä suunnasta. Koodi luetaan oikeista tiedostoista build-aikana — käsin kopioitu ote vanhenisi, ja se on juuri se virhe jonka tämä case lupaa ratkaista.',
    },
    {
      kind: 'band',
      title: 'Tarkistus on vain niin hyvä kuin se mitä se lukee.',
      body: 'Jokainen build ajaa saman ketjun, ja eriytymä pysäyttää putken. Mutta tarkistuksella on raja, ja raja on osa väitettä: alla on lista siitä mitä kukin niistä todistaa — ja mitä se ei näe.',
    },
    {
      kind: 'checks',
      label: 'Mitä build tarkistaa',
      title: '{n} tarkistusta, ja niiden sokeat kohdat',
      note: 'Lista ei ole kirjoitettu tähän vaan johdettu package.jsonista: tarkistus näkyy vasta kun se on kytketty ketjuun ja sen skripti on olemassa. Tämä sivu väitti kerran että Figmaa tarkistetaan — ei tarkistettu. Siksi väite luetaan nyt sieltä missä se on totta.',
    },
    {
      kind: 'text',
      label: 'Ylläpito',
      items: [
        {
          h: 'Mitä tarkistetaan',
          p: 'Onko jokaisella komponentilla story ja Code Connect -kytkentä. Vastaavatko tokenien arvot Figman muuttujia. Puuttuuko variantteja kumpaakaan puolelta.',
        },
        {
          h: 'Milloin',
          p: 'Joka buildissa ja jokaisessa pull requestissa. Eriytymä löytyy samana päivänä eikä kolmen kuukauden päästä.',
        },
        {
          h: 'Miksi se ratkaisee',
          p: 'Design systemit eivät kuole huonoon suunnitteluun vaan hiljaiseen eriytymiseen. Automaatio on ainoa asia joka estää sen.',
        },
      ],
    },
    {
      kind: 'choices',
      label: 'Kaksi tapaa aloittaa',
      title: 'Asiakkaan prosessi ratkaisee',
      items: [
        {
          h: 'Koodi ensin',
          p: 'Nopein reitti. Ei käännösvaihetta, muutos syntyy siihen paikkaan jossa tuote elää. Toimii kun tiimi on pieni ja tekijä osaa molemmat.',
          note: 'Näin tein Colliersissa ja Blokbookissa.',
        },
        {
          h: 'Figma ensin',
          p: 'Organisaatio pääsee mukaan. Suunnittelijat, sidosryhmät ja hyväksynnät toimivat siinä työkalussa jonka he tuntevat — ja koodi pysyy silti totuutena, koska kytkentä hoitaa käännöksen.',
          note: 'Tämä on useimman asiakkaan todellisuus.',
        },
      ],
    },
    {
      kind: 'text',
      label: 'Rajat',
      lead: 'Milloin tämä ei kannata',
      items: [
        {
          p: 'Kytkentä vaatii ylläpitoa, ja se maksaa itsensä takaisin vasta kun komponentteja on tarpeeksi ja tekijöitä useampi. Yhden hengen projektissa ja kymmenen komponentin kirjastossa se on ylimääräistä koneistoa. Kerron sen asiakkaalle suoraan.',
        },
      ],
    },
    {
      kind: 'todo',
      text: 'Täydennä: viisi URL-osoitetta, komponenttinäkymän oikea koodi, komponenttien ja kytkentöjen määrä. Tarkista Code Connectin lisenssivaatimus ennen kuin lupaat sen.',
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
