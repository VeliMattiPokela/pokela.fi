import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CheckList from './CheckList';

/**
 * Casen tarkistuslista: rivillä nimi ja millaisen virheen tarkistus
 * pysäyttää, tarkka kuvaus ja raja avautuvat rivistä. Sivulla lista luetaan
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
        huomaa: 'Huomaa, jos väri tai mitta muuttuu koodissa mutta ei Figmassa.',
        proves: 'styles/tokens.css ja tokens.json ovat samat arvot jokaisella breakpointilla.',
        blind: 'Ei kerro, käyttääkö arvoa kukaan.',
        runs: true,
      },
      {
        id: 'figma',
        title: 'Figma',
        huomaa: 'Huomaa, jos komponentti tai variantti on koodissa mutta ei Figma-kirjastossa.',
        proves: 'Jokainen kytkentä osoittaa olemassa olevaan Figma-komponenttiin. Kirjaston sisältö luetaan Figma-tiedostosta.',
        blind: 'Ei tarkista muuttujia.',
        runs: true,
      },
      {
        id: 'tekstit',
        title: 'Tekstit',
        huomaa: 'Huomaa, jos teksti kirjoitetaan komponenttiin sanakirjan ohi.',
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

/** Sivulla ajamaton tarkistus on omassa ryhmässään listan lopussa (päätös 50). */
export const Ryhmissa: Story = {
  args: {
    groups: [
      { id: 'tulossa', title: 'Tulossa', note: 'Tarkistus on kirjoitettu, mutta sitä ei vielä ajeta.' },
    ],
    items: [
      { id: 'tokens', title: 'Tokenit', huomaa: 'Huomaa, jos väri tai mitta muuttuu koodissa mutta ei Figmassa.', proves: 'styles/tokens.css ja tokens.json ovat samat arvot.', blind: null, runs: true },
      { id: 'figma', title: 'Figma', huomaa: 'Huomaa, jos variantti on koodissa mutta ei Figmassa.', proves: 'Jokainen kytkentä osoittaa olemassa olevaan Figma-komponenttiin.', blind: null, runs: true },
      { id: 'tekstit', group: 'tulossa', title: 'Tekstit', huomaa: 'Huomaa, jos teksti kirjoitetaan komponenttiin sanakirjan ohi.', proves: 'Näkyvät tekstit tulevat sanakirjasta.', blind: null, runs: false },
    ],
  },
};

export const Mobiilissa: Story = {
  globals: { viewport: { value: 'base' } },
};

export const TummaTeema: Story = {
  globals: { theme: 'dark' },
};
