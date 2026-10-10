import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import Icon from '@/components/Icon';
import { Row, Specimen, Stack } from '@/stories/doc/Layout';

/**
 * Button ei ole React-komponentti vaan luokkasopimus (`.btn`,
 * `.btn--primary`). Se on tarkoituksellista: nappi on useimmiten
 * `<a>` eikä `<button>`, ja luokat toimivat molemmilla ilman
 * `as`-propia.
 *
 * Nimi on Button eikä Napit, koska sama asia luetaan neljästä
 * paikasta: `styles/base.css`, `Button.figma.ts`, Figman
 * komponenttisetti ja tämä story. Yksi nimi, ei käännöstä.
 *
 * Story renderöi siksi elementin suoraan — se on sama merkkaus jota
 * sivusto käyttää.
 */
const meta = {
  title: 'Komponentit/Button',
  parameters: {
    docs: {
      description: {
        component: [
          'Padding 12/24 px, Archivo 500, korkeus vähintään 44 px. Radius 0, reunaviiva',
          '1 px, ei varjoja.',
          '',
          'Hover on käännös: primary vaihtaa mustan pinnan valkoiseksi ja saa musteviivan',
          '`border-color`-säännöstä — ei `box-shadow`-temppua, jotta "ei varjoja" pätee',
          'myös koodissa.',
          '',
          '`btn--text` on poikkeus: sillä ei ole pintaa jota kääntää, joten sen viiva',
          'paksunee `--hairline` → `--hairline-strong`. Padding kevenee saman verran,',
          'joten napin korkeus ei muutu eikä ympärillä oleva teksti nytkähdä.',
          '',
          'Kosketuslaitteella hover ei laukea; käännös tulee `:active`-tilassa.',
          '',
          'Koot `btn--s` (32 px) ja `btn--l` (56 px), oletus on m (44 px). Pelkkä ikoni on',
          '`btn--icon`: neliö, nimi aina `aria-label`illa (päätös 26).',
        ].join('\n'),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Neljä varianttia. Vie osoitin päälle nähdäksesi käännöksen. */
export const Variantit: Story = {
  render: () => (
    <Row width="narrow">
      <Specimen label="btn--primary" note="Päätoiminto. Yksi per näkymä.">
        <button type="button" className="btn btn--primary">
          Ota yhteyttä
        </button>
      </Specimen>

      <Specimen label="btn--ghost" note="Toissijainen. Sama koko, kevyempi paino.">
        <button type="button" className="btn btn--ghost">
          Katso työt
        </button>
      </Specimen>

      <Specimen label="btn--text" note="Tekstilinkki viivalla. Ei korkeusvaatimusta. Hover paksuntaa viivan.">
        <button type="button" className="btn btn--text">
          Lue case →
        </button>
      </Specimen>

      <Specimen label="disabled" note="Vaimennettu muste, viiva --line. Ei harmaata pintaa.">
        <button type="button" className="btn btn--ghost" disabled>
          Ei saatavilla
        </button>
      </Specimen>
    </Row>
  ),
};

/**
 * Sama luokka toimii linkkinä sellaisenaan — ei erillistä varianttia
 * eikä `as`-propia. Suurin osa sivuston napeista on `<a>`.
 */
export const Linkkina: Story = {
  render: () => (
    <Row width="narrow">
      <Specimen label="a.btn.btn--primary">
        <a href="#" className="btn btn--primary">
          Ota yhteyttä
        </a>
      </Specimen>
      <Specimen label="a.btn.btn--ghost">
        <a href="#" className="btn btn--ghost">
          Lataa CV (PDF)
        </a>
      </Specimen>
      <Specimen label="a.btn.btn--text">
        <a href="#" className="btn btn--text">
          Tietoa minusta →
        </a>
      </Specimen>
    </Row>
  ),
};

/**
 * Mobiilissa päätoiminto on täysleveä (`btn--block`), 600 px:stä
 * ylöspäin sisällön mukainen. Vaihda katselukokoa työkaluriviltä.
 */
export const TaysleveaMobiilissa: Story = {
  globals: { viewport: { value: 'base' } },
  render: () => (
    <Stack tight>
      <Specimen label="btn--block" fill>
        <a href="#" className="btn btn--primary btn--block">
          Ota yhteyttä
        </a>
      </Specimen>
      <Specimen label="btn--block" fill>
        <a href="#" className="btn btn--ghost btn--block">
          Lataa CV (PDF)
        </a>
      </Specimen>
    </Stack>
  ),
};

/** Samat luokat, sama merkkaus, käännetty pinta. */
export const Tumma: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <Row width="narrow">
      <Specimen label="btn--primary">
        <button type="button" className="btn btn--primary">
          Ota yhteyttä
        </button>
      </Specimen>
      <Specimen label="btn--ghost">
        <button type="button" className="btn btn--ghost">
          Katso työt
        </button>
      </Specimen>
      <Specimen label="btn--text">
        <button type="button" className="btn btn--text">
          Lue case →
        </button>
      </Specimen>
      <Specimen label="disabled">
        <button type="button" className="btn btn--ghost" disabled>
          Ei saatavilla
        </button>
      </Specimen>
    </Row>
  ),
};

/**
 * Kolme kokoa. m on oletus eikä tarvitse luokkaa. s tiiviisiin
 * näkymiin, l sivun ainoaan päätoimintoon. Tekstinapilla ei ole
 * kokoja.
 */
export const Koot: Story = {
  render: () => (
    <Stack>
      {(['primary', 'ghost'] as const).map((v) => (
        <Row key={v} width="narrow">
          <Specimen label={`btn--${v} btn--s`} note="32 px">
            <button type="button" className={`btn btn--${v} btn--s`}>
              Tallenna
            </button>
          </Specimen>
          <Specimen label={`btn--${v}`} note="44 px, oletus">
            <button type="button" className={`btn btn--${v}`}>
              Tallenna
            </button>
          </Specimen>
          <Specimen label={`btn--${v} btn--l`} note="56 px, teksti 16 px">
            <button type="button" className={`btn btn--${v} btn--l`}>
              Tallenna
            </button>
          </Specimen>
        </Row>
      ))}
      <Row width="narrow">
        <Specimen label="btn--s + ikoni">
          <button type="button" className="btn btn--ghost btn--s">
            Seuraava <Icon name="arrow-right" />
          </button>
        </Specimen>
        <Specimen label="+ ikoni">
          <button type="button" className="btn btn--ghost">
            Seuraava <Icon name="arrow-right" />
          </button>
        </Specimen>
        <Specimen label="btn--l + ikoni">
          <button type="button" className="btn btn--primary btn--l">
            Ota yhteyttä <Icon name="arrow-right" />
          </button>
        </Specimen>
      </Row>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const napit = within(canvasElement).getAllByRole('button', { name: 'Tallenna' });
    const korkeudet = napit.map((n) => Math.round(n.getBoundingClientRect().height));
    await expect(korkeudet).toEqual([32, 44, 56, 32, 44, 56]);
  },
};

/**
 * Pelkkä ikoni. Neliö, sivu = napin korkeus. Nimi `aria-label`illa:
 * ilman sitä ruudunlukija sanoisi vain "painike".
 */
export const PelkkaIkoni: Story = {
  render: () => (
    <Stack>
      <Row width="narrow">
        <Specimen label="btn--primary btn--icon btn--s">
          <button type="button" className="btn btn--primary btn--icon btn--s" aria-label="Lisää">
            <Icon name="plus" />
          </button>
        </Specimen>
        <Specimen label="btn--primary btn--icon">
          <button type="button" className="btn btn--primary btn--icon" aria-label="Lisää">
            <Icon name="plus" />
          </button>
        </Specimen>
        <Specimen label="btn--primary btn--icon btn--l" note="Ikoni l">
          <button type="button" className="btn btn--primary btn--icon btn--l" aria-label="Lisää">
            <Icon name="plus" />
          </button>
        </Specimen>
      </Row>
      <Row width="narrow">
        <Specimen label="btn--ghost btn--icon btn--s">
          <button type="button" className="btn btn--ghost btn--icon btn--s" aria-label="Sulje">
            <Icon name="close" />
          </button>
        </Specimen>
        <Specimen label="btn--ghost btn--icon">
          <button type="button" className="btn btn--ghost btn--icon" aria-label="Sulje">
            <Icon name="close" />
          </button>
        </Specimen>
        <Specimen label="btn--ghost btn--icon btn--l">
          <button type="button" className="btn btn--ghost btn--icon btn--l" aria-label="Sulje">
            <Icon name="close" />
          </button>
        </Specimen>
        <Specimen label="disabled">
          <button type="button" className="btn btn--ghost btn--icon" aria-label="Valikko" disabled>
            <Icon name="menu" />
          </button>
        </Specimen>
      </Row>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    for (const [nimi, sivut] of [
      ['Lisää', [32, 44, 56]],
      ['Sulje', [32, 44, 56]],
    ] as const) {
      const napit = c.getAllByRole('button', { name: nimi });
      for (const [i, n] of napit.entries()) {
        const r = n.getBoundingClientRect();
        await expect([Math.round(r.width), Math.round(r.height)]).toEqual([sivut[i], sivut[i]]);
      }
    }
  },
};

/**
 * s näyttää 32 px, mutta osuma-alue on --tap-min (44 px). Testi
 * osoittaa kohtaan 5 px näkyvän reunan yläpuolella ja odottaa nappia.
 */
export const Kosketusalue: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-12)', padding: 'var(--space-24)' }}>
      <button type="button" className="btn btn--ghost btn--s">
        Suodata
      </button>
      <button type="button" className="btn btn--ghost btn--icon btn--s" aria-label="Lisää">
        <Icon name="plus" />
      </button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    for (const nappi of [c.getByRole('button', { name: 'Suodata' }), c.getByRole('button', { name: 'Lisää' })]) {
      const r = nappi.getBoundingClientRect();
      const keski = r.left + r.width / 2;
      /* 44 px alue = 6 px kummallakin puolella. Reunalla 5,5 px. */
      await expect(document.elementFromPoint(keski, r.top - 5.5)).toBe(nappi);
      await expect(document.elementFromPoint(keski, r.bottom + 5.5)).toBe(nappi);
      await expect(document.elementFromPoint(keski, r.bottom + 6.5)).not.toBe(nappi);
    }
    const ikoni = c.getByRole('button', { name: 'Lisää' }).getBoundingClientRect();
    await expect(document.elementFromPoint(ikoni.left - 5.5, ikoni.top + ikoni.height / 2)).toBe(
      c.getByRole('button', { name: 'Lisää' }),
    );
  },
};
