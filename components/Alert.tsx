import type { ReactNode } from 'react';
import Icon, { type IconName } from './Icon';

/**
 * Inline-ilmoitus: sävy, otsikko, teksti, toiminto ja sulkeminen.
 *
 * Sovelluskomponentti (päätökset 22 ja 29). Vasen viiva
 * --hairline-strong, ei pintaa eikä kehystä: sama paksuus kuin kentän
 * virheviivassa, ja kevein tapa erottaa ilmoitus sisällöstä.
 *
 * Sävyjä on kolme, ja vain virhe on värillinen (--danger). Info ja
 * onnistui erottuvat ikonilla ja otsikolla. Varoitusta ei ole: ilman
 * toista tilaväriä se erottuisi virheestä vain sävyllä.
 *
 * Ruudunlukija: virhe on role="alert", muut role="status". Rooli
 * ilmoittaa sisällön, kun ilmoitus lisätään sivulle; jo latautuessa
 * näkyvä ilmoitus luetaan kuten muukin teksti.
 */
export type AlertTone = 'info' | 'success' | 'error';

export type AlertProps = {
  tone?: AlertTone;
  title: string;
  /** Selittävä teksti otsikon alla. */
  children?: ReactNode;
  /** Toiminto tekstin alla, esim. `<a className="btn btn--text">`. */
  action?: ReactNode;
  /** Kun annettu, ilmoituksessa on sulkunappi. */
  onDismiss?: () => void;
  /** Sulkunapin nimi ruudunlukijalle. */
  dismissLabel?: string;
  className?: string;
};

const IKONI: Record<AlertTone, IconName> = { info: 'info', success: 'check', error: 'alert' };

export default function Alert({
  tone = 'info',
  title,
  children,
  action,
  onDismiss,
  dismissLabel = 'Sulje',
  className,
}: AlertProps) {
  return (
    <div
      className={['alert', `alert--${tone}`, className].filter(Boolean).join(' ')}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      <Icon name={IKONI[tone]} className="alert__icon" />
      <div className="alert__content">
        <p className="alert__title">{title}</p>
        {children ? <div className="alert__body">{children}</div> : null}
        {action ? <div className="alert__actions">{action}</div> : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          className="alert__close"
          aria-label={dismissLabel}
          onClick={onDismiss}
        >
          <Icon name="close" />
        </button>
      ) : null}
    </div>
  );
}
