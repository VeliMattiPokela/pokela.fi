import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Video from './Video';

/**
 * Video kuvapaikassa. Media piirtää tämän, kun paikkaan on pudotettu
 * video kuvan sijaan.
 */
const meta = {
  title: 'Komponentit/Video',
  component: Video,
  parameters: {
    docs: {
      description: {
        component: [
          'Toistuu itsestään mykkänä silmukkana. Taukonappi on aina näkyvissä, ja jos',
          'käyttäjä on pyytänyt vähemmän liikettä, video alkaa tauolla (päätös 11).',
          '',
          'Kuvasuhde tulee Median laatikosta, ja video täyttää sen rajattuna kuten kuva.',
          'Storybookissa ei ole videotiedostoa, joten laatikko näyttää pelkän pohjan.',
        ].join('\n'),
      },
    },
  },
  args: { id: 'esimerkki', leveys: 1920, korkeus: 1080, caption: 'Hero-video' },
  decorators: [
    (Story) => (
      <div className="media media-hero media--kuva media--video">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Video>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Toistaa: Story = { args: { tila: 'toistaa' } };
export const Tauolla: Story = { args: { tila: 'tauolla' } };

/** Herossa video rajautuu 4:5:ksi mobiilissa, nappi pysyy nurkassa. */
export const Mobiilissa: Story = {
  globals: { viewport: { value: 'base' } },
  args: { tila: 'toistaa' },
};

/** Nappi on paperin värinen, joten se kääntyy teeman mukana. */
export const TummaTeema: Story = {
  globals: { theme: 'dark' },
  args: { tila: 'toistaa' },
};
