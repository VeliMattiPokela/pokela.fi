import type { ReactNode } from 'react';
import Korkeuskayrat from './Korkeuskayrat';

/**
 * Nosto (pattern).
 * ---------------------------------------------------------------
 * Sivun tai casen pääväite. Korvaa etusivun ja casejen käännetyt
 * nauhat.
 *
 *   paneeli    reunasta reunaan viivateos, keskellä paperinen paneeli
 *   jattikoko  käännetty pinta, väite koko ruudun levyisenä
 *   nauha      väite liukuu vaakanauhana reunasta reunaan
 */
export type NostoTyyli = 'paneeli' | 'jattikoko' | 'nauha';

export default function Nosto({
  title,
  body,
  action,
  tyyli = 'paneeli',
  label = '',
}: {
  title: string;
  body?: ReactNode;
  /** Linkki tai painike leipätekstin alla. */
  action?: ReactNode;
  tyyli?: NostoTyyli;
  /** Taustateoksen vaihtoehtoinen teksti (paneeli). */
  label?: string;
}) {
  const teksti =
    body || action ? (
      <div className="nosto__body">
        {body ? <p className="body-l">{body}</p> : null}
        {action}
      </div>
    ) : null;

  if (tyyli === 'paneeli') {
    return (
      <section className="nosto nosto--paneeli">
        <div className="nosto__tausta">
          <Korkeuskayrat label={label} />
        </div>
        <div className="nosto__paneeli">
          <p className="display-l nosto__title">{title}</p>
          {teksti}
        </div>
      </section>
    );
  }

  if (tyyli === 'nauha') {
    const toisto = Array.from({ length: 4 }, (_, i) => (
      <span key={i} className="nosto__toisto" aria-hidden={i > 0 || undefined}>
        {title}
        <span className="nosto__erotin" aria-hidden="true" />
      </span>
    ));
    return (
      <section className="nosto nosto--nauha">
        <p className="nosto__nauha">
          <span className="nosto__rulla">{toisto}</span>
        </p>
        <div className="nosto__ala">{teksti}</div>
      </section>
    );
  }

  /* jattikoko: väitteen sanat porrastetaan riveiksi. */
  const sanat = title.split(' ');
  const puoli = Math.ceil(sanat.length / 2);
  return (
    <section className="invert nosto nosto--jattikoko">
      <p className="nosto__jatti">
        <span className="nosto__rivi">{sanat.slice(0, puoli).join(' ')}</span>{' '}
        <span className="nosto__rivi nosto__rivi--loppu">{sanat.slice(puoli).join(' ')}</span>
      </p>
      <div className="nosto__ala">{teksti}</div>
    </section>
  );
}
