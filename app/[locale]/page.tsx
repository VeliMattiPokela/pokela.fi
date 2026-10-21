import Link from 'next/link';
import { isLocale, path, type Locale } from '@/lib/i18n';
import { getDictionary } from '@/content/dictionaries';
import { getWork } from '@/content/work';
import { Grid, Col } from '@/components/Grid';
import ListRow from '@/components/ListRow';
import Media from '@/components/Media';
import HeroName from '@/components/HeroName';
import HeroIntro from '@/components/HeroIntro';
import Korkeuskayrat from '@/components/Korkeuskayrat';
import { kuvapaikka } from '@/content/kuvat';

/* Herokuva on sivun levyinen; nauha jatkuu sen ulkopuolelle. Sama
   arvo kuin casejen herolla (CaseBlock). */
const SIZES_TAYSI =
  '(min-width: 1440px) 1368px, (min-width: 900px) calc(100vw - 72px), (min-width: 600px) calc(100vw - 48px), calc(100vw - 40px)';

import Reveal from '@/components/Reveal';
import Nosto from '@/components/Nosto';
import Icon from '@/components/Icon';
import LogoRow from '@/components/LogoRow';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;

  const dict = getDictionary(locale as Locale);
  const work = getWork(locale as Locale);
  const { home } = dict;

  return (
    <>
      {/* ---- nimi + rooli + viivateos -------------------------- */}
      <div className="home__alku">
      <HeroIntro>
        <section className="page home__intro">
          <HeroName lines={home.nameLines} />

          <div className="home__intro-meta">
            <p className="meta ink home__role">{home.role}</p>
            {home.availability ? (
              <p className="meta home__availability">{home.availability}</p>
            ) : null}
          </div>
        </section>
      </HeroIntro>

        <Korkeuskayrat label={home.heroArt} />
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
              as={Link}
              key={lead.slug}
              title={lead.title}
              description={lead.tagline}
              meta={lead.meta}
              href={path(locale as Locale, 'work', lead.slug)}
            />
          ))}
        </div>

        <div className="page home__clients surface-tint">
          <LogoRow label={dict.common.clients} />
        </div>

        <div className="page home__section-foot">
          <Link href={path(locale as Locale, 'work')} className="btn btn--text">
            {home.allWork} <Icon name="arrow-right" />
          </Link>
        </div>
      </section>

      {/* ---- herokuva: nauha ruudun reunoihin, kuva sivun levyinen -- */}
      <Reveal>
        <div className="page home__hero">
          <Media {...kuvapaikka('etusivu-hero')} sizes={SIZES_TAYSI} />
        </div>
      </Reveal>

      {/* ---- nosto: sivun pääväite ------------------------------ */}
      <Reveal>
        <Nosto title={home.bandTitle} body={home.bandBody} />
      </Reveal>
    </>
  );
}
