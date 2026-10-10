import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import Tabs from './Tabs';
import Tab from './Tab';
import TextField from './TextField';

/**
 * Välilehdet. Sivusto ei käytä näitä; ne ovat sovellusnäkymiä ja
 * Makea varten (päätös 22). Näppäimistö ja ARIA testataan tässä:
 * Näppäimistö- ja Hiiri-storyt ajavat play-funktion, ja axe
 * tarkistaa jokaisen storyn.
 */
const Paneeli = ({ children }: { children: string }) => <p className="body-s muted">{children}</p>;

const meta = {
  title: 'Komponentit/Tabs',
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component: [
          'Rivi välilehtiä hiusviivan päällä. Valittu saa musteviivan `--hairline-strong`, muut ovat `--ink-muted` ja tummuvat hoverissa. Sama kieli kuin navin aktiivinen linkki (päätös 28).',
          'Näppäimistö WAI-ARIA APG:n Tabs-mallin mukaan: vasen ja oikea nuoli siirtävät ja valitsevat, Home ja End vievät päihin, Tab vie paneeliin. Pois käytöstä olevat ohitetaan. Kapealla näytöllä rivi vierittyy.',
        ].join('\n\n'),
      },
    },
  },
  args: { label: 'Asetukset', children: null },
  render: (args) => (
    <Tabs {...args}>
      <Tab value="yleiset" label="Yleiset">
        <Paneeli>Nimi, kieli ja aikavyöhyke.</Paneeli>
      </Tab>
      <Tab value="tiimi" label="Tiimi">
        <Paneeli>Jäsenet ja roolit.</Paneeli>
      </Tab>
      <Tab value="ilmoitukset" label="Ilmoitukset">
        <Paneeli>Sähköposti ja ilmoitukset sovelluksessa.</Paneeli>
      </Tab>
      <Tab value="laskutus" label="Laskutus">
        <Paneeli>Tilaus ja laskut.</Paneeli>
      </Tab>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Oletus: Story = {};

export const Valittu: Story = { args: { defaultValue: 'tiimi' } };

/** Lukumäärä tekstin perässä, viimeinen pois käytöstä. */
export const LukumaaraJaDisabled: Story = {
  args: { label: 'Tehtävät' },
  render: (args) => (
    <Tabs {...args}>
      <Tab value="avoimet" label="Avoimet" count={12}>
        <Paneeli>12 avointa tehtävää.</Paneeli>
      </Tab>
      <Tab value="valmiit" label="Valmiit" count={48}>
        <Paneeli>48 valmista tehtävää.</Paneeli>
      </Tab>
      <Tab value="arkisto" label="Arkisto" count={0} disabled>
        <Paneeli>Arkisto on tyhjä.</Paneeli>
      </Tab>
    </Tabs>
  ),
};

/** Näppäimistö APG:n mukaan: nuolet kiertävät, Home ja End, Tab paneeliin. */
export const Nappaimisto: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const tab = (nimi: string) => c.getByRole('tab', { name: nimi });

    await userEvent.tab();
    await expect(tab('Yleiset')).toHaveFocus();
    await expect(tab('Yleiset')).toHaveAttribute('aria-selected', 'true');
    /* Vain valittu on sarkainjärjestyksessä. */
    await expect(tab('Tiimi')).toHaveAttribute('tabindex', '-1');

    await userEvent.keyboard('{ArrowRight}');
    await expect(tab('Tiimi')).toHaveFocus();
    await expect(tab('Tiimi')).toHaveAttribute('aria-selected', 'true');
    await expect(c.getByRole('tabpanel')).toHaveTextContent('Jäsenet ja roolit.');

    await userEvent.keyboard('{End}');
    await expect(tab('Laskutus')).toHaveFocus();
    /* Oikealta reunasta alkuun. */
    await userEvent.keyboard('{ArrowRight}');
    await expect(tab('Yleiset')).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(tab('Laskutus')).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(tab('Yleiset')).toHaveFocus();

    /* Tab vie paneeliin, joka kuuluu valitulle välilehdelle. */
    await userEvent.tab();
    const paneeli = c.getByRole('tabpanel');
    await expect(paneeli).toHaveFocus();
    await expect(paneeli).toHaveAttribute('aria-labelledby', tab('Yleiset').id);
    await expect(tab('Yleiset')).toHaveAttribute('aria-controls', paneeli.id);
  },
};

