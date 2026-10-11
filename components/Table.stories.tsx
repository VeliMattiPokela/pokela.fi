import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import Table, { type TableColumn } from './Table';
import Icon from './Icon';

/**
 * Taulukko. Sivusto ei käytä tätä; se on sovellusnäkymiä ja Makea
 * varten (päätös 22). Lajittelu, ARIA ja vieritys testataan tässä,
 * ja axe tarkistaa jokaisen storyn.
 */
type Jasen = {
  id: string;
  nimi: string;
  rooli: string;
  tiimi: string;
  liittynyt: string;
  muutoksia: number;
  tila: 'aktiivinen' | 'virhe' | 'kutsuttu';
};

const JASENET: Jasen[] = [
  { id: 'anna', nimi: 'Anna Virtanen', rooli: 'Suunnittelija', tiimi: 'Suunnittelu', liittynyt: '2026-09-12', muutoksia: 14, tila: 'aktiivinen' },
  { id: 'mikko', nimi: 'Mikko Laine', rooli: 'Kehittäjä', tiimi: 'Alusta', liittynyt: '2026-10-03', muutoksia: 128, tila: 'aktiivinen' },
  { id: 'sara', nimi: 'Sara Niemi', rooli: 'Tuoteomistaja', tiimi: 'Maksut', liittynyt: '2026-08-28', muutoksia: 7, tila: 'virhe' },
  { id: 'juho', nimi: 'Juho Korhonen', rooli: 'Tutkija', tiimi: 'Suunnittelu', liittynyt: '2026-10-01', muutoksia: 1024, tila: 'kutsuttu' },
];

const pvm = (iso: string) => {
  const [v, k, p] = iso.split('-').map(Number);
  return `${p}.${k}.${v}`;
};

const Tila = ({ tila }: { tila: Jasen['tila'] }) =>
  tila === 'aktiivinen' ? (
    <span className="table__status">
      <Icon name="check" />
      Aktiivinen
    </span>
  ) : tila === 'virhe' ? (
    <span className="table__status table__status--error">
      <Icon name="alert" />
      Maksu epäonnistui
    </span>
  ) : (
    <span className="table__muted">Kutsuttu</span>
  );

const SARAKKEET: TableColumn<Jasen>[] = [
  { key: 'nimi', header: 'Nimi', sortable: true },
  { key: 'rooli', header: 'Rooli', muted: true, sortable: true },
  { key: 'tiimi', header: 'Tiimi', muted: true },
  { key: 'liittynyt', header: 'Liittynyt', muted: true, sortable: true, cell: (r) => pvm(r.liittynyt) },
  {
    key: 'muutoksia',
    header: 'Muutoksia',
    numeric: true,
    sortable: true,
    cell: (r) => r.muutoksia.toLocaleString('fi-FI'),
  },
  { key: 'tila', header: 'Tila', cell: (r) => <Tila tila={r.tila} /> },
  {
    key: 'toiminnot',
    header: 'Toiminnot',
    hideHeader: true,
    numeric: true,
    cell: (r) => (
      <a className="table__action" href={`#${r.id}`}>
        Muokkaa<span className="visually-hidden"> {r.nimi}</span>
      </a>
    ),
  },
];

const meta = {
  title: 'Komponentit/Table',
  component: Table<Jasen>,
  parameters: {
    docs: {
      description: {
        component: [
          'Rivit hiusviivalla, otsikkorivin alla musteviiva. Ei pystyviivoja, raitoja eikä pintaa. Otsikot ovat metatekstiä, data Body/S:ää, ja rivi on vähintään `--tap-min` (päätös 30).',
          'Luvut oikealle ja tasalevyisin numeroin. Lajiteltava otsikko on nappi, ja `<th>` kertoo järjestyksen `aria-sort`illa. Kun taulukko ei mahdu, se vierittyy, ensimmäinen sarake pysyy paikallaan ja laatikkoon pääsee sarkaimella.',
        ].join('\n\n'),
      },
    },
  },
  args: {
    caption: 'Tiimin jäsenet',
    columns: SARAKKEET,
    rows: JASENET,
    rowKey: (r: Jasen) => r.id,
    defaultSort: { key: 'nimi', direction: 'ascending' },
  },
} satisfies Meta<typeof Table<Jasen>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Oletus: Story = {};

/** Nimi näkyvästi taulukon yläpuolella. */
export const NakyvaNimi: Story = { args: { showCaption: true } };

/** Ei lajittelua: rivit annetussa järjestyksessä. */
export const Lajittelematon: Story = { args: { defaultSort: null } };

