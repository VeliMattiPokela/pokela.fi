import { useId, type InputHTMLAttributes } from 'react';

/**
 * Kytkin: asetus, joka tulee voimaan heti.
 *
 * Sovelluskomponentti (päätös 22). Valintaruutu tallennetaan napilla,
 * kytkin ei. Siksi kytkin on asetuslistan rivi: label vasemmalla,
 * kytkin oikeassa reunassa. Kisko ja nuppi ovat neliöt kuten muu
 * systeemi; päällä kisko täyttyy --inkillä.
 *
 * Alla on <input type="checkbox" role="switch">, joten ruudunlukija
 * sanoo "päällä" tai "pois".
 */
export type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className' | 'role'> & {
  label: string;
  /** Ohjeteksti labelin alla. */
  hint?: string;
  className?: string;
};

export default function Switch(props: SwitchProps) {
  const { label, hint, className, id: annettuId, ...input } = props;
  const omaId = useId();
  const id = annettuId ?? omaId;
  const ohjeId = hint ? `${id}-ohje` : undefined;

  return (
    <div
      className={['choice', 'choice--switch', input.disabled && 'choice--disabled', className]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="choice__control">
        <input {...input} id={id} type="checkbox" role="switch" className="choice__input" aria-describedby={ohjeId} />
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
