import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Checkbox from './Checkbox';

/**
 * Valintaruutu. Sivusto ei käytä tätä; se on sovellusnäkymiä ja Makea
 * varten (päätös 22).
 */
const meta = {
  title: 'Komponentit/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component: [
          'Ruutu, label ja ohjeteksti. Valittu ruutu täytetään mustalla; hover paksuntaa reunan; focus on sivuston yhteinen rengas.',
          'Virhe kuuluu ryhmälle: käytä `ChoiceGroup`ia, jonka `error` merkitsee kaikki valinnat.',
        ].join('\n\n'),
      },
    },
  },
  args: { label: 'Uudet työt' },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Oletus: Story = {};

export const Valittu: Story = { args: { defaultChecked: true } };

export const Osittain: Story = { args: { label: 'Valitse kaikki', indeterminate: true } };

export const Ohjeteksti: Story = { args: { label: 'Kirjoitukset', hint: 'Noin kerran kuussa.' } };

export const Disabled: Story = {
  args: { label: 'Puhetilaisuudet', hint: 'Ei vielä saatavilla.', disabled: true },
};

export const Tumma: Story = { ...Valittu, globals: { theme: 'dark' } };

export const Mobiili: Story = { ...Ohjeteksti, globals: { viewport: { value: 'base' } } };
