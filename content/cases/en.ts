import type { Case, CaseRef } from './types';

/**
 * Kärkicaset englanniksi. Sama rakenne, samat kuvapaikat ja sama
 * järjestys kuin fi.ts:ssä, mutta teksti on kirjoitettu englanniksi
 * uudelleen eikä käännetty lause lauseelta. Termistö ja sävy on
 * sovittu Vellun kanssa (päätös 60).
 */

const colliers: Case = {
  slug: 'colliers',
  eyebrow: 'Case 01 · 2026 · Colliers',
  title: 'Colliers Asunnot',
  tagline: 'A rental housing service designed directly in code.',
  facts: [
    { label: 'Role', value: 'Senior Designer · design, front end, CMS' },
    { label: 'Duration', value: '8 months from concept to launch' },
    { label: 'Team', value: 'Small cross-functional team' },
    { label: 'Stack', value: 'Next.js, React, TypeScript, Storybook, Strapi' },
  ],
  blocks: [
    {
      kind: 'media',
      media: {
        id: 'colliers-hero',
        ratio: 'hero',
        caption: 'The listing page, large: sharp, deliberately cropped, at least 2800 px wide',
      },
    },
    {
      kind: 'text',
      label: 'Starting point',
      items: [
        {
          p: 'The service had been running for years, and its technology, look and user experience were due for renewal. At the same time, the business needed new features that called for a new foundation.',
        },
        {
          h: 'Brief',
          p: 'A new service in eight months: home search, online leasing, content management and a modernized brand. I designed the service and built its front end, so design decisions went straight into the product.',
        },
      ],
    },
    {
      kind: 'text',
      label: 'Decision',
      lead: 'Design happened directly in code',
      items: [
        {
          h: 'Choice',
          p: 'The first step was a clickable wireframe built in code. The design system and layouts were built in Storybook as code, not in Figma.',
        },
        {
          h: 'Why',
          p: 'A service running in the browser shows right away how it feels to use, and every design decision is already production code. The client could see and try the service from the start.',
        },
        {
          h: 'Effect',
          p: 'The client gave feedback on a working service in the browser. Agreed changes were ready for the next review.',
        },
      ],
    },
    {
      kind: 'compare',
      label: 'Week 1 → launch',
      id: 'colliers-runko',
      ratio: '4:3',
      tarveLeveys: 1344,
      beforeLabel: 'Wireframe in code',
      afterLabel: 'Launch',
      caption:
        'The listing page as a coded wireframe in week 1 and at launch. The wireframe was used to agree on the idea and the whole, and the final view was built on top of it.',
    },
    {
      kind: 'band',
      title: 'We iterated on working code, not pictures',
      body: 'A clickable skeleton was in the browser within the first weeks: search flows, the application flow, online leasing, the front page and the listing page. It also carried the project’s communication, because the whole was visible before the visual design was finished.',
    },
    {
      kind: 'trio',
      surface: 'tint',
      label: 'What was built',
      title: 'Home search, leasing and content management',
      items: [
        {
          media: { id: 'colliers-haku', ratio: '4:5', caption: 'AI search: a written description and its results' },
          h: 'Home search with AI and a map',
          p: 'Users can describe the home they are looking for in their own words, or search on a map. I was responsible for the interface and the front-end build.',
        },
        {
          media: { id: 'colliers-vuokraus', ratio: '4:5', caption: 'The Rent now flow, one step' },
          h: 'Rent now: leasing online',
          p: 'A multi-step flow for renting a home online from start to finish. Design and build were iterated directly in code.',
        },
        {
          media: { id: 'colliers-strapi', ratio: '4:5', caption: 'The Strapi editor while editing content' },
          h: 'Content management and white label',
          p: 'Strapi-based content management lets marketing build its own landing pages, in a partner’s branding when needed. I designed and built dozens of Strapi components and their variants. They combine into page templates for different needs, such as marketing campaigns and content pages.',
        },
      ],
    },
    {
      kind: 'text',
      surface: 'tint',
      label: 'Design system',
      lead: 'The design system lives in code',
      items: [
        {
          p: 'Tokens, components and layouts live in Storybook. There was no separate Figma file, so the documentation always matches the code in production.',
        },
        {
          p: 'Every release passes automated tests and strict type checking, and each move to production is approved separately. Accessibility and visual changes are checked in Storybook as components are built.',
        },
      ],
    },
    {
      kind: 'text',
      label: 'Approach',
      items: [
        {
          p: 'I chose a UX engineering approach because the quality of the service only showed in use: search flows, leasing steps and CMS components had to be tried in the browser, not as pictures. With design and build in the same code, nothing is lost between design and implementation, and every decision is seen right away in the form the user meets it. The same approach made the eight-month schedule possible.',
        },
      ],
    },
    { kind: 'todo', text: '"What I would do differently": one honest sentence makes the case more credible.' },
    {
      kind: 'text',
      label: 'Outcome',
      lead: 'The service is live and in use',
      items: [
        { p: 'colliersasunnot.com', href: 'https://colliersasunnot.com' },
      ],
    },
    { kind: 'todo', text: 'Client quote: one sentence, name and title. Waiting for permission.' },
  ],
  next: { slug: 'blokbook', title: 'Blokbook' },
};

