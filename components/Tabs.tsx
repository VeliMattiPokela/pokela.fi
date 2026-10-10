'use client';

import { Children, isValidElement, useId, useRef, useState, type KeyboardEvent, type ReactElement, type ReactNode } from 'react';
import Tab, { type TabProps } from './Tab';

/**
 * Välilehdet: rivi välilehtiä ja valitun paneeli.
 *
 * Sovelluskomponentti (päätökset 22 ja 28). Ulkoasu on navin
 * aktiivisen linkin kieli: valittu välilehti saa musteviivan
 * (--hairline-strong) rivin hiusviivan päälle, muut ovat haaleampia.
 *
 * Rakenne WAI-ARIA APG:n Tabs-mallin mukaan, automaattinen aktivointi:
 *
 *   rivi      role="tablist", aria-label
 *   välilehti role="tab", aria-selected, aria-controls. Vain valittu
 *             on sarkainjärjestyksessä (roving tabindex).
 *   paneeli   role="tabpanel", aria-labelledby, tabindex=0, jotta
 *             sarkain vie paneeliin silloinkin, kun siinä ei ole
 *             fokusoitavaa.
 *
 * Näppäimet: vasen ja oikea nuoli siirtävät ja valitsevat (rivin
 * päästä toiseen), Home ja End vievät päihin. Pois käytöstä olevat
 * ohitetaan. Paneelit vaihtuvat heti, joten valinta seuraa fokusta.
 */
export type TabsProps = {
  /** Rivin nimi ruudunlukijalle, esim. "Asetukset". Ei näy. */
  label: string;
  /** Ohjattu valinta. Käytä `onChange`:n kanssa. */
  value?: string;
  /** Alkuvalinta, kun valintaa ei ohjata. Oletus: ensimmäinen käytössä oleva. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** `Tab`-elementit. */
  children: ReactNode;
  id?: string;
  className?: string;
};

export default function Tabs({ label, value: ohjattu, defaultValue, onChange, children, id: annettuId, className }: TabsProps) {
  const omaId = useId();
  const id = annettuId ?? omaId;
  const tabId = (i: number) => `${id}-tab-${i}`;
  const paneeliId = (i: number) => `${id}-paneeli-${i}`;

  const tabit = Children.toArray(children).filter(
    (c): c is ReactElement<TabProps> => isValidElement(c) && c.type === Tab,
  );
  const kaytossa = (i: number) => i >= 0 && i < tabit.length && !tabit[i].props.disabled;

  const [oma, setOma] = useState(defaultValue);
  const pyydetty = ohjattu !== undefined ? ohjattu : oma;
  let valittu = tabit.findIndex((t) => t.props.value === pyydetty);
  if (!kaytossa(valittu)) valittu = tabit.findIndex((_, i) => kaytossa(i));

  const napit = useRef<(HTMLButtonElement | null)[]>([]);

  const valitse = (i: number) => {
    if (!kaytossa(i)) return;
    const uusi = tabit[i].props.value;
    if (ohjattu === undefined) setOma(uusi);
    if (i !== valittu) onChange?.(uusi);
  };

  /** Seuraava käytössä oleva suuntaan `askel`, rivin päästä toiseen. */
  const seuraava = (alku: number, askel: number) => {
    const n = tabit.length;
    for (let k = 1; k <= n; k++) {
      const i = (((alku + askel * k) % n) + n) % n;
      if (kaytossa(i)) return i;
    }
    return alku;
  };

  const nappain = (e: KeyboardEvent<HTMLDivElement>) => {
    let kohde = -1;
    if (e.key === 'ArrowRight') kohde = seuraava(valittu, 1);
    else if (e.key === 'ArrowLeft') kohde = seuraava(valittu, -1);
    else if (e.key === 'Home') kohde = seuraava(-1, 1);
    else if (e.key === 'End') kohde = seuraava(tabit.length, -1);
    else return;
    e.preventDefault();
    valitse(kohde);
    napit.current[kohde]?.focus();
  };

  return (
    <div className={['tabs', className].filter(Boolean).join(' ')}>
      <div className="tabs__list" role="tablist" aria-label={label} onKeyDown={nappain}>
        {tabit.map((t, i) => {
          const on = i === valittu;
          return (
            <button
              key={t.props.value}
              ref={(el) => {
                napit.current[i] = el;
              }}
              type="button"
              role="tab"
              id={tabId(i)}
              className="tabs__tab"
              aria-selected={on}
              aria-controls={paneeliId(i)}
              aria-disabled={t.props.disabled || undefined}
              tabIndex={on ? 0 : -1}
              onClick={() => valitse(i)}
            >
              {t.props.label}
              {t.props.count !== undefined ? <span className="tabs__count">{t.props.count}</span> : null}
            </button>
          );
        })}
      </div>
      {tabit.map((t, i) => (
        <div
          key={t.props.value}
          role="tabpanel"
          id={paneeliId(i)}
          className="tabs__panel"
          aria-labelledby={tabId(i)}
          tabIndex={0}
          hidden={i !== valittu}
        >
          {t.props.children}
        </div>
      ))}
    </div>
  );
}
