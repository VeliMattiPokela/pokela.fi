import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, path, type Locale } from '@/lib/i18n';
import { getDictionary } from '@/content/dictionaries';
import { getTyotapa } from '@/content/tyotapa';
import { getCase } from '@/content/cases';
import Piirros from '@/components/Piirros';
import Section from '@/components/Section';
import ListRow from '@/components/ListRow';
import Reveal from '@/components/Reveal';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).nav.method, description: getTyotapa(locale).lede };
}

/**
 * Työtapa: UX engineering -menetelmä omana kokonaisuutenaan. Caset,
 * joissa menetelmää on käytetty, linkittävät tänne ja tämä niihin
 * (päätös 38). Design system on sivun alasivu, ja navi pitää
 * Työtavan aktiivisena myös siellä (päätös 45).
 */
export default async function MethodPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getTyotapa(locale as Locale);

  return (
    <article className="tyotapa">
      <header className="page tyotapa__head">
        <span className="meta case__eyebrow">{t.eyebrow}</span>
        <h1 className="display-xl tyotapa__title">{t.title}</h1>
        <p className="body-l case__tagline">{t.lede}</p>
        <dl className="case__facts">
          {t.facts.map((fact) => (
            <div key={fact.label} className="case__fact">
              <dt className="meta">{fact.label}</dt>
              <dd className="body-s">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <figure className="tyotapa__kaista">
        <div className="page">
          <Piirros aihe="kypsyminen" label={t.hero.label} />
          <figcaption className="meta meta--s tyotapa__kuvateksti">{t.hero.caption}</figcaption>
        </div>
      </figure>

      <Reveal>
        <Section title={t.stepsTitle} id="vaiheet" layout="aside" surface="tint">
          <ol className="tyotapa__vaiheet">
            {t.steps.map((step, i) => (
              <li key={step.h} className="tyotapa__vaihe">
                <Piirros aihe={step.aihe} />
                <span className="meta meta--s">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="title">{step.h}</h3>
                <p className="body-s muted">{step.p}</p>
              </li>
            ))}
          </ol>
        </Section>
      </Reveal>

      <Reveal>
        <Section title={t.benefitsTitle} id="hyodyt" layout="aside">
          <ul className="tyotapa__lista tyotapa__lista--3">
            {t.benefits.map((item) => (
              <li key={item.h}>
                <p className="title">{item.h}</p>
                <p className="body-s muted">{item.p}</p>
              </li>
            ))}
          </ul>
        </Section>
      </Reveal>

      <Reveal>
        <Section title={t.limitsTitle} id="rajat" layout="aside">
          <ul className="tyotapa__lista tyotapa__lista--2">
            {t.limits.map((item) => (
              <li key={item.h}>
                <p className="title">{item.h}</p>
                <p className="body-s muted">{item.p}</p>
              </li>
            ))}
          </ul>
        </Section>
      </Reveal>

      <Reveal>
        <Section title={t.casesTitle} id="caset" layout="aside">
          <div>
            {t.cases.map((item) => {
              const kohde = getCase(locale as Locale, item.slug);
              if (!kohde) throw new Error(`Työtapa viittaa caseen "${item.slug}", jota ei ole.`);
              return (
                <ListRow
                  key={item.slug}
                  as={Link}
                  href={path(locale as Locale, 'work', item.slug)}
                  number={kohde.eyebrow.split(' · ')[0].replace('Case ', '')}
                  title={kohde.title}
                  description={item.p}
                  meta={item.meta}
                />
              );
            })}
          </div>
        </Section>
      </Reveal>

      <Reveal>
        <Section title={t.systemTitle} id="system" layout="aside">
          <ListRow
            as={Link}
            href={path(locale as Locale, 'system')}
            title={t.system.title}
            description={t.system.p}
            meta={t.system.meta}
          />
        </Section>
      </Reveal>
    </article>
  );
}
