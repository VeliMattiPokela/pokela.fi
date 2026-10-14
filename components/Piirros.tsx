import type { ReactNode } from 'react';

/**
 * Piirros: Työtapa-sivun viivakuvitus.
 *
 * Kuvat piirretään SVG:nä koodissa, eikä kuvatiedostoja ole. Viivat ja
 * pinnat tulevat tokeneista (piirros.css), joten piirros seuraa
 * teemaa kuten Korkeuskayrat ja LogoRow (päätös 33).
 *
 * Aiheet:
 * - `kypsyminen`: sama näkymä neljässä vaiheessa: runko, design
 *   system, data ja julkaistu palvelu. Sivun pääkuva.
 * - `ymmarrys`, `pohja`, `design-system`, `polut`, `data`, `julkaisu`:
 *   menetelmän kuusi vaihetta pieninä kuvina.
 *
 * Mitat ovat viewBoxin yksiköitä, eivät ruudun pikseleitä: piirros
 * skaalautuu leveytensä mukaan.
 */
export type PiirrosAihe = 'kypsyminen' | 'ymmarrys' | 'pohja' | 'design-system' | 'polut' | 'data' | 'julkaisu';

export const PIIRROS_AIHEET: readonly PiirrosAihe[] = [
  'kypsyminen',
  'ymmarrys',
  'pohja',
  'design-system',
  'polut',
  'data',
  'julkaisu',
];

/** Pieni tekstirivi piirroksessa. */
function T({
  x,
  y,
  k,
  koko,
  keski,
  children,
}: {
  x: number;
  y: number;
  k: string;
  koko: number;
  keski?: boolean;
  children: ReactNode;
}) {
  return (
    <text x={x} y={y} className={`piirros__${k}`} fontSize={koko} textAnchor={keski ? 'middle' : undefined}>
      {children}
    </text>
  );
}

const nuoli = (x: number, y: number) => <path className="piirros__viiva" d={`M${x} ${y} h18 m-5 -4 l5 4 l-5 4`} />;

const osoitin = (x: number, y: number) => (
  <path className="piirros__osoitin" d={`M${x} ${y} l0 16 l4 -4 l3 7 l3 -1 l-3 -7 l6 0 Z`} />
);

/** Selainikkuna: yläpalkki, osoite ja sisältö palkin alla. */
function Selain({ x, y, w, h, url, children }: { x: number; y: number; w: number; h: number; url: string; children: ReactNode }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect className="piirros__pohja" width={w} height={h} />
      <line className="piirros__hius" x1={0} y1={22} x2={w} y2={22} />
      {[12, 22, 32].map((cx) => (
        <circle key={cx} className="piirros__hius" cx={cx} cy={11} r={3} />
      ))}
      <rect className="piirros__kentta" x={w / 2 - 60} y={6} width={120} height={10} rx={5} />
      <T x={w / 2} y={14} k="faint" koko={7} keski>
        {url}
      </T>
      <g transform="translate(0 22)">{children}</g>
    </g>
  );
}

