import { Fragment } from 'react';
import Link from 'next/link';
import { path, type Locale } from '@/lib/i18n';
import { getCaseRefs } from '@/content/cases';

/**
 * Leipäteksti, jossa toisen casen maininta on linkki.
 *
 * Maininnat luetellaan sisällön puolella taivutusmuotoineen
 * (content/cases/fi.ts), koska suomen taivutus estää johtamasta
 * linkkitekstiä casen nimestä: "Colliersissa" ei ole "Colliers
 * Asunnot".
 *
 * Casen omalle sivulle ei linkitetä itseensä — `currentSlug`
 * jätetään pois osumista.
 */
export default function CaseText({
  text,
  locale,
  currentSlug,
}: {
  text: string;
  locale: Locale;
  /** Sivu jolla ollaan; sen omat maininnat jäävät tekstiksi. */
  currentSlug?: string;
}) {
  const refs = getCaseRefs(locale).filter((ref) => ref.slug !== currentSlug);
  if (refs.length === 0) return <>{text}</>;

  /* Pisin osuma ensin, jotta "Colliers Asunnot" voittaa "Colliers". */
  const pattern = new RegExp(
    `(${refs
      .map((ref) => ref.text)
      .sort((a, b) => b.length - a.length)
      .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|')})`,
    'g',
  );

  return (
    <>
      {text.split(pattern).map((part, i) => {
        const ref = refs.find((r) => r.text === part);
        return ref ? (
          <Link key={i} href={path(locale, 'work', ref.slug)} className="case-link">
            {part}
          </Link>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        );
      })}
    </>
  );
}
