import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { isLocale, locales, path, SYSTEM_CASE, type Locale } from '@/lib/i18n';
import { getWork } from '@/content/work';
import { getDictionary } from '@/content/dictionaries';
import { getSystem, tayta, type System } from '@/content/system';
import tokens, { colorNames, typeNames, spaceSteps } from '@/lib/tokens';
import ListRow from '@/components/ListRow';
import { Grid, Col } from '@/components/Grid';
import Icon, { ICON_NAMES } from '@/components/Icon';
import Media from '@/components/Media';
import LogoRow from '@/components/LogoRow';
import Timeline, { TimelineItem } from '@/components/Timeline';
import {
  AccordionNayte,
  AlertNayte,
  DialogNayte,
  LomakeNayte,
  TabsNayte,
  TaulukkoNayte,
  ValintaNayte,
} from './Naytteet';
import SivuKerroksina from '@/components/SivuKerroksina';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';

/**
 * Komponenttiosion ryhmät. Jokainen kirjaston komponentti on täsmälleen
 * yhdessä ryhmässä; määrä lasketaan tästä, ei kirjoiteta käsin.
 */
const RYHMAT = [
  /* Ryhmän nimi ja kuvaus ovat content/system/:ssä kielittäin. */
  { id: 'perusosat', komponentit: ['Button', 'Icon'] },
  { id: 'lomakkeet', komponentit: ['TextField', 'Select', 'Checkbox', 'Radio', 'Switch', 'ChoiceGroup'] },
  { id: 'navigaatio', komponentit: ['Nav', 'Tabs', 'Accordion', 'Footer'] },
  { id: 'palaute', komponentit: ['Alert', 'Dialog'] },
  { id: 'data', komponentit: ['Table', 'ListRow', 'Timeline'] },
  { id: 'media', komponentit: ['Media', 'Video', 'LogoRow', 'HeroName', 'ExplodedView'] },
  { id: 'rakenne', komponentit: ['PageHeader', 'Section', 'Grid'] },
] as const;

const SOVELLUS = new Set(['TextField', 'Select', 'Checkbox', 'Radio', 'Switch', 'ChoiceGroup', 'Tabs', 'Alert', 'Dialog', 'Table']);

const komponentteja = RYHMAT.reduce((n, r) => n + r.komponentit.length, 0);

/** Yksi näyte: komponentin nimi, merkintä ja elävä esitys. */
function NayteRunko({ nimi, huom, leveä, sovellus, children }: { nimi: string; huom?: string; leveä?: boolean; sovellus: string; children: ReactNode }) {
  return (
    <div className={['sys__specimen', leveä && 'sys__specimen--wide'].filter(Boolean).join(' ')}>
      <div className="sys__specimen-head">
        <span className="meta ink">{nimi}</span>
        {SOVELLUS.has(nimi) ? <span className="meta meta--s">{sovellus}</span> : null}
        {huom ? <span className="meta meta--s">{huom}</span> : null}
      </div>
      <div className="sys__specimen-body">{children}</div>
    </div>
  );
}

/**
 * Design system on case 03:n alasivu: se on tämän portfolion tuotos,
 * ei menetelmän (päätös 45). Muut caset eivät saa tätä sivua.
 */
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale, slug: SYSTEM_CASE }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: 'Design system',
    description: getSystem(locale).description,
  };
}

