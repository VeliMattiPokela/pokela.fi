import type { ReactNode } from 'react';
import Icon from './Icon';

/**
 * Ikkuna: paikka, jossa työn voi tarkistaa (case 03, Avaa ja tarkista).
 * ---------------------------------------------------------------
 * Pieni selainikkuna, jonka yläpalkissa on osoite ja sisällä
 * kaaviokuva työkalusta. Alla ovat numero, nimi, kuvaus ja tila.
 * Korvaa listarivin tässä osiossa: neljä linkkiä oikeisiin
 * työkaluihin näyttävät nyt työkaluilta eivätkä taas yhdeltä
 * listalta (päätös 53).
 *
 * Kuva piirretään SVG:nä koodissa kuten Piirros, joten kuvatiedostoja
 * ei ole ja värit tulevat tokeneista (ikkuna.css).
 *
 * Tila:
 * - `julkaistu`: koko ikkuna on linkki, ja yläpalkissa on nuoli.
 * - `olemassa`: tehty mutta ei avattavissa; kehys on hiljaisempi.
 * - `tulossa`: kuten yllä, ja teksti on haalea.
 */
export type IkkunaAihe = 'storybook' | 'figma' | 'code-connect' | 'repo';
export type IkkunaTila = 'julkaistu' | 'olemassa' | 'tulossa';

export const IKKUNA_AIHEET: readonly IkkunaAihe[] = ['storybook', 'figma', 'code-connect', 'repo'];

const viiva = (x1: number, y: number, x2: number, k = 'rivi') => (
  <line key={`${x1}-${y}`} className={`ikkuna__${k}`} x1={x1} y1={y} x2={x2} y2={y} />
);

const kuvat: Record<IkkunaAihe, ReactNode> = {
  /* Sivupalkin storyt, valittu story ja kankaalla painike. */
  storybook: (
    <>
      <rect className="ikkuna__pinta" width={84} height={180} />
      <line className="ikkuna__hius" x1={84} y1={0} x2={84} y2={180} />
      {[22, 38, 54, 70, 86, 102, 118].map((y, i) => viiva(14, y, i % 3 ? 64 : 52, i === 3 ? 'valittu' : 'rivi'))}
      <rect className="ikkuna__muste" x={126} y={64} width={110} height={36} />
      {viiva(152, 82, 210, 'kaanto')}
      <line className="ikkuna__hius" x1={84} y1={146} x2={320} y2={146} />
      {[110, 170, 230].map((x) => viiva(x, 164, x + 40))}
    </>
  ),
  /* Kehykset kankaalla, yksi valittuna, ja oikealla ominaisuudet. */
  figma: (
    <>
      <rect className="ikkuna__pinta" x={236} width={84} height={180} />
      <line className="ikkuna__hius" x1={236} y1={0} x2={236} y2={180} />
      <rect className="ikkuna__kehys" x={28} y={30} width={80} height={56} />
      <rect className="ikkuna__kehys" x={124} y={30} width={80} height={56} />
      <rect className="ikkuna__kehys" x={28} y={102} width={176} height={52} />
      <rect className="ikkuna__valinta" x={124} y={30} width={80} height={56} />
      {[
        [124, 30],
        [204, 30],
        [124, 86],
        [204, 86],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} className="ikkuna__kahva" x={x - 3} y={y - 3} width={6} height={6} />
      ))}
      {[22, 38, 54, 70].map((y, i) => viiva(250, y, i % 2 ? 290 : 304))}
      <rect className="ikkuna__muste" x={250} y={96} width={14} height={14} />
      <rect className="ikkuna__harmaa" x={270} y={96} width={14} height={14} />
      <rect className="ikkuna__kehys" x={290} y={96} width={14} height={14} />
    </>
  ),
  /* Koodirivi kytkeytyy katkoviivalla Figman komponenttiin. */
  'code-connect': (
    <>
      <rect className="ikkuna__pinta" width={150} height={180} />
      {[
        [20, 90],
        [32, 120],
        [32, 70],
        [32, 104],
        [20, 40],
      ].map(([x, w], i) => viiva(x, 34 + i * 24, x + w, i === 2 ? 'valittu' : 'rivi'))}
      <rect className="ikkuna__kehys" x={196} y={56} width={96} height={68} />
      {viiva(212, 80, 262, 'valittu')}
      {viiva(212, 100, 276)}
      <path className="ikkuna__kytkos" d="M110 82 C150 82 160 90 196 90" />
      <circle className="ikkuna__muste" cx={110} cy={82} r={3.5} />
      <circle className="ikkuna__muste" cx={196} cy={90} r={3.5} />
    </>
  ),
  /* Tiedostopuu ja oikealla muutoshistoria. */
  repo: (
    <>
      {(
        [
          [0, 4, true],
          [0, 11, true],
          [1, 11, false],
          [1, 16, false],
          [0, 7, true],
          [0, 11, false],
          [0, 8, true],
        ] as const
      ).map(([d, pituus, kansio], i) => (
        <g key={i}>
          <rect
            className={kansio ? 'ikkuna__harmaa' : 'ikkuna__kehys'}
            x={24 + d * 18}
            y={22 + i * 21}
            width={9}
            height={9}
          />
          {viiva(42 + d * 18, 26 + i * 21, 42 + d * 18 + pituus * 6, i === 3 ? 'valittu' : 'rivi')}
        </g>
      ))}
      <line className="ikkuna__hius" x1={196} y1={0} x2={196} y2={180} />
      <line className="ikkuna__hius" x1={222} y1={40} x2={222} y2={148} />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <circle className={i === 0 ? 'ikkuna__muste' : 'ikkuna__kehys'} cx={222} cy={36 + i * 28} r={4} />
          {viiva(236, 36 + i * 28, 286 - (i % 2) * 20)}
        </g>
      ))}
    </>
  ),
};

export default function Ikkuna({
  aihe,
  number,
  title,
  body,
  host,
  note,
  state = 'julkaistu',
  href,
}: {
  aihe: IkkunaAihe;
  /** Järjestysnumero, esim. "01". */
  number: string;
  title: string;
  body: string;
  /** Osoite yläpalkissa, esim. "github.com". */
  host: string;
  /** Tila tekstinä nimen alla, esim. "Avaa" tai "Tulossa". */
  note: string;
  state?: IkkunaTila;
  /** Pakollinen, kun tila on `julkaistu`. */
  href?: string | null;
}) {
  const linkki = state === 'julkaistu' && href;
  const sisalto = (
    <>
      <span className="ikkuna__ikkuna">
        <span className="ikkuna__palkki meta">
          <span className="ikkuna__pisteet" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="ikkuna__osoite">{host}</span>
          {linkki ? <Icon name="arrow-up-right" size="s" /> : null}
        </span>
        <svg className="ikkuna__kuva" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          {kuvat[aihe]}
        </svg>
      </span>
      <span className="ikkuna__teksti">
        <span className="meta ikkuna__numero">{number}</span>
        <span className="display-s ikkuna__nimi">{title}</span>
        <span className="body-s muted">{body}</span>
        <span className="meta ikkuna__tila">{note}</span>
      </span>
    </>
  );

  const luokka = `ikkuna ikkuna--${state}`;
  return linkki ? (
    <a className={luokka} href={href} target="_blank" rel="noreferrer">
      {sisalto}
    </a>
  ) : (
    <div className={luokka}>{sisalto}</div>
  );
}
