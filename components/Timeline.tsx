import type { CSSProperties, ReactNode } from 'react';

/**
 * Aikajana.
 * ---------------------------------------------------------------
 * Pystysuora jana: vasemmalla merkintä (aika, päivä, numero), keskellä
 * kisko ja piste, oikealla otsikko, sivutieto ja kuvaus. Merkintä,
 * kisko ja sisältö ovat listan ruudukon sarakkeita, jotta merkinnät
 * asettuvat samaan linjaan; siksi `TimelineItem` piirretään aina
 * `Timeline`-listan sisällä.
 *
 * `variant`:
 *   default   ohut kisko, ontto piste
 *   emphasis  paksu kisko ja täytetty piste: nostettu kohta
 *   end       kisko päättyy pisteeseen: viimeinen kohta
 *
 * `weight` (0–1) venyttää kohdan kiskoa. Sillä pitkä vaihe näkyy jo
 * pituudestaan, esimerkiksi keston osuutena koko ajasta.
 */
export default function Timeline({ children, className }: { children: ReactNode; className?: string }) {
  return <ol className={['timeline', className].filter(Boolean).join(' ')}>{children}</ol>;
}

export type TimelineVariant = 'default' | 'emphasis' | 'end';

export function TimelineItem({
  label,
  title,
  meta,
  description,
  group,
  variant = 'default',
  weight = 0,
}: {
  label: string;
  title: string;
  meta?: string | null;
  description?: string | null;
  group?: string | null;
  variant?: TimelineVariant;
  weight?: number;
}) {
  return (
    <li
      className={['timeline__item', variant === 'default' ? '' : `timeline__item--${variant}`].join(' ')}
      style={{ '--weight': weight.toFixed(3) } as CSSProperties}
    >
      <span className="meta faint timeline__label">{label}</span>
      <span className="timeline__rail" aria-hidden="true" />
      <span className="timeline__body">
        {group ? <span className="meta faint">{group}</span> : null}
        <span className="timeline__head">
          <span className="body-l">{title}</span>
          {meta ? <span className="meta faint">{meta}</span> : null}
        </span>
        {description ? <span className="body-s muted">{description}</span> : null}
      </span>
    </li>
  );
}
