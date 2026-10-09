import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import Icon from './Icon';

/**
 * Tekstikenttä: label, kenttä, ohjeteksti ja virhe yhtenä.
 *
 * Sivusto ei käytä tätä. Se on kirjastossa sovellusnäkymiä varten
 * (Storybookin ryhmä Sovellus, päätös 22), jotta Make voi rakentaa
 * lomakkeen systeemin omista osista eikä keksi omaansa.
 *
 * Kieli on .btn-perheen: hiusviiva ilman pyöristystä, hover paksuntaa
 * alaviivan kuten tekstinapissa, focus on sivuston yhteinen rengas.
 * Virhe on systeemin ainoa tilaväri --danger, aina ikonin ja tekstin
 * kanssa, ettei merkitys jää värin varaan.
 *
 * Tilat ovat propseja, eivät luokkia: `error` ja `disabled`. Hover ja
 * focus ovat CSS:n tiloja. `multiline` vaihtaa kentän tekstialueeksi;
 * muuten sama komponentti, koska label, ohje ja virhe ovat samat.
 */
type Yhteiset = {
  label: string;
  /** Ohjeteksti kentän alla. */
  hint?: string;
  /** Virheviesti. Kun annettu, kenttä on virhetilassa (aria-invalid). */
  error?: string;
  /** Valinnaisen kentän merkintä labelin perässä, esim. "(valinnainen)". */
  optional?: string;
  className?: string;
};

/* Yksi propsityyppi eikä unioni input/textarea: unioni hajottaa
   Storybookin ja Code Connectin tyypityksen, eikä kenttä tarvitse
   tekstialueelta muuta kuin rivimäärän. */
export type TextFieldProps = Yhteiset &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & {
    /** Tekstialue (<textarea>) yhden rivin kentän sijaan. */
    multiline?: boolean;
    /** Tekstialueen rivit. */
    rows?: number;
  };

export default function TextField(props: TextFieldProps) {
  const { label, hint, error, optional, className, multiline, rows, id: annettuId, ...kentta } = props;
  const omaId = useId();
  const id = annettuId ?? omaId;
  const ohjeId = hint ? `${id}-ohje` : undefined;
  const virheId = error ? `${id}-virhe` : undefined;
  const kuvaus = [ohjeId, virheId].filter(Boolean).join(' ') || undefined;

  const yhteiset = {
    id,
    className: 'field__control',
    'aria-invalid': error ? true : undefined,
    'aria-describedby': kuvaus,
  };

  return (
    <div
      className={['field', error && 'field--invalid', kentta.disabled && 'field--disabled', className]
        .filter(Boolean)
        .join(' ')}
    >
      <label className="field__label" htmlFor={id}>
        {label}
        {optional ? <span className="field__optional"> {optional}</span> : null}
      </label>
      {multiline ? (
        <textarea {...(kentta as TextareaHTMLAttributes<HTMLTextAreaElement>)} rows={rows} {...yhteiset} />
      ) : (
        <input {...kentta} {...yhteiset} />
      )}
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
    </div>
  );
}