export const Tyhja: Story = {
  args: { rows: [], empty: 'Ei jäseniä. Kutsu ensimmäinen jäsen tiimiin.' },
};

const nimet = (c: ReturnType<typeof within>) =>
  c.getAllByRole('row').slice(1).map((r: HTMLElement) => within(r).getAllByRole('cell')[0].textContent);

/** Klikkaus lajittelee, toinen klikkaus kääntää. aria-sort seuraa. */
export const Lajittelu: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const otsikko = (nimi: string) => c.getByRole('columnheader', { name: nimi });

    await expect(c.getByRole('table', { name: 'Tiimin jäsenet' })).toBeInTheDocument();
    await expect(otsikko('Nimi')).toHaveAttribute('aria-sort', 'ascending');
    await expect(otsikko('Rooli')).toHaveAttribute('aria-sort', 'none');
    /* Lajittelematon sarake ei saa aria-sortia lainkaan. */
    await expect(otsikko('Tiimi')).not.toHaveAttribute('aria-sort');
    await expect(nimet(c)).toEqual(['Anna Virtanen', 'Juho Korhonen', 'Mikko Laine', 'Sara Niemi']);

    await userEvent.click(c.getByRole('button', { name: 'Muutoksia' }));
    await expect(otsikko('Muutoksia')).toHaveAttribute('aria-sort', 'ascending');
    await expect(otsikko('Nimi')).toHaveAttribute('aria-sort', 'none');
    /* Luvut lajitellaan lukuina: 7 ennen 14:ää ja 1 024 viimeisenä. */
    await expect(nimet(c)).toEqual(['Sara Niemi', 'Anna Virtanen', 'Mikko Laine', 'Juho Korhonen']);

    await userEvent.click(c.getByRole('button', { name: 'Muutoksia' }));
    await expect(otsikko('Muutoksia')).toHaveAttribute('aria-sort', 'descending');
    await expect(nimet(c)).toEqual(['Juho Korhonen', 'Mikko Laine', 'Anna Virtanen', 'Sara Niemi']);

    /* Näppäimistö: Enter lajittelee fokusoidun sarakkeen. */
    c.getByRole('button', { name: 'Liittynyt' }).focus();
    await userEvent.keyboard('{Enter}');
    await expect(otsikko('Liittynyt')).toHaveAttribute('aria-sort', 'ascending');
    await expect(nimet(c)[0]).toBe('Sara Niemi');
  },
};

/** Rivi on --tap-min hiusviivoineen. Lajittelunappi ja toimintolinkki
    ovat rivin korkuisia osumia. */
export const Mitat: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const [otsikkorivi, rivi] = c.getAllByRole('row');
    await expect(Math.round(otsikkorivi.getBoundingClientRect().height)).toBe(44);
    await expect(Math.round(rivi.getBoundingClientRect().height)).toBe(44);
    await expect(Math.round(c.getByRole('button', { name: 'Nimi' }).getBoundingClientRect().height)).toBe(43);
    /* Linkin osuma-alue on rivin korkuinen: piste 10 px tekstin
       yläpuolella osuu yhä linkkiin. */
    const linkki = c.getByRole('link', { name: 'Muokkaa Anna Virtanen' });
    const r = linkki.getBoundingClientRect();
    await expect(linkki.contains(document.elementFromPoint(r.left + r.width / 2, r.top - 10))).toBe(true);
    const luku = within(rivi).getAllByRole('cell')[4];
    await expect(getComputedStyle(luku).textAlign).toBe('right');
    await expect(getComputedStyle(luku).fontVariantNumeric).toBe('tabular-nums');
  },
};

export const Tumma: Story = { globals: { theme: 'dark' } };

/** Kapealla näytöllä taulukko vierittyy ja ensimmäinen sarake pysyy. */
export const Mobiili: Story = {
  globals: { viewport: { value: 'base' } },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const alue = c.getByRole('region', { name: 'Tiimin jäsenet' });
    await expect(alue).toHaveAttribute('tabindex', '0');
    const eka = c.getAllByRole('row')[1].firstElementChild as HTMLElement;
    const ennen = eka.getBoundingClientRect().left;
    alue.scrollLeft = 200;
    alue.dispatchEvent(new Event('scroll'));
    await expect(Math.round(eka.getBoundingClientRect().left)).toBe(Math.round(ennen));
    await expect(alue).toHaveAttribute('data-scrolled');
    alue.scrollLeft = 0;
    alue.dispatchEvent(new Event('scroll'));
  },
};
