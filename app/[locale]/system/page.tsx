import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { isLocale, path, type Locale } from '@/lib/i18n';
import { getWork } from '@/content/work';
import { getDictionary } from '@/content/dictionaries';
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
  { id: 'perusosat', nimi: 'Perusosat', kuvaus: 'Napit ja ikonit, joista muut komponentit kootaan.', komponentit: ['Button', 'Icon'] },
  {
    id: 'lomakkeet',
    nimi: 'Lomakkeet',
    kuvaus: 'Kentät ja valinnat. Virhe on ainoa tila, jolla on oma väri.',
    komponentit: ['TextField', 'Select', 'Checkbox', 'Radio', 'Switch', 'ChoiceGroup'],
  },
  { id: 'navigaatio', nimi: 'Navigaatio', kuvaus: 'Liikkuminen sivujen ja sisällön osien välillä.', komponentit: ['Nav', 'Tabs', 'Accordion', 'Footer'] },
  { id: 'palaute', nimi: 'Palaute', kuvaus: 'Ilmoitukset ja vahvistukset käyttäjälle.', komponentit: ['Alert', 'Dialog'] },
  { id: 'data', nimi: 'Data ja listat', kuvaus: 'Rivit, taulukot ja aikajana.', komponentit: ['Table', 'ListRow', 'Timeline'] },
  {
    id: 'media',
    nimi: 'Media',
    kuvaus: 'Kuvat, video ja tunnisteet. Kuvat tulevat kuvaputkesta.',
    komponentit: ['Media', 'Video', 'LogoRow', 'HeroName', 'ExplodedView'],
  },
  { id: 'rakenne', nimi: 'Rakenne', kuvaus: 'Sivun kehys. Tämä sivu on koottu niistä.', komponentit: ['PageHeader', 'Section', 'Grid'] },
] as const;

const SOVELLUS = new Set(['TextField', 'Select', 'Checkbox', 'Radio', 'Switch', 'ChoiceGroup', 'Tabs', 'Alert', 'Dialog', 'Table']);

const komponentteja = RYHMAT.reduce((n, r) => n + r.komponentit.length, 0);

/** Yksi näyte: komponentin nimi, merkintä ja elävä esitys. */
function Nayte({ nimi, huom, leveä, children }: { nimi: string; huom?: string; leveä?: boolean; children: ReactNode }) {
  return (
    <div className={['sys__specimen', leveä && 'sys__specimen--wide'].filter(Boolean).join(' ')}>
      <div className="sys__specimen-head">
        <span className="meta ink">{nimi}</span>
        {SOVELLUS.has(nimi) ? <span className="meta meta--s">Sovellus</span> : null}
        {huom ? <span className="meta meta--s">{huom}</span> : null}
      </div>
      <div className="sys__specimen-body">{children}</div>
    </div>
  );
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
    description: 'Tokenit, komponentit ja tilat elävinä — sama koodi jota sivusto käyttää.',
  };
}

