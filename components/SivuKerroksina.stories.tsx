import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SivuKerroksina from './SivuKerroksina';

/**
 * Tämä sivusto räjäytyskuvana. System-sivulla ja case 03:ssa.
 */
const meta = {
  title: 'Sivusto/SivuKerroksina',
  component: SivuKerroksina,
  parameters: {
    docs: {
      description: {
        component: [
          'ExplodedView tämän sivuston sisällöllä: tokenit luetaan tokens.json:sta,',
          'komponentit ovat samat ListRow, Media ja Icon joita sivu käyttää. Vie osoitin',
          'komponentin päälle keskimmäisessä kerroksessa, niin sama komponentti syttyy',
          'valmiilla sivulla.',
        ].join('\n'),
      },
    },
  },
  args: { locale: 'fi' },
  decorators: [
    (Story) => (
      <div className="page">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SivuKerroksina>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pino viuhkana. */
export const Auki: Story = { args: { tila: 'auki' } };

/** Kapeassa kehyksessä levyt ovat pinona päällekkäin. */
export const Mobiilissa: Story = {
  globals: { viewport: { value: 'base' } },
};

/** Levyt ja viivat ovat tokenien värejä, joten ne kääntyvät teeman mukana. */
export const TummaTeema: Story = {
  globals: { theme: 'dark' },
};
