import type { Meta, StoryObj } from '@storybook/nextjs-vite';
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
