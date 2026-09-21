import Link from 'next/link';
import type { Block } from '@/content/cases';
import CaseBlock from './CaseBlock';
import CaseBlockDerived from './CaseBlockDerived';
import type { Locale } from '@/lib/i18n';

/**
 * Casen lohkot. Yksi lohkotyyppi = yksi Design Systemin komponentti,
 * joten uusi case ei tuo mukanaan uutta layoutia.
 *
 * Tämä tiedosto vain valitsee kumpi piirtää:
 *
 *   CaseBlock         piirtää annetun datan — voi renderöityä
 *                     selaimessa, joten sillä on storyt
 *   CaseBlockDerived  lukee totuuden tiedostojärjestelmästä
 *                     build-aikana — ei voi ajaa selaimessa
 *
 * Jako syntyi siitä ettei `node:fs` toimi selaimessa: yhdessä
 * tiedostossa koko moduuli kaatui storyssä.
 */
const DERIVED = new Set(['artefacts', 'checks', 'component']);

export default function CaseBlocks({
  blocks,
  locale,
  slug,
}: {
  blocks: Block[];
  locale: Locale;
  /** Nykyinen case: sen omiin mainintoihin ei linkitetä. */
  slug: string;
}) {
  return (
    <>
      {blocks.map((block, index) =>
        DERIVED.has(block.kind) ? (
          <CaseBlockDerived key={index} block={block as never} />
        ) : (
          <CaseBlock key={index} block={block as never} locale={locale} slug={slug} />
        ),
      )}
    </>
  );
}

export function CaseNext({
  href,
  label,
  title,
}: {
  href: string;
  label: string;
  title: string;
}) {
  return (
    <div className="page">
      <Link href={href} className="case__next">
        <span className="meta">{label}</span>
        <span className="case__next-title">{title} →</span>
      </Link>
    </div>
  );
}
