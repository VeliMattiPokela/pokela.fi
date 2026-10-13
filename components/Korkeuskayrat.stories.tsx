import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Korkeuskayrat from './Korkeuskayrat';

/**
 * Etusivun viivateos.
 */
const meta = {
  title: 'Komponentit/Korkeuskayrat',
  component: Korkeuskayrat,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Vaakasuuntaiset korkeuskäyrät SVG-polkuina. Kuvio lasketaan kiinteällä',
          'siemenellä, joten se on joka kerta sama, ja viivat ovat `--ink`-värisiä.',
          '',
          'Etusivulla viivat piirtyvät, kun HeroIntron kansi asettuu. Levossa kuvio',
          'ajelehtii hyvin hitaasti. Painettaessa osoitin tai sormi avaa linssin, jonka',
          'ympäri viivat väistävät; pelkkä osoittimen vienti ei tee mitään. Vähemmän',
          'liikettä pyytäneelle kuvio on paikallaan.',
        ].join('\n'),
      },
    },
  },
  args: { label: 'Korkeuskäyrät viivapiirroksena' },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', height: 560 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Korkeuskayrat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Oletus: Story = {};

export const Tumma: Story = { globals: { theme: 'dark' } };

/** Kapealla ruudulla käyrät ovat tiheämmässä ja pisteet lähempänä. */
export const Mobiilissa: Story = { globals: { viewport: { value: 'base' } } };
