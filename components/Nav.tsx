'use client';

import { useEffect, useRef, useState, type ElementType } from 'react';
import ThemeToggle from './ThemeToggle';
import Icon from './Icon';
import { ContactMeta, type ContactInfo } from './Footer';

export type NavLink = { href: string; label: string };

export type NavLabels = {
  /** Mobiilivalikon avausnappi ja valikon nimi ruudunlukijalle. */
  menu: string;
  close: string;
  theme: string;
  themeLight: string;
  themeDark: string;
  themeSystem: string;
};

const OLETUSTEKSTIT: NavLabels = {
  menu: 'Menu',
  close: 'Close',
  theme: 'Theme',
  themeLight: 'Light',
  themeDark: 'Dark',
  themeSystem: 'Auto',
};

export type NavProps = {
  /** Tunnus vasemmassa laidassa, myös navin nimi ruudunlukijalle. */
  brand: string;
  /** Tunnuksen osoite. Oletus `/`. */
  brandHref?: string;
  links: readonly NavLink[];
  /**
   * Nykyinen polku. Linkki, jonka osoitteella polku alkaa, on
   * aktiivinen. Next.js-sovellus antaa tähän `usePathname()`:n; ilman
   * tätä mikään linkki ei ole aktiivinen.
   */
  currentPath?: string;
  /**
   * Yhteyslinkki linkkien perään (`mailto:`). Mobiilivalikko näyttää
   * lisäksi yhteystiedot alalaidassaan. Valinnainen.
   */
  contact?: ContactInfo & { label: string };
  /** Napit ja teemanvaihto. Oletus englanniksi. */
  labels?: Partial<NavLabels>;
  /**
   * Linkkikomponentti, kuten ListRow:ssa. Oletus on tavallinen `<a>`;
   * Next.js-sovellus antaa tähän `next/link`:n.
   */
  as?: ElementType;
};

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
 *
 * Linkit, nykyinen polku, tekstit ja linkkikomponentti tulevat
 * propseina. Siksi Nav ei tiedä sivuston sanakirjasta eikä
 * Next.js:stä mitään ja elää npm-paketissa; sivusto antaa ne omasta
 * sanakirjastaan ja reitityksestään.
 */
export default function Nav({
  brand,
  brandHref = '/',
  links,
  currentPath,
  contact,
  labels,
  as: LinkComponent = 'a',
}: NavProps) {
  const t = { ...OLETUSTEKSTIT, ...labels };
  const pathname = currentPath ?? '';
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const kehysRef = useRef<HTMLElement>(null);
  const listaRef = useRef<HTMLUListElement>(null);
  const viivaRef = useRef<HTMLLIElement>(null);
  const [tila, setTila] = useState<'perus' | 'tiivis' | 'piilossa'>('perus');

  const isCurrent = (href: string) => pathname !== '' && (pathname === href || pathname.startsWith(href));

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
        <nav className="nav page" aria-label={brand}>
          <LinkComponent href={brandHref} className="meta ink nav__mark">
            {brand}
          </LinkComponent>

          <ul ref={listaRef} className="nav__links">
            {links.map((link) => (
              <li key={link.href}>
                <LinkComponent
                  href={link.href}
                  className="meta meta--s nav__link"
                  aria-current={isCurrent(link.href) ? 'page' : undefined}
                >
                  {link.label}
                </LinkComponent>
              </li>
            ))}
            {contact ? (
              <li>
                <a href={`mailto:${contact.email}`} className="meta meta--s nav__link">
                  {contact.label}
                </a>
              </li>
            ) : null}
            <li ref={viivaRef} className="nav__viiva" aria-hidden="true" />
          </ul>

          <div className="nav__tools">
            <ThemeToggle
              labels={{
                theme: t.theme,
                light: t.themeLight,
                dark: t.themeDark,
                system: t.themeSystem,
              }}
            />
            <button
              type="button"
              className="nav__menu-btn"
              aria-label={t.menu}
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <Icon name="menu" size="l" />
            </button>
          </div>
        </nav>
      </header>

      {open ? (
        <div className="menu" role="dialog" aria-modal="true" aria-label={t.menu}>
          <div className="menu__head">
            <span className="meta ink nav__mark">{brand}</span>
            <button
              ref={closeRef}
              type="button"
              className="meta meta--s ink menu__close"
              onClick={() => setOpen(false)}
            >
              {t.close} <Icon name="close" size="s" />
            </button>
          </div>

          <ul className="menu__links">
            {links.map((link) => (
              <li key={link.href}>
                <LinkComponent
                  href={link.href}
                  className="display-l"
                  aria-current={isCurrent(link.href) ? 'page' : undefined}
                >
                  {link.label}
                </LinkComponent>
              </li>
            ))}
            {contact ? (
              <li>
                <a href={`mailto:${contact.email}`}>{contact.label}</a>
              </li>
            ) : null}
          </ul>

          {contact ? (
            <div className="menu__foot">
              <ContactMeta {...contact} />
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
