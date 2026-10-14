import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Piirros from './Piirros';

/**
 * Työtapa-sivun viivakuvitus.
 */
const meta = {
  title: 'Komponentit/Piirros',
  component: Piirros,
  parameters: {
    docs: {
      description: {
        component: [
          'Menetelmän kuvitus SVG:nä. Värit tulevat tokeneista, joten piirros vaihtaa',
          'teemaa sivun mukana. `kypsyminen` on sivun pääkuva: sama näkymä runkona,',
          'design systemillä, datalla ja julkaistuna. Muut aiheet ovat menetelmän',
          'vaihekuvia. Ilman `label`-propsia piirros on koriste ja piilotetaan',
          'ruudunlukijalta.',
        ].join('\n'),
      },
    },
  },
  args: { aihe: 'kypsyminen', label: 'Sama näkymä neljässä vaiheessa' },
} satisfies Meta<typeof Piirros>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Kypsyminen: Story = {};
export const Tumma: Story = { globals: { theme: 'dark' } };

/** Kapealla ruudulla piirros skaalautuu leveytensä mukaan. */
export const Mobiilissa: Story = { globals: { viewport: { value: 'base' } } };

export const Ymmarrys: Story = { args: { aihe: 'ymmarrys', label: undefined } };
export const Pohja: Story = { args: { aihe: 'pohja', label: undefined } };
export const DesignSystem: Story = { args: { aihe: 'design-system', label: undefined } };
export const Polut: Story = { args: { aihe: 'polut', label: undefined } };
export const Data: Story = { args: { aihe: 'data', label: undefined } };
export const Julkaisu: Story = { args: { aihe: 'julkaisu', label: undefined } };
