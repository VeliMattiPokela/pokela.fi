import type { Cv } from './fi';

/** Työhistoria, työkalut ja koulutus englanniksi (päätös 60). */
const cv: Cv = {
  services: [
    {
      number: '01',
      title: 'Product and service',
      body: 'UX/UI design, service design, concept work, user flows and requirements.',
    },
    {
      number: '02',
      title: 'Build',
      body: 'Design systems in code, front-end development, interactive prototypes and AI-assisted development.',
    },
    {
      number: '03',
      title: 'Research',
      body: 'User interviews, usability testing, accessibility and user-centered development.',
    },
  ],
  jobs: [
    {
      period: '2021 —',
      title: 'Senior Designer',
      company: 'Loihde Factor Oy',
      projects: [
        {
          name: 'Colliers Asunnot',
          body: 'Rental housing service. Design, front end, CMS, design system in code',
        },
        {
          name: 'OP — Op.fi and channel apps',
          body: 'Online and mobile banking. Concept work, usability testing, end-user interviews, accessibility',
        },
        {
          name: 'Pivo — mobile payment app',
          body: 'iOS and Android, 1.2 million users. Service design and UX/UI, improving the handoff process',
        },
        {
          name: 'OP Opas — card application redesign',
          body: 'Internal tool for bank staff. Staff interviews, a streamlined application flow, concept and prototype',
        },
      ],
    },
    {
      period: '2025 —',
      company: 'Blokbook Oy',
      projects: [
        {
          name: 'Blokbook — own product and company',
          body: 'Booking and management service for shared spaces. Product design, UX/UI and technical build',
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
          body: 'Real-time service monitoring for business customers. UI/UX, front end, design system',
        },
        {
          name: 'OP Pohjola — Vahinkoapuri',
          body: 'Conversational claims report. Prototypes and usability testing',
        },
        {
          name: 'OP Pohjola — usage-based car insurance',
          body: 'Pilot campaign site, user flow and infographics',
        },
        {
          name: 'Evira — services for veterinarians and animal keepers',
          body: 'Digital services. UX/UI, front end, usability testing',
        },
        {
          name: 'Microsoft — marketing reporting',
          body: 'Analytics report visualization and template',
        },
      ],
    },
    {
      period: '2010 — 2015',
      title: 'Product Designer',
      company: 'Sanoma Digital Oy',
      projects: [
        {
          name: 'Oikotie Asunnot — web and mobile services',
          body: 'Product design, concept work, usability and analytics. Design and project management of native iOS and Android apps',
        },
      ],
    },
  ],
  jobsFootnote: 'Also Finavia, Ilta-Sanomat, Fennia and Caverion.',
  tools: [
    { label: 'Design', items: 'Figma, FigJam, Storybook' },
    { label: 'Code', items: 'React, Next.js, TypeScript, HTML, CSS, Vue, Git, GitHub' },
    { label: 'AI and dev tools', items: 'Claude, Claude Code, ChatGPT, Cursor, VS Code' },
    { label: 'Other', items: 'Supabase, Strapi, Photoshop, Lightroom, After Effects' },
  ],
  education: [
    { label: 'Bachelor of Engineering, media technology', items: '2010' },
    { label: 'Web Accessibility Certificate', items: 'W3Cx' },
    { label: 'Languages', items: 'Finnish (native), English (fluent), Swedish (basic)' },
  ],
};

export default cv;
