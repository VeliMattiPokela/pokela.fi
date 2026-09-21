/**
 * Työhistoria, työkalut ja koulutus.
 *
 * Roolikuvaukset ovat käännöksiä CV:stä — README merkitsee ne
 * tarkistettaviksi. Ne on jätetty sellaisiksi kuin ne olivat, ei
 * sievennetty.
 */

export type Job = {
  period: string;
  title: string;
  company: string;
  projects: { name: string; body: string }[];
};

const services = [
  {
    number: '01',
    title: 'Tuote ja palvelu',
    body: 'Käyttäjäkeskeinen UX/UI, palvelumuotoilu, käyttäjäpolut ja vaatimusmäärittely.',
  },
  {
    number: '02',
    title: 'Toteutus',
    body: 'Koodipohjainen design system, front end tuotantoon, interaktiiviset prototyypit.',
  },
  {
    number: '03',
    title: 'Tutkimus',
    body: 'Käytettävyystestaus ja auditointi, asiakashaastattelut, saavutettavuus.',
  },
];

const jobs: Job[] = [
  {
    period: '2021 —',
    title: 'Senior Designer',
    company: 'Loihde Factor Oy',
    projects: [
      {
        name: 'Colliers Asunnot',
        body: 'Vuokra-asuntopalvelu — design, front end, CMS, koodipohjainen design system',
      },
      {
        name: 'OP — Op.fi ja kanavasovellukset',
        body: 'Verkko- ja mobiilipankki. Konseptointi, käytettävyystestaus, loppukäyttäjähaastattelut, saavutettavuus',
      },
      {
        name: 'Pivo — mobiilimaksusovellus',
        body: 'iOS ja Android, 1,2 milj. käyttäjää. Palvelumuotoilu ja UX/UI, handoff-prosessin kehittäminen',
      },
      {
        name: 'OP Opas — korttihakemusprosessin uudistus',
        body: 'Virkailijoiden sisäinen työkalu. Haastattelut virkailijoiden kanssa, hakemuspolun virtaviivaistus, konsepti ja prototyyppi',
      },
    ],
  },
  {
    period: '2015 — 2021',
    title: 'UX Designer',
    company: 'Siili Solutions Oyj',
    projects: [
      {
        name: 'Elisa Aisti',
        body: 'Palveluiden reaaliaikainen seuranta yritysasiakkaille. UI/UX, front end, design system',
      },
      {
        name: 'OP Pohjola — Vahinkoapuri',
        body: 'Keskustelunomainen vahinkoilmoitus. Prototyypit ja käytettävyystestaus',
      },
      {
        name: 'OP Pohjola — ajotapaan perustuva vakuutus',
        body: 'Pilotin kampanjasivusto, käyttäjäpolku ja infografiikka',
      },
      {
        name: 'Evira — palvelut eläinlääkäreille ja eläintenpitäjille',
        body: 'Digitaaliset asiointipalvelut. UX/UI, front end, käytettävyystestaus',
      },
      {
        name: 'Microsoft — markkinoinnin raportointi',
        body: 'Analytiikkaraportin visualisointi ja mallipohja',
      },
    ],
  },
  {
    period: '2010 — 2015',
    title: 'Product Designer',
    company: 'Sanoma Digital Oy',
    projects: [
      {
        name: 'Oikotie Asunnot — palvelu',
        body: 'Suomen suurin asuntoilmoitusten palvelu. Tuotesuunnittelu, konsepti, käytettävyys',
      },
      {
        name: 'Oikotie Asunnot — iOS ja Android',
        body: 'Natiivisovellukset. Designer ja projektipäällikkö',
      },
    ],
  },
];

const jobsFootnote =
  'Lisäksi Blokbook (oma tuote, 2024 —), Finavia, Ilta-Sanomat, Fennia ja Caverion.';

const tools = [
  { label: 'Design', items: 'Figma, Storybook, Sketch, InVision' },
  { label: 'Koodi', items: 'Next.js, React, TypeScript, HTML, CSS, Vue, Strapi' },
  { label: 'Muu', items: 'Photoshop, Lightroom, After Effects, Ableton, Logic Pro' },
];

const education = [
  { label: 'Insinööri (AMK), mediatekniikka', items: '2010' },
  { label: 'Web Accessibility Certificate', items: 'W3Cx, kesken' },
  { label: 'Kielet', items: 'suomi (äidinkieli), englanti (sujuva), ruotsi (perusteet)' },
];

const cv = { services, jobs, jobsFootnote, tools, education };
export type Cv = typeof cv;
export default cv;
