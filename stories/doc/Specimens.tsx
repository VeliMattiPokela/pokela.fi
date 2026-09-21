// Ei react-tyyppi-importteja: näytepalat ovat puhtaita funktioita.
import tokens from '@/tokens.json';

/**
 * Dokumenttisivujen näytepalat.
 *
 * Kaikki lukevat arvot `tokens.json`:sta — yksikään luku tässä
 * tiedostossa ei ole kirjoitettu käsin. Jos token muuttuu,
 * dokumentaatio muuttuu, eikä sitä tarvitse muistaa päivittää.
 *
 * Jokainen näytepala kääritään `.sb-unstyled`-luokkaan. Storybookin
 * docs-container pakottaa muuten `font-size: 16px` kaikkiin
 * diveihin, jolloin display-näyte renderöityisi leipätekstin
 * kokoisena — eli näyttäisi väärää asiaa. `.sb-unstyled` on
 * Storybookin oma ulospääsy siitä resetistä.
 */

const colorKeys = Object.keys(tokens.color.light) as (keyof typeof tokens.color.light)[];
const typeKeys = Object.keys(tokens.type) as (keyof typeof tokens.type)[];

/* ---- väri -------------------------------------------------------- */

export function Swatches() {
  return (
    <table className="spec-table sb-unstyled">
      <thead>
        <tr>
          <th />
          <th>Token</th>
          <th>Light</th>
          <th>Dark</th>
          <th>Käyttö</th>
        </tr>
      </thead>
      <tbody>
        {colorKeys.map((name) => (
          <tr key={name}>
            <td>
              <span className="spec-chip" style={{ background: `var(--${name})` }} />
            </td>
            <td>
              <code>--{name}</code>
            </td>
            <td className="spec-num">{tokens.color.light[name]}</td>
            <td className="spec-num">{tokens.color.dark[name]}</td>
            <td className="spec-muted">{colorUse[name]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const colorUse: Record<string, string> = {
  paper: 'Sivun pinta',
  'paper-alt': 'Hiljainen vaihtoehtoinen pinta',
  line: 'Hiusviiva, erotin',
  'line-strong': 'Osion aloittava vahva viiva',
  ink: 'Leipäteksti, otsikot',
  'ink-muted': 'Toissijainen teksti',
  'ink-faint': 'Metatiedot, vaimennettu tila',
  'badge-surface': 'Hiljainen merkintäpinta',
  'invert-surface': 'Käännetty pinta — hover, nostopalkki',
  'invert-ink': 'Teksti käännetyllä pinnalla',
  'invert-faint': 'Metatieto käännetyllä pinnalla',
  'placeholder-base': 'Kuvapaikan pohja',
  'placeholder-stripe': 'Kuvapaikan raita',
};

/** Osoittaa että käännös toimii molempiin suuntiin samoilla nimillä. */
export function InvertDemo() {
  return (
    <div className="doc-grid-2 sb-unstyled">
      <div className="spec-box">
        <span className="meta">Normaali pinta</span>
        <p style={{ margin: 0 }}>Teksti on --ink, tausta on --paper.</p>
        <span className="meta">Metatieto on --ink-faint</span>
      </div>
      <div className="spec-box invert">
        <span className="meta">Käännetty pinta</span>
        <p style={{ margin: 0 }}>Teksti on --invert-ink, tausta on --invert-surface.</p>
        <span className="meta">Metatieto on --invert-faint</span>
      </div>
    </div>
  );
}

/* ---- typografia --------------------------------------------------- */

const sampleFor = (name: string) => {
  if (name.startsWith('display')) return 'Pokela';
  if (name.startsWith('meta')) return 'Senior Designer — Helsinki';
  return 'Suunnittelen käyttöliittymät ja kirjoitan ne itse tuotantoon.';
};

const classFor = (name: string) => {
  if (name.startsWith('display')) return `display-${name.split('-')[1]}`;
  if (name === 'meta') return 'meta';
  if (name === 'meta-s') return 'meta meta--s';
  if (name === 'body-l') return 'body-l';
  if (name === 'body-s') return 'body-s';
  return '';
};

export function TypeScale() {
  return (
    <div className="spec-type sb-unstyled">
      {typeKeys.map((name) => {
        const spec = tokens.type[name];
        const scale = (tokens.typeScale as Record<string, Record<string, string>>)[name];
        return (
          <div key={name} className="spec-type-row">
            <div className="spec-type-meta">
              <code>{name}</code>
              <span className="meta meta--s">
                {spec.size} · lh {spec.lineHeight}
                {'tracking' in spec ? ` · tr ${spec.tracking}` : ''} · {spec.weight}
              </span>
              {scale ? (
                <span className="meta meta--s spec-muted">
                  {Object.entries(scale)
                    .map(([level, value]) => `${level} ${value}`)
                    .join(' · ')}
                </span>
              ) : null}
            </div>
            <div className={classFor(name)}>{sampleFor(name)}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ---- grid --------------------------------------------------------- */

export function GridDemo({ columns = 12 }: { columns?: number }) {
  return (
    <div className="spec-grid sb-unstyled" style={{ ['--demo-cols' as string]: columns }}>
      {Array.from({ length: columns }).map((_, i) => (
        <span key={i} className="spec-grid-col">
          {i + 1}
        </span>
      ))}
    </div>
  );
}

export function GridTable() {
  const { columns, gutter, pagePadding, breakpoints, sectionGap } = tokens.layout;
  const levels = ['base', 'sm', 'md', 'lg'] as const;
  return (
    <table className="spec-table sb-unstyled">
      <thead>
        <tr>
          <th>Taso</th>
          <th>Alkaa</th>
          <th>Saraketta</th>
          <th>Gutter</th>
          <th>Sivun padding</th>
          <th>Osioväli</th>
        </tr>
      </thead>
      <tbody>
        {levels.map((level) => (
          <tr key={level}>
            <td>
              <code>{level}</code>
            </td>
            <td className="spec-num">{breakpoints[level]}</td>
            <td className="spec-num">{columns[level]}</td>
            <td className="spec-num">{gutter[level]}</td>
            <td className="spec-num">{pagePadding[level]}</td>
            <td className="spec-num">{sectionGap[level]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ---- välistys ----------------------------------------------------- */

export function SpaceScale() {
  return (
    <ul className="spec-space sb-unstyled">
      {Object.entries(tokens.space).map(([step, value]) => (
        <li key={step}>
          <code>--space-{step}</code>
          <span className="spec-space-bar" style={{ width: value }} />
          <span className="meta meta--s">{value}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---- viivat ------------------------------------------------------- */

/**
 * Viivat ja reunat. Hiusviiva on tämän systeemin tunnusomaisin token:
 * se on jokaisessa reunassa, jokaisessa listarivissä ja jokaisen
 * ikonin vedossa. Sitä ei ole erikseen ikoneille, jotta kahta
 * paksuutta ei voi syntyä.
 */
export function BorderScale() {
  const rows = [
    {
      token: '--hairline',
      value: tokens.border.hairline,
      what: 'Perusviiva. Rivien väli, reunat, ikonin veto.',
      demo: <span className="spec-line" style={{ borderTopWidth: tokens.border.hairline }} />,
    },
    {
      token: '--hairline-strong',
      value: tokens.border.hairlineStrong,
      what: 'Hover ja valittu tila. Sama arvo kuin fokusrenkaassa, mutta eri asia — toinen on typografiaa, toinen saavutettavuutta.',
      demo: <span className="spec-line" style={{ borderTopWidth: tokens.border.hairlineStrong }} />,
    },
    {
      token: '--radius',
      value: tokens.border.radius,
      what: 'Nolla kaikkialla. Siksi ikonien päätteet ovat tylpät ja kulmat terävät.',
      demo: <span className="spec-rule-demo" style={{ borderRadius: tokens.border.radius }} />,
    },
    {
      token: '--focus-width',
      value: tokens.border.focusWidth,
      what: 'Fokusrengas. Ei koskaan pois päältä.',
      demo: (
        <span
          className="spec-rule-demo"
          style={{ outline: `${tokens.border.focusWidth} solid var(--ink)`, outlineOffset: tokens.border.focusOffset }}
        />
      ),
    },
    {
      token: '--focus-offset',
      value: tokens.border.focusOffset,
      what: 'Renkaan etäisyys elementistä, jotta viiva ei istu kiinni tekstissä.',
      demo: null,
    },
  ];
  return (
    <table className="spec-table sb-unstyled">
      <thead>
        <tr>
          <th />
          <th>Token</th>
          <th>Arvo</th>
          <th>Mihin</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.token}>
            <td className="spec-line-cell">{row.demo}</td>
            <td>
              <code>{row.token}</code>
            </td>
            <td className="spec-num">{row.value}</td>
            <td className="spec-muted">{row.what}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ---- lukumitta ---------------------------------------------------- */

/**
 * Lukumitta näytetään oikealla tekstillä, ei palkilla: mitan koko
 * pointti on kuinka monta merkkiä riville mahtuu.
 */
export function MeasureDemo() {
  const sample =
    'Rivin pituus ratkaisee luettavuuden enemmän kuin fonttikoko. Kun rivi on liian pitkä, silmä kadottaa paikkansa rivinvaihdossa ja sama rivi luetaan kahdesti.';
  return (
    <div className="sb-unstyled spec-measure">
      <p className="body-l" style={{ maxWidth: tokens.layout.measure }}>
        {sample}
      </p>
      <p className="meta meta--s spec-muted">
        <code>--measure</code> — {tokens.layout.measure}
      </p>
    </div>
  );
}

/* ---- liike -------------------------------------------------------- */

export function MotionTable() {
  const rows = [
    { name: 'Nappi, linkki', token: '--dur-fast', value: tokens.motion.duration.fast, what: 'Taustan ja tekstin väri' },
    { name: 'Listarivi', token: '--dur-base', value: tokens.motion.duration.base, what: 'Pinnan käännös, ei liikettä' },
    { name: 'Sivunvaihto', token: '--dur-slow', value: tokens.motion.duration.slow, what: 'Ristihäivytys, ei slaidausta' },
    { name: 'Reveal', token: '--dur-reveal', value: tokens.motion.duration.reveal, what: `${tokens.motion.reveal.translate} nousu, stagger ${tokens.motion.reveal.stagger}` },
    { name: 'Ennen / jälkeen', token: '—', value: '0ms', what: 'Jakaja seuraa osoitinta 1:1' },
  ];
  return (
    <table className="spec-table sb-unstyled">
      <thead>
        <tr>
          <th>Mikä</th>
          <th>Token</th>
          <th>Kesto</th>
          <th>Mitä liikkuu</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.name}>
            <td>{row.name}</td>
            <td>
              <code>{row.token}</code>
            </td>
            <td className="spec-num">{row.value}</td>
            <td className="spec-muted">{row.what}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function EasingCurves() {
  const curves = [
    { name: '--ease-standard', value: tokens.motion.easing.standard },
    { name: '--ease-out', value: tokens.motion.easing.out },
  ];
  return (
    <div className="doc-grid-2 sb-unstyled">
      {curves.map((curve) => (
        <div key={curve.name} className="spec-box">
          <code>{curve.name}</code>
          <span className="meta meta--s spec-muted">{curve.value}</span>
          <span className="spec-ease" style={{ transitionTimingFunction: curve.value }} />
          <span className="meta meta--s">Vie osoitin päälle</span>
        </div>
      ))}
    </div>
  );
}

/* ---- tee / älä tee ------------------------------------------------ */

export function DoDont({ do: dos, dont }: { do: string[]; dont: string[] }) {
  return (
    <div className="doc-grid-2 sb-unstyled">
      <Column title="Tee" items={dos} />
      <Column title="Älä tee" items={dont} muted />
    </div>
  );
}

function Column({ title, items, muted }: { title: string; items: string[]; muted?: boolean }) {
  return (
    <div>
      <h4 className="meta spec-col-title">{title}</h4>
      <ul className="spec-list">
        {items.map((item) => (
          <li key={item} className={muted ? 'spec-muted' : undefined}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Yksittäisen näytteen kehys on stories/doc/Layout.tsx:ssä
   (<Specimen>), jotta samaa käytetään sekä docsissa että
   story-kankaalla. Täällä olisi toinen samanniminen komponentti. */
