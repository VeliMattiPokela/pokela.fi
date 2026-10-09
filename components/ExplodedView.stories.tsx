import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ExplodedView from './ExplodedView';

/**
 * Räjäytyskuva: kerrokset levyinä 3D-tilassa.
 */
const levy = (teksti: string) => (
  <div style={{ padding: 'var(--space-40)' }}>
    <span className="display-l">{teksti}</span>
  </div>
);

const meta = {
  title: 'Komponentit/ExplodedView',
  component: ExplodedView,
  parameters: {
    docs: {
      description: {
        component: [
          'Kerrokset ovat oikeaa HTML:ää pelkillä CSS 3D -muunnoksilla. Osoitin kääntää',
          'pinoa, klikkaus nostaa kerroksen kerrallaan esiin, ja elementit joilla on sama',
          '`data-kohde` syttyvät yhdessä. Tilassa `auki` vieritys kokoaa kerrokset yhdeksi',
          'pinnaksi, kun kuva poistuu yläreunasta. Vähemmän liikettä pyytäneelle pino',
          'näkyy paikallaan.',
        ].join('\n'),
      },
    },
  },
  args: {
    label: 'Kolme kerrosta',
    layers: [
      { name: '01 Pohja', source: 'tokens.json', content: levy('Pohja') },
      { name: '02 Osat', content: levy('Osat') },
      { name: '03 Pinta', content: levy('Pinta') },
    ],
  },
  decorators: [
    (Story) => (
      <div className="page">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ExplodedView>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pino viuhkana. Vie osoitin päälle ja klikkaa. */
export const Auki: Story = { args: { tila: 'auki' } };

/** Kerrokset koottuna yhdeksi pinnaksi. Klikkaus avaa pinon. */
export const Koottu: Story = { args: { tila: 'koottu' } };

/** Kapeassa kehyksessä levyt ovat pinona päällekkäin, viuhkan sijaan. */
export const Mobiilissa: Story = {
  globals: { viewport: { value: 'base' } },
  args: { tila: 'auki' },
};

/** Levyt ja viivat ovat tokenien värejä, joten ne kääntyvät teeman mukana. */
export const TummaTeema: Story = {
  globals: { theme: 'dark' },
  args: { tila: 'auki' },
};
