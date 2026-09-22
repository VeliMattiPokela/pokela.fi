import type { Metadata } from 'next';
import { isLocale, path, type Locale } from '@/lib/i18n';
import { getWork } from '@/content/work';
import { getDictionary } from '@/content/dictionaries';
import tokens, { colorNames, typeNames, spaceSteps } from '@/lib/tokens';
import ListRow from '@/components/ListRow';
import { Grid, Col } from '@/components/Grid';
import Icon from '@/components/Icon';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: 'Design system',
    description: 'Tokenit, komponentit ja tilat elävinä — sama koodi jota sivusto käyttää.',
  };
}

export default async function SystemPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const dict = getDictionary(locale as Locale);

  return (
    <>
      <header className="page page-head">
        <h1 className="display-xl">{dict.system.title}</h1>
        <p className="meta">
          {colorNames.length} väriä · {typeNames.length} tyyliä · {spaceSteps.length} väliä
        </p>
      </header>

      <section className="page section">
        <p className="body-l measure">
          Tämä sivu lukee arvot <code className="code">tokens.json</code>:sta build-aikana. Jos
          token muuttuu, tämä sivu muuttuu — eikä sitä tarvitse muistaa päivittää. Sama tiedosto
          ajetaan jokaisessa buildissa <code className="code">styles/tokens.css</code>:ää vasten,
          ja build kaatuu jos ne eriytyvät.
        </p>
      </section>

      {/* ---- väri ------------------------------------------------ */}
      <section className="page section" aria-labelledby="color">
        <div className="section-head">
          <h2 id="color" className="meta">
            01 — Väri
          </h2>
          <span className="meta">Ei aksenttiväriä</span>
        </div>

        <p className="body-l measure sys__note">
          Kaksi teemaa, samat token-nimet, yksi määrittely per token
          (<code className="code">light-dark()</code>). Vaihda teemaa navin oikeasta reunasta —
          arvot alla vaihtuvat mukana.
        </p>

        <ul className="sys__swatches">
          {colorNames.map((name) => (
            <li key={name} className="sys__swatch">
              <span
                className="sys__chip"
                style={{ background: `var(--${name})` }}
                aria-hidden="true"
              />
              <span className="sys__swatch-name">--{name}</span>
              <span className="meta meta--s sys__swatch-values">
                {tokens.color.light[name]} / {tokens.color.dark[name]}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ---- typografia ------------------------------------------ */}
      <section className="page section" aria-labelledby="type">
        <div className="section-head">
          <h2 id="type" className="meta">
            02 — Typografia
          </h2>
          <span className="meta">Bodoni Moda + Archivo</span>
        </div>

        <div className="sys__type">
          {typeNames.map((name) => {
            const spec = tokens.type[name];
            const isDisplay = name.startsWith('display');
            const isMeta = name.startsWith('meta');
            return (
              <div key={name} className="sys__type-row">
                <div className="sys__type-meta">
                  <span className="meta meta--ink">{name}</span>
                  <span className="meta meta--s">
                    {spec.size} · lh {spec.lineHeight}
                    {'tracking' in spec ? ` · tr ${spec.tracking}` : ''}
                  </span>
                </div>
                <div
                  className={
                    isDisplay ? `display-${name.split('-')[1]}` : isMeta ? `meta ${name === 'meta-s' ? 'meta--s' : ''}` : ''
                  }
                  style={isMeta ? undefined : { fontSize: undefined }}
                >
                  {isDisplay
                    ? 'Pokela'
                    : isMeta
                      ? 'UX Engineer — Helsinki'
                      : 'Suunnittelen käyttöliittymät ja kirjoitan ne itse tuotantoon.'}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---- grid ------------------------------------------------ */}
      <section className="page section" aria-labelledby="grid">
        <div className="section-head">
          <h2 id="grid" className="meta">
            03 — Grid
          </h2>
          <span className="meta">
            {tokens.layout.columns.base} → {tokens.layout.columns.sm} → {tokens.layout.columns.md}{' '}
            saraketta
          </span>
        </div>

        <p className="body-l measure sys__note">
          Sarakemäärä on token, ei komponentin tieto. Kavenna ikkunaa — sarakkeet vähenevät
          itsestään.
        </p>

        <Grid className="sys__grid-demo">
          {Array.from({ length: 12 }).map((_, i) => (
            <Col key={i} base={1} sm={1} md={1}>
              <span className="sys__grid-col" />
            </Col>
          ))}
        </Grid>
      </section>

      {/* ---- välistys -------------------------------------------- */}
      <section className="page section" aria-labelledby="space">
        <div className="section-head">
          <h2 id="space" className="meta">
            04 — Välistys
          </h2>
          <span className="meta">4 px perusyksikkö</span>
        </div>

        <ul className="sys__space">
          {spaceSteps.map(([step, value]) => (
            <li key={step} className="sys__space-row">
              <span className="meta meta--ink">--space-{step}</span>
              <span className="sys__space-bar" style={{ width: value }} aria-hidden="true" />
              <span className="meta meta--s">{value}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ---- komponentit ----------------------------------------- */}
      <section className="section" aria-labelledby="components">
        <div className="page section-head">
          <h2 id="components" className="meta">
            05 — Komponentit
          </h2>
          <span className="meta">{dict.system.rules}</span>
        </div>

        <div className="page sys__buttons">
          <div className="sys__specimen">
            <span className="meta meta--s">btn--primary</span>
            <button type="button" className="btn btn--primary">
              {dict.about.contact}
            </button>
          </div>
          <div className="sys__specimen">
            <span className="meta meta--s">btn--ghost</span>
            <button type="button" className="btn btn--ghost">
              {dict.home.allWork}
            </button>
          </div>
          <div className="sys__specimen">
            <span className="meta meta--s">btn--text</span>
            <button type="button" className="btn btn--text">
              {dict.home.aboutLink} <Icon name="arrow-right" />
            </button>
          </div>
          <div className="sys__specimen">
            <span className="meta meta--s">disabled</span>
            <button type="button" className="btn btn--ghost" disabled>
              Ei saatavilla
            </button>
          </div>
        </div>

        <div className="page sys__specimen sys__specimen--wide">
          <span className="meta meta--s">{dict.system.listRowHint}</span>
        </div>
        <div className="list-rows">
          {getWork(locale as Locale).leads.slice(0, 2).map((lead) => (
            <ListRow
              key={lead.slug}
              title={lead.title}
              description={lead.tagline}
              meta={lead.meta}
              href={path(locale as Locale, 'work', lead.slug)}
            />
          ))}
        </div>
      </section>
    </>
  );
}
