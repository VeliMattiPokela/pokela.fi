import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PageProgress from './PageProgress';

/**
 * Sivunvaihdon viiva. Sivustolla tila seuraa klikkauksia; tässä
 * tilat näytetään pakotettuina `state`-propsilla.
 */
const meta = {
  title: 'Osiot/PageProgress',
  component: PageProgress,
  parameters: {
    bleed: true,
    docs: {
      description: {
        component: [
          'Ohut musteviiva ruudun yläreunassa, kun sivunvaihto kestää (päätös 41).',
          'Näkyy vasta 120 ms:n jälkeen, kasvaa hitaasti kohti 90 %:a ja sulkeutuu',
          'täyteen leveyteen, kun polku vaihtuu.',
          '',
          'ListRow näyttää siirtymän omassa alaviivassaan, joten sen klikkaus ei',
          'piirrä tätä viivaa. Next.js-sovellus kytkee komponentin reitittimeen',
          '`PageProgressRoute`-kääreellä.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof PageProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Sivu latautuu: viiva kasvaa vasemmalta. */
export const Lataa: Story = { args: { state: 'loading' } };

/** Lepotila: ei näy. */
export const Lepo: Story = { args: { state: 'idle' } };

/** Tummassa teemassa viiva on vaalea muste. */
export const Tumma: Story = { args: { state: 'loading' }, globals: { theme: 'dark' } };

/** Mobiilissa viiva on sama: koko leveys, sama paksuus. */
export const Mobiili: Story = {
  args: { state: 'loading' },
  globals: { viewport: { value: 'base' } },
};
