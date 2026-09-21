import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Media from './Media';
import { Row, Specimen, Stack } from '@/stories/doc/Layout';

/**
 * Kuvapaikka. Raidoitus tokeneista + metateksti siitä mikä kuva
 * tulee — ei harmaata laatikkoa jossa lukee "image".
 */
const meta = {
  title: 'Komponentit/Media',
  component: Media,
  parameters: {
    docs: {
      description: {
        component: [
          'Kuvapaikka kertoo mitä kuvaa odotetaan ja missä suhteessa. Kun oikea kuva on',
          'olemassa, se korvataan samassa kuvasuhteessa eikä layout liiku.',
          '',
          'Kuvasuhteet ovat responsiivisia: `hero` on mobiilissa 4:5, 600 px:stä 16:9 ja',
          '900 px:stä 21:9. Täysleveästä 21:9-kuvasta ei näkisi mobiilissa mitään.',
        ].join('\n'),
      },
    },
  },
  args: { ratio: '4:3', caption: 'Tier 2 · 4:3 — skeleton selaimessa' },
} satisfies Meta<typeof Media>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Oletus: Story = {};

/** Kaikki viisi kuvasuhdetta rinnakkain. */
export const Kuvasuhteet: Story = {
  render: () => (
    <Stack>
      <Specimen label="hero — 4:5 → 16:9 → 21:9" fill>
        <Media ratio="hero" caption="Täysleveä kuva, työn hero" />
      </Specimen>
      <Row width="wide">
        <Specimen label="case — 4:3" fill>
          <Media ratio="4:3" caption="Casen näkymä" />
        </Specimen>
        <Specimen label="card — 4:5" fill>
          <Media ratio="4:5" caption="Kolmen ruudukko" />
        </Specimen>
        <Specimen label="portrait — 3:4" fill>
          <Media ratio="3:4" caption="Muotokuva, mobiilikaappaus" />
        </Specimen>
        <Specimen label="square — 1:1" fill>
          <Media ratio="1:1" caption="Detalji, Storybook-näkymä" />
        </Specimen>
      </Row>
    </Stack>
  ),
};

/** Hero kaventuu 4:5:ksi mobiilissa — vaihda katselukokoa. */
export const HeroMobiilissa: Story = {
  globals: { viewport: { value: 'base' } },
  args: { ratio: 'hero', caption: 'Täysleveä kuva 21:9 — mobiilissa 4:5' },
};

export const Tumma: Story = {
  globals: { theme: 'dark' },
  args: { ratio: 'hero', caption: 'Raidoitus tulee --placeholder-a / -b -tokeneista' },
};
