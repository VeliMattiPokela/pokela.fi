'use client';

import { Fragment, type ReactNode } from 'react';
import { Accordion, useAccordionGroup } from './Accordion';

/**
 * Tarkistuslista casessa: nimi ja mitä tarkistus todistaa näkyvät
 * aina, raja ("Ei kata") avautuu rivistä. Viimeinen rivi voi olla
 * viimeisin build, jonka aikajana avautuu samalla tavalla.
 *
 * Kun `groups` on annettu, ryhmän otsikko ja selite tulevat sen
 * ensimmäisen rivin eteen. Numerointi jatkuu ryhmien yli.
 */
export default function CheckList({
  items,
  groups,
  build,
}: {
  items: { id: string; title: string; proves: string; blind: string | null; runs: boolean; group?: string }[];
  groups?: { id: string; title: string; note: string }[];
  build?: { description: string; meta: string; children: ReactNode };
}) {
  const group = useAccordionGroup();
  const labels = { open: 'Avaa', close: 'Sulje' };

  return (
    <div className="list-rows case__checklist">
      {items.map((check, i) => {
        /* Rivillä vain ensimmäinen lause, loput avautuvat rajan kanssa. */
        const [first, ...rest] = check.proves.split(/(?<=\.)\s+(?=[A-ZÄÖ])/);
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
          number={String(i + 1).padStart(2, '0')}
          title={check.title}
          description={first}
          meta={check.runs ? 'Ajossa' : 'Ei vielä kytketty'}
          open={group.isOpen(check.id)}
          onToggle={() => group.toggle(check.id)}
          labels={labels}
        >
          {rest.length ? <p className="body-s muted measure">{rest.join(' ')}</p> : null}
          <p className="body-s muted measure case__check-blind">
            <strong>Ei kata:</strong> {check.blind ?? 'Rajaa ei ole kirjattu.'}
          </p>
        </Accordion>
        </Fragment>
        );
      })}
      {build ? (
        <Accordion
          number="—"
          title="Viimeisin build"
          description={build.description}
          meta={build.meta}
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
