'use client';

import { useId, useState, type ReactNode } from 'react';
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

  return (
    <div className="accordion">
      <button
        type="button"
        className="list-row list-row--numbered list-row--expandable bleed"
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
      >
        <span className="meta list-row__number">{number}</span>
        <span className="list-row__main">
          <span className="list-row__title">{title}</span>
          <span className="list-row__description">{description}</span>
        </span>
        <span className="meta list-row__meta">{meta}</span>
        <Icon name={open ? 'minus' : 'plus'} size="l" className="list-row__icon" />
        <span className="visually-hidden">{open ? labels.close : labels.open}</span>
      </button>

      {open ? (
        <div id={id} className="accordion__panel page" role="region" aria-label={title}>
          {children}
        </div>
      ) : null}
    </div>
  );
}

/** Pitää huolen että vain yksi rivi on auki kerrallaan. */
export function useAccordionGroup() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  return {
    isOpen: (slug: string) => openSlug === slug,
    toggle: (slug: string) => setOpenSlug((current) => (current === slug ? null : slug)),
  };
}
