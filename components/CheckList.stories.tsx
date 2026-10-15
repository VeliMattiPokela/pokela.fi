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

export const Mobiilissa: Story = {
  globals: { viewport: { value: 'base' } },
};

export const TummaTeema: Story = {
  globals: { theme: 'dark' },
};
