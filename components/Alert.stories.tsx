import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import Alert from './Alert';
import TextField from './TextField';

/**
 * Inline-ilmoitus. Sivusto ei käytä tätä; se on sovellusnäkymiä ja
 * Makea varten (päätös 22). Axe tarkistaa jokaisen storyn, ja
 * play-funktiot tarkistavat roolin, sulkemisen ja kosketusalueen.
 */
const meta = {
  title: 'Komponentit/Alert',
  component: Alert,
  parameters: {
    docs: {
      description: {
        component: [
          'Vasen viiva `--hairline-strong`, ei pintaa eikä kehystä (päätös 29). Sävyt info, success ja error; vain virhe on värillinen (`--danger`), muut erottuvat ikonilla ja otsikolla.',
          'Virhe on `role="alert"`, muut `role="status"`. Sulkunappi on näkyvästi 32 px, osuma-alue `--tap-min`.',
        ].join('\n\n'),
      },
    },
  },
  args: {
    tone: 'info',
    title: 'Kutsu vanhenee 7 päivässä',
    children: 'Kutsutut näkevät tiimin vasta, kun hyväksyvät kutsun.',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 'var(--measure)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('status')).toHaveTextContent('Kutsu vanhenee 7 päivässä');
  },
};

export const Onnistui: Story = {
  args: { tone: 'success', title: 'Asetukset tallennettu', children: 'Muutokset näkyvät tiimille heti.' },
};

export const Virhe: Story = {
  args: {
    tone: 'error',
    title: 'Laskua ei voitu veloittaa',
    children: 'Kortti hylättiin 3.10. Päivitä maksutapa, ettei tilaus keskeydy.',
    action: (
      <a className="btn btn--text" href="#maksutapa">
        Päivitä maksutapa
      </a>
    ),
  },
  play: async ({ canvasElement }) => {
    const ilmoitus = within(canvasElement).getByRole('alert');
    await expect(ilmoitus).toHaveTextContent('Laskua ei voitu veloittaa');
    /* Virheen viiva on danger, ei muste: väri luetaan tokenista. */
    const danger = getComputedStyle(document.documentElement).getPropertyValue('--danger').trim();
    const probe = document.createElement('span');
    probe.style.color = danger;
    document.body.append(probe);
    const odotettu = getComputedStyle(probe).color;
    probe.remove();
    await expect(getComputedStyle(ilmoitus).borderLeftColor).toBe(odotettu);
  },
};

export const PelkkaOtsikko: Story = { args: { tone: 'success', title: 'Kutsu lähetetty', children: undefined } };

/** Sulkeminen: nappi on nimetty, poistaa ilmoituksen, ja osuma-alue on --tap-min. */
export const Suljettava: Story = {
  render: (args) => {
    const Suljettava = () => {
      const [auki, setAuki] = useState(true);
      return auki ? <Alert {...args} onDismiss={() => setAuki(false)} /> : <p className="body-s muted">Suljettu.</p>;
    };
    return <Suljettava />;
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const nappi = c.getByRole('button', { name: 'Sulje' });
    const r = nappi.getBoundingClientRect();
    await expect(Math.round(r.height)).toBe(32);
    /* Osuma-alue: piste 5 px napin yläpuolella osuu yhä nappiin. */
    const osuma = document.elementFromPoint(r.left + r.width / 2, r.top - 5);
    await expect(nappi.contains(osuma)).toBe(true);
    await userEvent.click(nappi);
    await expect(c.queryByRole('status')).toBeNull();
    await expect(c.getByText('Suljettu.')).toBeVisible();
  },
};

/** Kaikki sävyt pinossa. */
export const Savyt: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-24)' }}>
      <Alert title="Kutsu vanhenee 7 päivässä" onDismiss={() => {}}>
        Kutsutut näkevät tiimin vasta, kun hyväksyvät kutsun.
      </Alert>
      <Alert tone="success" title="Asetukset tallennettu" onDismiss={() => {}}>
        Muutokset näkyvät tiimille heti.
      </Alert>
      <Alert
        tone="error"
        title="Laskua ei voitu veloittaa"
        action={
          <a className="btn btn--text" href="#maksutapa">
            Päivitä maksutapa
          </a>
        }
      >
        Kortti hylättiin 3.10. Päivitä maksutapa, ettei tilaus keskeydy.
      </Alert>
    </div>
  ),
};

/** Lomakkeen virhekooste ylhäällä, kentän virhe alla. */
export const Lomakkeessa: Story = {
  render: () => (
    <form style={{ display: 'grid', gap: 'var(--space-24)' }} onSubmit={(e) => e.preventDefault()}>
      <Alert tone="error" title="Kutsua ei lähetetty">
        Korjaa sähköpostiosoite ja yritä uudelleen.
      </Alert>
      <TextField label="Sähköposti" type="email" defaultValue="anna@pokela" error="Tarkista osoite, esim. anna@pokela.fi." />
      <TextField label="Nimi" defaultValue="Anna" />
      <div style={{ display: 'flex', gap: 'var(--space-16)' }}>
        <button type="submit" className="btn btn--primary">Lähetä kutsu</button>
        <button type="button" className="btn btn--ghost">Peruuta</button>
      </div>
    </form>
  ),
};

export const Tumma: Story = { ...Savyt, globals: { theme: 'dark' } };

export const Mobiili: Story = { ...Savyt, globals: { viewport: { value: 'base' } } };
