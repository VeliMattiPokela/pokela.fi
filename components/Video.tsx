'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

/**
 * Video.
 *
 * Toistuu itsestään mykkänä silmukkana, kuten hero-kuva joka liikkuu.
 * Kaksi ehtoa tekevät sen kelvolliseksi (päätös 11):
 *
 *   - Taukonappi on aina näkyvissä. Liikkuva kuva jota ei voi
 *     pysäyttää on saavutettavuusongelma silloinkin kun se on mykkä
 *     (WCAG 2.2.2).
 *   - Jos käyttäjä on pyytänyt vähemmän liikettä, video ei lähde
 *     liikkeelle. Julistekuva näkyy, ja napista sen voi käynnistää.
 *
 * Siksi `autoPlay`-attribuuttia ei käytetä: se lähtisi liikkeelle jo
 * ennen kuin `prefers-reduced-motion` ehditään lukea. Toisto
 * käynnistetään vasta selaimessa.
 *
 * `Tila` on Figmassa variantti (`toistaa` / `tauolla`), jotta napin
 * kumpikin asu on myös sivupohjissa. `Esitys` on toinen variantti:
 * puhelinruudun video istuu levyllä kuten kaappaus kuvana (päätös 9).
 * `Mobiili` on kolmas: herolla voi olla oma puhelinvideo, kuten
 * herokuvalla oma mobiilikuva. Ks. Video.figma.ts.
 *
 * Napin alareunassa on etenemisviiva (päätös 58): ohut musteviiva
 * kertoo, missä kohtaa silmukkaa video on. Sama viiva kuin
 * sivunvaihdossa (päätös 41), mutta se seuraa videon aikaa.
 */
export type Tila = 'toistaa' | 'tauolla';
export type VideoEsitys = 'taysi' | 'levy';

/**
 * Etenemisviiva videon taukonappiin. Palauttaa refin viivalle; viiva
 * päivitetään suoraan tyyliin eikä tilaan, jotta jokainen ruutu ei
 * piirrä Reactia uudelleen. Toiston aikana viiva seuraa
 * requestAnimationFramella, tauolla se pysähtyy kohtaansa.
 *
 * `pakotettu` (0–1) näyttää viivan paikallaan: Storybook ja Figma
 * näyttävät sen ilman videotiedostoa. Sivustolla sitä ei anneta.
 */
export function useEtenema(videoRef: RefObject<HTMLVideoElement | null>, pakotettu?: number) {
  const viiva = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const el = viiva.current;
    if (!el) return;
    const aseta = (osuus: number) => {
      el.style.transform = `scaleX(${Math.min(1, Math.max(0, osuus))})`;
    };
    if (pakotettu !== undefined) {
      aseta(pakotettu);
      return;
    }
    if (!video) return;
    let kehys = 0;
    const paivita = () => {
      aseta(video.duration > 0 ? video.currentTime / video.duration : 0);
    };
    const kierros = () => {
      paivita();
      kehys = requestAnimationFrame(kierros);
    };
    const alkaa = () => {
      cancelAnimationFrame(kehys);
      kehys = requestAnimationFrame(kierros);
    };
    const loppuu = () => {
      cancelAnimationFrame(kehys);
      paivita();
    };
    video.addEventListener('play', alkaa);
    video.addEventListener('pause', loppuu);
    video.addEventListener('seeked', paivita);
    video.addEventListener('loadedmetadata', paivita);
    if (!video.paused) alkaa();
    else paivita();
    return () => {
      cancelAnimationFrame(kehys);
      video.removeEventListener('play', alkaa);
      video.removeEventListener('pause', loppuu);
      video.removeEventListener('seeked', paivita);
      video.removeEventListener('loadedmetadata', paivita);
    };
  }, [videoRef, pakotettu]);

  return viiva;
}

