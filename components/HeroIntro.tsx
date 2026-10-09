import type { ReactNode } from 'react';
import HeroIntroLiike from './HeroIntroLiike';
import { introSkripti } from '@/lib/hero-intro';

/**
 * HeroIntro: etusivun nimipalkki ja sen saapuminen.
 *
 * Levossa tämä on vain täysleveä palkki (`--badge-surface`), jonka
 * sisällä ovat nimi ja roolirivi. Istunnon ensimmäisellä käynnillä
 * palkki täyttää ensin koko ruudun ja nimi rakentuu sen keskellä.
 * Kun kirjaimet ovat täyttyneet, palkki supistuu yhdellä liikkeellä
 * omaan kokoonsa ja sivu paljastuu sen ympäriltä. Ks. päätös 14.
 *
 * Lopullinen asettelu on sivulla alusta asti: koko ruudun palkki on
 * sisällön päällä oleva kerros, joka rajataan pienemmäksi
 * (`clip-path`), ja nimi siirtyy paikalleen (`transform`). Mikään ei
 * siis hyppää eikä asettelu siirry.
 *
 * Intron päättää `HeroIntroScript` sivun <head>issä ennen ensimmäistä
 * maalausta. Ilman JavaScriptiä näkyy pelkkä palkki. Vieritysyritys
 * kesken intron asettaa palkin heti, joten kenenkään ei tarvitse odottaa.
 */
export default function HeroIntro({ children }: { children: ReactNode }) {
  return (
    <div className="hero-intro">
      <div className="hero-intro__kansi" aria-hidden="true" />
      <div className="hero-intro__sisus">{children}</div>
      <HeroIntroLiike />
    </div>
  );
}

/** Intron päätös ennen ensimmäistä maalausta. Kuuluu <head>iin. */
export function HeroIntroScript({ kotipolku }: { kotipolku: string }) {
  return <script dangerouslySetInnerHTML={{ __html: introSkripti(kotipolku) }} />;
}
