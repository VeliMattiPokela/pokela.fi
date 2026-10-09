import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Switch from './Switch';

/**
 * Kytkin. Sivusto ei käytä tätä; se on sovellusnäkymiä ja Makea
 * varten (päätös 22).
 */
const meta = {
  title: 'Komponentit/Switch',
  component: Switch,
  parameters: {
    docs: {
      description: {
        component: [
          'Asetus, joka tulee voimaan heti, ilman tallennusnappia. Label vasemmalla, kytkin rivin oikeassa reunassa.',
          'Jos valinta tallennetaan napilla, käytä `Checkbox`ia.',
        ].join('\n\n'),
      },
    },
  },
  args: { label: 'Sähköposti-ilmoitukset' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 'var(--measure)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Oletus: Story = {};

export const Paalla: Story = { args: { defaultChecked: true } };

export const Ohjeteksti: Story = { args: { defaultChecked: true, hint: 'Kun joku kommentoi työtäsi.' } };

export const Disabled: Story = { args: { label: 'Viikkokooste', disabled: true } };

export const Tumma: Story = { ...Paalla, globals: { theme: 'dark' } };

export const Mobiili: Story = { ...Ohjeteksti, globals: { viewport: { value: 'base' } } };
