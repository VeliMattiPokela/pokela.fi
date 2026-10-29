import Link from 'next/link';
import type { Metadata } from 'next';
import { isLocale, path, type Locale } from '@/lib/i18n';
import { getDictionary } from '@/content/dictionaries';
import { getWork } from '@/content/work';
import ListRow from '@/components/ListRow';
import LogoRow from '@/components/LogoRow';
import PreviousWork from '@/components/PreviousWork';
import Media from '@/components/Media';
import { kuvapaikka } from '@/content/kuvat';

/** Nosto on koko sisältöleveys. */
const SIZES_TAYSI =
  '(min-width: 1440px) 1368px, (min-width: 900px) calc(100vw - 72px), (min-width: 600px) calc(100vw - 48px), calc(100vw - 40px)';
import Reveal from '@/components/Reveal';
import PageHeader from '@/components/PageHeader';

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
      <PageHeader title={dict.work.title} meta={dict.work.subtitle} />

      {/* ---- neljä kärkeä ----------------------------------------- */}
      <section className="list-rows" aria-label={dict.home.selectedWork}>
        {work.leads.map((lead) => (
          <ListRow
            as={Link}
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

        <div className="page work__clients">
          <LogoRow label={dict.common.clients} />
        </div>
      </section>

      {/* ---- nosto ---------------------------------------------- */}
      <Reveal>
        <section className="page section">
          <Media {...kuvapaikka('tyot-storybook')} sizes={SIZES_TAYSI} />
        </section>
      </Reveal>
    </>
  );
}