/** Sama näkymä neljässä kypsyysasteessa: 1 runko, 2 design system, 3 data, 4 julkaistu. */
function Nakyma({ w, vaihe }: { w: number; vaihe: 1 | 2 | 3 | 4 }) {
  const p = 16;
  const runko = vaihe === 1;
  const kuva = vaihe >= 3;
  const hy = 74;
  const hh = 92;
  const by = hy + hh + 14;
  const cy = by + 34;
  const cw = (w - 2 * p - 20) / 3;
  const hinnat = ['1 240 €', '980 €', '1 410 €'];
  return (
    <>
      {runko ? (
        <rect className="piirros__katko" x={p} y={12} width={w - 2 * p} height={14} />
      ) : (
        <>
          <T x={p} y={23} k="merkki" koko={8}>
            KOTI
          </T>
          {[0, 1, 2].map((i) => (
            <rect key={i} className="piirros__muste" x={w - p - 30 - i * 34} y={17} width={24} height={2} />
          ))}
        </>
      )}
      {runko ? (
        <rect className="piirros__katko" x={p} y={40} width={w * 0.55} height={22} />
      ) : (
        <T x={p} y={60} k="display" koko={24}>
          Löydä koti
        </T>
      )}
      {runko ? (
        <>
          <rect className="piirros__katko" x={p} y={hy} width={w - 2 * p} height={hh} />
          <line className="piirros__katko" x1={p} y1={hy} x2={w - p} y2={hy + hh} />
          <line className="piirros__katko" x1={w - p} y1={hy} x2={p} y2={hy + hh} />
        </>
      ) : kuva ? (
        <>
          <rect className="piirros__kuva" x={p} y={hy} width={w - 2 * p} height={hh} />
          <path
            className="piirros__vuori"
            d={`M${p} ${hy + hh} L${p + 60} ${hy + 48} L${p + 100} ${hy + 70} L${p + 150} ${hy + 30} L${w - p} ${hy + hh} Z`}
          />
        </>
      ) : (
        <rect className="piirros__paikka" x={p} y={hy} width={w - 2 * p} height={hh} />
      )}
      {runko ? (
        <>
          <rect className="piirros__katko" x={p} y={by} width={w - 2 * p - 70} height={20} />
          <rect className="piirros__katko" x={w - p - 62} y={by} width={62} height={20} />
        </>
      ) : (
        <>
          <rect className="piirros__pohja" x={p} y={by} width={w - 2 * p - 70} height={20} />
          {kuva ? (
            <T x={p + 8} y={by + 13} k="muted" koko={8}>
              Kaksio, parveke, lähellä metroa
            </T>
          ) : null}
          <rect className="piirros__muste" x={w - p - 62} y={by} width={62} height={20} />
          <T x={w - p - 31} y={by + 13} k="painike" koko={7} keski>
            HAE
          </T>
        </>
      )}
      {[0, 1, 2].map((i) => {
        const cx = p + i * (cw + 10);
        if (runko)
          return (
            <g key={i}>
              <rect className="piirros__katko" x={cx} y={cy} width={cw} height={48} />
              <rect className="piirros__katko" x={cx} y={cy + 54} width={cw * 0.7} height={6} />
            </g>
          );
        if (!kuva)
          return (
            <g key={i}>
              <rect className="piirros__paikka" x={cx} y={cy} width={cw} height={48} />
              <rect className="piirros__muste" x={cx} y={cy + 56} width={cw * 0.7} height={3} />
              <rect className="piirros__haalea" x={cx} y={cy + 64} width={cw * 0.45} height={2} />
            </g>
          );
        return (
          <g key={i}>
            <rect className="piirros__kuva" x={cx} y={cy} width={cw} height={48} />
            <T x={cx} y={cy + 62} k="hinta" koko={9}>
              {hinnat[i]}
            </T>
            <rect className="piirros__haalea" x={cx} y={cy + 68} width={cw * 0.6} height={2} />
          </g>
        );
      })}
      {vaihe === 4 ? osoitin(w * 0.62, cy + 22) : null}
    </>
  );
}

function Kypsyminen() {
  const w = 300;
  const h = 330;
  const nimet = ['01 Runko', '02 Design system', '03 Data', '04 Julkaistu'];
  const px = 24 + 3 * 334 + w - 64;
  const py = 44 + h - 150;
  return (
    <svg viewBox="0 0 1368 400">
      {nimet.map((nimi, i) => {
        const x = 24 + i * 334;
        return (
          <g key={nimi}>
            <T x={x} y={28} k="meta" koko={11}>
              {nimi.toUpperCase()}
            </T>
            <Selain x={x} y={44} w={w} h={h} url={i === 3 ? 'palvelu.fi' : 'localhost:3000'}>
              <Nakyma w={w} vaihe={(i + 1) as 1 | 2 | 3 | 4} />
            </Selain>
            {i < 3 ? nuoli(x + w + 8, 44 + h / 2) : null}
          </g>
        );
      })}
      {/* Sama palvelu puhelimessa: julkaistu toimii kaikilla laitteilla. */}
      <g transform={`translate(${px} ${py})`}>
        <rect className="piirros__pohja" width={84} height={164} rx={12} />
        <rect className="piirros__hius" x={30} y={6} width={24} height={4} rx={2} />
        <T x={10} y={34} k="display" koko={13}>
          Löydä koti
        </T>
        <rect className="piirros__kuva" x={10} y={42} width={64} height={50} />
        <path className="piirros__vuori" d="M10 92 L30 70 L46 80 L60 62 L74 92 Z" />
        <rect className="piirros__muste" x={10} y={100} width={64} height={14} />
        <T x={42} y={110} k="painike" koko={7} keski>
          HAE
        </T>
        <T x={10} y={132} k="hinta" koko={9}>
          1 240 €
        </T>
        <rect className="piirros__haalea" x={10} y={138} width={40} height={2} />
      </g>
    </svg>
  );
}

function Ymmarrys() {
  return (
    <svg viewBox="0 0 240 150">
      {[
        [98, 58],
        [142, 58],
        [120, 96],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} className="piirros__viiva" cx={cx} cy={cy} r={36} />
      ))}
      <circle className="piirros__muste" cx={120} cy={72} r={4} />
      <T x={56} y={16} k="meta" koko={8} keski>
        KÄYTTÄJÄ
      </T>
      <T x={188} y={16} k="meta" koko={8} keski>
        LIIKETOIMINTA
      </T>
      <T x={120} y={146} k="meta" koko={8} keski>
        TEKNIIKKA
      </T>
    </svg>
  );
}

