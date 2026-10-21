import type { ReactNode } from 'react';
import Korkeuskayrat from './Korkeuskayrat';

/**
 * Nosto (pattern).
 * ---------------------------------------------------------------
 * Sivun tai casen pääväite. Reunasta reunaan taustana on etusivun
 * viivateos (Korkeuskayrat), ja keskellä on paperinen paneeli, jossa
 * väite, leipäteksti ja valinnainen linkki ovat keskitettyinä.
 *
 * Korvaa käännetyt nauhat, jotka hyppäsivät sivulta liian rajusti
 * esiin ja toistivat samaa kahden palstan asettelua kuin muut osiot.
 * Tausta on koristetta, joten se on piilotettu ruudunlukijalta.
 */
export default function Nosto({
  title,
  body,
  action,
}: {
  title: ReactNode;
  body?: ReactNode;
  /** Linkki tai painike leipätekstin alla. */
  action?: ReactNode;
}) {
  return (
    <section className="nosto">
      <div className="nosto__tausta">
        <Korkeuskayrat />
      </div>
      <div className="nosto__paneeli">
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
