import type { Dictionary } from './fi';

/**
 * Englanninkieliset tekstit. Rakenne tulee fi.ts:stä, joten puuttuva
 * avain kaataa tyypintarkistuksen. Teksti on kirjoitettu englanniksi
 * uudelleen, ei käännetty sanatarkasti (päätös 60).
 */
const en: Dictionary = {
  meta: {
    siteName: 'Pokela',
    title: 'Veli-Matti Pokela — Senior Product Designer & UX Engineer',
    description:
      'I design interfaces and build them for production. Senior Product Designer & UX Engineer, Helsinki.',
    skipToContent: 'Skip to content',
  },

  nav: {
    work: 'Work',
    method: 'How I work',
    about: 'About',
    contact: 'Get in touch',
    menu: 'Menu',
    close: 'Close',
    theme: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'Auto',
    language: 'Suomeksi',
    languageShort: 'FI',
  },

  home: {
    name: 'Veli-Matti Pokela',
    nameLines: ['Veli-Matti', 'Pokela'],
    role: 'Senior Product Designer & UX Engineer, Helsinki',
    heroArt: 'Contour lines as a line drawing',
    availability: null,
    statement: 'Interfaces, from design to production code.',
    lede:
      'My two most recent projects are Colliers Asunnot and my own product, Blokbook. In both, the interface was designed and built directly in code.',
    aboutLink: 'About',
    selectedWork: 'Selected work',
    allWork: 'View all work',
    bandTitle: 'Design and build in the same hands',
    bandBody:
      'Design systems, product design and front end. One of them or all three, depending on the project.',
  },

  work: {
    title: 'Work',
    previous: 'Earlier work',
    previousHint: 'Opens on the page',
    nextCase: 'Next case',
    open: 'Open',
    close: 'Close',
  },

  about: {
    titleLines: ['Veli-Matti', 'Pokela'],
    lede:
      'Senior Product Designer & UX Engineer, Helsinki. I create concepts, interfaces and their front-end builds.',
    body:
      'I have worked on digital products and services since 2010. My work combines UX/UI design, service design and front-end development. It starts from understanding user and business needs and moves from concepts and prototypes to working, coded interfaces. I work fluently both in Figma and directly in code, and use AI as part of design and development. My experience ranges from consumer-facing digital services to complex internal tools.',
    contact: 'Get in touch',
    printCv: 'Print CV',
    printRole: 'Senior Product Designer & UX Engineer',
    portraitAlt: 'Veli-Matti Pokela',
    servicesTitle: 'Expertise',
    historyTitle: 'Experience',
    historySince: 'Since 2010',
    toolsTitle: 'Tools',
    educationTitle: 'Education and languages',
  },

  footer: {
    ctaLines: ['Get in', 'touch'],
    email: 'velimatti.pokela@gmail.com',
    location: 'Helsinki, FI',
    linkedin: 'LinkedIn',
    linkedinUrl: 'https://www.linkedin.com/in/veli-matti-pokela-5b1b288a/',
    colophonLabel: 'This site',
    colophon: 'Next.js · TypeScript · Storybook · tokens in code',
    year: '2026',
  },

  system: {
    rules: 'Radius 0 · 1 px line · no shadows',
    title: 'System',
    lede: 'This portfolio’s design system is the same in code, in Figma and in AI tools. This page shows every color, measure and component the site uses.',
    kerroksetLabel:
      'This site taken apart into three layers: tokens, components and the finished page.',
    kerrokset: ['01 Tokens', '02 Components', '03 Page'],
    layersTitle: '00 — In layers',
    layersNote:
      'One page as three layers. The layers are the site’s own code, not pictures. Colors and measures come from the design system, and the components are the same ones the site uses. When a token changes, this page changes too.',
  },

  showcase: {
    label: 'The list row from four angles',
    figmaHeading: 'Component in Figma',
    codeConnectHeading: 'Code Connect mapping',
    name: 'Name',
    hoverDemo: 'Open row, reversed',
    tabView: 'View',
    tabCode: 'Code',
    states: 'States',
    statesValue: 'Default · pointer over the row · keyboard focus · press on a touch screen',
    sizes: 'Sizes',
    sizesValue: 'Stacked below 600 px, one row above',
    usedIn: 'Used on',
    usedInValue: 'Front page · work list · earlier work · this view',
    tokenNote: '{n} tokens, not a single hardcoded value',
    lines: 'lines',
    styleNote: 'Every color, space and line comes from a token, so the dark theme needs no rule of its own.',
    storyNote: 'A story isn’t a separate description of the component. It is the same component this page uses, in its different states.',
    storiesTitle: 'States maintained ({n})',
    storiesNote:
      'Every state is opened in a real browser and checked automatically whenever the site is released. If contrast, touch target size or the name a screen reader hears breaks in even one state, the release stops there.',
    variant: 'Variant',
    breakpointValue: 'base · sm+ — a @media breakpoint, not a prop, so it isn’t mapped to code.',
    props: 'Props',
    tokensLabel: 'Tokens in this component ({n})',
    tokensValue: 'Tokens have the same names in Figma as in code, so designers and developers talk about the same things.',
    variantsNote:
      'Variants and props are read from the mapping file, not written here: that is where they are in the form Figma actually uses. If the mapping changes, this list changes with it.',
    connectNote:
      'This is the repo file as is, not an example. It tells Figma which code component matches what, so Dev Mode shows designers the real usage instead of a guessed structure. Its integrity is checked by',
    connectNoteEnd: 'in every build.',
  },

  common: {
    role: 'Role',
    todo: 'To be added',
    responsible: 'Led',
    contributed: 'Contributed',
    before: 'Before',
    after: 'After',
    clients: 'Clients',
    toBeAdded: 'To be added',
    play: 'Play',
    pause: 'Pause',
  },
};

export default en;
