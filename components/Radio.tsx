import { useId, type InputHTMLAttributes } from 'react';

/**
 * Radiopainike: yksi vaihtoehto ryhmästä, josta valitaan yksi.
 *
 * Sovelluskomponentti (päätös 22). Ympyrä on systeemin ainoa pyöreä
 * muoto (päätös 24): ilman sitä radio ja valintaruutu näyttäisivät
 * samalta, eikä käyttäjä näkisi, valitaanko yksi vai monta.
 *
 * Käytä aina ChoiceGroupin sisällä samalla `name`-arvolla.
 */
export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> & {
  label: string;
  /** Ohjeteksti labelin alla. */
  hint?: string;
  className?: string;
};

export default function Radio(props: RadioProps) {
  const { label, hint, className, id: annettuId, ...input } = props;
  const omaId = useId();
  const id = annettuId ?? omaId;
  const ohjeId = hint ? `${id}-ohje` : undefined;

  return (
    <div
      className={['choice', 'choice--radio', input.disabled && 'choice--disabled', className]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="choice__control">
        <input {...input} id={id} type="radio" className="choice__input" aria-describedby={ohjeId} />
        <span className="choice__mark" aria-hidden="true" />
      </span>
      <label className="choice__label" htmlFor={id}>
        {label}
      </label>
      {hint ? (
        <p id={ohjeId} className="choice__hint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
