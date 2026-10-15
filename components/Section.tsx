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
 * Pinta rytmittää pitkää sivua luvuittain (päätös 40):
 *
 *   paper    oletus, sivun oma pinta
 *   tint     sävytetty pinta reunasta reunaan. Peräkkäiset tint-osiot
 *            muodostavat yhden luvun, joten pinta vaihtuu luvun eikä
 *            jokaisen osion kohdalla.
 *
 * Otsikko on aina `h2.meta`: se nimeää osion, sisällön oma otsikko
 * (esim. `display-m`) kuuluu `children`-osaan.
 */
export type SectionLayout = 'stacked' | 'aside';
export type SectionSurface = 'paper' | 'tint';

export default function Section({
  title,
  meta,
  id,
  layout = 'stacked',
  surface = 'paper',
  className,
  children,
}: {
  title: ReactNode;
  meta?: ReactNode;
  /** Otsikon id; osio nimetään sillä (`aria-labelledby`). */
  id?: string;
  layout?: SectionLayout;
  surface?: SectionSurface;
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
      <section className={['page section--aside', surface === 'tint' && 'surface-tint', className].filter(Boolean).join(' ')} aria-labelledby={id}>
        {otsikko}
        {children}
      </section>
    );
  }
  return (
    <section className={['page section', surface === 'tint' && 'surface-tint', className].filter(Boolean).join(' ')} aria-labelledby={id}>
      <div className="section-head">
        {otsikko}
        {meta ? <span className="meta">{meta}</span> : null}
      </div>
      {children}
    </section>
  );
}