const blokbook: Case = {
  slug: 'blokbook',
  eyebrow: 'Case 02 · Own product',
  title: 'Blokbook',
  tagline: 'From a problem in my own building to a product for sale.',
  facts: [
    { label: 'Role', value: 'Founder · product design · development' },
    { label: 'Status', value: 'Live, in use in several housing companies' },
    { label: 'Platforms', value: 'Web, iOS, Android' },
    { label: 'Stack', value: 'Vue, TypeScript, Storybook, Supabase, Capacitor, Stripe' },
  ],
  blocks: [
    {
      kind: 'media',
      media: {
        id: 'blokbook-hero',
        ratio: 'hero',
        caption:
          'Blokbook on a phone: laundry room and sauna slots, card payment, remote door opening and chat.',
      },
    },
    {
      kind: 'text',
      label: 'Why',
      items: [
        {
          p: 'In Finnish housing companies, saunas, laundry rooms, club rooms and parking spaces are still booked on a list on the wall, and payments are handled separately. I looked for a service to fix this in my own building, and there was nothing suitable.',
        },
        {
          h: 'What it became',
          p: 'A booking and management service where bookings, payments, access control and other smart control of shared spaces live in one system. Property managers and boards no longer do the manual work. Now in use in several housing companies.',
        },
      ],
    },
    {
      kind: 'text',
      label: 'Decision',
      lead: 'Built for my own building first',
      items: [
        {
          h: 'Choice',
          p: 'The starting point was a familiar problem of my own, not a separate market study. The first user was my own housing company.',
        },
        {
          h: 'Why',
          p: 'Real use showed quickly what works. The service ran in production with real bookings and real payments before it was sold to anyone.',
        },
        {
          h: 'Effect',
          p: 'The concept matured in use and grew: from a web app to native iOS and Android apps, and from one housing company to a product.',
        },
      ],
    },
    {
      kind: 'todo',
      text: 'Two perspectives: the resident’s booking view and the management view of the same space side by side, once real screenshots are available.',
    },
    {
      kind: 'text',
      label: 'From design to build',
      items: [
        {
          p: 'In Blokbook, the interfaces, booking rules and technical implementation evolve together. While designing the experience, I also define what the system has to do and how information moves between residents and management.',
        },
        {
          p: 'A shared codebase and design system keep the interfaces consistent on web, iOS and Android.',
        },
        {
          p: 'Every change passes automated tests and accessibility, security and design system checks before release.',
        },
      ],
    },
    {
      kind: 'scope',
      surface: 'tint',
      label: 'Responsibilities',
      title: 'From concept to customer support',
      body: 'Every part of the product, from the business idea to pricing and maintenance.',
      items: [
        'Concept and business idea',
        'Brand and visual identity',
        'UX and interface',
        'Design system and Storybook',
        'Front end',
        'Back end and database',
        'Infrastructure and release',
        'Pricing and productization',
        'Support and maintenance',
      ],
    },
    {
      kind: 'trio',
      surface: 'tint',
      label: 'Three platforms',
      title: 'One service, three platforms',
      items: [
        {
          media: { id: 'blokbook-web', ratio: '3:4', caption: 'Web: the service’s front page' },
          levea: true,
          h: 'Web',
          p: 'The first platform. The design system and Storybook started here.',
        },
        {
          media: { id: 'blokbook-ios', ratio: '3:4', caption: 'iOS: the housing company’s home view' },
          h: 'iOS',
          p: 'A native app with the same components and the same look as the web.',
        },
        {
          media: { id: 'blokbook-android', ratio: '3:4', caption: 'Android: the sauna booking calendar' },
          h: 'Android',
          p: 'The same approach as at Colliers, plus a native mobile build.',
        },
      ],
    },
    {
      kind: 'text',
      label: 'Today',
      lead: 'The service is on the market, and development continues',
      items: [
        {
          p: 'Several housing companies use the service, and development continues.',
        },
        { p: 'blokbook.com', href: 'https://blokbook.com' },
      ],
    },
    {
      kind: 'todo',
      text: 'To add: launch year, number of housing companies (if it can be shared), a line from a property manager or board, "what I would do differently".',
    },
  ],
  next: { slug: 'portfolio', title: 'Pokela.fi – Portfolio' },
};

