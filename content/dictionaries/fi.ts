/**
 * Suomenkieliset tekstit. Tämä tiedosto määrittelee myös sanakirjan
 * tyypin — en.ts ei mene läpi tyypintarkistuksesta ennen kuin se on
 * yhtä täydellinen.
 *
 * Tekstit ovat sanatarkasti sivupohjista (Page Templates.dc.html,
 * Mobile Templates.dc.html). Paikkamerkit on merkitty TODO-kentillä
 * eikä keksityillä arvoilla.
 */

const fi = {
  meta: {
    siteName: 'Pokela',
    title: 'Veli-Matti Pokela — Senior Product Designer & UX Engineer',
    description:
      'Suunnittelen käyttöliittymät ja koodaan ne tuotantoon. Senior Product Designer & UX Engineer, Helsinki.',
    skipToContent: 'Siirry sisältöön',
  },

  nav: {
    work: 'Työt',
    method: 'Työtapani',
    about: 'Tietoa minusta',
    contact: 'Ota yhteyttä',
    menu: 'Valikko',
    close: 'Sulje',
    theme: 'Teema',
    themeLight: 'Vaalea',
    themeDark: 'Tumma',
    themeSystem: 'Auto',
    /* Kielivalitsin: linkki toiseen kieleen. Pitkä muoto on
       linkin nimi ruudunlukijalle, lyhyt näkyy navissa. */
    language: 'In English',
    languageShort: 'EN',
  },

  home: {
    name: 'Veli-Matti Pokela',
    nameLines: ['Veli-Matti', 'Pokela'],
    role: 'Senior Product Designer & UX Engineer, Helsinki',
    /** Etusivun viivateoksen vaihtoehtoinen teksti (Korkeuskayrat). */
    heroArt: 'Korkeuskäyrät viivapiirroksena',
    /** TODO: oikea saatavuustieto. Ei näytetä ennen kuin se on tiedossa. */
    availability: null as string | null,
    statement: 'Käyttöliittymät suunnittelusta tuotantokoodiin asti.',
    lede:
      'Viimeisimmät kaksi projektia ovat Colliers Asunnot ja oma tuote Blokbook. Kummassakin käyttöliittymä suunniteltiin ja toteutettiin suoraan koodissa.',
    aboutLink: 'Tietoa minusta',
    selectedWork: 'Valitut työt',
    allWork: 'Katso kaikki työt',
    bandTitle: 'Suunnittelu ja toteutus samoissa käsissä',
    bandBody:
      'Design system, tuotesuunnittelu ja front end. Projektista riippuen yksi näistä tai kaikki kolme.',
  },

  work: {
    title: 'Työt',
    previous: 'Aiemmat työt',
    previousHint: 'Avautuu sivulla',
    nextCase: 'Seuraava case',
    open: 'Avaa',
    close: 'Sulje',
  },

  about: {
    titleLines: ['Veli-Matti', 'Pokela'],
    lede:
      'Senior Product Designer & UX Engineer, Helsinki. Teen konsepteja, käyttöliittymiä ja niiden front end -toteutuksen.',
    body:
      'Olen työskennellyt digitaalisten tuotteiden ja palveluiden suunnittelun parissa vuodesta 2010. Yhdistän työssäni UX/UI-suunnittelua, palvelumuotoilua ja front end -kehitystä. Työ alkaa käyttäjien ja liiketoiminnan tarpeiden ymmärtämisestä ja etenee konsepteista ja prototyypeistä toimiviin, koodattuihin käyttöliittymiin. Työskentelen sujuvasti sekä Figmassa että suoraan koodissa ja hyödynnän tekoälyä osana suunnittelu- ja kehitystyötä. Kokemusta on niin kuluttajille suunnatuista digitaalisista palveluista kuin monimutkaisista sisäisistä työkaluista.',
    contact: 'Ota yhteyttä',
    /* Ei "Lataa PDF": PDF:ää ei ole eikä tehdä. Sivu tulostuu
       CV:ksi, ja selain tekee siitä tiedoston jos lukija haluaa. */
    printCv: 'Tulosta CV',
    /* Näkyy vain paperilla: ruudulla yhteystiedot ovat napissa ja
       footerissa, joista kumpikaan ei tulostu. */
    printRole: 'Senior Product Designer & UX Engineer',
    portraitAlt: 'Veli-Matti Pokela',
    servicesTitle: 'Osaaminen',
    historyTitle: 'Työhistoria',
    historySince: 'Vuodesta 2010',
    toolsTitle: 'Työkalut',
    educationTitle: 'Koulutus ja kielet',
  },

  footer: {
    ctaLines: ['Ota', 'yhteyttä'],
    email: 'velimatti.pokela@gmail.com',
    location: 'Helsinki, FI',
    linkedin: 'LinkedIn',
    linkedinUrl: 'https://www.linkedin.com/in/veli-matti-pokela-5b1b288a/',
    colophonLabel: 'Tämä sivusto',
    colophon: 'Next.js · TypeScript · Storybook · tokenit koodissa',
    year: '2026',
  },

  /* Kuvatekstit. Näkyvät sivulla ja luetaan ruudunlukijalle, joten ne
     kuuluvat tänne eivätkä komponenttiin. Tuotenimet (Colliers,
     Blokbook, Storybook) eivät käänny, mutta loppuosa kääntyy. */
  /* System-sivu ja komponenttinäyttely. Nämä ovat dokumentaatiota,
     mutta dokumentaatio on osa sivustoa ja kääntyy sen mukana. */
  system: {
    rules: 'Radius 0 · viiva 1 px · ei varjoja',
    title: 'System',
    /* Ingressi kertoo ensikertalaiselle, mikä sivu on ja miksi sillä
       on väliä. Build-huomio on sen alla todisteena. */
    lede: 'Tämän portfolion design system on sama koodissa, Figmassa ja AI-työkaluissa. Tällä sivulla näkyy jokainen väri, mitta ja komponentti, jota sivusto käyttää.',
    kerroksetLabel:
      'Tämä sivusto purettuna kolmeen kerrokseen: tokenit, komponentit ja valmis sivu.',
    kerrokset: ['01 Tokenit', '02 Komponentit', '03 Sivu'],
    layersTitle: '00 — Kerroksina',
    layersNote:
      'Sama sivu kolmena kerroksena. Kerrokset ovat sivuston omaa koodia, eivät kuvia. Värit ja mitat tulevat design systemistä, ja komponentit ovat samat, joita sivusto käyttää. Kun token muuttuu, tämäkin sivu muuttuu.',
  },

  showcase: {
    label: 'Listarivi neljästä suunnasta',
    figmaHeading: 'Komponentti Figmassa',
    codeConnectHeading: 'Code Connect -kytkentä',
    name: 'Nimi',
    /* Keskimmäisen näyterivin meta ei ole sisältöä vaan selite siitä
       mitä rivi demonstroi. */
    hoverDemo: 'Avattu rivi, käännetty',
    tabView: 'Näkymä',
    tabCode: 'Koodi',
    states: 'Tilat',
    statesValue: 'Perustila · osoitin rivin päällä · näppäimistöfokus · painallus kosketusnäytöllä',
    sizes: 'Koot',
    sizesValue: 'Alle 600 px pinottu, siitä ylöspäin yksi rivi',
    usedIn: 'Käytössä',
    usedInValue: 'Etusivu · työlistaus · aiemmat työt · tämä näkymä',
    tokenNote: '{n} tokenia, ei yhtään kovakoodattua arvoa',
    lines: 'riviä',
    styleNote: 'Jokainen väri, väli ja viiva tulee tokenista, joten tumma teema ei tarvitse omaa sääntöä.',
    storyNote: 'Story ei ole erillinen kuvaus komponentista. Se on sama komponentti, jota tämä sivu käyttää, eri tiloissaan.',
    storiesTitle: 'Tilat joita ylläpidetään ({n})',
    storiesNote:
      'Jokainen tila avataan oikeassa selaimessa ja tarkistetaan koneellisesti aina kun sivustoa julkaistaan. Jos kontrasti, kosketuskohteen koko tai ruudunlukijan näkemä nimi rikkoutuu yhdessäkin tilassa, julkaisu pysähtyy siihen.',
    variant: 'Variantti',
    breakpointValue: 'base · sm+ — @media-katko, ei propsi, joten sitä ei kartoiteta koodiin.',
    props: 'Propsit',
    tokensLabel: 'Tokenit tässä komponentissa ({n})',
    tokensValue: 'Tokeneilla on Figmassa samat nimet kuin koodissa, joten suunnittelija ja kehittäjä puhuvat samoista asioista.',
    variantsNote:
      'Variantit ja propsit luetaan kytkentätiedostosta, ei kirjoiteta tähän: siellä ne ovat siinä muodossa jota Figma oikeasti käyttää. Jos kytkentä muuttuu, tämä lista muuttuu mukana.',
    connectNote:
      'Tämä on repon tiedosto sellaisenaan, ei esimerkki. Se kertoo Figmalle mikä koodikomponentti vastaa mitä, jolloin Dev Mode näyttää suunnittelijalle oikean käyttötavan arvatun rakenteen sijaan. Kytkennän eheyden tarkistaa',
    connectNoteEnd: 'jokaisessa buildissa.',
  },

  common: {
    role: 'Rooli',
    /* Näkyy vain kehityksessä: tuotannossa täydentämätön kohta
       jätetään pois. Silti sanakirjassa, koska se on näkyvää tekstiä. */
    todo: 'Täydennettävä',
    /* Vastuujako. Olivat ennen kovakoodattuina PreviousWorkissa,
       jolloin ne olisivat jääneet suomeksi englanninkieliselle
       sivulle. */
    responsible: 'Vastuullani',
    contributed: 'Osallistuin',
    /* Ennen/jälkeen-kuvaparin kahvan otsikot. */
    before: 'Ennen',
    after: 'Jälkeen',
    clients: 'Asiakkaita',
    toBeAdded: 'Täydennetään',
    /* Videon toistonappi. */
    play: 'Toista',
    pause: 'Pysäytä',
  },
} as const;

/** `as const` tekee arvoista literaaleja; muut kielet tarvitsevat
    saman rakenteen merkkijonoina. */
type Laajenna<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Laajenna<U>[]
    : T extends object
      ? { readonly [K in keyof T]: Laajenna<T[K]> }
      : T;

export type Dictionary = Laajenna<typeof fi>;
export default fi;
