'use client';

import { useEffect, useRef, useState } from 'react';

export type PageProgressState = 'idle' | 'loading' | 'done';

export type PageProgressProps = {
  /**
   * Nykyinen polku. Kun se vaihtuu, siirtymä on perillä ja viiva
   * päättyy. Next.js-sovellus antaa tähän `usePathname()`:n. Ilman
   * tätä viiva päättyy vasta, kun selain lataa uuden sivun.
   */
  path?: string;
  /**
   * Pakotettu tila. Storybook ja Figma näyttävät tilat staattisina;
   * sivustolla tila seuraa klikkauksia eikä tätä anneta.
   */
  state?: PageProgressState;
};

/** Näin nopea siirtymä ei näytä mitään: välähdys olisi pahempi kuin ei mitään. */
const VIIVE_MS = 120;
/** Päättymisen kesto ennen kuin viiva palaa lepoon (--dur-base + --dur-slow). */
const PAATOS_MS = 540;

function sisainenLinkki(e: MouseEvent): HTMLAnchorElement | null {
  if (e.button !== 0) return null;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null;
  const a = (e.target as Element | null)?.closest?.('a');
  if (!a || !a.href || a.hasAttribute('download')) return null;
  if (a.target && a.target !== '_self') return null;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin) return null;
  /* Sama sivu (tai pelkkä ankkuri) ei ole siirtymä. */
  if (url.pathname === location.pathname && url.search === location.search) return null;
  return a;
}

/**
 * Sivunvaihdon viiva — ohut musteviiva ruudun yläreunassa (päätös 41).
 *
 * Staattinen vienti tekee sivunvaihdosta yleensä välittömän, koska
 * Next.js hakee näkyvien linkkien sisällön etukäteen. Kun linkkiä ei
 * ole haettu (kosketus ilman hoveria, rivi juuri vieritetty näkyviin,
 * hidas yhteys), klikkauksen ja uuden sivun väliin jää hetki, jossa
 * mikään ei liiku. Viiva täyttää sen hetken.
 *
 * Viiva ilmestyy vasta VIIVE_MS:n jälkeen, kasvaa hitaasti kohti
 * oikeaa reunaa mutta ei koskaan perille ennen kuin sivu on vaihtunut,
 * ja sulkeutuu sitten täyteen leveyteen ja häviää. Ei spinneriä, ei
 * prosentteja, ei väriä: --hairline-strong ja --ink, kuten
 * ListRow'n siirtymäviivassa.
 *
 * Linkki, jolla on oma tapansa näyttää siirtymä (`data-siirtyma="oma"`,
 * esim. ListRow), saa sen sijaan `data-siirtyy`-attribuutin, ja viiva
 * piirtyy sen omaan reunaan siihen, mihin juuri klikattiin.
 *
 * Komponentti ei tuo Next.js:ää (Next.js-sovelluksessa sen kytkee
 * PageProgressRoute). Klikkaukset se kuuntelee DOMista, ja
 * perille pääsyn se saa `path`-propsina, joten se toimii minkä tahansa
 * reitittimen kanssa.
 */
export default function PageProgress({ path, state }: PageProgressProps) {
  const [tila, setTila] = useState<PageProgressState>('idle');
  const viive = useRef<number | undefined>(undefined);
  const odottaa = useRef(false);
  const linkki = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (state) return;
    const klikki = (e: MouseEvent) => {
      const a = sisainenLinkki(e);
      if (!a) return;
      linkki.current?.removeAttribute('data-siirtyy');
      linkki.current = a;
      odottaa.current = true;
      window.clearTimeout(viive.current);
      viive.current = window.setTimeout(() => {
        if (!odottaa.current) return;
        if (a.dataset.siirtyma === 'oma') a.setAttribute('data-siirtyy', '');
        else setTila('loading');
      }, VIIVE_MS);
    };
    /* Kaappausvaiheessa, koska next/link kutsuu preventDefaultia
       ennen kuin klikkaus kuplii documentiin asti. */
    document.addEventListener('click', klikki, true);
    return () => {
      document.removeEventListener('click', klikki, true);
      window.clearTimeout(viive.current);
    };
  }, [state]);

  /* Polku vaihtui: perillä. */
  useEffect(() => {
    if (state || !odottaa.current) return;
    odottaa.current = false;
    window.clearTimeout(viive.current);
    linkki.current?.removeAttribute('data-siirtyy');
    linkki.current = null;
    setTila((t) => (t === 'loading' ? 'done' : 'idle'));
  }, [path, state]);

  useEffect(() => {
    if (tila !== 'done' || state) return;
    const t = window.setTimeout(() => setTila('idle'), PAATOS_MS);
    return () => window.clearTimeout(t);
  }, [tila, state]);

  return <div className="page-progress" data-tila={state ?? tila} aria-hidden="true" />;
}
