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
    role: 'Senior Designer — suunnittelen käyttöliittymät ja koodaan ne tuotantoon',
    /** TODO: oikea saatavuustieto. Ei näytetä ennen kuin se on tiedossa. */
    availability: null as string | null,
    heroCaption: 'Täysleveä kuva 21:9 — työn hero tai valokuva',
    statement: 'Rakennan tuotteita, jotka toimivat myös silloin kun demo on ohi.',
    lede:
      'Suunnittelen käyttöliittymät ja kirjoitan ne itse tuotantoon. Viimeisimmät kaksi projektia: Colliers Asunnot ja oma tuotteeni Blokbook — molemmissa design syntyi suoraan koodissa.',
    aboutLink: 'Tietoa minusta',
    selectedWork: 'Valitut työt',
    alsoWorked: 'Muita aiempia töitä',
    allWork: 'Katso kaikki työt',
    bandTitle: 'Sama ihminen piirtää ja rakentaa.',
    bandBody:
      'Design system, tuotesuunnittelu ja frontend-toteutus — tarpeen mukaan kaikki kolme.',
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
      'Senior Designer Helsingissä. Olen yhtä kotonani varhaisen konseptin luonnostelussa, käyttöliittymän suunnittelussa ja sen koodaamisessa toimivaksi ratkaisuksi.',
    body:
      'Olen tehnyt tuotesuunnittelua, palvelumuotoilua ja front end -kehitystä vuodesta 2010 — usein samassa projektissa. Ymmärrän sekä liiketoiminnan että käyttäjän, kuvaan palvelun ja käyttöliittymän, ja muutan sen responsiiviseksi koodatuksi ratkaisuksi. Se monipuolisuus on se mikä pitää asiat liikkeessä ja auttaa tiimejä etenemään nopeammin.',
    contact: 'Ota yhteyttä',
    downloadCv: 'Lataa CV (PDF)',
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

  common: {
    role: 'Rooli',
    clients: 'Asiakkaita',
    toBeAdded: 'Täydennetään',
  },
} as const;

export type Dictionary = typeof fi;
export default fi;
