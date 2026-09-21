'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { path, type Locale } from '@/lib/i18n';
import type { Dictionary } from '@/content/dictionaries';
import ThemeToggle from './ThemeToggle';
import Icon from './Icon';

/**
 * Navi. Aktiivinen kohta merkitään musteen täydellä sävyllä ja
 * alleviivauksella — ei värillä.
 *
 * Mobiilissa linkit siirtyvät koko ruudun valikkoon. Valikko
 * sulkeutuu Escillä ja reitin vaihtuessa, ja se lukitsee taustan
 * vierityksen ollessaan auki.
 */
export default function Nav({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const links = [
    { href: path(locale, 'work'), label: dict.nav.work },
    { href: path(locale, 'about'), label: dict.nav.about },
    { href: path(locale, 'system'), label: dict.nav.system },
  ];

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(href);

  /* Reitin vaihtuessa valikko sulkeutuu. */
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <nav className="nav page" aria-label={dict.meta.siteName}>
        <Link href={path(locale)} className="meta meta--ink nav__mark">
          {dict.meta.siteName}
        </Link>

        <ul className="nav__links">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="meta meta--s nav__link"
                aria-current={isCurrent(link.href) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a href={`mailto:${dict.footer.email}`} className="meta meta--s nav__link">
              {dict.nav.contact}
            </a>
          </li>
        </ul>

        <div className="nav__tools">
          <ThemeToggle
            labels={{
              theme: dict.nav.theme,
              light: dict.nav.themeLight,
              dark: dict.nav.themeDark,
              system: dict.nav.themeSystem,
            }}
          />
          <button
            type="button"
            className="nav__menu-btn"
            aria-label={dict.nav.menu}
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Icon name="menu" size="l" />
          </button>
        </div>
      </nav>

      {open ? (
        <div className="menu" role="dialog" aria-modal="true" aria-label={dict.nav.menu}>
          <div className="menu__head">
            <span className="meta meta--ink nav__mark">{dict.meta.siteName}</span>
            <button
              ref={closeRef}
              type="button"
              className="meta meta--s meta--ink menu__close"
              onClick={() => setOpen(false)}
            >
              {dict.nav.close} <Icon name="close" size="s" />
            </button>
          </div>

          <ul className="menu__links">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} aria-current={isCurrent(link.href) ? 'page' : undefined}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={`mailto:${dict.footer.email}`}>{dict.nav.contact}</a>
            </li>
          </ul>

          <div className="menu__foot">
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
      ) : null}
    </>
  );
}
