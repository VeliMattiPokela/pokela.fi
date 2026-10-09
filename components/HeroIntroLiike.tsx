'use client';

import { useEffect, useRef } from 'react';
import { INTRO_AVAIN } from '@/lib/hero-intro';

/**
 * HeroIntron liike. Ei omaa ulkoasua: lukee HeroIntro-palkin, jonka
 * sisällä se on, ja ajaa sen intron, jos skripti avasi sen.
 *
 * Aikataulu tulee HeroNamelta: `hero-name:rakennettu` kertoo, että
 * nimen koko on lopullinen (silloin se voidaan keskittää), ja
 * `hero-name:taytetty`, että kirjaimet ovat täynnä (silloin palkki
 * asettuu).
 */
export default function HeroIntroLiike() {
  const ankkuri = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const palkki = ankkuri.current?.closest<HTMLElement>('.hero-intro');
    const kansi = palkki?.querySelector<HTMLElement>('.hero-intro__kansi');
    const sisus = palkki?.querySelector<HTMLElement>('.hero-intro__sisus');
    if (!palkki || !kansi || !sisus || !html.classList.contains('hero-intro-auki')) return;

    let tila: 'odottaa' | 'keskella' | 'asettuu' | 'valmis' = 'odottaa';
    let ajastin = 0;
    try { sessionStorage.setItem(INTRO_AVAIN, '1'); } catch { /* yksityinen tila */ }

    function lopeta() {
      tila = 'valmis';
      html.classList.remove('hero-intro-auki');
      palkki!.classList.remove('hero-intro--keskella', 'hero-intro--asettuu', 'hero-intro--kiire');
      sisus!.style.transform = '';
      kansi!.style.clipPath = '';
      poista();
    }

    /* Sivu ehdittiin vierittää ennen kuin JavaScript latautui. */
    if (window.scrollY > 0) return lopeta();

    function keskita() {
      if (tila === 'asettuu' || tila === 'valmis') return;
      sisus!.style.transform = '';
      const r = sisus!.getBoundingClientRect();
      sisus!.style.transform = `translateY(${(innerHeight / 2 - (r.top + r.height / 2)).toFixed(1)}px)`;
      /* Lähtöarvo rajaukselle: tyhjästä (`none`) ei voi siirtyä. */
      kansi!.style.clipPath = 'inset(0px 0px 0px 0px)';
      tila = 'keskella';
      palkki!.classList.add('hero-intro--keskella');
    }

    function asettuu(kiire = false) {
      if (tila !== 'keskella') return;
      tila = 'asettuu';
      const r = palkki!.getBoundingClientRect();
      palkki!.classList.add('hero-intro--asettuu');
      if (kiire) palkki!.classList.add('hero-intro--kiire');
      void kansi!.offsetWidth;
      kansi!.style.clipPath = `inset(${r.top.toFixed(1)}px 0 ${(innerHeight - r.bottom).toFixed(1)}px 0)`;
      sisus!.style.transform = 'translateY(0)';
      kansi!.addEventListener('transitionend', lopeta, { once: true });
      /* Varmistus, jos siirtymä ei pääty (välilehti taustalla). */
      ajastin = window.setTimeout(lopeta, 1400);
    }

    /* Vieritysyritys kesken intron: palkki asettuu heti. Vieritys
       estetään vain sen hetken, ettei sivu liu'u kerroksen alla. */
    const esta = (e: Event) => {
      if (tila === 'valmis') return;
      /* Nimi ei ole vielä edes keskellä: intro jätetään pois. */
      if (tila === 'odottaa') return lopeta();
      e.preventDefault();
      if (tila === 'keskella') asettuu(true);
    };
    const nappain = (e: KeyboardEvent) => {
      if ([' ', 'PageDown', 'ArrowDown', 'End'].includes(e.key)) esta(e);
      /* Sarkainta ei estetä: kohdistus saa liikkua, palkki vain asettuu. */
      else if (e.key === 'Tab') {
        if (tila === 'odottaa') lopeta();
        else asettuu(true);
      }
    };
    const rakennettu = () => keskita();
    const taytetty = () => asettuu();
    const koko = () => { if (tila === 'keskella') keskita(); };

    function poista() {
      clearTimeout(ajastin);
      palkki!.removeEventListener('hero-name:rakennettu', rakennettu);
      palkki!.removeEventListener('hero-name:taytetty', taytetty);
      window.removeEventListener('wheel', esta);
      window.removeEventListener('touchmove', esta);
      window.removeEventListener('keydown', nappain);
      window.removeEventListener('resize', koko);
    }

    palkki.addEventListener('hero-name:rakennettu', rakennettu);
    palkki.addEventListener('hero-name:taytetty', taytetty);
    window.addEventListener('wheel', esta, { passive: false });
    window.addEventListener('touchmove', esta, { passive: false });
    window.addEventListener('keydown', nappain);
    window.addEventListener('resize', koko);
    /* Jos nimi ei rakennu (merkki puuttuu ääriviivoista), intro ei
       jää peittämään sivua. */
    ajastin = window.setTimeout(() => { if (tila === 'odottaa') lopeta(); }, 3000);

    /* Purku vain irrottaa kuuntelijat. Kehitystilan tuplakäynnistys
       purkaa ja käynnistää efektin heti uudelleen, eikä intro saa
       loppua siihen. */
    return poista;
  }, []);

  return <span ref={ankkuri} hidden />;
}
