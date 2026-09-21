import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Grid, Col } from './Grid';

/**
 * Layoutin perusta. Sarakemäärä tulee tokenista `--columns`, joten
 * komponentti ei tiedä breakpointeista mitään.
 */
const meta = {
  title: 'Komponentit/Grid',
  component: Grid,
  parameters: {
    /* Täysleveä: hoitaa oman sivupaddinginsa .bleed-utilitylla. */
    bleed: true,
    docs: {
      description: {
        component: [
          'Sijoittelu annetaan sarakkeina, ei pikseleinä. `<Col base={4} md={7}>` on koko',
          'leveys mobiilissa ja 7/12 työpöydällä.',
          '',
          'Kavenna katselukokoa: sama merkintä antaa 12 → 8 → 4 saraketta ilman että',
          'mitään kirjoitetaan uudelleen.',
        ].join('\n'),
      },
    },
  },
  /* Jokainen story renderöi oman layoutinsa, joten meta antaa vain
     tyhjän lapsen tyypintarkistusta varten. */
  args: { children: null },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Sarakkeen havainnollistus. Sama luokka kuin Perusta/Grid-sivulla,
   jotta demo ei eriydy dokumentaatiosta. */
const Block = ({ children }: { children: React.ReactNode }) => (
  <span className="spec-grid-col">{children}</span>
);

/** Kaikki 12 saraketta näkyvissä. */
export const Sarakkeet: Story = {
  render: () => (
    <div className="page">
      <Grid>
        {Array.from({ length: 12 }).map((_, i) => (
          <Col key={i} base={1} sm={1} md={1}>
            <Block>{i + 1}</Block>
          </Col>
        ))}
      </Grid>
    </div>
  ),
};

/**
 * Etusivun väitelause: teksti sarakkeilla 1–7, ingressi 9–12.
 * Sama merkintä pinoutuu mobiilissa itsestään.
 */
export const EtusivunVaitelause: Story = {
  render: () => (
    <div className="page">
      <Grid>
        <Col base={4} sm={8} md={7}>
          <p className="display-m sb-flush">
            Rakennan tuotteita, jotka toimivat myös silloin kun demo on ohi.
          </p>
        </Col>
        <Col base={4} sm={8} md={4} startMd={9}>
          <p className="body-l measure sb-flush sb-muted">
            Suunnittelen käyttöliittymät ja kirjoitan ne itse tuotantoon. Viimeisimmät
            kaksi projektia: Colliers Asunnot ja oma tuotteeni Blokbook.
          </p>
        </Col>
      </Grid>
    </div>
  ),
};

/** Sama kuin yllä, mobiilissa: yksi palsta, neljä saraketta. */
export const Mobiili: Story = {
  globals: { viewport: { value: 'base' } },
  render: () => (
    <div className="page">
      <Grid>
        {Array.from({ length: 4 }).map((_, i) => (
          <Col key={i} base={1} sm={1} md={1}>
            <Block>{i + 1}</Block>
          </Col>
        ))}
      </Grid>
    </div>
  ),
};

/** Sarakkeet ja käännetty kaista tummassa teemassa. */
export const Tumma: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div className="page">
      <Grid>
        {Array.from({ length: 12 }).map((_, i) => (
          <Col key={i} base={1} sm={1} md={1}>
            <Block>{i + 1}</Block>
          </Col>
        ))}
      </Grid>
    </div>
  ),
};

/**
 * `.bleed` ulottuu reunaan mutta pitää sisällön samassa linjassa
 * `.page`:n kanssa. Käännetty palkki on tyypillinen käyttö.
 */
export const Bleed: Story = {
  render: () => (
    <>
      <div className="page">
        <p className="meta">Sisältö .page-käärössä</p>
      </div>
      <div className="invert bleed sb-band">
        <p className="display-m sb-band__text">Sama ihminen piirtää ja rakentaa.</p>
      </div>
      <div className="page">
        <p className="meta">Sisältö jatkuu samassa linjassa</p>
      </div>
    </>
  ),
};
