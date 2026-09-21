import type { StorybookConfig } from '@storybook/nextjs-vite';

/**
 * Storybook on osa case 03:n todistusaineistoa: sama koodi, samat
 * tokenit, samat tilat kuin sivustolla. Siksi se ei käytä omia
 * tyylejä vaan importoi styles/index.css:n sellaisenaan.
 */
const config: StorybookConfig = {
  stories: [
    /* Dokumenttisivut ovat stories/, komponenttien storyt asuvat
       komponentin vieressä. */
    '../stories/**/*.mdx',
    '../components/**/*.stories.@(ts|tsx)',
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    /* Ajaa storyt testeinä (Vitest + Playwright) ja tekee
       saavutettavuusvirheestä kaatavan. Ks. vitest.config.ts. */
    '@storybook/addon-vitest',
  ],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
  staticDirs: ['../public'],

  /* Tämä Storybook on julkinen artefakti, ei kehitysympäristö:
     ei työkalun omia ilmoituksia eikä käyttöönottolistaa. Liput ovat
     Storybookin omat (`FEATURES.*OnboardingChecklist`), ei
     luokkanimiin kiinnitettyä piilotusta. */
  core: {
    disableWhatsNewNotifications: true,
    disableTelemetry: true,
  },

  features: {
    sidebarOnboardingChecklist: false,
    menuOnboardingChecklist: false,
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};

export default config;
