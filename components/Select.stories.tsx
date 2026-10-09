import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import Select from './Select';
import TextField from './TextField';

/**
 * Valintalista. Sivusto ei käytä tätä; se on sovellusnäkymiä ja Makea
 * varten (päätös 22). Lista on oma (päätös 25), joten sen näppäimistö
 * ja ARIA testataan tässä: Näppäimistö- ja Auki-storyt ajavat
 * play-funktion, ja axe tarkistaa avoimen listan.
 */
const ROOLIT = [
  { value: 'kehittaja', label: 'Kehittäjä' },
  { value: 'suunnittelija', label: 'Suunnittelija' },
  { value: 'tuoteomistaja', label: 'Tuoteomistaja' },
  { value: 'tutkija', label: 'Tutkija' },
];

const meta = {
  title: 'Komponentit/Select',
  component: Select,
  parameters: {
    docs: {
      description: {
        component: [
          'Suljettuna sama kenttä kuin `TextField`; auki systeemin oma lista. Valittu rivi on painolla 500 ja merkillä, aktiivinen rivi pinnalla `--paper-alt`.',
          'Näppäimistö WAI-ARIA APG:n select-only combobox -mallin mukaan: nuolet, Home, End, PageUp/PageDown, Enter, välilyönti, Esc, Tab ja kirjainhaku. Fokus pysyy kentässä; lista kertoo aktiivisen rivin `aria-activedescendant`illa.',
        ].join('\n\n'),
      },
    },
  },
  args: {
    label: 'Rooli',
    options: ROOLIT,
    placeholder: 'Valitse rooli',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 'var(--measure)', minHeight: 'calc(var(--tap-min) * 8)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Oletus: Story = {};

export const Valittu: Story = { args: { defaultValue: 'suunnittelija' } };

export const Ohjeteksti: Story = {
  args: { label: 'Kieli', optional: '(valinnainen)', placeholder: 'Sama kuin tiimillä', hint: 'Kutsuviestin kieli.' },
};

export const Virhe: Story = { args: { error: 'Valitse rooli ennen kutsua.', required: true } };

export const Disabled: Story = {
  args: {
    label: 'Tiimi',
    options: [{ value: 'suunnittelu', label: 'Suunnittelu' }],
    defaultValue: 'suunnittelu',
    disabled: true,
    hint: 'Tiimiä voi vaihtaa vain ylläpitäjä.',
  },
};

/** Lista auki, yksi vaihtoehto pois käytöstä. Axe tarkistaa listan. */
export const Auki: Story = {
  args: {
    defaultValue: 'suunnittelija',
    options: [...ROOLIT, { value: 'omistaja', label: 'Omistaja', disabled: true }],
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('combobox'));
    await expect(c.getByRole('listbox')).toBeVisible();
    await expect(c.getByRole('option', { name: 'Suunnittelija' })).toHaveAttribute('aria-selected', 'true');
  },
};

/** Näppäimistö APG:n mukaan: avaus, liike, kirjainhaku, Esc ja valinta. */
export const Nappaimisto: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const kentta = c.getByRole('combobox');
    await userEvent.tab();
    await expect(kentta).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    await expect(kentta).toHaveAttribute('aria-expanded', 'true');
    const aktiivinen = () => document.getElementById(kentta.getAttribute('aria-activedescendant') ?? '');
    await expect(aktiivinen()).toHaveTextContent('Kehittäjä');

    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    await expect(aktiivinen()).toHaveTextContent('Tuoteomistaja');
    await userEvent.keyboard('{End}');
    await expect(aktiivinen()).toHaveTextContent('Tutkija');
    await userEvent.keyboard('{Home}');
    await expect(aktiivinen()).toHaveTextContent('Kehittäjä');

    /* Esc sulkee muuttamatta arvoa. */
    await userEvent.keyboard('{Escape}');
    await expect(kentta).toHaveAttribute('aria-expanded', 'false');
    await expect(kentta).toHaveTextContent('Valitse rooli');

    /* Kirjainhaku avaa ja hyppää, Enter valitsee. */
    await userEvent.keyboard('s');
    await expect(aktiivinen()).toHaveTextContent('Suunnittelija');
    await userEvent.keyboard('{Enter}');
    await expect(kentta).toHaveAttribute('aria-expanded', 'false');
    await expect(kentta).toHaveTextContent('Suunnittelija');
    await expect(kentta).toHaveFocus();
  },
};

/** Pois käytöstä oleva vaihtoehto ohitetaan, ja Tab hyväksyy aktiivisen. */
export const OhitusJaTab: Story = {
  args: {
    options: [
      { value: 'a', label: 'Kehittäjä' },
      { value: 'b', label: 'Omistaja', disabled: true },
      { value: 'c', label: 'Suunnittelija' },
    ],
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const kentta = c.getByRole('combobox');
    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    const aktiivinen = () => document.getElementById(kentta.getAttribute('aria-activedescendant') ?? '');
    await expect(aktiivinen()).toHaveTextContent('Suunnittelija');
    await userEvent.keyboard('{ArrowDown}');
    await expect(aktiivinen()).toHaveTextContent('Suunnittelija');
    await userEvent.tab();
    await expect(kentta).toHaveAttribute('aria-expanded', 'false');
    await expect(kentta).toHaveTextContent('Suunnittelija');
    await expect(kentta).not.toHaveFocus();
  },
};

/** Hiiri: klikkaus avaa, rivin klikkaus valitsee, klikkaus ulkopuolelle sulkee. */
export const Hiiri: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const kentta = c.getByRole('combobox');
    await userEvent.click(kentta);
    await userEvent.click(c.getByRole('option', { name: 'Tutkija' }));
    await expect(kentta).toHaveTextContent('Tutkija');
    await expect(kentta).toHaveFocus();
    await userEvent.click(kentta);
    await expect(kentta).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(canvasElement.ownerDocument.body);
    await expect(kentta).toHaveAttribute('aria-expanded', 'false');
    await expect(kentta).toHaveTextContent('Tutkija');
  },
};

/** Select tekstikentän rinnalla, kuten Make-näkymässä. */
export const Lomakkeessa: Story = {
  render: () => (
    <form style={{ display: 'grid', gap: 'var(--space-24)' }} onSubmit={(e) => e.preventDefault()}>
      <TextField label="Sähköposti" type="email" defaultValue="anna@pokela.fi" />
      <Select label="Rooli" name="rooli" options={ROOLIT} defaultValue="suunnittelija" />
      <Select
        label="Kieli"
        name="kieli"
        optional="(valinnainen)"
        placeholder="Sama kuin tiimillä"
        options={[
          { value: 'fi', label: 'Suomi' },
          { value: 'sv', label: 'Ruotsi' },
          { value: 'en', label: 'Englanti' },
        ]}
      />
      <div style={{ display: 'flex', gap: 'var(--space-16)' }}>
        <button type="submit" className="btn btn--primary">Lähetä kutsu</button>
        <button type="button" className="btn btn--ghost">Peruuta</button>
      </div>
    </form>
  ),
};

export const Tumma: Story = { ...Auki, globals: { theme: 'dark' } };

export const Mobiili: Story = { ...Valittu, globals: { viewport: { value: 'base' } } };
