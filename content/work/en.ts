import type { Work, Lead, Previous } from './fi';

/**
 * Työt englanniksi. Sama rakenne ja samat kuvapaikat kuin fi.ts:ssä
 * (päätös 60).
 */

const leads: Lead[] = [
  {
    slug: 'colliers',
    number: '01',
    title: 'Colliers Asunnot',
    tagline: 'A rental housing service designed in code',
    lede:
      'An end-to-end rental housing service: home search, online leasing and content management. I designed the service and built its front end.',
    meta: 'Design, front end, CMS',
    next: 'blokbook',
  },
  {
    slug: 'blokbook',
    number: '02',
    title: 'Blokbook',
    tagline: 'From a problem in my own building to a product for sale',
    lede:
      'Booking and payments for shared spaces in housing companies, on web, iOS and Android. My own product and company.',
    meta: 'Founder · product, design, build',
    next: 'portfolio',
  },
  {
    slug: 'portfolio',
    number: '03',
    title: 'Pokela.fi – Portfolio',
    tagline: 'A portfolio that shows how it was made',
    lede:
      'The portfolio was designed and built in code. The design system is the same in code and in Figma, and the Storybook, Code Connect mappings and checks are public.',
    meta: 'Design, front end, design system',
    next: 'himat',
  },
  {
    slug: 'himat',
    number: '04',
    title: 'Himat',
    tagline: 'From a listing to a clear buying decision',
    lede:
      'A service for home buyers: a listing link turns into a property view that shows the risks, the costs and what the home would mean for your finances. My own product, in pilot as a beta.',
    meta: 'Own product · product, design, build',
    next: 'colliers',
  },
];

const previous: Previous[] = [
  {
    slug: 'pivo',
    number: '05',
    title: 'Pivo',
    tagline: 'A payment app for 1.2 million users',
    meta: 'Service design · UX/UI',
    detail: {
      heading: 'A payment app for over a million users',
      intro:
        'Pivo is OP’s mobile payment app for sending money, splitting shared costs and paying online. It has 1.2 million users on iOS and Android.',
      roleTitle: 'Service Designer / UX/UI Designer',
      roleNote: 'iOS and Android. Prototypes were tested with customers before development.',
      responsible: [
        'Interface and interaction design',
        'Early concept work',
        'User research: interviews, surveys, analytics, testing',
        'Accessibility',
      ],
      contributed: [
        'Improving design-to-dev practices',
        'Working with business, development, marketing and data',
      ],
      sectionsTitle: 'Work on Pivo',
      sections: [
        {
          title: 'User research and concepts',
          body: 'Interviews, surveys, analytics and usability tests. They shaped the concepts for new features before any screens were finalized.',
        },
        {
          title: 'Interface and interactions',
          body: 'Screens and interactions for iOS and Android. Prototypes were tested with customers before development, and animations were designed together with the rest of the interface.',
        },
        {
          title: 'Accessibility across the app',
          body: 'We went through the app screen by screen and fixed color contrast, touch target sizes and screen reader support. After that, accessibility became part of the team’s everyday work.',
        },
        {
          title: 'From design to build',
          body: 'I improved how the team handed design over to development. That is where my interest in designing directly in code began.',
        },
      ],
      hero: {
        items: [
          { id: 'pivo-ryhma', kind: 'video', ratio: '3:4', caption: 'Creating a group: a ready template, members and the first expense' },
          { id: 'pivo-kulut', kind: 'video', ratio: '3:4', caption: 'Group expenses: the card lifts on touch, and the split expense moves into the list' },
          { id: 'pivo-reaktio', kind: 'video', ratio: '3:4', caption: 'An incoming payment: a reaction is picked by swiping along the bar' },
        ],
      },
      media: [
        {
          title: 'Accessibility before and after',
          intro:
            'The whole app was reviewed for accessibility. The sign-in screen shows how the app looked before the improvements and after them.',
          items: [
            {
              id: 'pivo-kirjautuminen',
              kind: 'compare',
              ratio: '3:4',
              caption:
                'Sign-in before and after: light text on a saturated gradient failed contrast requirements, letter-spaced capitals slowed reading, and typed characters showed only as thin dots.',
            },
          ],
        },
      ],
    },
  },
  {
    slug: 'elisa-aisti',
    number: '06',
    title: 'Elisa Aisti',
    tagline: 'A status overview service for Elisa’s business customers',
    meta: 'UI/UX · Concept · Front end',
    detail: {
      heading: 'A status overview you can read at a glance',
      intro:
        'Elisa is one of Finland’s largest telecom operators. The goal was to renew its status overview service for business customers, which had fallen behind technically and visually and no longer met users’ needs. The new version built on earlier research, extended with new interviews and usability tests.',
      roleTitle: 'UI/UX Designer',
      roleNote: 'Paired with a service designer and the development team. The concept and interface were tested with end users before development.',
      responsible: [
        'Product UI/UX design',
        'User research and usability testing',
        'Research analysis',
      ],
      contributed: ['Concept design', 'Customer interviews', 'Front-end build'],
      sectionsTitle: 'Solution',
      sections: [
        {
          title: 'Real-time monitoring',
          body: 'Business customers see the status of their services and connections in real time, follow trends and anticipate problems.',
        },
        {
          title: 'Plain language and alerts',
          body: 'Data is shown in simple visualizations. The system alerts on anomalies and suggests what to do next.',
        },
        {
          title: 'Transparent incidents',
          body: 'Tickets got more detailed information and a time estimate for each stage. Users know what is happening and when.',
        },
        {
          title: 'Dark theme, every screen size',
          body: 'The system stays open for long stretches, so a dark theme was chosen because it is easier on the eyes. The service works from mobile to desktop.',
        },
      ],
      hero: {
        items: [{ id: 'aisti-laitteet', kind: 'image', ratio: '4:3', caption: 'The site view on desktop, tablet and phone' }],
      },
      media: [],
    },
  },
  {
    slug: 'op-vahinkoapuri',
    number: '07',
    title: 'OP Vahinkoapuri',
    tagline: 'A conversational claims report',
    meta: 'UI/UX · Concept · Testing',
    detail: {
      heading: 'The form became a conversation',
      intro:
        'OP Pohjola wanted a new way to report insurance claims. The old report was confusing, so customers called or filled in a paper form. That loaded customer service and frustrated both sides. Underneath was another problem: the system produced no structured data, so claims handling was slow and manual.',
      roleTitle: 'UI/UX Designer',
      roleNote: 'Close collaboration with the development team throughout the project.',
      responsible: [
        'UI/UX of the conversational claims service',
        'UI prototypes',
        'Validation through usability testing with end users',
      ],
      contributed: ['Early concept work', 'Customer interviews', 'Service design phases'],
      sectionsTitle: 'Solution',
      sections: [
        {
          title: 'A conversational flow',
          body: 'The app replaced all the old forms. Users pick ready-made answers with a single tap.',
        },
        {
          title: 'Adapts to the answers',
          body: 'The flow takes shape from the answers: only the relevant questions, and picking the wrong form is no longer possible.',
        },
        {
          title: 'Tested before build',
          body: 'The claims flow was validated with usability tests with end users before development started.',
        },
        {
          title: 'Structured data',
          body: 'The redesign also changed what the report leaves in the system. Structured data reduced manual work and sped up claims handling.',
        },
      ],
      hero: {
        items: [{ id: 'op-laitteet', kind: 'image', ratio: '4:3', caption: 'Starting a claim on a tablet and the damage picker on a phone' }],
      },
      media: [],
    },
  },
];

const work: Work = { leads, previous };
export default work;
