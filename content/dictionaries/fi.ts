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
      'Suunnittelen käyttöliittymät ja koodaan ne tuotantoon. Senior Designer, Helsinki.',
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
  },

  home: {
    name: 'Veli-Matti Pokela',
    nameLines: ['Veli-Matti', 'Pokela'],
    role: 'Senior Designer, Helsinki',
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
    subtitle: 'Neljä kärkeä · aiempi työ',
    previous: 'Aiempi työ',
    previousHint: 'Avautuu sivulla',
    nextCase: 'Seuraava case',
    open: 'Avaa',
    close: 'Sulje',
  },

  about: {
    titleLines: ['Veli-Matti', 'Pokela'],
    lede:
      'Senior Designer, Helsinki. Teen konsepteja, käyttöliittymiä ja niiden front end -toteutuksen.',
    body:
      'Olen tehnyt tuotesuunnittelua, palvelumuotoilua ja front end -kehitystä vuodesta 2010, usein samassa projektissa. Työ alkaa yleensä liiketoiminnan ja käyttäjien tarpeista ja päättyy responsiiviseen, koodattuun käyttöliittymään. Laajasta ja monipuolisesta roolista on ollut hyötyä varsinkin pienissä tiimeissä, joissa yksi ihminen tekee monta asiaa.',
    contact: 'Ota yhteyttä',
    /* Ei "Lataa PDF": PDF:ää ei ole eikä tehdä. Sivu tulostuu
       CV:ksi, ja selain tekee siitä tiedoston jos lukija haluaa. */
    printCv: 'Tulosta CV',
    /* Näkyy vain paperilla: ruudulla yhteystiedot ovat napissa ja
       footerissa, joista kumpikaan ei tulostu. */
    printRole: 'Senior Designer',
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
    lede: 'Design system on tämän portfolion yhteinen kieli, jolla Figma, koodi ja AI tekevät samaa sivustoa. Tällä sivulla se on näkyvissä sellaisenaan: jokainen väri, mitta ja komponentti on sama, jota sivusto käyttää.',
    kerroksetLabel:
      'Tämä sivusto purettuna kolmeen kerrokseen: tokenit, komponentit ja valmis sivu.',
    kerrokset: ['01 Tokenit', '02 Komponentit', '03 Sivu'],
    layersTitle: '00 — Kerroksina',
    layersNote:
      'Sama sivu kolmena kerroksena. Kerrokset ovat sivuston omaa koodia, eivät kuvia: värit ja mitat luetaan tokens.json:sta buildin aikana ja komponentit ovat samat, joita sivu käyttää. Kun token muuttuu, tämäkin sivu muuttuu.',
  },

  showcase: {
    label: 'Listarivi neljästä suunnasta',
    figmaHeading: 'Komponentti Figmassa',
    codeConnectHeading: 'Code Connect -kytkentä',
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