/** Viiva napin sisällä. Ruudunlukija ei tarvitse sitä: nappi kertoo tilan. */
export function Etenema({ viiva }: { viiva: RefObject<HTMLSpanElement | null> }) {
  return (
    <span className="video__etenema" aria-hidden="true">
      <span ref={viiva} className="video__etenema-viiva" />
    </span>
  );
}

export default function Video({
  id,
  leveys,
  korkeus,
  caption,
  tila: alku,
  esitys = 'taysi',
  mobiili,
  etenema,
}: {
  id: string;
  leveys: number;
  korkeus: number;
  caption?: string;
  /** Alkutila. Oletus: toistaa, ellei käyttäjä ole pyytänyt vähemmän liikettä. */
  tila?: Tila;
  /**
   * `taysi` täyttää Median laatikon rajattuna. `levy` näyttää videon
   * kokonaisena levyn keskellä, kuten puhelinkaappauksen kuvana.
   */
  esitys?: VideoEsitys;
  /**
   * Media-ehto, josta alkaen pääversio näytetään. Sitä kapeammalla
   * ruudulla näytetään oma puhelinvideo `<id>-mobiili`. Ilman arvoa
   * videoita on yksi.
   */
  mobiili?: string;
  /**
   * Pakotettu etenemä 0–1. Storybook ja Figma näyttävät viivan
   * paikallaan; sivustolla viiva seuraa videon aikaa eikä tätä anneta.
   */
  etenema?: number;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const viiva = useEtenema(ref, etenema);
  const [tila, setTila] = useState<Tila>('tauolla');
  /* Juliste ei osaa media-ehtoja kuten <source>, joten puhelimen
     juliste vaihdetaan selaimessa. Palvelin piirtää pääversion. */
  const [juliste, setJuliste] = useState(`/kuva/${id}-juliste.webp`);

  useEffect(() => {
    if (mobiili && !window.matchMedia(mobiili).matches) {
      setJuliste(`/kuva/${id}-mobiili-juliste.webp`);
    }
  }, [id, mobiili]);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    /* Mykkä asetetaan ominaisuutena: React ei kirjoita `muted`-
       attribuuttia palvelimella, ja selain toistaa itsestään vain
       mykän videon. */
    video.muted = true;
    const vahemmanLiiketta = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if ((alku ?? (vahemmanLiiketta ? 'tauolla' : 'toistaa')) === 'toistaa') {
      video.play().then(() => setTila('toistaa'), () => setTila('tauolla'));
    }
  }, [alku]);

  const vaihda = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setTila('toistaa'), () => setTila('tauolla'));
    } else {
      video.pause();
      setTila('tauolla');
    }
  };

  return (
    <>
      <video
        ref={ref}
        className={esitys === 'levy' ? 'media__levy-kuva' : 'media-fill'}
        muted
        loop
        playsInline
        preload="metadata"
        poster={juliste}
        width={leveys}
        height={korkeus}
        /* Ilman kontrolleja video on koriste; nimi kuvatekstistä jos se on. */
        {...(caption ? { 'aria-label': caption } : { 'aria-hidden': true })}
      >
        {/* Selain valitsee ensimmäisen lähteen, jonka ehto täyttyy. */}
        <source src={`/kuva/${id}.webm`} type="video/webm" media={mobiili} />
        <source src={`/kuva/${id}.mp4`} type="video/mp4" media={mobiili} />
        {mobiili ? (
          <>
            <source src={`/kuva/${id}-mobiili.webm`} type="video/webm" />
            <source src={`/kuva/${id}-mobiili.mp4`} type="video/mp4" />
          </>
        ) : null}
      </video>
      {/* Napin teksti on suomeksi suoraan, kuten Median muukin teksti:
          sivustolla on yksi kieli (lib/i18n.ts), ja sanakirja tulee
          tähän samalla kun Media saa sen. */}
      <button type="button" className="meta meta--s video__toisto" onClick={vaihda}>
        {tila === 'toistaa' ? 'Pysäytä' : 'Toista'}
        <Etenema viiva={viiva} />
      </button>
    </>
  );
}