/** Pois käytöstä oleva ohitetaan nuolilla eikä klikkaus valitse sitä. */
export const Ohitus: Story = {
  ...LukumaaraJaDisabled,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const tab = (nimi: RegExp) => c.getByRole('tab', { name: nimi });
    await userEvent.click(tab(/Arkisto/));
    await expect(tab(/Avoimet/)).toHaveAttribute('aria-selected', 'true');
    await expect(tab(/Arkisto/)).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(tab(/Valmiit/));
    await expect(tab(/Valmiit/)).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tab(/Avoimet/)).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(tab(/Valmiit/)).toHaveFocus();
  },
};

/** Hiiri: klikkaus valitsee ja vaihtaa paneelin. */
export const Hiiri: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('tab', { name: 'Ilmoitukset' }));
    await expect(c.getByRole('tab', { name: 'Ilmoitukset' })).toHaveAttribute('aria-selected', 'true');
    await expect(c.getByRole('tabpanel')).toHaveTextContent('Sähköposti');
    await expect(c.getAllByRole('tabpanel', { hidden: true })).toHaveLength(4);
  },
};

/** Fokusrengas on välilehden sisällä, joten vierittyvä rivi ei leikkaa sitä. */
export const Fokusrengas: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.tab();
    const t = c.getByRole('tab', { name: 'Yleiset' });
    const tyyli = getComputedStyle(t);
    await expect(tyyli.outlineStyle).toBe('solid');
    await expect(parseFloat(tyyli.outlineOffset)).toBeLessThan(0);
    /* Teksti alkaa palstan reunasta, vaikka välilehdellä on sisennys. */
    const lista = c.getByRole('tablist');
    const reuna = lista.parentElement!.getBoundingClientRect().left;
    const teksti = document.createRange();
    teksti.selectNodeContents(t.firstChild!);
    await expect(Math.round(teksti.getBoundingClientRect().left - reuna)).toBe(0);
  },
};

/** Välilehdet asetusnäkymässä, kuten Make-näkymässä. */
export const Asetuksissa: Story = {
  render: () => (
    <Tabs label="Asetukset" defaultValue="tiimi">
      <Tab value="yleiset" label="Yleiset">
        <Paneeli>Nimi, kieli ja aikavyöhyke.</Paneeli>
      </Tab>
      <Tab value="tiimi" label="Tiimi" count={4}>
        <form style={{ display: 'grid', gap: 'var(--space-24)' }} onSubmit={(e) => e.preventDefault()}>
          <TextField label="Tiimin nimi" defaultValue="Suunnittelu" />
          <TextField label="Yhteyshenkilö" type="email" defaultValue="anna@pokela.fi" />
          <div style={{ display: 'flex', gap: 'var(--space-16)' }}>
            <button type="submit" className="btn btn--primary">Tallenna</button>
            <button type="button" className="btn btn--ghost">Peruuta</button>
          </div>
        </form>
      </Tab>
      <Tab value="ilmoitukset" label="Ilmoitukset">
        <Paneeli>Sähköposti ja ilmoitukset sovelluksessa.</Paneeli>
      </Tab>
      <Tab value="laskutus" label="Laskutus">
        <Paneeli>Tilaus ja laskut.</Paneeli>
      </Tab>
    </Tabs>
  ),
};

export const Tumma: Story = { ...Valittu, globals: { theme: 'dark' } };

export const Mobiili: Story = { ...Asetuksissa, globals: { viewport: { value: 'base' } } };
