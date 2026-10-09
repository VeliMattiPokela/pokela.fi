'use client';

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import Icon from './Icon';

/**
 * Valintalista: label, kenttä, oma lista, ohjeteksti ja virhe.
 *
 * Sovelluskomponentti (päätös 22). Suljettu kenttä on TextFieldin
 * kenttä; lista on systeemin oma (päätös 25), koska Vellu halusi
 * listankin hiusviivakieleen. Natiivi <select> antaisi saavutettavuuden
 * ilmaiseksi, joten tämä toteuttaa sen itse WAI-ARIA APG:n
 * "select-only combobox" -mallin mukaan:
 *
 *   kenttä   role="combobox", aria-expanded, aria-controls,
 *            aria-activedescendant. Fokus pysyy kentässä koko ajan;
 *            lista näyttää aktiivisen vaihtoehdon.
 *   lista    role="listbox", vaihtoehdot role="option" ja
 *            aria-selected.
 *
 * Näppäimet: suljettuna Enter, välilyönti, nuolet, Home ja End
 * avaavat, kirjain hyppää vaihtoehtoon. Auki nuolet, Home, End,
 * PageUp ja PageDown liikkuvat, Enter ja välilyönti valitsevat, Esc
 * sulkee muuttamatta, Tab valitsee ja siirtyy eteenpäin. Kirjoittaminen
 * hakee alkukirjaimilla. Klikkaus listan ulkopuolelle sulkee.
 *
 * Lomakkeeseen arvo menee piilokentästä, kun `name` on annettu.
 */
export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectProps = {
  label: string;
  options: SelectOption[];
  /** Ohjattu arvo. Käytä `onChange`:n kanssa. */
  value?: string;
  /** Alkuarvo, kun arvoa ei ohjata. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Teksti kun mitään ei ole valittu, esim. "Valitse rooli". */
  placeholder?: string;
  /** Ohjeteksti kentän alla. */
  hint?: string;
  /** Virheviesti. Kun annettu, kenttä on virhetilassa (aria-invalid). */
  error?: string;
  /** Valinnaisen kentän merkintä labelin perässä, esim. "(valinnainen)". */
  optional?: string;
  disabled?: boolean;
  required?: boolean;
  /** Lomakekentän nimi. Arvo lähtee lomakkeen mukana piilokentästä. */
  name?: string;
  id?: string;
  className?: string;
};

/** Montako riviä PageUp ja PageDown hyppäävät: listan näkyvä korkeus. */
const SIVU = 6;
/** Kuinka kauan kirjainhaku muistaa edelliset kirjaimet. */
const HAKU_MS = 500;