const thisSite: Case = {
  slug: 'portfolio',
  eyebrow: 'Case 03 · 2026 · Own portfolio',
  title: 'Pokela.fi – Portfolio',
  tagline: 'A portfolio that shows how it was made. It was designed in code, and Figma and AI tools use the same design system.',
  facts: [
    { label: 'Role', value: 'Design, front end, design system' },
    { label: 'Stack', value: 'Next.js, TypeScript, Storybook, Figma Code Connect' },
    { label: 'Public', value: 'Storybook, the Figma file and the code' },
  ],
  blocks: [
    {
      kind: 'media',
      media: {
        id: 'portfolio-prosessi',
        ratio: '4:3',
        caption: 'The process end to end: code, Figma, Storybook, checks, the site and Figma Make.',
      },
    },
    {
      kind: 'text',
      label: 'Starting point',
      items: [
        {
          h: 'Brief',
          p: 'The portfolio was meant to show the way of working in practice. In my own projects I often design directly in code, as UX engineering, but in client organizations the work often starts in Figma too. The goal was to show that both work.',
        },
      ],
    },
    {
      kind: 'text',
      label: 'Decision',
      lead: 'Code is the single source, and Figma follows it',
      items: [
        {
          h: 'Choice',
          p: 'The portfolio was built as a working design system. Figma and AI tools use the same values and components as the site.',
        },
        {
          h: 'Why',
          p: 'Work can start in code or in Figma, and neither falls behind. The same setup works in a client team where designers work in Figma.',
        },
      ],
    },
    {
      kind: 'choices',
      label: 'Two ways to start',
      title: 'Which one fits depends on the team',
      items: [
        {
          h: 'Code first',
          p: 'The fastest way when the team is small and the same person designs and codes. Changes go straight into the product.',
          note: 'This is how Colliers and Blokbook were made.',
        },
        {
          h: 'Figma first',
          p: 'Designers and stakeholders work in a familiar tool, and code still stays the source, because Code Connect links the components together. Figma Make builds prototypes from the same parts.',
          note: 'Most client projects start this way.',
        },
      ],
    },
    {
      kind: 'band',
      title: 'One design system in code, Figma and AI tools',
      body: 'Tokens, components and pages are the same code. The Figma library and Figma Make use the same parts as npm packages.',
      link: { label: 'View the design system', to: 'system' },
    },
    {
      kind: 'kerrokset',
      surface: 'tint',
      label: 'In layers',
      title: 'One page in three layers',
      body: 'Tokens at the bottom, the components built from them in the middle and the finished page on top. The layers are the site’s own code, not pictures.',
    },
    {
      kind: 'component',
      surface: 'tint',
      label: 'One component',
      title: 'One component from four angles',
      body: 'The list row is the site’s most characteristic component. Here it is finished, as code, in Storybook and in Figma.',
    },
    {
      kind: 'ketju',
      surface: 'tint',
      label: 'Process',
      title: 'The process step by step',
      body: 'The process runs from a company’s existing code and Figma to a change made in Figma Make being released in the product.',
    },
    {
      kind: 'checks',
      label: 'Checks',
      title: '{n} checks keep code and Figma in sync',
      note: 'A design system usually decays gradually, as code and Figma drift apart. Here every change goes through the checks, and if something doesn’t match, the change stops before release.',
      pending: {
        id: 'tulossa',
        title: 'Coming',
        note: 'The check is written but not run yet.',
      },
      paivitys: {
        title: 'Site update',
        note: 'Every update goes through the checks before release. This page is the result of the update below.',
        row: 'Latest update',
      },
    },
    {
      kind: 'text',
      label: 'Outcome',
      lead: 'The portfolio is both a work sample and a working design system',
      items: [
        {
          p: 'The page is built from the same components shown in Storybook and Figma. Tokens and components are published as npm packages, and every change goes through the same checks.',
        },
        {
          h: 'When this isn’t worth it',
          p: 'Keeping code and Figma in sync takes upkeep, and it pays off only when there are many components and several people. In a one-person project or a ten-component library, it’s wasted effort.',
        },
      ],
    },
    {
      kind: 'artefacts',
      label: 'Open and check',
      note: 'The links go to the real tools and files.',
    },
  ],
  next: { slug: 'himat', title: 'Himat' },
};

