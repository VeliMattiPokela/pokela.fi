import type { Decorator, Preview } from '@storybook/nextjs-vite';
import { useLayoutEffect } from 'react';
import { Archivo, Bodoni_Moda } from 'next/font/google';
import tokens from '../tokens.json';
import '../styles/index.css';
import './story-layout.css';
import './storybook.css';

/* Samat fontit kuin sivustolla, samalla tavalla ladattuna.
   Muuttujat menevät tokens.css:n --font-display / --font-ui taakse. */
const bodoni = Bodoni_Moda({
  subsets: ['latin-ext'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-bodoni',
});

const archivo = Archivo({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-archivo',
});

/**
 * Teema asetetaan juureen samalla attribuutilla kuin sivustolla
 * (`data-theme`), ei Storybookin omalla taustavärillä. Näin storyt
 * todistavat että tokenit kantavat molemmat teemat — eivät vain
 * näytä siltä.
 *
 * Attribuutti asetetaan renderöinnin aikana, EI useEffectissä.
 * Effekti ajetaan vasta ensimmäisen maalauksen jälkeen, jolloin
 * story ehtii välähtää väärässä teemassa — ja saavutettavuusajo
 * mittaisi kontrastin siitä välitilasta. Sivustolla saman tekee
 * ThemeScript synkronisesti <head>issä.
 */
function applyTheme(theme: 'light' | 'dark') {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (root.getAttribute('data-theme') !== theme) root.setAttribute('data-theme', theme);
  root.classList.add(bodoni.variable, archivo.variable);
}

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme as 'light' | 'dark';
  applyTheme(theme);

  /* Kanvaasin pinta seuraa teemaa myös story-kehyksen ulkopuolella. */
  useLayoutEffect(() => {
    document.body.style.background = 'var(--paper)';
    document.body.style.color = 'var(--ink)';
  }, [theme]);

  return <Story />;
};

/**
 * Rytmi kankaalle. Storybookin oma `layout` on aina `fullscreen`,
 * jotta se ei lisäisi omaa rem-pohjaista paddingiaan tokenien ohi —
 * väli tulee tästä, tokeneista.
 *
 * Täysleveät komponentit (indeksirivi, navi, footer) merkitään
 * `parameters: { bleed: true }`. Ne hoitavat oman sivupaddinginsa
 * `.bleed`-utilitylla, joten kanavan padding rikkoisi ne.
 */
const withCanvas: Decorator = (Story, context) =>
  context.parameters.bleed ? (
    <Story />
  ) : (
    <div className="sb-canvas">
      <Story />
    </div>
  );

/* Katselukoot suoraan tokeneista — ei toista listaa jota pitäisi
   muistaa päivittää. */
const bp = tokens.layout.breakpoints;
const viewports = {
  base: { name: `base — 0–${parseInt(bp.sm) - 1}px`, styles: { width: '390px', height: '844px' } },
  sm: { name: `sm — ${bp.sm}`, styles: { width: bp.sm, height: '900px' } },
  md: { name: `md — ${bp.md}`, styles: { width: bp.md, height: '900px' } },
  lg: { name: `lg — ${bp.lg}`, styles: { width: '1440px', height: '900px' } },
};

const preview: Preview = {
  decorators: [withCanvas, withTheme],

  globalTypes: {
    theme: {
      description: 'Teema',
      toolbar: {
        title: 'Teema',
        items: [
          { value: 'light', title: 'Vaalea' },
          { value: 'dark', title: 'Tumma' },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: { theme: 'light' },

  parameters: {
    /* Storybook ei lisää omaa paddingiaan — väli tulee withCanvasista. */
    layout: 'fullscreen',
    viewport: { options: viewports },
    backgrounds: { disable: true },
    controls: { expanded: true, matchers: { date: /Date$/i } },
    /* Saavutettavuusvirhe kaataa `npm run test:stories` -ajon.
       Ilman ajajaa tämä asetus ei tekisi mitään — ks. vitest.config.mts. */
    a11y: { test: 'error' },
    docs: {
      toc: true,
    },
    options: {
      storySort: {
        order: [
          'Aloita',
          'Perusta',
          ['Väri', 'Typografia', 'Grid', 'Välistys', 'Liike'],
          'Komponentit',
          'Sivut',
        ],
      },
    },
  },
};

export default preview;
