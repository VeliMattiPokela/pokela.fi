import Link from 'next/link';
import { isLocale, path, type Locale } from '@/lib/i18n';
import { getDictionary } from '@/content/dictionaries';
import { getWork } from '@/content/work';
import { Grid, Col } from '@/components/Grid';
import ListRow from '@/components/ListRow';
import Media from '@/components/Media';
import { kuvapaikka } from '@/content/kuvat';

/* Kuinka leveänä kuva piirtyy. Sivu tietää sen, kuva ei.
   Nostopari on md-koossa 7 ja 4 saraketta kahdestatoista. */
const SIZES = {
  taysi:
    '(min-width: 1440px) 1368px, (min-width: 900px) calc(100vw - 72px), (min-width: 600px) calc(100vw - 48px), calc(100vw - 40px)',
  leveampi: '(min-width: 1440px) 790px, (min-width: 900px) calc(58vw - 48px), calc(100vw - 40px)',
  kapeampi: '(min-width: 1440px) 440px, (min-width: 900px) calc(33vw - 48px), calc(100vw - 40px)',
};
import Reveal from '@/components/Reveal';
import Icon from '@/components/Icon';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;

  const dict = getDictionary(locale as Locale);
  const work = getWork(locale as Locale);
  const { home } = dict;

  return (
    <>
      {/* ---- nimi + rooli --------------------------------------- */}
      <section className="page home__intro">
        {/* Nimi katkeaa mobiilissa riveille, työpöydällä se luetaan
            yhtenä. Yhdysmerkkiin päättyvän osan perään ei tule väliä. */}
        <h1 className="display-xl home__name">
          {home.nameLines.map((line, i) => (
            <span key={line} className="home__name-line">
              {line}
              {i < home.nameLines.length - 1 && !line.endsWith('-') ? ' ' : ''}
            </span>
          ))}
        </h1>

        <div className="home__intro-meta">
          <p className="meta meta--ink home__role">{home.role}</p>
          {home.availability ? (
            <p className="meta home__availability">{home.availability}</p>
          ) : null}
        </div>
      </section>

      {/* ---- hero 21:9 ------------------------------------------ */}
      <div className="page">
        <Media {...kuvapaikka('etusivu-hero')} sizes={SIZES.taysi} priority />
      </div>

      {/* ---- väitelause ----------------------------------------- */}
      <Reveal>
        <section className="page section">
          <Grid>
            <Col base={4} sm={8} md={7}>
              <p className="display-m home__statement">{home.statement}</p>
            </Col>
            <Col base={4} sm={8} md={4} startMd={9}>
              <p className="body-l measure home__lede">{home.lede}</p>
              <Link href={path(locale as Locale, 'about')} className="btn btn--text home__about">
                {home.aboutLink} <Icon name="arrow-right" />
              </Link>
            </Col>
          </Grid>
        </section>
      </Reveal>

      {/* ---- valitut työt --------------------------------------- */}
      <section className="section" aria-labelledby="selected-work">
        <div className="page home__section-head">
          <h2 id="selected-work" className="meta">
            {home.selectedWork}
          </h2>
          <span className="meta">{String(work.leads.length).padStart(2, '0')}</span>
        </div>

        <div className="list-rows">
          {work.leads.map((lead) => (
            <ListRow
              key={lead.slug}
              title={lead.title}
              description={lead.tagline}
              meta={lead.meta}
              href={path(locale as Locale, 'work', lead.slug)}
            />
          ))}
        </div>

        <div className="page home__section-foot">
          <span className="meta">
            {home.alsoWorked} · {work.also.join(' · ')}
          </span>
          <Link href={path(locale as Locale, 'work')} className="btn btn--text">
            {home.allWork} <Icon name="arrow-right" />
          </Link>
        </div>
      </section>

      {/* ---- kaksi kuvaa ---------------------------------------- */}
      <Reveal>
        <section className="page section">
          <Grid>
            <Col base={4} sm={8} md={7}>
              <Media {...kuvapaikka('etusivu-colliers')} sizes={SIZES.leveampi} />
            </Col>
            <Col base={4} sm={8} md={4} startMd={9}>
              <Media {...kuvapaikka('etusivu-blokbook')} sizes={SIZES.kapeampi} />
            </Col>
          </Grid>
        </section>
      </Reveal>

      {/* ---- käännetty nostorivi -------------------------------- */}
      <Reveal>
        <section className="invert bleed home__band">
          <div className="home__band-inner">
            <p className="display-m home__band-title">{home.bandTitle}</p>
            <p className="body-l measure home__band-body">{home.bandBody}</p>
          </div>
        </section>
      </Reveal>
    </>
  );
}
