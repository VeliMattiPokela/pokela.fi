import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Timeline, { TimelineItem } from './Timeline';

/**
 * Pystysuora aikajana. Case 03 piirtää sillä sen buildin, joka
 * rakensi sivun, mutta komponentti ei tiedä buildeista mitään.
 */
const meta = {
  title: 'Komponentit/Timeline',
  component: TimelineItem,
  parameters: {
    docs: {
      description: {
        component: [
          'Merkintä, kisko ja sisältö ovat listan ruudukon sarakkeita, joten',
          '`TimelineItem` piirretään aina `Timeline`-listan sisällä. `weight`',
          'venyttää kiskoa, ja `emphasis` nostaa kohdan paksulla kiskolla.',
        ].join('\n'),
      },
    },
  },
  args: {
    label: '0.01',
    title: 'Kuvat',
    meta: 'alle sekunnin',
    description: '7/23 paikkaa täynnä, 16 odottaa kuvaa',
  },
  decorators: [
    (Story) => (
      <div className="page">
        <Timeline>
          <Story />
        </Timeline>
      </div>
    ),
  ],
} satisfies Meta<typeof TimelineItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tavallinen kohta: ohut kisko, ontto piste. */
export const Oletus: Story = { args: { variant: 'default', group: 'Synkka' } };

/** Nostettu kohta. Kisko on paksu ja venyy painon mukaan. */
export const Korostettu: Story = {
  args: {
    variant: 'emphasis',
    label: '0.03',
    group: 'Build',
    title: 'Kuvat ja videot',
    meta: '5 min 32 s',
    description: '7/23 paikkaa täynnä',
    weight: 0.99,
  },
};

/** Viimeinen kohta: kisko päättyy pisteeseen. */
export const Loppu: Story = {
  args: { variant: 'end', label: '5.35', title: 'Sivusto rakennetaan', meta: null, description: 'Tämä sivu on sen tulos.' },
};

/** Kokonainen jana: kohdat ja niiden merkinnät samassa linjassa. */
export const Jana: Story = {
  render: () => (
    <>
      <TimelineItem label="0.00" group="Synkka" title="Tokenit" meta="alle sekunnin" description="101 tokenia tarkistettu" />
      <TimelineItem label="0.01" title="Kuvat" meta="alle sekunnin" description="7/23 paikkaa täynnä, 16 odottaa kuvaa" />
      <TimelineItem label="0.03" group="Build" title="Kuvat ja videot" meta="5 min 32 s" variant="emphasis" weight={0.5} />
      <TimelineItem label="5.35" title="Sivusto rakennetaan" description="Tämä sivu on sen tulos." variant="end" />
    </>
  ),
};

/** Mobiilissa kuvaus rivittyy, sivutieto pysyy otsikon rinnalla. */
export const Mobiilissa: Story = {
  globals: { viewport: { value: 'base' } },
  args: { title: 'Storyt', description: '17/24 storylla, 7 poikkeusta joiden sääntö tarkistettu' },
};

/** Kisko ja pisteet ovat tokenien värejä, joten ne kääntyvät teeman mukana. */
export const TummaTeema: Story = {
  globals: { theme: 'dark' },
  args: { variant: 'emphasis', label: '0.03', title: 'Kuvat ja videot', meta: '5 min 32 s', weight: 0.5 },
};