export default function Select(props: SelectProps) {
  const {
    label,
    options,
    value: ohjattu,
    defaultValue,
    onChange,
    placeholder,
    hint,
    error,
    optional,
    disabled,
    required,
    name,
    id: annettuId,
    className,
  } = props;

  const omaId = useId();
  const id = annettuId ?? omaId;
  const labelId = `${id}-label`;
  const listaId = `${id}-lista`;
  const ohjeId = hint ? `${id}-ohje` : undefined;
  const virheId = error ? `${id}-virhe` : undefined;
  const kuvaus = [ohjeId, virheId].filter(Boolean).join(' ') || undefined;
  const optioId = (i: number) => `${id}-optio-${i}`;

  const [oma, setOma] = useState(defaultValue);
  const arvo = ohjattu !== undefined ? ohjattu : oma;
  const valittu = options.findIndex((o) => o.value === arvo);

  const [auki, setAuki] = useState(false);
  const [aktiivinen, setAktiivinen] = useState(-1);
  const [ylos, setYlos] = useState(false);

  const kentta = useRef<HTMLDivElement>(null);
  const lista = useRef<HTMLUListElement>(null);
  const juuri = useRef<HTMLDivElement>(null);
  const haku = useRef({ teksti: '', aika: 0 });

  const kaytossa = useCallback((i: number) => i >= 0 && i < options.length && !options[i].disabled, [options]);

  /** Seuraava käytössä oleva vaihtoehto suuntaan `askel`, tai sama jos reunassa. */
  const siirra = useCallback(
    (alku: number, askel: number) => {
      let i = alku;
      for (let n = 0; n < options.length; n++) {
        const seuraava = i + askel;
        if (seuraava < 0 || seuraava >= options.length) break;
        i = seuraava;
        if (kaytossa(i)) return i;
      }
      return kaytossa(alku) ? alku : -1;
    },
    [options, kaytossa],
  );
  const ensimmainen = useCallback(() => siirra(-1, 1), [siirra]);
  const viimeinen = useCallback(() => siirra(options.length, -1), [siirra, options.length]);

  const valitse = (i: number) => {
    if (!kaytossa(i)) return;
    const uusi = options[i].value;
    if (ohjattu === undefined) setOma(uusi);
    if (uusi !== arvo) onChange?.(uusi);
  };

  const avaa = (aktiivi: number) => {
    if (disabled) return;
    setAuki(true);
    setAktiivinen(aktiivi >= 0 ? aktiivi : ensimmainen());
  };
  const sulje = () => {
    setAuki(false);
    setAktiivinen(-1);
  };

  /* Aktiivinen vaihtoehto pysyy näkyvissä pitkässä listassa. */
  useEffect(() => {
    if (!auki || aktiivinen < 0) return;
    document.getElementById(optioId(aktiivinen))?.scrollIntoView({ block: 'nearest' });
  }, [auki, aktiivinen]);

  /* Lista aukeaa ylös, jos alla ei ole tilaa mutta yllä on. */
  useEffect(() => {
    if (!auki || !kentta.current || !lista.current) return;
    const k = kentta.current.getBoundingClientRect();
    const korkeus = lista.current.offsetHeight;
    const alla = window.innerHeight - k.bottom;
    setYlos(alla < korkeus && k.top > alla);
  }, [auki]);

  /* Klikkaus tai kosketus komponentin ulkopuolella sulkee. */
  useEffect(() => {
    if (!auki) return;
    const ulkona = (e: PointerEvent) => {
      if (!juuri.current?.contains(e.target as Node)) sulje();
    };
    document.addEventListener('pointerdown', ulkona);
    return () => document.removeEventListener('pointerdown', ulkona);
  }, [auki]);

  /** Kirjainhaku: kirjaimet kertyvät hetken, ja sama kirjain kiertää vaihtoehtoja. */
  const hae = (merkki: string) => {
    const nyt = Date.now();
    const h = haku.current;
    h.teksti = nyt - h.aika > HAKU_MS ? merkki : h.teksti + merkki;
    h.aika = nyt;
    const sama = h.teksti.split('').every((c) => c === h.teksti[0]);
    const etsittava = (sama ? h.teksti[0] : h.teksti).toLocaleLowerCase('fi');
    const lahto = auki ? aktiivinen : valittu;
    const alku = sama || h.teksti.length === 1 ? lahto + 1 : Math.max(lahto, 0);
    for (let n = 0; n < options.length; n++) {
      const i = (alku + n) % options.length;
      if (kaytossa(i) && options[i].label.toLocaleLowerCase('fi').startsWith(etsittava)) return i;
    }
    return -1;
  };

  const nappain = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const { key, altKey } = e;

    if (!auki) {
      if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === ' ') {
        e.preventDefault();
        avaa(valittu >= 0 ? valittu : key === 'ArrowUp' ? viimeinen() : ensimmainen());
      } else if (key === 'Home') {
        e.preventDefault();
        avaa(ensimmainen());
      } else if (key === 'End') {
        e.preventDefault();
        avaa(viimeinen());
      } else if (key.length === 1 && !e.ctrlKey && !e.metaKey && !altKey) {
        const i = hae(key);
        if (i >= 0) avaa(i);
      }
      return;
    }

    switch (key) {
      case 'ArrowDown':
        e.preventDefault();
        setAktiivinen((a) => siirra(a, 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (altKey) {
          valitse(aktiivinen);
          sulje();
        } else setAktiivinen((a) => siirra(a, -1));
        break;
      case 'Home':
        e.preventDefault();
        setAktiivinen(ensimmainen());
        break;
      case 'End':
        e.preventDefault();
        setAktiivinen(viimeinen());
        break;
      case 'PageDown':
        e.preventDefault();
        setAktiivinen((a) => {
          let i = a;
          for (let n = 0; n < SIVU; n++) i = siirra(i, 1);
          return i;
        });
        break;
      case 'PageUp':
        e.preventDefault();
        setAktiivinen((a) => {
          let i = a;
          for (let n = 0; n < SIVU; n++) i = siirra(i, -1);
          return i;
        });
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (key === ' ' && haku.current.teksti && Date.now() - haku.current.aika < HAKU_MS) {
          /* Välilyönti kesken haun on osa hakua ("Uusi Seelanti"). */
          const i = hae(' ');
          if (i >= 0) setAktiivinen(i);
          break;
        }
        valitse(aktiivinen);
        sulje();
        break;
      case 'Escape':
        e.preventDefault();
        sulje();
        break;
      case 'Tab':
        /* Tab hyväksyy aktiivisen ja antaa fokuksen siirtyä. */
        valitse(aktiivinen);
        sulje();
        break;
      default:
        if (key.length === 1 && !e.ctrlKey && !e.metaKey && !altKey) {
          const i = hae(key);
          if (i >= 0) setAktiivinen(i);
        }
    }
  };

  const naytettava = valittu >= 0 ? options[valittu].label : placeholder;

  return (
    <div
      ref={juuri}
      className={['field', 'select', error && 'field--invalid', disabled && 'field--disabled', className]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Ei <label>: combobox ei ole lomake-elementti. Klikkaus tuo silti
          fokuksen kenttään kuten natiivissa. */}
      <span id={labelId} className="field__label" onClick={() => kentta.current?.focus()}>
        {label}
        {optional ? <span className="field__optional"> {optional}</span> : null}
      </span>
      <div className="select__wrap">
        <div
          ref={kentta}
          id={id}
          role="combobox"
          tabIndex={disabled ? -1 : 0}
          className={['field__control', 'select__control', valittu < 0 && 'select__control--placeholder']
            .filter(Boolean)
            .join(' ')}
          aria-labelledby={labelId}
          aria-controls={listaId}
          aria-expanded={auki}
          aria-haspopup="listbox"
          aria-activedescendant={auki && aktiivinen >= 0 ? optioId(aktiivinen) : undefined}
          aria-describedby={kuvaus}
          aria-invalid={error ? true : undefined}
          aria-required={required || undefined}
          aria-disabled={disabled || undefined}
          onClick={() => (auki ? sulje() : avaa(valittu))}
          onKeyDown={nappain}
          onBlur={(e) => {
            if (!juuri.current?.contains(e.relatedTarget as Node)) sulje();
          }}
        >
          <span className="select__value">{naytettava}</span>
          <Icon name="chevron-down" className="select__chevron" />
        </div>
        <ul
          ref={lista}
          id={listaId}
          role="listbox"
          aria-labelledby={labelId}
          tabIndex={-1}
          hidden={!auki}
          className={['select__list', ylos && 'select__list--up'].filter(Boolean).join(' ')}
        >
          {options.map((o, i) => (
            <li
              key={o.value}
              id={optioId(i)}
              role="option"
              aria-selected={i === valittu}
              aria-disabled={o.disabled || undefined}
              className={['select__option', i === aktiivinen && 'is-active'].filter(Boolean).join(' ')}
              /* Fokus pysyy kentässä: hiiren painallus ei saa viedä sitä. */
              onPointerDown={(e) => e.preventDefault()}
              onPointerMove={() => kaytossa(i) && i !== aktiivinen && setAktiivinen(i)}
              onClick={() => {
                if (!kaytossa(i)) return;
                valitse(i);
                sulje();
                kentta.current?.focus();
              }}
            >
              <span>{o.label}</span>
              {i === valittu ? <Icon name="check" className="select__check" /> : null}
            </li>
          ))}
        </ul>
      </div>
      {name ? <input type="hidden" name={name} value={arvo ?? ''} /> : null}
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
