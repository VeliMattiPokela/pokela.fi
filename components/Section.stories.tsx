import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Section from './Section';

/**
 * Sivun osio otsikkoineen. Pattern: kaksi asettelua, molemmat
 * sivustolta.
 */
const meta = {
  title: 'Patternit/Section',
  component: Section,
  parameters: {
    docs: {
      description: {
        component: [
          '`stacked`: otsikko ja sivutieto rivinä, sisältö alla (Tietoa, System).',
          '`aside`: otsikko vasemmalla, sisältö oikealla (casesivujen lohkot).',
        ].join('\n'),
      },
    },
  },
  args: {
    id: 'osio',
    title: 'Työhistoria',
    meta: 'Vuodesta 2006',
    children: <p className="body-l measure">Osion sisältö tulee otsikon alle.</p>,
  },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pino: Story = { args: { layout: 'stacked' } };

export const Sivussa: Story = {
  args: {
    layout: 'aside',
    title: 'Lähtötilanne',
    children: (
      <div>
        <h3 className="display-m">Otsikko on vasemmalla, sisältö oikealla.</h3>
        <p className="body-l measure">Pienellä ruudulla ne ovat päällekkäin.</p>
      </div>
    ),
  },
};

export const SivussaMobiilissa: Story = {
  args: Sivussa.args,
  globals: { viewport: { value: 'base' } },
};

export const TummaTeema: Story = {
  args: Sivussa.args,
  globals: { theme: 'dark' },
};
