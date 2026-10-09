import type { ReactNode } from 'react';

/**
 * Osio (pattern).
 * ---------------------------------------------------------------
 * Sivun osio otsikkoineen. Kaksi asettelua, molemmat sivustolta:
 *
 *   stacked  otsikko ja sivutieto rivinä, sisältö alla
 *            (työlista, Tietoa, System)
 *   aside    otsikko vasemmassa sarakkeessa, sisältö oikealla;
 *            pienellä ruudulla päällekkäin (casesivujen lohkot)
 *
 * Otsikko on aina `h2.meta`: se nimeää osion, sisällön oma otsikko
 * (esim. `display-m`) kuuluu `children`-osaan.
 */
export type SectionLayout = 'stacked' | 'aside';

export default function Section({
  title,
  meta,
  id,
  layout = 'stacked',
  className,
  children,
}: {
  title: ReactNode;
  meta?: ReactNode;
  /** Otsikon id; osio nimetään sillä (`aria-labelledby`). */
  id?: string;
  layout?: SectionLayout;
  className?: string;
  children: ReactNode;
}) {
  const otsikko = (
    <h2 id={id} className="meta">
      {title}
    </h2>
  );
  if (layout === 'aside') {
    return (
      <section className={['page section--aside', className].filter(Boolean).join(' ')} aria-labelledby={id}>
        {otsikko}
        {children}
      </section>
    );
  }
  return (
    <section className={['page section', className].filter(Boolean).join(' ')} aria-labelledby={id}>
      <div className="section-head">
        {otsikko}
        {meta ? <span className="meta">{meta}</span> : null}
      </div>
      {children}
    </section>
  );
}
