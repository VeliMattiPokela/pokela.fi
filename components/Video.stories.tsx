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
          'Kuvasuhde tulee Median laatikosta. Oletuksena video täyttää sen rajattuna kuten kuva;',
          'esitys `levy` näyttää puhelinruudun videon kokonaisena levyn keskellä.',
          'Storybookissa ei ole videotiedostoa, joten laatikko näyttää pelkän pohjan.',
        ].join('\n'),
      },
    },
  },
  args: { id: 'esimerkki', leveys: 1920, korkeus: 1080, caption: 'Hero-video' },
  decorators: [
    (Story, { args }) =>
      args.esitys === 'levy' ? (
        <div className="media media-3-4 media--levy media--video" style={{ maxWidth: 400 }}>
          <span className="media__levy">
            <Story />
          </span>
        </div>
      ) : (
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

/**
 * Herolla oma puhelinvideo: kapealla ruudulla selain valitsee
 * `<id>-mobiili`-lähteen, ja juliste vaihtuu sen mukana.
 */
export const OmaMobiilivideo: Story = {
  globals: { viewport: { value: 'base' } },
  args: { tila: 'toistaa', mobiili: '(min-width: 600px)' },
};

/** Nappi on paperin värinen, joten se kääntyy teeman mukana. */
export const TummaTeema: Story = {
  globals: { theme: 'dark' },
  args: { tila: 'toistaa' },
};

/** Puhelinruudun video levyllä: kokonaisena, kuten kaappaus kuvana. */
export const Levylla: Story = {
  args: { tila: 'toistaa', esitys: 'levy', leveys: 750, korkeus: 1334, caption: 'Puhelinruudun video' },
};
