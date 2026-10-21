import type { ReactNode } from 'react';

/**
 * Nosto (pattern).
 * ---------------------------------------------------------------
 * Sivun tai casen pääväite yhtenä isona lauseena. Korvaa etusivun ja
 * casejen käännetyt nauhat, jotka hyppäsivät sivulta liian rajusti
 * esiin ja toistivat samaa kahden palstan asettelua kuin muut osiot.
 *
 * Yksi palsta: väite koko leveydeltä, leipäteksti ja linkki sen alla
 * siirrettynä oikealle. Rytmi tulee väljästä tilasta, ei kontrastista.
 *
 *   tint     sävytetty pinta reunasta reunaan (oletus)
 *   paper    sivun oma pinta, yläreunassa viiva
 */
export type NostoSurface = 'tint' | 'paper';

export default function Nosto({
  title,
  body,
  action,
  surface = 'tint',
}: {
  title: ReactNode;
  body?: ReactNode;
  /** Linkki tai painike leipätekstin alla. */
  action?: ReactNode;
  surface?: NostoSurface;
}) {
  return (
    <section className={['bleed nosto', `nosto--${surface}`].join(' ')}>
      <div className="nosto__inner">
        <p className="display-l nosto__title">{title}</p>
        {body || action ? (
          <div className="nosto__body">
            {body ? <p className="body-l">{body}</p> : null}
            {action}
          </div>
        ) : null}
      </div>
    </section>
  );
}
