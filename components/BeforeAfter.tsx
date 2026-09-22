'use client';

import { useCallback, useRef, useState } from 'react';
import { Lahteet, rajaukset } from './Media';

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
 */
export default function BeforeAfter({
  id,
  beforeLabel,
  afterLabel,
  alt,
  caption,
  sizes = '100vw',
}: {
  /** Paikan tunniste. Lähteet ovat `<id>-ennen` ja `<id>-jalkeen`. */
  id: string;
  beforeLabel: string;
  afterLabel: string;
  alt: string;
  caption?: string;
  sizes?: string;
}) {
  const [pos, setPos] = useState(50);
  const frameRef = useRef<HTMLDivElement>(null);

  const ennen = rajaukset(id, `${id}-ennen`)?.[0];
  const jalkeen = rajaukset(id, `${id}-jalkeen`)?.[0];
  if (!ennen || !jalkeen) return null;
  const { leveys: width, korkeus: height } = jalkeen;

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

  return (
    <figure className="compare">
      <div
        ref={frameRef}
        className="compare__frame"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        style={{ ['--pos' as string]: `${pos}%`, aspectRatio: `${width} / ${height}` }}
      >
        {/* Jälkeen: pohjalla, koko kehys. */}
        <picture>
          <Lahteet nimi={`${id}-jalkeen`} r={jalkeen} sizes={sizes} />
          <img
            src={`/kuva/${id}-jalkeen-${jalkeen.koko}-${jalkeen.leveys}.webp`}
            alt={alt}
            width={jalkeen.leveys}
            height={jalkeen.korkeus}
            sizes={sizes}
            loading="lazy"
            decoding="async"
            className="compare__img media-fill"
            draggable={false}
          />
        </picture>

        {/* Ennen: päällä, leikattuna jakajan kohdalta. */}
        <picture className="compare__img--before">
          <Lahteet nimi={`${id}-ennen`} r={ennen} sizes={sizes} />
          <img
            src={`/kuva/${id}-ennen-${ennen.koko}-${ennen.leveys}.webp`}
            alt=""
            aria-hidden="true"
            width={ennen.leveys}
            height={ennen.korkeus}
            sizes={sizes}
            loading="lazy"
            decoding="async"
            className="compare__img media-fill"
            draggable={false}
          />
        </picture>

        <span className="meta meta--s compare__label compare__label--before">{beforeLabel}</span>
        <span className="meta meta--s compare__label compare__label--after">{afterLabel}</span>

        <span className="compare__divider" aria-hidden="true" />
        <span className="compare__handle" aria-hidden="true">
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
      </div>

      {caption ? <figcaption className="body-s compare__caption">{caption}</figcaption> : null}
    </figure>
  );
}