export default async function SystemPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const dict = getDictionary(locale as Locale);

  const lead = getWork(locale as Locale).leads;
  const naytteet: Record<(typeof RYHMAT)[number]['id'], ReactNode> = {
    perusosat: (
      <>
        <Nayte nimi="Button" huom="Variantit" leveä>
          <div className="sys__row">
            <button type="button" className="btn btn--primary">{dict.about.contact}</button>
            <button type="button" className="btn btn--ghost">{dict.home.allWork}</button>
            <button type="button" className="btn btn--text">
              {dict.home.aboutLink} <Icon name="arrow-right" />
            </button>
            <button type="button" className="btn btn--ghost" disabled>Ei saatavilla</button>
          </div>
        </Nayte>
        <Nayte nimi="Button" huom="Koot s · m · l ja ikoninappi" leveä>
          <div className="sys__row">
            <button type="button" className="btn btn--ghost btn--s">Pieni</button>
            <button type="button" className="btn btn--ghost">Perus</button>
            <button type="button" className="btn btn--ghost btn--l">Suuri</button>
            <button type="button" className="btn btn--primary btn--icon btn--s" aria-label="Lisää">
              <Icon name="plus" />
            </button>
            <button type="button" className="btn btn--ghost btn--icon" aria-label="Valikko">
              <Icon name="menu" />
            </button>
          </div>
        </Nayte>
        <Nayte nimi="Icon" huom={`${ICON_NAMES.length} merkkiä`} leveä>
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
        <Nayte nimi="TextField" huom="Perus · virhe · vihje · monirivinen">
          <LomakeNayte />
        </Nayte>
        <Nayte nimi="Select" huom="Ja valinnat: Radio, Checkbox, ChoiceGroup, Switch">
          <ValintaNayte />
        </Nayte>
      </>
    ),
    navigaatio: (
      <>
        <Nayte nimi="Tabs" leveä>
          <TabsNayte />
        </Nayte>
        <Nayte nimi="Accordion" leveä>
          <AccordionNayte labels={{ open: dict.work.open, close: dict.work.close }} />
        </Nayte>
        <Nayte nimi="Nav ja Footer" huom="Tämän sivun ylä- ja alareuna" leveä>
          <p className="body-s muted">
            Navigaatio ja alatunniste ovat sivun kehyksessä, joten ne näkyvät tämän sivun ylä- ja alareunassa.
          </p>
        </Nayte>
      </>
    ),
    palaute: (
      <>
        <Nayte nimi="Alert" huom="Info · onnistui · virhe">
          <AlertNayte />
        </Nayte>
        <Nayte nimi="Dialog">
          <DialogNayte />
        </Nayte>
      </>
    ),
    data: (
      <>
        <Nayte nimi="Table" leveä>
          <TaulukkoNayte />
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
            <TimelineItem label="09:00" group="Tarkistukset" title="Tokenit" meta="1 s" description="tokens.json vastaa tyylejä." />
            <TimelineItem label="09:01" title="Kuvat" meta="12 s" description="Kuvaputki ajettu." variant="emphasis" />
            <TimelineItem label="09:02" title="Sivusto rakennetaan" description="Tämä sivu on sen tulos." variant="end" />
          </Timeline>
        </Nayte>
      </>
    ),
    media: (
      <>
        <Nayte nimi="Media" huom="Kuva, suhde 4:3">
          <Media id="blokbook-hero" ratio="4:3" sizes="(min-width: 900px) 40vw, 100vw" />
        </Nayte>
        <Nayte nimi="Video" huom="Median kautta, kun paikka on video">
          <Media id="colliers-hero" ratio="4:3" sizes="(min-width: 900px) 40vw, 100vw" />
        </Nayte>
        <Nayte nimi="LogoRow" leveä>
          <LogoRow label={dict.common.clients} />
        </Nayte>
        <Nayte nimi="HeroName ja ExplodedView" leveä>
          <p className="body-s muted">
            Nimi on etusivun otsikko, joten se näytetään siellä eikä tällä sivulla toisena pääotsikkona.{' '}
            <Link href={path(locale as Locale)} className="sys__link">Etusivulle</Link>. ExplodedView on osion{' '}
            <a href="#layers" className="sys__link">00 Kerroksina</a> kuva.
          </p>
        </Nayte>
      </>
    ),
    rakenne: (
      <Nayte nimi="PageHeader, Section ja Grid" leveä>
        <p className="body-s muted">
          Sivun otsikko on PageHeader, jokainen numeroitu osio on Section, ja{' '}
          <a href="#grid" className="sys__link">03 Grid</a> näyttää sarakkeet.
        </p>
      </Nayte>
    ),
  };

  return (
    <>
      <PageHeader title={dict.system.title} meta={<>{colorNames.length} väriä · {typeNames.length} tyyliä · {spaceSteps.length} väliä</>} lede="Design system on yhteinen kieli, jolla Figma, koodi ja AI tekevät samaa sivustoa. Tällä sivulla se on näkyvissä sellaisenaan: jokainen väri, mitta ja komponentti on sama, jota sivusto käyttää." />

      <section className="page section">
        <p className="body-s muted measure">
          Tämä sivu lukee arvot <code className="code">tokens.json</code>:sta build-aikana. Jos
          token muuttuu, tämä sivu muuttuu — eikä sitä tarvitse muistaa päivittää. Sama tiedosto
          ajetaan jokaisessa buildissa <code className="code">styles/tokens.css</code>:ää vasten,
          ja build kaatuu jos ne eriytyvät.
        </p>
      </section>

      {/* ---- kerroksina ------------------------------------------ */}
      <Section id="layers" title={dict.system.layersTitle}>
        <p className="body-l measure sys__note">{dict.system.layersNote}</p>
        <SivuKerroksina locale={locale as Locale} />
      </Section>

      {/* ---- väri ------------------------------------------------ */}
      <Section id="color" title="01 — Väri" meta="Ei aksenttiväriä">

        <p className="body-l measure sys__note">
          Kaksi teemaa, samat token-nimet, yksi määrittely per token
          (<code className="code">light-dark()</code>).
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
      <Section id="type" title="02 — Typografia" meta="Bodoni Moda + Archivo" surface="tint">

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
                    ? 'Pokela'
                    : isMeta
                      ? 'UX Engineer — Helsinki'
                      : 'Suunnittelen käyttöliittymät ja kirjoitan ne itse tuotantoon.'}
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
            saraketta
          </>
        }
      >

        <p className="body-l measure sys__note">
          Sarakemäärä on token, ei komponentin tieto.
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
      <Section id="space" title="04 — Välistys" meta="4 px perusyksikkö" surface="tint">

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
      <Section id="components" title="05 — Komponentit" meta={dict.system.rules}>
        <p className="body-l measure sys__note">
          Kaikki {komponentteja} komponenttia ryhmiteltynä käyttötarkoituksen mukaan, elävinä: samat
          komponentit, jotka paketti <code className="code">@pokela/components</code> vie ja Figman
          kirjasto kuvaa. Sovellus-merkityt ovat sovellusnäkymiä ja Makea varten; sivusto itse ei
          käytä niitä.
        </p>

        <div className="sys__groups">
          {RYHMAT.map((ryhma, i) => (
            <section key={ryhma.id} className="sys__group" aria-labelledby={`komponentit-${ryhma.id}`}>
              <div className="sys__group-meta">
                <h3 id={`komponentit-${ryhma.id}`} className="meta ink">
                  {String(i + 1).padStart(2, '0')} {ryhma.nimi}
                </h3>
                <p className="body-s muted">{ryhma.kuvaus}</p>
              </div>
              <div className="sys__specimens">{naytteet[ryhma.id]}</div>
            </section>
          ))}
        </div>
      </Section>
    </>
  );
}
