import type { Dictionary } from '@/content/dictionaries';
import Icon from './Icon';

/**
 * Footer-CTA: display-l vasemmalle, yhteystiedot metana oikealle,
 * vahva viiva yläpuolelle. Sama joka sivulla.
 */
export default function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className="footer">
      <div className="page">
        <div className="footer__inner">
          <a href={`mailto:${dict.footer.email}`} className="footer__cta">
            {dict.footer.ctaLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </a>

          <div className="footer__meta">
            <a href={`mailto:${dict.footer.email}`} className="meta meta--ink">
              {dict.footer.email}
            </a>
            <span className="meta">{dict.footer.location}</span>
            <a
              href={dict.footer.linkedinUrl}
              className="meta meta--ink"
              target="_blank"
              rel="noreferrer"
            >
              {dict.footer.linkedin} <Icon name="arrow-up-right" size="s" />
            </a>
          </div>
        </div>

        <div className="footer__legal">
          <span className="meta meta--s">
            © {dict.footer.year} {dict.home.name}
          </span>
          <span className="meta meta--s">
            {dict.footer.colophonLabel} — {dict.footer.colophon}
          </span>
        </div>
      </div>
    </footer>
  );
}
