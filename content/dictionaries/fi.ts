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
    title: 'Veli-Matti Pokela — Senior Designer',
    description:
      'Suunnittelen käyttöliittymät ja koodaan ne tuotantoon. Senior Designer Helsingissä.',
    skipToContent: 'Siirry sisältöön',
  },

  nav: {
    work: 'Työt',
    about: 'Tietoa',
    system: 'System',
    contact: 'Ota yhteyttä',
    menu: 'Valikko',
    close: 'Sulje',
    theme: 'Teema',
    themeLight: 'Vaalea',
    themeDark: 'Tumma',
    themeSystem: 'Auto',
  },

  home: {
    name: 'Veli-Matti Pokela',
    nameLines: ['Veli-', 'Matti', 'Pokela'],
    role: 'Senior Designer, Helsinki',
    /** TODO: oikea saatavuustieto. Ei näytetä ennen kuin se on tiedossa. */
    availability: null as string | null,
    statement: 'Suunnittelen käyttöliittymiä ja koodaan ne itse tuotantoon asti.',
    lede:
      'Viimeisimmät kaksi projektia ovat Colliers Asunnot ja oma tuotteeni Blokbook. Kummassakin suunnittelin ja toteutin käyttöliittymän suoraan koodissa.',
    aboutLink: 'Tietoa minusta',
    selectedWork: 'Valitut työt',
    alsoWorked: 'Muita aiempia töitä',
    allWork: 'Katso kaikki työt',
    bandTitle: 'Teen yleensä sekä suunnittelun että toteutuksen.',
    bandBody:
      'Design system, tuotesuunnittelu ja front end. Projektista riippuen yksi näistä tai kaikki kolme.',
  },

  work: {
    title: 'Työt',
    subtitle: 'Kolme kärkeä · aiempi työ',
    previous: 'Aiempi työ',
    previousHint: 'Avautuu sivulla',
    alsoLabel: 'Lisäksi',
    outroTitle: 'Kaikki työ ei mahdu sivulle.',
    outroBody:
      'Käyn projektit ja niiden ratkaisut läpi mielelläni tarkemmin keskustelussa.',
    outroCta: 'Pyydä esittely',
    nextCase: 'Seuraava case',
    open: 'Avaa',
    close: 'Sulje',
  },

  about: {
    titleLines: ['Veli-Matti', 'Pokela'],
    lede:
      'Senior Designer Helsingissä. Teen konsepteja, käyttöliittymiä ja niiden front end -toteutuksen.',
    body:
      'Olen tehnyt tuotesuunnittelua, palvelumuotoilua ja front end -kehitystä vuodesta 2010, usein samassa projektissa. Työ alkaa yleensä liiketoiminnan ja käyttäjien tarpeista ja päättyy responsiiviseen, koodattuun käyttöliittymään. Siitä on ollut hyötyä varsinkin pienissä tiimeissä, joissa yksi ihminen kattaa useamman roolin.',
    contact: 'Ota yhteyttä',
    /* Ei "Lataa PDF": PDF:ää ei ole eikä tehdä. Sivu tulostuu
       CV:ksi, ja selain tekee siitä tiedoston jos lukija haluaa. */
    printCv: 'Tulosta CV',
    /* Näkyy vain paperilla: ruudulla yhteystiedot ovat napissa ja
       footerissa, joista kumpikaan ei tulostu. */
    printRole: 'Senior Designer',
    portraitAlt: 'Veli-Matti Pokela',
    servicesTitle: 'Mitä teen',
    historyTitle: 'Työhistoria',
    historySince: 'Vuodesta 2010',
    toolsTitle: 'Työkalut',
    educationTitle: 'Koulutus ja kielet',
  },

  footer: {
    ctaLines: ['Otetaan', 'yhteyttä'],
    email: 'veli-matti@pokela.fi',
    location: 'Helsinki, FI',
    linkedin: 'LinkedIn',
    linkedinUrl: 'https://www.linkedin.com/in/velimattipokela/',
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
    listRowHint: 'list-row — vie osoitin päälle',
    title: 'System',
    kerroksetLabel:
      'Tämä sivusto purettuna kolmeen kerrokseen: tokenit, komponentit ja valmis sivu.',
    kerrokset: ['01 Tokenit', '02 Komponentit', '03 Sivu'],
    layersTitle: '00 — Kerroksina',
    layersMeta: 'Vie osoitin päälle, klikkaa',
    layersNote:
      'Sama sivu kolmena kerroksena. Kerrokset ovat sivuston omaa koodia, eivät kuvia: värit ja mitat luetaan tokens.json:sta ja komponentit ovat samat, joita sivu käyttää. Kun vierität ohi, kerrokset painuvat yhdeksi sivuksi.',
  },

  showcase: {
    label: 'Listarivi neljästä suunnasta',
    figmaHeading: 'Komponentti Figmassa',
    codeConnectHeading: 'Code Connect -kytkentä',
    elsewhere: 'Sama komponentti muualla',
    name: 'Nimi',
    /* Keskimmäisen näyterivin meta ei ole sisältöä vaan selite siitä
       mitä rivi demonstroi. */
    hoverDemo: 'Avattu rivi, käännetty',
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
  },
} as const;

export type Dictionary = typeof fi;
export default fi;
