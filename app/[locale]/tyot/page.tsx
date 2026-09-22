import type { Metadata } from 'next';
import { isLocale, path, type Locale } from '@/lib/i18n';
import { getDictionary } from '@/content/dictionaries';
import { getWork } from '@/content/work';
import ListRow from '@/components/ListRow';
import LogoRow from '@/components/LogoRow';
import PreviousWork from '@/components/PreviousWork';
import Media from '@/components/Media';
import Reveal from '@/components/Reveal';
import Icon from '@/components/Icon';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return { title: dict.work.title };
}

export default async function WorkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;

  const dict = getDictionary(locale as Locale);
  const work = getWork(locale as Locale);

  return (
    <>
      <header className="page page-head">
        <h1 className="display-xl">{dict.work.title}</h1>
        <p className="meta">{dict.work.subtitle}</p>
      </header>

      {/* ---- kolme kärkeä ---------------------------------------- */}
      <section className="list-rows" aria-label={dict.home.selectedWork}>
        {work.leads.map((lead) => (
          <ListRow
            key={lead.slug}
            size="m"
            number={lead.number}
            title={lead.title}
            description={lead.lede}
            meta={lead.meta}
            href={path(locale as Locale, 'work', lead.slug)}
          />
        ))}
      </section>

      {/* ---- aiempi työ ------------------------------------------ */}
      <section className="section" aria-labelledby="previous">
        <div className="page section-head">
          <h2 id="previous" className="meta">
            {dict.work.previous}
          </h2>
          <span className="meta">{dict.work.previousHint}</span>
        </div>

        <PreviousWork items={work.previous} dict={dict} />

        <div className="page work__also">
          <span className="meta">
            {dict.work.alsoLabel} · {work.also.join(' · ')}
          </span>
        </div>

        <div className="page">
          <LogoRow label={dict.common.clients} />
        </div>
      </section>

      {/* ---- nosto + outro --------------------------------------- */}
      <Reveal>
        <section className="page section">
          <Media ratio="4:3" caption={dict.captions.workStorybook} />

          <div className="work__outro">
            <h2 className="display-m">{dict.work.outroTitle}</h2>
            <div>
              <p className="body-l measure work__outro-body">{dict.work.outroBody}</p>
              <a href={`mailto:${dict.footer.email}`} className="btn btn--text work__outro-cta">
                {dict.work.outroCta} <Icon name="arrow-right" />
              </a>
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}
