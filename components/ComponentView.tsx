'use client';

import { useId, useRef, useState, type ReactNode } from 'react';
import Icon from './Icon';

/**
 * Komponenttinäkymä — yksi komponentti neljästä suunnasta.
 *
 * Välilehdet ovat oikea `tablist`: nuolinäppäimet, Home/End,
 * roving tabindex, `aria-controls`. Ei div-nappeja — tämä sivu
 * väittää osaavansa saavutettavuuden, joten sen pitää kestää
 * näppäimistökäyttö.
 *
 * Sisältö tulee propseina valmiiksi renderöitynä: koodi luetaan ja
 * korostetaan palvelimella build-aikana (lib/source.ts,
 * lib/highlight.ts), joten selaimeen ei mene korostuskirjastoa.
 */

export type Tab = {
  /**
   * Välilehden nimi, meta-koossa.
   *
   * Nimeä välilehti paikan mukaan, ei artefaktityypin: "Storybook"
   * ja "Figma" ovat ne kaksi muuta paikkaa joissa sama komponentti
   * elää. "Story" rikkoisi parin — toinen nimeäisi tiedostotyypin,
   * toinen työkalun.
   */
  label: string;
  /** Vakaa tunniste ankkuria varten. */
  id: string;
  content: ReactNode;
};

export default function ComponentView({
  tabs,
  label,
  links,
  linksLabel,
}: {
  tabs: Tab[];
  /** Saavutettava nimi koko ryhmälle. */
  label: string;
  /** Alarivin otsikko. Propsina eikä kirjoitettuna tähän, jotta se
      kulkee sanakirjan kautta kuten muukin näkyvä teksti. */
  linksLabel?: string;
  /** Alarivin artefaktit. Tila kertoo onko se julkaistu, olemassa
      vai tulossa — "tulossa" ei saa tarkoittaa kahta eri asiaa. */
  links?: { label: string; href: string | null; state: string; note: string }[];
}) {
  const [active, setActive] = useState(0);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const focusTab = (index: number) => {
    const next = (index + tabs.length) % tabs.length;
    setActive(next);
    refs.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys: Record<string, () => void> = {
      ArrowRight: () => focusTab(index + 1),
      ArrowLeft: () => focusTab(index - 1),
      Home: () => focusTab(0),
      End: () => focusTab(tabs.length - 1),
    };
    const action = keys[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  };

  return (
    <div className="cview">
      <div className="cview__tabs" role="tablist" aria-label={label}>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${base}-tab-${tab.id}`}
            aria-selected={index === active}
            aria-controls={`${base}-panel-${tab.id}`}
            /* Roving tabindex: vain aktiivinen on tab-järjestyksessä,
               loput saavutetaan nuolinäppäimillä. */
            tabIndex={index === active ? 0 : -1}
            className="cview__tab meta"
            onClick={() => setActive(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${base}-panel-${tab.id}`}
          aria-labelledby={`${base}-tab-${tab.id}`}
          hidden={index !== active}
          /* Paneeli on fokusoitava, jotta näppäimistökäyttäjä pääsee
             sisältöön suoraan välilehdeltä. */
          tabIndex={0}
          className="cview__panel"
        >
          {tab.content}
        </div>
      ))}

      {links?.length ? (
        <div className="cview__links">
          <span className="meta">{linksLabel}</span>
          <span className="cview__links-list">
            {links.map((link) =>
              link.href ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="meta meta--ink cview__link"
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label} <Icon name="arrow-up-right" size="s" />
                </a>
              ) : (
                /* Tyhjä linkki olisi huonompi kuin puuttuva: casen
                   argumentti on että jokaisen väitteen voi tarkistaa. */
                <span key={link.label} className="meta cview__link cview__link--pending">
                  {link.label} — {link.note}
                </span>
              ),
            )}
          </span>
        </div>
      ) : null}
    </div>
  );
}

/** Koodilohko. `html` on Shikin tuottamaa, korostettu build-aikana. */
export function CodeBlock({
  path,
  html,
  lines,
  note,
}: {
  path: string;
  html: string;
  /** Tiedoston rivimäärä. Tiedosto näytetään aina kokonaan. */
  lines: number;
  note?: string;
}) {
  return (
    <figure className="code">
      <figcaption className="code__head">
        <span className="meta meta--s code__path">{path}</span>
        <span className="meta meta--s code__lines">{lines} riviä</span>
      </figcaption>
      <div className="code__body" dangerouslySetInnerHTML={{ __html: html }} />
      {note ? <p className="body-s code__note">{note}</p> : null}
    </figure>
  );
}

/** Faktarivi: nimi vasemmalle, arvo oikealle, hiusviiva väliin. */
export function FactList({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="cview__facts">
      {items.map((item) => (
        <div key={item.label} className="cview__fact">
          <dt className="meta">{item.label}</dt>
          <dd className="cview__fact-value">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
