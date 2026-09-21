import type { CSSProperties, ReactNode } from 'react';

/**
 * Storyjen asetteluprimitiivit.
 *
 * Storyt eivät kirjoita inline-tyylejä: sama kuri kuin sivustolla.
 * Nämä kolme kattavat kaiken mitä näytepalojen asetteluun tarvitaan.
 *
 * Jokainen juuri kääritään `.sb-unstyled`-luokkaan, koska Storybookin
 * docs-container pakottaa muuten `font-size: 16px` kaikkiin diveihin —
 * silloin display-näyte renderöityisi leipätekstin kokoisena.
 */

const cx = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ');

/** Näytteet samaan ruudukkoon: sama linja, sama väli, sama korkeus. */
export function Row({
  children,
  width = 'default',
  className,
}: {
  children: ReactNode;
  /** Sarakkeen minimileveys. `narrow` napeille, `wide` isoille näytteille. */
  width?: 'narrow' | 'default' | 'wide';
  className?: string;
}) {
  return (
    <div
      className={cx(
        'sb-unstyled',
        'sb-row',
        width === 'narrow' && 'sb-row--narrow',
        width === 'wide' && 'sb-row--wide',
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Näytteet allekkain, kun järjestyksellä on merkitystä. */
export function Stack({
  children,
  tight,
  className,
}: {
  children: ReactNode;
  tight?: boolean;
  className?: string;
}) {
  return (
    <div className={cx('sb-unstyled', 'sb-stack', tight && 'sb-stack--tight', className)}>
      {children}
    </div>
  );
}

/**
 * Yksi näyte: merkintä ylhäällä hiusviivan kanssa, komponentti alla.
 * Merkintä kertoo luokan tai tilan — se on osa dokumentaatiota, ei
 * koriste.
 */
export function Specimen({
  label,
  children,
  fill,
  note,
  style,
}: {
  /** Luokka tai tila, esim. `btn--primary` tai `hover`. */
  label: string;
  children: ReactNode;
  /** Täyttää sarakkeen leveyden (esim. listarivi). */
  fill?: boolean;
  /** Yhden lauseen selite näytteen alle. */
  note?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={cx('sb-specimen', fill && 'sb-specimen--fill')} style={style}>
      <span className="meta meta--s sb-specimen__label">{label}</span>
      <div className="sb-specimen__body">{children}</div>
      {note ? <p className="sb-note">{note}</p> : null}
    </div>
  );
}

/** Selittävä rivi ilman näytettä. */
export function Note({ children }: { children: ReactNode }) {
  return <p className="sb-unstyled sb-note">{children}</p>;
}
