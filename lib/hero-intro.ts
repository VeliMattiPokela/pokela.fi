/**
 * sessionStorage-avain: etusivun intro on jo nähty tässä istunnossa.
 * Omassa tiedostossaan, koska sitä lukevat sekä palvelimella
 * kirjoitettu skripti (HeroIntro) että selaimen puoli (HeroIntroLiike).
 * Asiakaskomponentin vienti olisi palvelimella viittaus, ei merkkijono.
 */
export const INTRO_AVAIN = 'pokela-hero-intro';

/**
 * Skripti, joka päättää ennen ensimmäistä maalausta, näytetäänkö
 * intro: vain etusivulla, kerran istunnossa, ei vähemmän liikettä
 * pyytäneelle eikä silloin, kun sivu avataan muualta kuin
 * yläreunasta. Se ajetaan <head>issä (ks. HeroIntroScript), koska
 * selaimessa piirretty <script> ei koskaan suoritu.
 */
export function introSkripti(kotipolku: string) {
  const koti = JSON.stringify(kotipolku.replace(/\/$/, ''));
  return `(function(){try{if(location.pathname.replace(/\\/$/,'')===${koti}&&!sessionStorage.getItem(${JSON.stringify(
    INTRO_AVAIN,
  )})&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!location.hash&&!scrollY){document.documentElement.classList.add('hero-intro-auki')}}catch(e){}})()`;
}
