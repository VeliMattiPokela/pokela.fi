import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, locales, path, type Locale } from '@/lib/i18n';
import { getDictionary } from '@/content/dictionaries';
import { getCase, getCases } from '@/content/cases';
import CaseBlocks, { CaseNext } from '@/components/CaseBlocks';

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getCases(locale).map((item) => ({ locale, slug: item.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const item = getCase(locale, slug);
  if (!item) return {};
  return { title: item.title, description: item.tagline };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale as Locale);
  const item = getCase(locale as Locale, slug);
  if (!item) notFound();

  return (
    <article>
      <header className="page case__head">
        <span className="meta case__eyebrow">{item.eyebrow}</span>

        <h1 className="display-l case__title">
          {item.titleLines ? (
            item.titleLines.map((line) => <span key={line}>{line}</span>)
          ) : (
            item.title
          )}
        </h1>

        <p className="body-l case__tagline">{item.tagline}</p>

        <dl className="case__facts">
          {item.facts.map((fact) => (
            <div key={fact.label} className="case__fact">
              <dt className="meta">{fact.label}</dt>
              <dd className="case__fact-value">
                {fact.value ?? (
                  /* Tyhjää faktaa ei täytetä arvauksella. */
                  <span className="case__fact-value--missing">{dict.common.toBeAdded}</span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      <CaseBlocks blocks={item.blocks} locale={locale as Locale} slug={item.slug} />

      <CaseNext
        href={path(locale as Locale, 'work', item.next.slug)}
        label={dict.work.nextCase}
        title={item.next.title}
      />
    </article>
  );
}
