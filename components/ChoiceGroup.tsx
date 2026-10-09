import { useId, type ReactNode } from 'react';
import Icon from './Icon';

/**
 * Valintojen ryhmä: otsikko (legend), valinnat, ohje ja virhe.
 *
 * Sovelluskomponentti (päätös 22). Ryhmä on <fieldset>, joten
 * ruudunlukija sanoo otsikon ennen jokaista valintaa. Virhe kuuluu
 * ryhmälle eikä yksittäiselle valinnalle: "valitse yksi" koskee
 * kaikkia. Virhetilassa jokaisen valinnan reuna on --danger, ja viesti
 * on ikonin kanssa kuten TextFieldissä.
 *
 * Yksittäinenkin pakollinen valinta ("hyväksy ehdot") tehdään ryhmänä,
 * jotta virheelle on paikka.
 */
export type ChoiceGroupProps = {
  legend: string;
  /** Ohjeteksti valintojen alla. */
  hint?: string;
  /** Virheviesti. Kun annettu, ryhmä on virhetilassa. */
  error?: string;
  children: ReactNode;
  className?: string;
};

export default function ChoiceGroup({ legend, hint, error, children, className }: ChoiceGroupProps) {
  const id = useId();
  const ohjeId = hint ? `${id}-ohje` : undefined;
  const virheId = error ? `${id}-virhe` : undefined;
  const kuvaus = [ohjeId, virheId].filter(Boolean).join(' ') || undefined;

  return (
    <fieldset
      className={['choice-group', error && 'choice-group--invalid', className].filter(Boolean).join(' ')}
      aria-describedby={kuvaus}
    >
      <legend className="choice-group__legend">{legend}</legend>
      {children}
      {hint ? (
        <p id={ohjeId} className="field__hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={virheId} className="field__error">
          <Icon name="alert" />
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
