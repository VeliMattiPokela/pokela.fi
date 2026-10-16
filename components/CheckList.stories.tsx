import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CheckList from './CheckList';

/**
 * Casen tarkistuslista: rivillä nimi ja ensimmäinen lause, raja ja
 * loput kuvauksesta avautuvat rivistä. Sivulla lista luetaan
 * lib/checks.ts:stä, tässä se on esimerkkidataa.
 */
const meta = {
  title: 'Osiot/CheckList',
  component: CheckList,
  args: {
    items: [
      {
        id: 'tokens',
        title: 'Tokenit',
        proves: 'styles/tokens.css ja tokens.json ovat samat arvot jokaisella breakpointilla.',
        blind: 'Ei kerro, käyttääkö arvoa kukaan.',
        runs: true,
      },
      {
        id: 'figma',
        title: 'Figma',
        proves: 'Jokainen kytkentä osoittaa olemassa olevaan Figma-komponenttiin. Kirjaston sisältö luetaan Figma-tiedostosta.',
        blind: 'Ei tarkista muuttujia.',
        runs: true,
      },
      {
        id: 'tekstit',
        title: 'Tekstit',
        proves: 'Näkyvät tekstit tulevat sanakirjasta, eivät komponenteista.',
        blind: null,
        runs: false,
      },
    ],
  },
} satisfies Meta<typeof CheckList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Perus: Story = {};

/** Sivulla lista näytetään kahtena ryhmänä (päätös 42). */
export const Ryhmissa: Story = {
  args: {
    groups: [
      { id: 'ydin', title: 'Yleinen ydin', note: 'Koodi, Figma ja paketit pidetään samana.' },
      { id: 'tuote', title: 'Tuotekohtaiset vartijat', note: 'Sama menetelmä tämän sivuston omiin tiedostoihin.' },
    ],
    items: [
      { id: 'tokens', group: 'ydin', title: 'Tokenit', proves: 'styles/tokens.css ja tokens.json ovat samat arvot.', blind: null, runs: true },
      { id: 'figma', group: 'ydin', title: 'Figma', proves: 'Jokainen kytkentä osoittaa olemassa olevaan Figma-komponenttiin.', blind: null, runs: true },
      { id: 'favicon', group: 'tuote', title: 'Favicon', proves: 'Favicon vastaa tokenien väriparia tavu tavulta.', blind: null, runs: true },
    ],
  },
};

export const Mobiilissa: Story = {
  globals: { viewport: { value: 'base' } },
};

export const TummaTeema: Story = {
  globals: { theme: 'dark' },
};
