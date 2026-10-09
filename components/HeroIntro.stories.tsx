import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import HeroIntro from './HeroIntro';
import HeroName from './HeroName';

/**
 * Etusivun nimipalkki ja sen saapuminen.
 */
const meta = {
  title: 'Komponentit/HeroIntro',
  component: HeroIntro,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Täysleveä palkki nimen ja roolirivin ympärillä. Istunnon ensimmäisellä käynnillä',
          'palkki täyttää ensin koko ruudun, nimi rakentuu sen keskellä, ja kun kirjaimet ovat',
          'täyttyneet, palkki supistuu omaan kokoonsa. Vieritysyritys kesken intron asettaa',
          'palkin heti.',
          '',
          'Storybookissa näkyy lepotila: intron päättää sivun alussa ajettava skripti, jota',
          'Storybook ei aja. Intro on nähtävissä etusivulla.',
        ].join('\n'),
      },
    },
  },
  args: {
    children: (
      <section className="page home__intro">
        <HeroName lines={['Veli-', 'Matti', 'Pokela']} />
        <div className="home__intro-meta">
          <p className="meta ink home__role">Senior Designer, Helsinki</p>
        </div>
      </section>
    ),
  },
} satisfies Meta<typeof HeroIntro>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Palkki levossa, nimi ja roolirivi sen sisällä. */
export const Levossa: Story = {};

/** Mobiilissa nimi katkeaa kolmelle riville. */
export const Mobiilissa: Story = { globals: { viewport: { value: 'base' } } };

/** Palkin pinta on --badge-surface, joten se kääntyy teeman mukana. */
export const TummaTeema: Story = { globals: { theme: 'dark' } };
