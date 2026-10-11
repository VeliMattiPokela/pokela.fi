'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import Icon from './Icon';

/**
 * Modaalinen dialogi: otsikko, teksti, sisältö, toiminnot ja sulkeminen.
 *
 * Sovelluskomponentti (päätökset 22 ja 31). Ei varjoa eikä tummaa
 * verhoa: sivu peittyy paperin sävyisellä verholla, ja dialogi on
 * paperia musteen hiusviivakehyksellä. Uutta väriä ei tarvita, ja
 * sama ratkaisu toimii molemmissa teemoissa. Mobiilissa dialogi on
 * alareunan arkki, ja napit ovat täysleveitä.
 *
 * Natiivi <dialog> ja showModal(): selain pitää fokuksen dialogissa,
 * piilottaa muun sivun ruudunlukijalta ja sulkee Escillä. Esc ja
 * verhon klikkaus kutsuvat `onClose`a, joten tila pysyy kutsujalla.
 *
 * Fokus menee avattaessa ensimmäiseen fokusoitavaan: lomakkeessa
 * ensimmäiseen kenttään, vahvistuksessa Peruuta-nappiin, kun se on
 * toiminnoissa ensimmäisenä. Sulkunappi on DOM:ssa viimeisenä, jotta
 * se ei vie alkufokusta. Suljettaessa fokus palaa avanneeseen nappiin.
 */
export type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Selittävä teksti otsikon alla. Ruudunlukija lukee sen avattaessa. */
  description?: ReactNode;
  /** Sisältö tekstin alla, esim. lomakkeen kentät. */
  children?: ReactNode;
  /** Napit oikeaan alakulmaan: vähiten vahingollinen ensin. */
  actions?: ReactNode;
  /** Sulkunapin nimi ruudunlukijalle. */
  closeLabel?: string;
  className?: string;
};

export default function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  actions,
  closeLabel = 'Sulje',
  className,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const avaaja = useRef<HTMLElement | null>(null);
  const otsikkoId = useId();
  const tekstiId = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      avaaja.current = document.activeElement as HTMLElement | null;
      el.showModal();
    } else if (!open && el.open) {
      el.close();
      avaaja.current?.focus();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={['dialog', className].filter(Boolean).join(' ')}
      aria-labelledby={otsikkoId}
      aria-describedby={description ? tekstiId : undefined}
      onCancel={(e) => {
        /* Esc: selain sulkisi itse, mutta tila on kutsujalla. */
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        /* Klikkaus osuu itse dialogiin vain verhon kohdalla: sisältö on
           .dialog__panelissa, joka täyttää dialogin. */
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dialog__panel">
        <div className="dialog__header">
          <h2 id={otsikkoId} className="dialog__title">
            {title}
          </h2>
          {description ? (
            <div id={tekstiId} className="dialog__description">
              {description}
            </div>
          ) : null}
        </div>
        {children ? <div className="dialog__body">{children}</div> : null}
        {actions ? <div className="dialog__actions">{actions}</div> : null}
        <button type="button" className="dialog__close" aria-label={closeLabel} onClick={onClose}>
          <Icon name="close" />
        </button>
      </div>
    </dialog>
  );
}
