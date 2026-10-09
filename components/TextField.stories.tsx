import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TextField from './TextField';

/**
 * Tekstikenttä. Ryhmä on Sovellus eikä Komponentit: sivusto ei käytä
 * tätä, vaan se on sovellusnäkymiä ja Makea varten (päätös 22).
 */
const meta = {
  title: 'Sovellus/TextField',
  component: TextField,
  parameters: {
    docs: {
      description: {
        component: [
          'Label, kenttä, ohjeteksti ja virhe yhtenä. Hover paksuntaa alaviivan kuten tekstinapissa; focus on sivuston yhteinen rengas.',
          'Virhe on systeemin ainoa tilaväri `--danger`, aina ikonin ja tekstin kanssa.',
        ].join('\n\n'),
      },
    },
  },
  args: {
    label: 'Nimi',
    placeholder: 'Etunimi Sukunimi',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 'var(--measure)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Oletus: Story = {};

export const Ohjeteksti: Story = {
  args: {
    label: 'Yritys',
    optional: '(valinnainen)',
    defaultValue: 'Loihde Factor',
    hint: 'Näkyy vain laskulla.',
  },
};

export const Virhe: Story = {
  args: {
    label: 'Sähköposti',
    type: 'email',
    defaultValue: 'vellu@pokela',
    error: 'Sähköpostista puuttuu verkkotunnus, esim. pokela.fi.',
  },
};

export const Disabled: Story = {
  args: { label: 'Asiakasnumero', defaultValue: '10 4482', disabled: true },
};

export const Tekstialue: Story = {
  args: {
    label: 'Viesti',
    multiline: true,
    placeholder: 'Kerro lyhyesti, mitä olet tekemässä.',
    hint: 'Enintään 500 merkkiä.',
  },
};

/** Kenttä napin ja toisen kentän rinnalla, kuten Make-näkymässä. */
export const Lomakkeessa: Story = {
  render: () => (
    <form style={{ display: 'grid', gap: 'var(--space-24)' }} onSubmit={(e) => e.preventDefault()}>
      <TextField label="Nimi" defaultValue="Veli-Matti Pokela" />
      <TextField
        label="Sähköposti"
        type="email"
        defaultValue="vellu@pokela"
        error="Sähköpostista puuttuu verkkotunnus."
      />
      <TextField label="Viesti" optional="(valinnainen)" multiline placeholder="Kerro lyhyesti, mitä olet tekemässä." />
      <div style={{ display: 'flex', gap: 'var(--space-16)' }}>
        <button type="submit" className="btn btn--primary">Lähetä</button>
        <button type="button" className="btn btn--ghost">Peruuta</button>
      </div>
    </form>
  ),
};

export const Tumma: Story = { ...Virhe, globals: { theme: 'dark' } };

export const Mobiili: Story = { ...Ohjeteksti, globals: { viewport: { value: 'base' } } };
