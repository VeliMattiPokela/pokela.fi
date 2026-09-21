import type { CSSProperties, ElementType, ReactNode } from 'react';

/**
 * 12-sarakkeinen grid (4 → 8 → 12).
 *
 * Sarakemäärä tulee tokenista `--columns`, joten komponentti ei tiedä
 * breakpointeista mitään. Sijoittelu annetaan sarakkeina, ei pikseleinä:
 *
 *   <Col base={4} md={7}>          → koko leveys mobiilissa, 7/12 työpöydällä
 *   <Col base={4} md={4} startMd={9}>  → sarakkeet 9–12
 */

type GridProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
};

export function Grid({ children, as: Tag = 'div', className, style }: GridProps) {
  return (
    <Tag className={['grid', className].filter(Boolean).join(' ')} style={style}>
      {children}
    </Tag>
  );
}

type ColProps = {
  children: ReactNode;
  /** Sarakkeita 0–599px (max 4). Oletus: koko leveys. */
  base?: number;
  /** Sarakkeita 600–899px (max 8). Oletus: base skaalattuna. */
  sm?: number;
  /** Sarakkeita ≥900px (max 12). Oletus: sm. */
  md?: number;
  /** Aloitussarake ≥600px. */
  startSm?: number;
  /** Aloitussarake ≥900px. */
  startMd?: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
};

export function Col({
  children,
  base = 4,
  sm,
  md,
  startSm,
  startMd,
  as: Tag = 'div',
  className,
  style,
}: ColProps) {
  const spanSm = sm ?? Math.min(8, base * 2);
  const spanMd = md ?? Math.min(12, spanSm);

  const vars = {
    '--span-base': base,
    '--span-sm': spanSm,
    '--span-md': spanMd,
    ...(startSm ? { '--start-sm': startSm } : {}),
    ...(startMd ? { '--start-md': startMd } : {}),
    ...style,
  } as CSSProperties;

  return (
    <Tag className={['col', className].filter(Boolean).join(' ')} style={vars}>
      {children}
    </Tag>
  );
}
