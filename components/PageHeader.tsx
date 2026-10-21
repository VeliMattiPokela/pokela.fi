import type { ReactNode } from 'react';

/** Otsikon pituus merkkeinä, jonka yli otsikko pienenee display-l:ään. */
const LYHYT_OTSIKKO = 20;

/**
 * Sivun otsikon koko pituudesta (päätös 44). Lyhyt otsikko on
 * `display-xl`, pidempi `display-l`, jotta pitkä otsikko ei kasva
 * kolmelle riville. Koko johdetaan aina tekstistä, ei aseteta käsin.
 */
export function otsikonKoko(title: ReactNode): 'xl' | 'l' {
  return typeof title === 'string' && title.length > LYHYT_OTSIKKO ? 'l' : 'xl';
}

/**
 * Sivun otsikko (pattern).
 * ---------------------------------------------------------------
 * Patterni ei tuo omaa ulkoasua: se asettelee olemassa olevat
 * typografialuokat aina samalla tavalla. Otsikko (`display-xl`, pitkä
 * otsikko `display-l`) ja sivutieto (`meta`) ovat samalla rivillä
 * leveämmällä ruudulla, ingressi (`body-l`) otsikon alla samassa
 * sarakkeessa.
 *
 * Ennen tätä sama rakenne kirjoitettiin jokaiselle sivulle käsin, ja
 * Figma Make arvasi sen: ingressi päätyi sarakkeisiin 9–12, irti
 * otsikosta (päätös 21).
 */
export default function PageHeader({
  title,
  meta,
  lede,
  size = otsikonKoko(title),
}: {
  title: ReactNode;
  meta?: ReactNode;
  lede?: ReactNode;
  /** Johdetaan otsikon pituudesta. Aseta vain, jos otsikko ei ole teksti. */
  size?: 'xl' | 'l';
}) {
  return (
    <header className="page page-header">
      <div className="page-head">
        <h1 className={`display-${size}`}>{title}</h1>
        {meta ? <p className="meta">{meta}</p> : null}
      </div>
      {lede ? <p className="body-l measure page-header__lede">{lede}</p> : null}
    </header>
  );
}
