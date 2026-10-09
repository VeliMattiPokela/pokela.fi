import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Radio from './Radio';

/**
 * Radiopainike. Sivusto ei käytä tätä; se on sovellusnäkymiä ja Makea
 * varten (päätös 22). Käytetään ChoiceGroupin sisällä.
 */
const meta = {
  title: 'Komponentit/Radio',
  component: Radio,
  parameters: {
    docs: {
      description: {
        component: [
          'Yksi vaihtoehto ryhmästä, josta valitaan yksi. Ympyrä on systeemin ainoa pyöreä muoto (päätös 24), jotta radio erottuu valintaruudusta.',
          'Käytä aina `ChoiceGroup`in sisällä samalla `name`-arvolla.',
        ].join('\n\n'),
      },
    },
  },
  args: { label: 'Sähköposti', name: 'tapa', value: 'sahkoposti' },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Oletus: Story = {};

export const Valittu: Story = { args: { defaultChecked: true } };

export const Ohjeteksti: Story = { args: { label: 'Julkinen', hint: 'Kuka tahansa linkin saanut.' } };

export const Disabled: Story = { args: { label: 'Puhelin', disabled: true } };

export const Tumma: Story = { ...Valittu, globals: { theme: 'dark' } };

export const Mobiili: Story = { ...Ohjeteksti, globals: { viewport: { value: 'base' } } };
