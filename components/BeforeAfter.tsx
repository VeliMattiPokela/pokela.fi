'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Lahteet, rajaukset, videovertailu } from './Media';
import type { Tila } from './Video';

/**
 * Ennen / jälkeen -vertailu. Sivuston signature-komponentti.
 *
 * "Jälkeen" on pohjalla ja "Ennen" päällä leikattuna clip-pathilla.
 * Jakaja seuraa osoitinta 1:1 — ei transitionia vedon aikana, koska
 * viive tuntuu heti rikkinäiseltä.
 *
 * Saavutettavuus: jakaja on oikea <input type="range">, joten se
 * toimii näppäimistöllä ja ruudunlukijalla ilman erillistä
 * näppäinkäsittelyä. Se on visuaalisesti piilotettu, ja näkyvä
 * kahva piirretään sen päälle pointer-events: none -tilassa.
 *
 * Tiedostot ja mitat luetaan kuvamanifestista tunnisteen perusteella,
 * eikä niitä anneta propseina: käsin kirjoitettu polku olisi voinut
 * osoittaa väärään tiedostoon ja käsin kirjoitettu mitta varannut
 * väärän tilan. Vertailuparia ei rajata, joten kehys ottaa lähteen
 * oman kuvasuhteen eikä object-fit: cover leikkaa mitään pois.
 *
 * Videovertailu: kun paikkaan on pudotettu kaksi videota, puolet
 * toistuvat päällekkäin samaan tahtiin ja jakajaa voi vetää kesken
 * toiston. "Jälkeen" johtaa ja "Ennen" seuraa sitä: jos ennen-video
 * ajautuu yli 1/15 sekuntia jälkeen, se siirretään kohdalleen.
 * Jatkuva siirto joka ruudulla nykisi, joten korjataan vain ajautuma.
 * Toisto noudattaa Videon sääntöjä (päätös 11): taukonappi on aina
 * näkyvissä, ja vähemmän liikettä pyytäneelle näkyvät julisteet.
 * `tila` on alkutila, Figmassa variantti kuten Videolla.
 *
 * Vaakasuuntainen lähde (työpöytänäkymä) saa koko sarakkeen
 * leveyden. Puhelinkaappaus pysyy 320 pikselissä, koska sitä
 * leveämpänä se olisi pelkkää korkeutta.
 */
