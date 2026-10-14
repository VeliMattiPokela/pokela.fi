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
 * Navi väistyy (päätös 37). Ylälaidassa se on tavallinen palkki.
 * Alas vieritettäessä se liukuu pois, ja ylös vieritettäessä se palaa
 * tiiviinä palkkina sumennetun paperin päällä. Fokus tuo sen esiin,
 * joten näppäimistöllä navi ei jää piiloon. Alleviivaus on yksi
 * viiva, joka liukuu osoitettuun linkkiin ja palaa aktiiviseen; ilman
 * JavaScriptiä aktiivinen linkki kantaa oman viivansa kuten ennen.
 *
 * Mobiilissa linkit siirtyvät koko ruudun valikkoon. Valikko
 * sulkeutuu Escillä ja reitin vaihtuessa, ja se lukitsee taustan
 * vierityksen ollessaan auki.
 */
export default function Nav({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const kehysRef = useRef<HTMLElement>(null);
  const listaRef = useRef<HTMLUListElement>(null);
  const viivaRef = useRef<HTMLLIElement>(null);
  const [tila, setTila] = useState<'perus' | 'tiivis' | 'piilossa'>('perus');

  const links = [
    { href: path(locale, 'work'), label: dict.nav.work },
    { href: path(locale, 'method'), label: dict.nav.method },
    { href: path(locale, 'about'), label: dict.nav.about },
    { href: path(locale, 'system'), label: dict.nav.system },
  ];

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(href);

  /* Väistyminen. Raja on navin oma korkeus: sen yläpuolella navi on
     paikallaan, sen alapuolella suunta ratkaisee. Muutaman pikselin
     kynnys estää kosketusvierityksen värinää vaihtamasta tilaa. */
  useEffect(() => {
    let edellinen = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const raja = kehysRef.current?.offsetHeight ?? 0;
      if (y <= raja) setTila('perus');
      else if (y - edellinen > 4) setTila('piilossa');
      else if (edellinen - y > 4) setTila('tiivis');
      else return;
      edellinen = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Liukuva alleviivaus. Viiva mitataan linkistä, joten se seuraa
     fonttien latausta ja ikkunan kokoa ResizeObserverin kautta. */
  useEffect(() => {
    const lista = listaRef.current;
    const viiva = viivaRef.current;
    if (!lista || !viiva) return;
    const aktiivinen = () => lista.querySelector<HTMLElement>('[aria-current="page"]');
    const siirra = (linkki: HTMLElement | null) => {
      if (!linkki) {
        viiva.style.opacity = '0';
        return;
      }
      viiva.style.opacity = '1';
      viiva.style.width = `${linkki.offsetWidth}px`;
      viiva.style.transform = `translateX(${linkki.offsetLeft}px)`;
    };
    const lepo = () => siirra(aktiivinen());
    const osoita = (e: PointerEvent) => {
      const linkki = (e.target as HTMLElement).closest<HTMLElement>('.nav__link');
      if (linkki) siirra(linkki);
    };
    lepo();
    lista.dataset.viiva = '';
    const havainnoija = new ResizeObserver(lepo);
    havainnoija.observe(lista);
    lista.addEventListener('pointerover', osoita);
    lista.addEventListener('pointerleave', lepo);
    return () => {
      havainnoija.disconnect();
      lista.removeEventListener('pointerover', osoita);
      lista.removeEventListener('pointerleave', lepo);
      delete lista.dataset.viiva;
    };
  }, [pathname]);

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
      <header
        ref={kehysRef}
        className="nav-kehys"
        data-tila={tila}
        onFocus={() => setTila((t) => (t === 'piilossa' ? 'tiivis' : t))}
      >
        <nav className="nav page" aria-label={dict.meta.siteName}>
          <Link href={path(locale)} className="meta ink nav__mark">
            {dict.meta.siteName}
          </Link>

          <ul ref={listaRef} className="nav__links">
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
            <li ref={viivaRef} className="nav__viiva" aria-hidden="true" />
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
      </header>

      {open ? (
        <div className="menu" role="dialog" aria-modal="true" aria-label={dict.nav.menu}>
          <div className="menu__head">
            <span className="meta ink nav__mark">{dict.meta.siteName}</span>
            <button
              ref={closeRef}
              type="button"
              className="meta meta--s ink menu__close"
              onClick={() => setOpen(false)}
            >
              {dict.nav.close} <Icon name="close" size="s" />
            </button>
          </div>

          <ul className="menu__links">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="display-l"
                  aria-current={isCurrent(link.href) ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={`mailto:${dict.footer.email}`}>{dict.nav.contact}</a>
            </li>
          </ul>

          <div className="menu__foot">
            <a href={`mailto:${dict.footer.email}`} className="meta ink">
              {dict.footer.email}
            </a>
            <span className="meta">{dict.footer.location}</span>
            <a
              href={dict.footer.linkedinUrl}
              className="meta ink"
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
