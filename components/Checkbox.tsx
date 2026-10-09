'use client';

import { useEffect, useId, useRef, type InputHTMLAttributes } from 'react';

/**
 * Valintaruutu: ruutu, label ja ohjeteksti.
 *
 * Sovelluskomponentti (päätös 22), sivusto ei käytä tätä. Kieli on
 * .btn-perheen: hiusviiva --line-strong, ei pyöristystä, valittu ruutu
 * täytetään --inkillä. Rivi on vähintään --tap-min korkea.
 *
 * Oikea <input> on ruudun päällä näkymättömänä, joten näppäimistö,
 * lomake ja ruudunlukija toimivat kuten natiivissa. `indeterminate`
 * ei ole HTML-attribuutti, joten se asetetaan elementille.
 *
 * Virhettä ei ole tässä: se kuuluu ryhmälle (ChoiceGroup), jonka
 * legend kertoo, mitä puuttuu.
 */
export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> & {
  label: string;
  /** Ohjeteksti labelin alla. */
  hint?: string;
  /** Osittain valittu, esim. "valitse kaikki", kun osa on valittu. */
  indeterminate?: boolean;
  className?: string;
};

export default function Checkbox(props: CheckboxProps) {
  const { label, hint, indeterminate, className, id: annettuId, ...input } = props;
  const omaId = useId();
  const id = annettuId ?? omaId;
  const ohjeId = hint ? `${id}-ohje` : undefined;
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = Boolean(indeterminate);
  }, [indeterminate]);

  return (
    <div className={['choice', input.disabled && 'choice--disabled', className].filter(Boolean).join(' ')}>
      <span className="choice__control">
        <input {...input} ref={ref} id={id} type="checkbox" className="choice__input" aria-describedby={ohjeId} />
        <span className="choice__mark" aria-hidden="true">
          <svg viewBox="0 0 20 20">
            <path className="choice__check" d="M5 10 L8.5 13.5 L15 6.5" />
            <path className="choice__dash" d="M5 10 H15" />
          </svg>
        </span>
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