const himat: Case = {
  slug: 'himat',
  eyebrow: 'Case 04 · 2026 · Own product',
  title: 'Himat',
  tagline: 'Property portals help you find a home. Himat helps you understand what buying it would mean.',
  facts: [
    { label: 'Role', value: 'Own product · product, design, build' },
    { label: 'Status', value: 'Beta, limited external pilot' },
    { label: 'Platform', value: 'Web, mobile first' },
    { label: 'Stack', value: 'Next.js, TypeScript, Supabase, Claude' },
  ],
  blocks: [
    {
      kind: 'media',
      media: {
        id: 'himat-hero',
        ratio: 'hero',
        caption: 'From a listing link to a property page: Himat reads the listing, builds the cover and calculates the costs.',
      },
    },
    {
      kind: 'text',
      label: 'Starting point',
      items: [
        {
          p: 'Buying a home is the biggest financial decision most people make, but the information it takes is scattered: the listing in one service, the housing company’s documents as PDFs, the loan calculation on the bank’s site and personal finances in a spreadsheet. Current tools give buyers more data but don’t help them interpret it.',
        },
        {
          h: 'Brief',
          p: 'A service that takes interpretation work off the buyer. A listing link turns into a property view that shows right away what to notice and what the home would cost this particular household.',
        },
      ],
    },
    {
      kind: 'text',
      label: 'Decision',
      lead: 'AI reads and explains, code calculates and assesses',
      items: [
        {
          h: 'Choice',
          p: 'A language model extracts the facts from the listing and the housing company’s documents, classifies them and writes a summary. Calculations and assessment levels are done in tested code.',
        },
        {
          h: 'Why',
          p: 'In a home purchase, a wrong number is expensive. The model’s answer is checked against a schema and the source, and code rejects any summary whose numbers can’t be found in the source.',
        },
        {
          h: 'Effect',
          p: 'Every claim leads to a source or a calculation, and missing information is shown as missing, not guessed.',
        },
      ],
    },
    {
      kind: 'text',
      label: 'From link to decision',
      lead: 'A listing link is enough to start',
      items: [
        {
          p: 'Paste the listing link, and Himat reads the rest. The property cover tells the essentials first: what is good about the home and what still needs checking. Costs are calculated from the loan, the maintenance charges and the money needed at closing, and personal finances take three questions. When the housing company documents from the agent are added, the missing facts fill in with their sources.',
        },
      ],
    },
    {
      kind: 'pair',
      label: 'Finances and housing company',
      items: [
        {
          id: 'himat-talous',
          ratio: '3:4',
          label: 'Does it fit the budget',
          caption: 'Personal finances: income, household and savings in three questions',
        },
        {
          id: 'himat-paperit',
          ratio: '3:4',
          label: 'Housing company documents',
          caption: 'The maintenance needs report is read, and renovations show with their page numbers',
        },
      ],
    },
    {
      kind: 'band',
      title: 'Fact, calculation and assessment are kept apart',
      body: 'The buyer always sees what comes from a source, what is calculated and what is an assessment. That is why the interpretation can be trusted, and checked.',
    },
    {
      kind: 'text',
      label: 'Value proposition',
      lead: 'Less work for the buyer',
      items: [
        {
          h: 'Value before sign-in',
          p: 'The first home can be added and read without an account. An account is needed only to save or compare homes.',
        },
        {
          h: 'No single score',
          p: 'Cost level, financial headroom and fit are separate assessments, and the rule behind each one can be opened.',
        },
        {
          h: 'Uncertainty is visible',
          p: 'When information is missing, the service says so and tells where to get it, for example from the housing company’s manager’s certificate.',
        },
        {
          h: 'The whole household',
          p: 'Homes and finances can be shared with a partner, and the calculations use the household’s own numbers.',
        },
      ],
    },
    {
      kind: 'pair',
      label: 'Everyday life and comparison',
      items: [
        {
          id: 'himat-sijainti',
          ratio: '3:4',
          label: 'Does it fit everyday life',
          caption: 'Location: travel times, map, transport and noise',
        },
        {
          id: 'himat-vertailu',
          ratio: '3:4',
          label: 'Two homes side by side',
          caption: 'Comparison: monthly cost, own money and housing company figures on the same rows',
        },
      ],
    },
    {
      kind: 'scope',
      surface: 'tint',
      label: 'Responsibilities',
      title: 'From idea to beta as a team of one',
      body: 'Every part of the product. AI has been part of the work from the start.',
      items: [
        'Product concept and scope',
        'Brand and visual identity',
        'UX and interface',
        'Design system and tokens',
        'Front end',
        'Back end, database and security',
        'AI extraction and its evaluation',
        'Accessibility and quality gates',
        'Infrastructure and release',
      ],
    },
    {
      kind: 'text',
      label: 'Quality',
      lead: 'The AI rules are written down and tested',
      items: [
        {
          h: 'AI accuracy is measured',
          p: 'Every extraction rule and normalization is written down with its reason, and a test set backs it up. A prompt change is measured against the test set before it ships.',
        },
        {
          h: 'The same gates on every change',
          p: 'Accessibility at WCAG 2.2 AA, row-level security on every table, a strict content security policy, and unit, component and E2E tests.',
        },
        {
          h: 'Decisions on record',
          p: 'Architecture decisions are recorded with their reasons, so the AI agent and people work by the same rules.',
        },
      ],
    },
    {
      kind: 'text',
      label: 'Outcome',
      lead: 'The beta is in a limited external pilot',
      items: [
        {
          p: 'Himat reads the listing, the housing company documents and the location, calculates costs from the household’s finances and compares homes side by side. Development continues based on pilot feedback.',
        },
        { p: 'himat-ten.vercel.app', href: 'https://himat-ten.vercel.app/' },
      ],
    },
  ],
  next: { slug: 'colliers', title: 'Colliers Asunnot' },
};

/**
 * Casejen mainnat leipätekstissä. Englannissa ei taivuta, joten
 * nimet riittävät; pisin osuma ensin.
 */
export const caseRefs: CaseRef[] = [
  { text: 'UX engineering approach', section: 'method' },
  { text: 'Colliers Asunnot', slug: 'colliers' },
  { text: 'at Colliers', slug: 'colliers' },
  { text: 'Blokbook', slug: 'blokbook' },
];

const cases: Case[] = [colliers, blokbook, thisSite, himat];
export default cases;