export default function BeforeAfter({
  id,
  beforeLabel,
  afterLabel,
  alt,
  caption,
  sizes = '100vw',
  tila: alku,
}: {
  /** Paikan tunniste. Lähteet ovat `<id>-ennen` ja `<id>-jalkeen`. */
  id: string;
  beforeLabel: string;
  afterLabel: string;
  alt: string;
  caption?: string;
  sizes?: string;
  /** Videovertailun alkutila. Oletus: toistaa, ellei käyttäjä ole pyytänyt vähemmän liikettä. */
  tila?: Tila;
}) {
  const [pos, setPos] = useState(50);
  const [toisto, setToisto] = useState<Tila>('tauolla');
  const frameRef = useRef<HTMLDivElement>(null);
  const ennenRef = useRef<HTMLVideoElement>(null);
  const jalkeenRef = useRef<HTMLVideoElement>(null);

  const videot = videovertailu(id);

  useEffect(() => {
    const johtaja = jalkeenRef.current;
    const seuraaja = ennenRef.current;
    if (!johtaja || !seuraaja) return;
    /* Mykkä ominaisuutena, kuten Videossa: React ei kirjoita
       attribuuttia palvelimella. */
    johtaja.muted = true;
    seuraaja.muted = true;
    let kehys = 0;
    const tahdista = () => {
      if (Math.abs(seuraaja.currentTime - johtaja.currentTime) > 1 / 15) {
        seuraaja.currentTime = johtaja.currentTime;
      }
      if (seuraaja.paused !== johtaja.paused) {
        if (johtaja.paused) seuraaja.pause();
        else seuraaja.play().catch(() => {});
      }
      kehys = requestAnimationFrame(tahdista);
    };
    kehys = requestAnimationFrame(tahdista);
    const vahemmanLiiketta = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if ((alku ?? (vahemmanLiiketta ? 'tauolla' : 'toistaa')) === 'toistaa') {
      johtaja.play().then(
        () => setToisto('toistaa'),
        () => setToisto('tauolla')
      );
    }
    return () => cancelAnimationFrame(kehys);
  }, [alku, videot]);

  const ennen = videot ? null : rajaukset(id, `${id}-ennen`)?.[0];
  const jalkeen = videot ? null : rajaukset(id, `${id}-jalkeen`)?.[0];

  /** Osoittimen x → prosentti. Sama laskenta klikille ja vedolle. */
  const fromPointer = useCallback((clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, next)));
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    /* Kahva ja jakaja ovat pointer-events: none, joten kaikki
       osoitintapahtumat tulevat suoraan kehykselle. */
    event.currentTarget.setPointerCapture(event.pointerId);
    fromPointer(event.clientX);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) fromPointer(event.clientX);
  };

  const vaihda = () => {
    const johtaja = jalkeenRef.current;
    if (!johtaja) return;
    if (johtaja.paused) {
      johtaja.play().then(
        () => setToisto('toistaa'),
        () => setToisto('tauolla')
      );
    } else {
      johtaja.pause();
      setToisto('tauolla');
    }
  };

  if (!videot && (!ennen || !jalkeen)) return null;
  const { leveys: width, korkeus: height } = videot ?? jalkeen!;

  /** Videovertailun puoli: mykkä silmukka, julisteena ensimmäinen ruutu. */
  const puoli = (
    nimi: string,
    ref: React.RefObject<HTMLVideoElement | null>,
    nimike?: string,
  ) => (
    <video
      ref={ref}
      className="media-fill"
      muted
      loop
      playsInline
      preload="metadata"
      poster={`/kuva/${nimi}-juliste.webp`}
      width={width}
      height={height}
      /* Vertailun nimi pohjalla olevalla videolla, kuten kuvaparissa alt. */
      {...(nimike ? { 'aria-label': nimike } : { 'aria-hidden': true })}
    >
      <source src={`/kuva/${nimi}.webm`} type="video/webm" />
      <source src={`/kuva/${nimi}.mp4`} type="video/mp4" />
    </video>
  );

  return (
    <figure className={width > height ? 'compare compare--leve' : 'compare'}>
      <div
        ref={frameRef}
        className="compare__frame"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        style={{
          ['--pos' as string]: `${pos}%`,
          aspectRatio: `${width} / ${height}`,
        }}
      >
        {videot ? (
          <>
            <div className="compare__img">{puoli(`${id}-jalkeen`, jalkeenRef, alt)}</div>
            <div className="compare__img compare__img--before">
              {puoli(`${id}-ennen`, ennenRef)}
            </div>
          </>
        ) : (
          <>
            {/* Jälkeen: pohjalla, koko kehys. */}
            <picture>
              <Lahteet nimi={`${id}-jalkeen`} r={jalkeen!} sizes={sizes} />
              <img
                src={`/kuva/${id}-jalkeen-${jalkeen!.koko}-${jalkeen!.leveys}.webp`}
                alt={alt}
                width={jalkeen!.leveys}
                height={jalkeen!.korkeus}
                sizes={sizes}
                loading="lazy"
                decoding="async"
                className="compare__img media-fill"
                draggable={false}
              />
            </picture>

            {/* Ennen: päällä, leikattuna jakajan kohdalta. */}
            <picture className="compare__img--before">
              <Lahteet nimi={`${id}-ennen`} r={ennen!} sizes={sizes} />
              <img
                src={`/kuva/${id}-ennen-${ennen!.koko}-${ennen!.leveys}.webp`}
                alt=""
                aria-hidden="true"
                width={ennen!.leveys}
                height={ennen!.korkeus}
                sizes={sizes}
                loading="lazy"
                decoding="async"
                className="compare__img media-fill"
                draggable={false}
              />
            </picture>
          </>
        )}

        <span className="meta meta--s compare__label compare__label--before">{beforeLabel}</span>
        <span className="meta meta--s compare__label compare__label--after">{afterLabel}</span>

        <span className="compare__divider" aria-hidden="true" />
        <span className="body-s compare__handle" aria-hidden="true">
          ‹ ›
        </span>

        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={Math.round(pos)}
          onChange={(event) => setPos(Number(event.target.value))}
          className="compare__range"
          aria-label={`${beforeLabel} / ${afterLabel}`}
          aria-valuetext={`${Math.round(pos)} % ${beforeLabel.toLowerCase()}`}
        />

        {/* Range-syötteen päällä, jotta nappia voi painaa vetämättä jakajaa. */}
        {videot ? (
          <button
            type="button"
            className="meta meta--s video__toisto compare__toisto"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={vaihda}
          >
            {toisto === 'toistaa' ? 'Pysäytä' : 'Toista'}
          </button>
        ) : null}
      </div>

      {caption ? <figcaption className="body-s compare__caption">{caption}</figcaption> : null}
    </figure>
  );
}
