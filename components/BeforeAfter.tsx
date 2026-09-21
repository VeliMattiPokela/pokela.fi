'use client';

import { useCallback, useRef, useState } from 'react';

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
 */
export default function BeforeAfter({
  before,
  after,
  beforeLabel,
  afterLabel,
  alt,
  caption,
  width,
  height,
}: {
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
  alt: string;
  caption?: string;
  /** Lähdekuvan mitat. Kehys ottaa niiden kuvasuhteen, jotta
      object-fit: cover ei rajaa mitään pois. */
  width: number;
  height: number;
}) {
  const [pos, setPos] = useState(50);
  const frameRef = useRef<HTMLDivElement>(null);

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
        <img src={after} alt={alt} className="compare__img media-fill" draggable={false} />

        {/* Ennen: päällä, leikattuna jakajan kohdalta. */}
        <img
          src={before}
          alt=""
          aria-hidden="true"
          className="compare__img compare__img--before media-fill"
          draggable={false}
        />

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
