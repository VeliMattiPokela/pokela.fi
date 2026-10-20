import Icon from './Icon';

/** Yhteystiedot, jotka Footer ja Navin mobiilivalikko näyttävät. */
export type ContactInfo = {
  email: string;
  /** Paikkakunta tai muu lyhyt rivi. Valinnainen. */
  location?: string;
  /** Ulkoinen linkki, esim. LinkedIn. Avautuu uuteen välilehteen. */
  link?: { label: string; href: string };
};

export type FooterProps = {
  /** Iso CTA, yksi rivi per alkio. Linkki on `mailto:`. */
  cta: readonly string[];
  contact: ContactInfo;
  /** Pienet rivit alalaitaan, esim. tekijänoikeus. Valinnainen. */
  legal?: readonly string[];
};

/** Sähköposti, paikka ja ulkoinen linkki metana. */
export function ContactMeta({ email, location, link }: ContactInfo) {
  return (
    <>
      <a href={`mailto:${email}`} className="meta ink">
        {email}
      </a>
      {location ? <span className="meta">{location}</span> : null}
      {link ? (
        <a href={link.href} className="meta ink" target="_blank" rel="noreferrer">
          {link.label} <Icon name="arrow-up-right" size="s" />
        </a>
      ) : null}
    </>
  );
}

/**
 * Footer-CTA: display-l vasemmalle, yhteystiedot metana oikealle,
 * vahva viiva yläpuolelle. Sama joka sivulla.
 *
 * Sisältö tulee propseina, joten Footer elää npm-paketissa; sivusto
 * antaa sen sanakirjastaan.
 */
export default function Footer({ cta, contact, legal = [] }: FooterProps) {
  return (
    <footer className="footer">
      <div className="page">
        <div className="footer__inner">
          <a href={`mailto:${contact.email}`} className="display-l footer__cta">
            {cta.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </a>

          <div className="footer__meta">
            <ContactMeta {...contact} />
          </div>
        </div>

        {legal.length ? (
          <div className="footer__legal">
            {legal.map((rivi) => (
              <span key={rivi} className="meta meta--s">
                {rivi}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </footer>
  );
}
