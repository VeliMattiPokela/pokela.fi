import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import Dialog, { type DialogProps } from './Dialog';
import TextField from './TextField';

/**
 * Dialogi. Sivusto ei käytä tätä; se on sovellusnäkymiä ja Makea
 * varten (päätös 22). Fokus, Esc, verho ja sulkunappi testataan
 * tässä, ja axe tarkistaa jokaisen storyn.
 */
type Esitys = Omit<DialogProps, 'open' | 'onClose'> & { alussaAuki?: boolean; avaa?: string };

function Esitys({ alussaAuki = true, avaa = 'Poista jäsen', actions, ...props }: Esitys) {
  const [auki, setAuki] = useState(alussaAuki);
  const sulje = () => setAuki(false);
  return (
    <>
      <button type="button" className="btn btn--ghost btn--s" onClick={() => setAuki(true)}>
        {avaa}
      </button>
      <Dialog
        {...props}
        open={auki}
        onClose={sulje}
        actions={
          actions ?? (
            <>
              <button type="button" className="btn btn--ghost btn--s" onClick={sulje}>
                Peruuta
              </button>
              <button type="button" className="btn btn--primary btn--s" onClick={sulje}>
                Poista jäsen
              </button>
            </>
          )
        }
      />
    </>
  );
}

const meta = {
  title: 'Komponentit/Dialog',
  component: Esitys,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Modaalinen dialogi. Sivu peittyy paperin sävyisellä verholla, ja dialogi on paperia musteen hiusviivakehyksellä: ei varjoa eikä uutta väriä (päätös 31). Mobiilissa alareunan arkki, napit täysleveinä ja ensisijainen ylimpänä.',
          'Natiivi `<dialog>` ja `showModal()`: fokus pysyy dialogissa, Esc ja verhon klikkaus kutsuvat `onClose`a, ja suljettaessa fokus palaa avanneeseen nappiin. Napit vähiten vahingollinen ensin, jolloin vahvistuksessa alkufokus on Peruuta-napissa.',
        ].join('\n\n'),
      },
    },
  },
  args: {
    title: 'Poistetaanko Sara Niemi tiimistä?',
    description: 'Pääsy tiimin projekteihin päättyy heti. Voit kutsua jäsenen takaisin myöhemmin.',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-32)', minHeight: '480px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Esitys>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vahvistus: Story = {};

/** Lomake dialogissa: alkufokus on ensimmäisessä kentässä. */
export const Lomakkeessa: Story = {
  args: {
    title: 'Kutsu jäsen',
    description: 'Kutsu lähtee sähköpostiin ja on voimassa 7 päivää.',
    avaa: 'Kutsu jäsen',
    children: (
      <>
        <TextField label="Sähköposti" type="email" defaultValue="sara@pokela.fi" />
        <TextField label="Viesti" optional="(valinnainen)" placeholder="Tervetuloa tiimiin" />
      </>
    ),
    actions: (
      <>
        <button type="button" className="btn btn--ghost btn--s">
          Peruuta
        </button>
        <button type="submit" className="btn btn--primary btn--s">
          Lähetä kutsu
        </button>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await waitFor(() => expect(c.getByRole('textbox', { name: 'Sähköposti' })).toHaveFocus());
  },
};

/** Avaus, alkufokus, Esc ja fokuksen paluu avanneeseen nappiin. */
export const Nappaimisto: Story = {
  args: { alussaAuki: false },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const avaaja = c.getByRole('button', { name: 'Poista jäsen' });
    await userEvent.click(avaaja);

    const dialogi = c.getByRole('dialog', { name: 'Poistetaanko Sara Niemi tiimistä?' });
    await expect(dialogi).toHaveAttribute('open');
    await expect(dialogi).toHaveAccessibleDescription(/Pääsy tiimin projekteihin/);
    /* Vähiten vahingollinen saa alkufokuksen, ei sulkunappi. */
    await expect(within(dialogi).getByRole('button', { name: 'Peruuta' })).toHaveFocus();

    /* Esc: testin näppäinpainallus ei laukaise selaimen omaa Esc-käsittelyä,
       joten lähetetään sama cancel-tapahtuma, jonka selain Escistä lähettää. */
    fireEvent(dialogi, new Event('cancel', { cancelable: true }));
    await waitFor(() => expect(dialogi).not.toHaveAttribute('open'));
    await expect(avaaja).toHaveFocus();
  },
};

/** Verhon klikkaus sulkee, sisällön klikkaus ei. */
export const Verho: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const dialogi = c.getByRole('dialog');
    await userEvent.click(within(dialogi).getByText(/Pääsy tiimin projekteihin/));
    await expect(dialogi).toHaveAttribute('open');
    /* Verhon klikkaus kohdistuu itse <dialog>-elementtiin. */
    fireEvent.click(dialogi);
    await waitFor(() => expect(dialogi).not.toHaveAttribute('open'));
  },
};

/** Sulkunappi: näkyvä 32 px, osuma-alue --tap-min. */
export const Sulkunappi: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const nappi = c.getByRole('button', { name: 'Sulje' });
    const r = nappi.getBoundingClientRect();
    await expect(Math.round(r.height)).toBe(32);
    const osuma = document.elementFromPoint(r.left + r.width / 2, r.bottom + 5);
    await expect(nappi.contains(osuma)).toBe(true);
    await userEvent.click(nappi);
    await waitFor(() => expect(c.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open'));
  },
};

export const Tumma: Story = { globals: { theme: 'dark' } };

export const Mobiili: Story = {
  ...Lomakkeessa,
  globals: { viewport: { value: 'base' } },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const dialogi = c.getByRole('dialog');
    await Promise.all(dialogi.getAnimations().map((a) => a.finished));
    /* Arkki on alareunassa ja koko levyinen. */
    const r = dialogi.getBoundingClientRect();
    await expect(Math.round(r.bottom)).toBe(window.innerHeight);
    await expect(Math.round(r.width)).toBe(document.documentElement.clientWidth);
  },
};