function Pohja() {
  return (
    <svg viewBox="0 0 240 150">
      <rect className="piirros__pohja" x={20} y={20} width={80} height={108} />
      <T x={30} y={38} k="meta" koko={8}>
        README
      </T>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} className="piirros__haalea" x={30} y={50 + i * 12} width={60 - (i % 3) * 12} height={2} />
      ))}
      <path className="piirros__viiva" d="M120 110 H224 M140 110 C150 110, 150 70, 168 70 H196 C212 70, 212 110, 216 110" />
      {[132, 160, 190, 224].map((x) => (
        <circle key={x} className="piirros__muste" cx={x} cy={110} r={4} />
      ))}
      <circle className="piirros__pohja" cx={176} cy={70} r={4} />
      <T x={120} y={136} k="meta" koko={8}>
        MAIN
      </T>
    </svg>
  );
}

function DesignSystem() {
  return (
    <svg viewBox="0 0 240 150">
      <rect className="piirros__muste" x={20} y={24} width={28} height={28} />
      <rect className="piirros__harmaa" x={20} y={60} width={28} height={28} />
      <rect className="piirros__pohja" x={20} y={96} width={28} height={28} />
      <T x={60} y={48} k="display" koko={18}>
        Aa
      </T>
      <T x={60} y={80} k="meta" koko={8}>
        SPACE 16
      </T>
      <T x={60} y={114} k="meta" koko={8}>
        RADIUS 0
      </T>
      {nuoli(110, 75)}
      <rect className="piirros__muste" x={140} y={28} width={80} height={22} />
      <T x={180} y={42} k="painike" koko={7} keski>
        PAINIKE
      </T>
      <rect className="piirros__pohja" x={140} y={60} width={80} height={68} />
      <rect className="piirros__paikka" x={146} y={66} width={68} height={32} />
      <rect className="piirros__muste" x={146} y={106} width={48} height={3} />
      <rect className="piirros__haalea" x={146} y={114} width={34} height={2} />
    </svg>
  );
}

function Polut() {
  const nimet = ['ETUSIVU', 'HAKU', 'KOHDE', 'VUOKRAUS'];
  return (
    <svg viewBox="0 0 240 150">
      {nimet.map((nimi, i) => {
        const x = 12 + i * 58;
        return (
          <g key={nimi}>
            <T x={x + 22} y={30} k="meta" koko={8} keski>
              {nimi}
            </T>
            <rect className="piirros__pohja" x={x} y={40} width={44} height={66} />
            <rect className="piirros__paikka" x={x + 5} y={48} width={34} height={22} />
            <rect className="piirros__haalea" x={x + 5} y={78} width={26} height={2} />
            <rect className="piirros__haalea" x={x + 5} y={86} width={20} height={2} />
            {i < 3 ? <path className="piirros__viiva" d={`M${x + 46} 73 h10`} /> : null}
          </g>
        );
      })}
      <circle className="piirros__muste" cx={22} cy={96} r={3} />
      <path className="piirros__katko" d="M34 96 C70 136, 150 136, 200 100" />
      <circle className="piirros__muste" cx={200} cy={100} r={3} />
    </svg>
  );
}

function Data() {
  const rivit = ['{', '  name: "Kaksio",', '  rent: 1240,', '  area: 48', '}'];
  return (
    <svg viewBox="0 0 240 150">
      {rivit.map((rivi, i) => (
        <T key={rivi} x={16} y={40 + i * 16} k="koodi" koko={10}>
          {rivi}
        </T>
      ))}
      {nuoli(126, 75)}
      {[0, 1, 2, 3].map((i) => {
        const x = 154 + (i % 2) * 38;
        const y = 30 + Math.floor(i / 2) * 50;
        return (
          <g key={i}>
            <rect className="piirros__kuva" x={x} y={y} width={32} height={26} />
            <rect className="piirros__muste" x={x} y={y + 32} width={24} height={3} />
          </g>
        );
      })}
    </svg>
  );
}

function Julkaisu() {
  return (
    <svg viewBox="0 0 240 150">
      <Selain x={16} y={18} w={150} h={112} url="palvelu.fi">
        <rect className="piirros__kuva" x={10} y={10} width={130} height={44} />
        <rect className="piirros__muste" x={10} y={62} width={70} height={3} />
        <rect className="piirros__haalea" x={10} y={70} width={50} height={2} />
      </Selain>
      <g transform="translate(176 46)">
        <rect className="piirros__pohja" width={46} height={90} rx={8} />
        <rect className="piirros__kuva" x={6} y={14} width={34} height={30} />
        <rect className="piirros__muste" x={6} y={52} width={24} height={3} />
      </g>
      {osoitin(110, 92)}
    </svg>
  );
}

const PIIRROKSET: Record<PiirrosAihe, () => ReactNode> = {
  kypsyminen: Kypsyminen,
  ymmarrys: Ymmarrys,
  pohja: Pohja,
  'design-system': DesignSystem,
  polut: Polut,
  data: Data,
  julkaisu: Julkaisu,
};

export default function Piirros({ aihe, label }: { aihe: PiirrosAihe; label?: string }) {
  const Kuva = PIIRROKSET[aihe];
  return (
    <div
      className={`piirros piirros--${aihe === 'kypsyminen' ? 'iso' : 'pieni'}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <Kuva />
    </div>
  );
}