export default async function SystemPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const dict = getDictionary(locale as Locale);
  const t: System = getSystem(locale as Locale);
  /* Sovellus-merkintä kulkee jokaiselle näytteelle samana. */
  const Nayte = (props: Omit<Parameters<typeof NayteRunko>[0], 'sovellus'>) => <NayteRunko {...props} sovellus={t.sovellus} />;

  const lead = getWork(locale as Locale).leads;
  const naytteet: Record<(typeof RYHMAT)[number]['id'], ReactNode> = {
    perusosat: (
      <>
        <Nayte nimi="Button" huom={t.huom.variantit} leveä>
          <div className="sys__row">
            <button type="button" className="btn btn--primary">{dict.about.contact}</button>
            <button type="button" className="btn btn--ghost">{dict.home.allWork}</button>
            <button type="button" className="btn btn--text">
              {dict.home.aboutLink} <Icon name="arrow-right" />
            </button>
            <button type="button" className="btn btn--ghost" disabled>{t.napit.eiSaatavilla}</button>
          </div>
        </Nayte>
        <Nayte nimi="Button" huom={t.huom.koot} leveä>
          <div className="sys__row">
            <button type="button" className="btn btn--ghost btn--s">{t.napit.pieni}</button>
            <button type="button" className="btn btn--ghost">{t.napit.perus}</button>
            <button type="button" className="btn btn--ghost btn--l">{t.napit.suuri}</button>
            <button type="button" className="btn btn--primary btn--icon btn--s" aria-label={t.napit.lisaa}>
              <Icon name="plus" />
            </button>
            <button type="button" className="btn btn--ghost btn--icon" aria-label={t.napit.valikko}>
              <Icon name="menu" />
            </button>
          </div>
        </Nayte>
        <Nayte nimi="Icon" huom={tayta(t.huom.ikonit, { n: ICON_NAMES.length })} leveä>
          <ul className="sys__icons">
            {ICON_NAMES.map((n) => (
              <li key={n} className="sys__icon">
                <Icon name={n} />
                <span className="meta meta--s">{n}</span>
              </li>
            ))}
          </ul>
        </Nayte>
      </>
    ),
    lomakkeet: (
      <>
        <Nayte nimi="TextField" huom={t.huom.textField}>
          <LomakeNayte t={t.naytteet} />
        </Nayte>
        <Nayte nimi="Select" huom={t.huom.select}>
          <ValintaNayte t={t.naytteet} />
        </Nayte>
      </>
    ),
    navigaatio: (
      <>
        <Nayte nimi="Tabs" leveä>
          <TabsNayte t={t.naytteet} />
        </Nayte>
        <Nayte nimi="Accordion" leveä>
          <AccordionNayte t={t.naytteet} labels={{ open: dict.work.open, close: dict.work.close }} />
        </Nayte>
        <Nayte nimi="Nav ja Footer" huom={t.huom.navFooter} leveä>
          <p className="body-s muted">{t.navFooter}</p>
        </Nayte>
      </>
    ),
    palaute: (
      <>
        <Nayte nimi="Alert" huom={t.huom.alert}>
          <AlertNayte t={t.naytteet} />
        </Nayte>
        <Nayte nimi="Dialog">
          <DialogNayte t={t.naytteet} />
        </Nayte>
      </>
    ),
    data: (
      <>
        <Nayte nimi="Table" leveä>
          <TaulukkoNayte t={t.naytteet} />
        </Nayte>
        <Nayte nimi="ListRow" leveä>
          <div className="list-rows">
            {lead.slice(0, 2).map((l) => (
              <ListRow
                as={Link}
                key={l.slug}
                title={l.title}
                description={l.tagline}
                meta={l.meta}
                href={path(locale as Locale, 'work', l.slug)}
              />
            ))}
          </div>
        </Nayte>
        <Nayte nimi="Timeline" leveä>
          <Timeline>
            <TimelineItem label="09:00" group={t.aikajana.ryhma} title={t.aikajana.tokenit} meta="1 s" description={t.aikajana.tokenitKuvaus} />
            <TimelineItem label="09:01" title={t.aikajana.kuvat} meta="12 s" description={t.aikajana.kuvatKuvaus} variant="emphasis" />
            <TimelineItem label="09:02" title={t.aikajana.sivusto} description={t.aikajana.sivustoKuvaus} variant="end" />
          </Timeline>
        </Nayte>
      </>
    ),
    media: (
      <>
        <Nayte nimi="Media" huom={t.huom.media}>
          <Media id="blokbook-hero" ratio="4:3" sizes="(min-width: 900px) 40vw, 100vw" />
        </Nayte>
        <Nayte nimi="Video" huom={t.huom.video}>
          <Media id="colliers-hero" ratio="4:3" sizes="(min-width: 900px) 40vw, 100vw" />
        </Nayte>
        <Nayte nimi="LogoRow" leveä>
          <LogoRow label={dict.common.clients} />
        </Nayte>
        <Nayte nimi="HeroName ja ExplodedView" leveä>
          <p className="body-s muted">
            {t.heroName.alku}{' '}
            <Link href={path(locale as Locale)} className="sys__link">{t.heroName.linkki}</Link>. {t.heroName.exploded}{' '}
            <a href="#layers" className="sys__link">{t.heroName.kerroksina}</a>{t.heroName.kuva ? ` ${t.heroName.kuva}` : '.'}
          </p>
        </Nayte>
      </>
    ),
    rakenne: (
      <Nayte nimi="PageHeader, Section ja Grid" leveä>
        <p className="body-s muted">
          {t.rakenne.alku}{' '}
          <a href="#grid" className="sys__link">03 Grid</a> {t.rakenne.loppu}
        </p>
      </Nayte>
    ),
  };

  return (
    <>
      <PageHeader title={dict.system.title} meta={tayta(t.headerMeta, { varit: colorNames.length, tyylit: typeNames.length, valit: spaceSteps.length })} lede={dict.system.lede} />

      {/* ---- kerroksina ------------------------------------------ */}
      <Section id="layers" title={dict.system.layersTitle}>
        <p className="body-l measure sys__note">{dict.system.layersNote}</p>
        <SivuKerroksina locale={locale as Locale} />
      </Section>

      {/* ---- väri ------------------------------------------------ */}
      <Section id="color" title={t.vari.title} meta={t.vari.meta}>

        <p className="body-l measure sys__note">
          {t.vari.note}{' '}
          (<code className="sys__code">light-dark()</code>).
        </p>

        <ul className="sys__swatches">
          {colorNames.map((name) => (
            <li key={name} className="sys__swatch">
              <span
                className="sys__chip"
                style={{ background: `var(--${name})` }}
                aria-hidden="true"
              />
              <span className="body-s sys__swatch-name">--{name}</span>
              <span className="meta meta--s sys__swatch-values">
                {tokens.color.light[name]} / {tokens.color.dark[name]}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* ---- typografia ------------------------------------------ */}
      <Section id="type" title={t.typo.title} meta="Bodoni Moda + Archivo" surface="tint">

        <div className="sys__type">
          {typeNames.map((name) => {
            const spec = tokens.type[name];
            const isDisplay = name.startsWith('display');
            const isMeta = name.startsWith('meta');
            return (
              <div key={name} className="sys__type-row">
                <div className="sys__type-meta">
                  <span className="meta ink">{name}</span>
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
                    ? 'Portfolio'
                    : isMeta
                      ? 'UX Engineer — Helsinki'
                      : t.typo.naytelause}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ---- grid ------------------------------------------------ */}
      <Section
        id="grid"
        title="03 — Grid"
        meta={
          <>
            {tokens.layout.columns.base} → {tokens.layout.columns.sm} → {tokens.layout.columns.md}{' '}
            {t.grid.sarakkeita}
          </>
        }
      >

        <p className="body-l measure sys__note">
          {t.grid.note}
        </p>

        <Grid className="sys__grid-demo">
          {Array.from({ length: 12 }).map((_, i) => (
            <Col key={i} base={1} sm={1} md={1}>
              <span className="sys__grid-col" />
            </Col>
          ))}
        </Grid>
      </Section>

      {/* ---- välistys -------------------------------------------- */}
      <Section id="space" title={t.valistys.title} meta={t.valistys.meta} surface="tint">

        <ul className="sys__space">
          {spaceSteps.map(([step, value]) => (
            <li key={step} className="sys__space-row">
              <span className="meta ink">--space-{step}</span>
              <span className="sys__space-bar" style={{ width: value }} aria-hidden="true" />
              <span className="meta meta--s">{value}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* ---- komponentit ----------------------------------------- */}
      <Section id="components" title={t.komponentit.title} meta={dict.system.rules}>
        <p className="body-l measure sys__note">
          {tayta(t.komponentit.alku, { n: komponentteja })}{' '}
          <code className="sys__code">@pokela/components</code> {t.komponentit.loppu}
        </p>

        <div className="sys__groups">
          {RYHMAT.map((ryhma, i) => (
            <section key={ryhma.id} className="sys__group" aria-labelledby={`komponentit-${ryhma.id}`}>
              <div className="sys__group-meta">
                <h3 id={`komponentit-${ryhma.id}`} className="meta ink">
                  {String(i + 1).padStart(2, '0')} {t.ryhmat[ryhma.id].nimi}
                </h3>
                <p className="body-s muted">{t.ryhmat[ryhma.id].kuvaus}</p>
              </div>
              <div className="sys__specimens">{naytteet[ryhma.id]}</div>
            </section>
          ))}
        </div>
      </Section>
    </>
  );
}
