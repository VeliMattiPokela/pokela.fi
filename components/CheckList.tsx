'use client';

import { Fragment, type ReactNode } from 'react';
import { Accordion, useAccordionGroup } from './Accordion';

/**
 * Tarkistuslista casessa: nimi ja millaisen virheen tarkistus
 * pysäyttää näkyvät aina, tarkka kuvaus ja raja ("Ei kata") avautuvat
 * rivistä. Viimeinen rivi voi olla viimeisin ajo, jonka aikajana
 * avautuu samalla tavalla.
 *
 * Vain ajossa olevat rivit numeroidaan, jotta numerot vastaavat
 * otsikon lukua. Kun `groups` on annettu, ryhmän otsikko ja selite
 * tulevat sen ensimmäisen rivin eteen (sivulla: Tulossa, päätös 50).
 */
export default function CheckList({
  items,
  groups,
  build,
}: {
  items: { id: string; title: string; huomaa: string; proves: string; items?: string[]; blind: string | null; runs: boolean; group?: string }[];
  groups?: { id: string; title: string; note: string }[];
  build?: { description: string; children: ReactNode };
}) {
  const group = useAccordionGroup();
  const labels = { open: 'Avaa', close: 'Sulje' };

  return (
    <div className="list-rows case__checklist">
      {items.map((check, i) => {
        const numero = items.slice(0, i + 1).filter((c) => c.runs).length;
        const alku = check.group !== items[i - 1]?.group ? groups?.find((g) => g.id === check.group) : undefined;
        return (
        <Fragment key={check.id}>
        {alku ? (
          <div className="case__checkgroup">
            <h4 className="meta case__checkgroup-title">{alku.title}</h4>
            <p className="body-s muted measure">{alku.note}</p>
          </div>
        ) : null}
        <Accordion
          number={check.runs ? String(numero).padStart(2, '0') : '—'}
          title={check.title}
          description={check.huomaa}
          open={group.isOpen(check.id)}
          onToggle={() => group.toggle(check.id)}
          labels={labels}
        >
          <div className="check-detail">
            {/* Rivin kuvaus siirtyy avatessa tähän: rivillä on silloin
                vain otsikko, ja lause aloittaa palstan musteella. */}
            <section className="check-detail__col">
              <h5 className="meta check-detail__label">Tarkistaa</h5>
              <p className="check-detail__text">
                <span className="check-detail__lead">{check.huomaa}</span> {check.proves}
              </p>
              {check.items?.length ? (
                <ul className="check-detail__list">
                  {check.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              ) : null}
            </section>
            <section className="check-detail__col">
              <h5 className="meta check-detail__label">Ei kata</h5>
              {(check.blind ?? 'Rajaa ei ole kirjattu.').split('\n\n').map((kappale, k) => (
                <p key={k} className="check-detail__text">{kappale}</p>
              ))}
            </section>
          </div>
        </Accordion>
        </Fragment>
        );
      })}
      {build ? (
        <Accordion
          number="—"
          title="Viimeisin ajo"
          description={build.description}
          open={group.isOpen('ajo')}
          onToggle={() => group.toggle('ajo')}
          labels={labels}
        >
          {build.children}
        </Accordion>
      ) : null}
    </div>
  );
}
