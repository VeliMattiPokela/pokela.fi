import type { Tyotapa } from './fi';

/** Työtapa-sivu englanniksi (päätös 60). */
const tyotapa: Tyotapa = {
  eyebrow: 'How I work',
  title: 'UX engineering – design in code',
  lede: 'UX engineering combines user-centered design with front-end development. The service is designed and iterated as working code, so every design decision is already production code and can be tried right away.',
  facts: [
    { label: 'What', value: 'User-centered design and front end' },
    { label: 'Tools', value: 'React, TypeScript, Storybook, Git, AI assistant' },
    { label: 'Role', value: 'UX engineer: design and build in the same hands' },
    { label: 'Used in', value: 'Colliers Asunnot, Blokbook, this site, Himat' },
  ],
  hero: {
    label: 'The same view in four stages: skeleton, design system, data and the live service.',
    caption: 'The same view as a skeleton, with the design system, with data and live. The same code runs from start to finish.',
  },
  stepsTitle: 'Steps',
  steps: [
    {
      aihe: 'ymmarrys',
      h: 'Understanding first',
      p: 'Customer insight and a shared vision come before the first line of code. Code doesn’t replace concept work.',
    },
    {
      aihe: 'pohja',
      h: 'Foundation and brief',
      p: 'The development environment and version control are set up right away. The brief, ways of working and quality rules are written into text files from the start, so the AI assistant works from the same context and by the same rules as the team.',
    },
    {
      aihe: 'design-system',
      h: 'Design system in code',
      p: 'Colors, typography and the structure, states and behavior of components are defined directly in code. A change in one place shows everywhere at once.',
    },
    {
      aihe: 'polut',
      h: 'Views and flows',
      p: 'User flows are built whole, from the front page to the end.',
    },
    {
      aihe: 'data',
      h: 'Data',
      p: 'Realistic mock data makes the service believable before there is an API. The real API is connected when it is ready.',
    },
    {
      aihe: 'julkaisu',
      h: 'Release and iteration',
      p: 'The service is released to a test environment, and stakeholders and users try it on their own devices. Changes agreed with stakeholders are ready for the next review, and the same code goes on to production.',
    },
  ],
  benefitsTitle: 'What it changes',
  benefits: [
    {
      h: 'Feedback comes from a working service',
      p: 'The client comments on a working service in the browser.',
    },
    {
      h: 'The design doesn’t change in the build',
      p: 'Design decisions are already code, so they aren’t reinterpreted during implementation.',
    },
    { h: 'The design system stays up to date', p: 'The documentation is the same code that runs in production.' },
  ],
  limitsTitle: 'Limits',
  limits: [
    { h: 'Concept work isn’t skipped', p: 'Understanding and a shared vision first, then code.' },
    {
      h: 'AI code is reviewed',
      p: 'It works, but it isn’t always the most sustainable solution. Quality is ensured before production.',
    },
    {
      h: 'AI use is agreed',
      p: 'Security, licenses and data handling are assessed case by case with the organization.',
    },
    {
      h: 'Test releases must be allowed',
      p: 'If the client’s environment doesn’t allow them, ideas can’t be tried together.',
    },
    {
      h: 'One tool among others',
      p: 'Not every project benefits from this, and the traditional way of working still suits many.',
    },
  ],
  casesTitle: 'Where it was used',
  cases: [
    {
      slug: 'colliers',
      p: 'A clickable skeleton was in the browser within the first weeks, and the design system was built in Storybook as code.',
      meta: 'The full method',
    },
    {
      slug: 'blokbook',
      p: 'My own product was designed directly in code. The design system and Storybook grew with the first platform.',
      meta: 'Own product',
    },
    {
      slug: 'portfolio',
      p: 'The next step for the method: code is the single source, and checks keep Figma and AI tools in sync with it.',
      meta: 'Next step',
    },
    {
      slug: 'himat',
      p: 'My own product was built directly in code from day one. The design system and rules were written at the start, and an AI agent works by them.',
      meta: 'Own product, AI agent',
    },
  ],
};

export default tyotapa;
