import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PageHeader from './PageHeader';

/**
 * Sivun otsikko. Pattern: ei omaa ulkoasua, vain asettelu
 * olemassa oleville typografialuokille.
 */
const meta = {
  title: 'Patternit/PageHeader',
  component: PageHeader,
  parameters: {
    docs: {
      description: {
        component: [
          'Otsikko ja sivutieto samalla rivillä leveämmällä ruudulla.',
          'Ingressi on otsikon alla samassa sarakkeessa, ei sivussa.',
        ].join('\n'),
      },
    },
  },
  args: { title: 'Työt', meta: 'Valitut projektit 2015–2026' },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Otsikko ja sivutieto, kuten työlistassa. */
export const Oletus: Story = {};

/** Ingressin kanssa. */
export const Ingressilla: Story = {
  args: {
    title: 'Ideasta valmiiksi',
    meta: '9 viikkoa',
    lede: 'Selkeä prosessi tekee etenemisestä näkyvää. Jokainen vaihe päättyy yhteiseen päätökseen ennen seuraavaa askelta.',
  },
};

export const Mobiilissa: Story = {
  args: Ingressilla.args,
  globals: { viewport: { value: 'base' } },
};

export const TummaTeema: Story = {
  args: Ingressilla.args,
  globals: { theme: 'dark' },
};
