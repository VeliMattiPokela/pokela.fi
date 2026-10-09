import type { ReactNode } from 'react';

/**
 * Sivun otsikko (pattern).
 * ---------------------------------------------------------------
 * Patterni ei tuo omaa ulkoasua: se asettelee olemassa olevat
 * typografialuokat aina samalla tavalla. Otsikko (`display-xl`) ja
 * sivutieto (`meta`) ovat samalla rivillä leveämmällä ruudulla,
 * ingressi (`body-l`) otsikon alla samassa sarakkeessa.
 *
 * Ennen tätä sama rakenne kirjoitettiin jokaiselle sivulle käsin, ja
 * Figma Make arvasi sen: ingressi päätyi sarakkeisiin 9–12, irti
 * otsikosta (päätös 21).
 */
export default function PageHeader({
  title,
  meta,
  lede,
}: {
  title: ReactNode;
  meta?: ReactNode;
  lede?: ReactNode;
}) {
  return (
    <header className="page page-header">
      <div className="page-head">
        <h1 className="display-xl">{title}</h1>
        {meta ? <p className="meta">{meta}</p> : null}
      </div>
      {lede ? <p className="body-l measure page-header__lede">{lede}</p> : null}
    </header>
  );
}
