'use client';

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import Icon from './Icon';

/**
 * Taulukko: sarakkeet, rivit, lajittelu ja tyhjä tila.
 *
 * Sovelluskomponentti (päätökset 22 ja 30). Rivit erotetaan
 * hiusviivalla, otsikkorivin alla on musteviiva. Ei pystyviivoja,
 * raitoja eikä pintaa: sama kieli kuin ListRow'ssa. Otsikot ovat
 * metatekstiä, jotta huomio menee dataan.
 *
 * Saavutettavuus:
 *   · oikea <table>, jolla on <caption> (oletuksena piilotettu) ja
 *     <th scope="col">
 *   · lajiteltava otsikko on <th>:n sisällä oleva nappi, ja <th>
 *     kertoo järjestyksen aria-sortilla (APG: Sortable Table)
 *   · kun taulukko ei mahdu, vierityslaatikosta tulee nimetty alue,
 *     johon pääsee sarkaimella ja jota voi vierittää nuolilla
 *
 * Lajittelu tehdään täällä: rivit annetaan sellaisinaan, ja taulukko
 * järjestää ne valitun sarakkeen mukaan. Tila voi olla ohjattu (`sort`
 * + `onSortChange`) tai oma (`defaultSort`).
 */
export type TableSortDirection = 'ascending' | 'descending';
export type TableSort = { key: string; direction: TableSortDirection };

export type TableColumn<R> = {
  /** Sarakkeen avain. Ilman `cell`iä solu näyttää `row[key]`. */
  key: string;
  header: string;
  /** Luku: oikealle ja tasalevyisin numeroin. */
  numeric?: boolean;
  /** Toissijainen tieto --ink-mutedilla. */
  muted?: boolean;
  sortable?: boolean;
  /** Otsikko vain ruudunlukijalle, esim. toimintosarake. */
  hideHeader?: boolean;
  cell?: (row: R) => ReactNode;
  /** Arvo, jonka mukaan lajitellaan. Oletus `row[key]`. */
  sortValue?: (row: R) => string | number;
};

export type TableProps<R> = {
  /** Taulukon nimi. Ruudunlukija lukee sen aina. */
  caption: string;
  /** Näytä nimi myös näkyvästi taulukon yläpuolella. */
  showCaption?: boolean;
  columns: TableColumn<R>[];
  rows: R[];
  rowKey: (row: R) => string;
  sort?: TableSort | null;
  defaultSort?: TableSort | null;
  onSortChange?: (sort: TableSort) => void;
  /** Teksti, kun rivejä ei ole. */
  empty?: ReactNode;
  className?: string;
};

const vertailija = new Intl.Collator('fi', { numeric: true, sensitivity: 'base' });

function arvo<R>(rivi: R, sarake: TableColumn<R>): string | number {
  if (sarake.sortValue) return sarake.sortValue(rivi);
  const v = (rivi as Record<string, unknown>)[sarake.key];
  return typeof v === 'number' ? v : String(v ?? '');
}

export default function Table<R>({
  caption,
  showCaption = false,
  columns,
  rows,
  rowKey,
  sort,
  defaultSort = null,
  onSortChange,
  empty = 'Ei rivejä.',
  className,
}: TableProps<R>) {
  const [omaSort, setOmaSort] = useState<TableSort | null>(defaultSort);
  const nykyinen = sort !== undefined ? sort : omaSort;

  const jarjestetty = useMemo(() => {
    const sarake = nykyinen && columns.find((c) => c.key === nykyinen.key);
    if (!nykyinen || !sarake) return rows;
    const suunta = nykyinen.direction === 'ascending' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const x = arvo(a, sarake);
      const y = arvo(b, sarake);
      const ero = typeof x === 'number' && typeof y === 'number' ? x - y : vertailija.compare(String(x), String(y));
      return ero * suunta;
    });
  }, [rows, columns, nykyinen]);

  const lajittele = (key: string) => {
    const seuraava: TableSort = {
      key,
      direction: nykyinen?.key === key && nykyinen.direction === 'ascending' ? 'descending' : 'ascending',
    };
    if (sort === undefined) setOmaSort(seuraava);
    onSortChange?.(seuraava);
  };

  /* Vierityslaatikko on alue ja sarkainpysäkki vain, kun se oikeasti
     vierittyy: muuten se olisi turha pysäkki jokaisella näppäimistön
     käyttäjällä. `data-scrolled` näyttää kiinnitetyn sarakkeen viivan
     vasta, kun sen alle on vieritetty jotain. */
  const laatikko = useRef<HTMLDivElement>(null);
  const [vierittyy, setVierittyy] = useState(false);
  useEffect(() => {
    const el = laatikko.current;
    if (!el) return;
    const mittaa = () => setVierittyy(el.scrollWidth > el.clientWidth + 1);
    const vieritys = () => el.toggleAttribute('data-scrolled', el.scrollLeft > 0);
    mittaa();
    const ro = new ResizeObserver(mittaa);
    ro.observe(el);
    el.addEventListener('scroll', vieritys, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener('scroll', vieritys);
    };
  }, []);

  const captionId = useId();

  return (
    <div
      ref={laatikko}
      className={['table', className].filter(Boolean).join(' ')}
      role={vierittyy ? 'region' : undefined}
      aria-labelledby={vierittyy ? captionId : undefined}
      tabIndex={vierittyy ? 0 : undefined}
    >
      <table className="table__table">
        <caption id={captionId} className={showCaption ? 'table__caption' : 'visually-hidden'}>
          {caption}
        </caption>
        <thead>
          <tr>
            {columns.map((c) => {
              const suunta = nykyinen?.key === c.key ? nykyinen.direction : undefined;
              return (
                <th
                  key={c.key}
                  scope="col"
                  className={c.numeric ? 'table__num' : undefined}
                  aria-sort={c.sortable ? (suunta ?? 'none') : undefined}
                >
                  {c.hideHeader ? (
                    <span className="visually-hidden">{c.header}</span>
                  ) : c.sortable ? (
                    <button
                      type="button"
                      className="table__sort"
                      data-direction={suunta}
                      onClick={() => lajittele(c.key)}
                    >
                      {c.header}
                      <Icon name="chevron-down" size="s" className="table__sort-icon" />
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {jarjestetty.length === 0 ? (
            <tr className="table__empty">
              <td colSpan={columns.length}>{empty}</td>
            </tr>
          ) : (
            jarjestetty.map((rivi) => (
              <tr key={rowKey(rivi)}>
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={[c.numeric && 'table__num', c.muted && 'table__muted'].filter(Boolean).join(' ') || undefined}
                  >
                    {c.cell ? c.cell(rivi) : String((rivi as Record<string, unknown>)[c.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
