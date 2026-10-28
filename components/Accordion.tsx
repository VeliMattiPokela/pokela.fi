'use client';

import { useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import Icon from './Icon';

/**
 * Avautuva rivi.
 *
 * Vain yksi kerrallaan auki — siitä huolehtii <AccordionGroup>.
 *
 * Rivi itse EI ole listarivin sukulainen vaan sama rivi: se käyttää
 * `.list-row`-runkoa modifioijalla `--expandable`. Ero on siinä että
 * tämä on <button> eikä linkki, ja siksi se on oma komponenttinsa —
 * avaustila, paneeli ja ryhmälogiikka eivät kuulu linkkiin.
 *
 * Toteutus on <button> + region, ei <details>, koska "vain yksi auki"
 * vaatii jaetun tilan ja koska avautuva sisältö sisältää otsikoita
 * joiden pitää pysyä dokumentin rakenteessa.
 *
 * Avautuminen on liike (päätös 48): käännetty pinta nousee rivin
 * alareunasta, paneeli laskeutuu auki ja sisältö nousee lohko
 * kerrallaan. Sulkeutuessa sama tapahtuu lyhyemmin toisin päin, joten
 * paneeli pysyy DOMissa liikkeen ajan. Vähennetty liike avaa ja sulkee
 * heti, kuten ennen.
 */
export type AccordionProps = {
  number: string;
  title: string;
  description: string;
  meta: string;
  children: ReactNode;
  open: boolean;
  onToggle: () => void;
  labels: { open: string; close: string };
};

export function Accordion({
  number,
  title,
  description,
  meta,
  children,
  open,
  onToggle,
  labels,
}: AccordionProps) {
  const id = useId();
  const button = useRef<HTMLButtonElement>(null);
  const clip = useRef<HTMLDivElement>(null);
  /* Paneeli on DOMissa auki ollessa ja sulkeutumisen ajan. */
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);
  const edellinen = useRef(open);

  useLayoutEffect(() => {
    if (edellinen.current === open) return;
    edellinen.current = open;
    const btn = button.current;
    const el = clip.current;
    if (!btn || !el || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (!open) setMounted(false);
      return;
    }
    return open ? avaa(btn, el) : sulje(btn, el, () => setMounted(false));
  }, [open]);

  return (
    <div className="accordion">
      <button
        ref={button}
        type="button"
        className="list-row list-row--numbered list-row--expandable bleed"
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
      >
        <span className="meta list-row__number">{number}</span>
        <span className="list-row__main">
          <span className="display-s list-row__title">{title}</span>
          <span className="body-s muted list-row__description">{description}</span>
        </span>
        <span className="meta list-row__meta">{meta}</span>
        {/* Plus kääntyy miinukseksi CSS:ssä: pystyviiva kiertyy vaakaviivan päälle. */}
        <Icon name="plus" size="l" className="list-row__icon" />
        <span className="visually-hidden">{open ? labels.close : labels.open}</span>
      </button>

      {mounted ? (
        <div ref={clip} className="accordion__clip">
          <div id={id} className="accordion__panel page" role="region" aria-label={title}>
            {children}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ---- liike ----------------------------------------------------------

   Tekstin väri vaihtuu täsmälleen musteen reunalla: rivin vanha tila
   jää kloonina rivin päälle ja leikkautuu pois, jolloin alta paljastuu
   uusi tila. Pelkkä taustan animointi vaihtaisi tekstin värin koko
   rivillä kerralla, ja valkoinen teksti näkyisi hetken valkoisella. */

const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';
const EASE_IN_OUT = 'cubic-bezier(0.65, 0, 0.35, 1)';

function kerros(btn: HTMLButtonElement, oliAuki: boolean) {
  const k = btn.cloneNode(true) as HTMLElement;
  k.removeAttribute('aria-controls');
  k.querySelector('.visually-hidden')?.remove();
  k.setAttribute('aria-hidden', 'true');
  k.inert = true;
  k.setAttribute('aria-expanded', String(oliAuki));
  k.classList.add('accordion__kerros');
  if (!oliAuki) {
    /* Suljettu rivi oli osoittimen alla: hiljainen pinta. Värit
       suoraan, koska sisarrivien vaimennus osuisi myös klooniin. */
    k.style.background = btn.matches(':hover, :focus-visible') ? 'var(--badge-surface)' : 'var(--paper)';
    k.style.color = 'var(--ink)';
    k.querySelectorAll<HTMLElement>('.meta, .list-row__description').forEach((e) => {
      e.style.color = 'var(--ink-muted)';
    });
  }
  btn.after(k);
  btn.style.transition = 'none';
  return k;
}

/** Lohkot, jotka nousevat esiin vuorotellen. */
function lohkot(el: HTMLElement) {
  const panel = el.firstElementChild as HTMLElement;
  const juuri = panel.children.length === 1 ? (panel.firstElementChild as HTMLElement) : panel;
  return [...juuri.children] as HTMLElement[];
}

function avaa(btn: HTMLButtonElement, el: HTMLElement) {
  const k = kerros(btn, false);
  const h = el.scrollHeight;
  el.style.overflow = 'hidden';
  const anims = [
    k.animate([{ clipPath: 'inset(0 0 0 0)' }, { clipPath: 'inset(0 0 100% 0)' }], {
      duration: 420,
      easing: EASE_OUT,
      fill: 'forwards',
    }),
    el.animate([{ height: '0px' }, { height: `${h}px` }], { duration: 640, easing: EASE_OUT }),
    ...lohkot(el).map((l, i) =>
      l.animate([{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }], {
        duration: 620,
        delay: 140 + Math.min(i, 6) * 60,
        easing: EASE_OUT,
        fill: 'backwards',
      }),
    ),
  ];
  const siivoa = () => {
    anims.forEach((a) => a.cancel());
    k.remove();
    btn.style.transition = '';
    el.style.overflow = '';
  };
  Promise.all(anims.map((a) => a.finished)).then(siivoa, () => {});
  return siivoa;
}

function sulje(btn: HTMLButtonElement, el: HTMLElement, valmis: () => void) {
  const k = kerros(btn, true);
  const h = el.offsetHeight;
  el.style.overflow = 'hidden';
  const anims = [
    k.animate([{ clipPath: 'inset(0 0 0 0)' }, { clipPath: 'inset(100% 0 0 0)' }], {
      duration: 360,
      delay: 100,
      easing: EASE_IN_OUT,
      fill: 'forwards',
    }),
    ...lohkot(el).map((l) =>
      l.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, easing: 'linear', fill: 'forwards' }),
    ),
    el.animate([{ height: `${h}px` }, { height: '0px' }], {
      duration: 420,
      delay: 60,
      easing: EASE_IN_OUT,
      fill: 'forwards',
    }),
  ];
  let peruttu = false;
  const siivoa = () => {
    anims.forEach((a) => a.cancel());
    k.remove();
    btn.style.transition = '';
    el.style.overflow = '';
  };
  Promise.all(anims.map((a) => a.finished)).then(() => {
    if (peruttu) return;
    /* Paneelin animaatioita ei peruta: perutut animaatiot palauttaisivat
       paneelin täyteen korkeuteen yhdeksi ruuduksi ennen kuin React
       poistaa sen, ja se välähti. Paneeli poistuu kiinni-tilassa. */
    k.remove();
    btn.style.transition = '';
    valmis();
  }, () => {});
  return () => {
    peruttu = true;
    siivoa();
  };
}

/** Pitää huolen että vain yksi rivi on auki kerrallaan. */
export function useAccordionGroup() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  return {
    isOpen: (slug: string) => openSlug === slug,
    toggle: (slug: string) => setOpenSlug((current) => (current === slug ? null : slug)),
  };
}
