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
 * - `lahtotilanne`, `lahde`, `koodi`, `arvot`, `kirjasto`, `kytkenta`,
 *   `make`, `paluu`: case 03:n prosessin kahdeksan vaihetta
 *   (content/prosessi.ts).
 *
 * Mitat ovat viewBoxin yksiköitä, eivät ruudun pikseleitä: piirros
 * skaalautuu leveytensä mukaan.
 */
export type PiirrosAihe =
  | 'kypsyminen'
  | 'ymmarrys'
  | 'pohja'
  | 'design-system'
  | 'polut'
  | 'data'
  | 'julkaisu'
  | 'lahtotilanne'
  | 'lahde'
  | 'koodi'
  | 'arvot'
  | 'kirjasto'
  | 'kytkenta'
  | 'make'
  | 'paluu';

export const PIIRROS_AIHEET: readonly PiirrosAihe[] = [
  'kypsyminen',
  'ymmarrys',
  'pohja',
  'design-system',
  'polut',
  'data',
  'julkaisu',
  'lahtotilanne',
  'lahde',
  'koodi',
  'arvot',
  'kirjasto',
  'kytkenta',
  'make',
  'paluu',
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

/* Prosessin vaiheet (case 03). Sama sanasto kuin menetelmän kuvissa:
   musta täyte on valmis osa, katkoviiva puuttuva tai tuleva. */

/** Koodirivit: lyhyitä viivoja kuin editorissa. */
function Rivit({ x, y, n, w = 44 }: { x: number; y: number; n: number; w?: number }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <rect key={i} className="piirros__haalea" x={x + (i % 3 === 1 ? 8 : 0)} y={y + i * 10} width={w - (i % 4) * 8} height={2} />
      ))}
    </>
  );
}

/** Pieni painike: musta täyte, tai ääriviiva kun `tila` on 'hius'. */
function Painike({ x, y, w = 44, tila = 'muste' }: { x: number; y: number; w?: number; tila?: 'muste' | 'pohja' | 'katko' }) {
  return <rect className={`piirros__${tila}`} x={x} y={y} width={w} height={14} />;
}

function Lahtotilanne() {
  return (
    <svg viewBox="0 0 240 150">
      <T x={20} y={22} k="meta" koko={8}>
        KOODI
      </T>
      <rect className="piirros__pohja" x={20} y={30} width={76} height={96} />
      <Rivit x={28} y={40} n={8} w={56} />
      <T x={144} y={22} k="meta" koko={8}>
        FIGMA
      </T>
      <rect className="piirros__pohja" x={144} y={30} width={76} height={96} />
      <rect className="piirros__paikka" x={152} y={38} width={60} height={26} />
      <Painike x={152} y={72} w={36} />
      <rect className="piirros__haalea" x={152} y={94} width={48} height={2} />
      <rect className="piirros__haalea" x={152} y={102} width={36} height={2} />
      {[52, 78, 104].map((y, i) => (
        <g key={y}>
          <path className="piirros__katko" d={`M98 ${y} H142`} />
          <circle className={i === 0 ? 'piirros__muste' : 'piirros__pohja'} cx={120} cy={y} r={4} />
        </g>
      ))}
      <T x={120} y={142} k="meta" koko={8} keski>
        3 EROA · 1 PÄÄTETTY
      </T>
    </svg>
  );
}

function Lahde() {
  const kohteet: [number, string][] = [
    [34, 'CSS'],
    [75, 'FIGMA'],
    [116, 'NPM'],
  ];
  return (
    <svg viewBox="0 0 240 150">
      <rect className="piirros__pohja" x={20} y={40} width={84} height={70} />
      <T x={30} y={58} k="koodi" koko={9}>
        tokens.json
      </T>
      <rect className="piirros__muste" x={30} y={70} width={12} height={12} />
      <rect className="piirros__harmaa" x={46} y={70} width={12} height={12} />
      <rect className="piirros__pohja" x={62} y={70} width={12} height={12} />
      <rect className="piirros__haalea" x={30} y={92} width={52} height={2} />
      {kohteet.map(([y, nimi]) => (
        <g key={nimi}>
          <path className="piirros__viiva" d={`M104 75 C130 75, 130 ${y}, 156 ${y} h10 m-5 -4 l5 4 l-5 4`} />
          <rect className="piirros__pohja" x={172} y={y - 10} width={48} height={20} />
          <T x={196} y={y + 3} k="meta" koko={7} keski>
            {nimi}
          </T>
        </g>
      ))}
    </svg>
  );
}

function Koodi() {
  return (
    <svg viewBox="0 0 240 150">
      <rect className="piirros__pohja" x={16} y={18} width={208} height={114} />
      <line className="piirros__hius" x1={16} y1={36} x2={224} y2={36} />
      <line className="piirros__hius" x1={72} y1={36} x2={72} y2={132} />
      <T x={24} y={30} k="meta" koko={7}>
        STORYBOOK
      </T>
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} className={i === 1 ? 'piirros__muste' : 'piirros__haalea'} x={24} y={50 + i * 14} width={i === 1 ? 36 : 30 - (i % 2) * 8} height={i === 1 ? 3 : 2} />
      ))}
      {[
        ['OLETUS', 'muste'],
        ['HOVER', 'harmaa'],
        ['POIS', 'katko'],
      ].map(([nimi, tila], i) => (
        <g key={nimi}>
          <T x={86} y={60 + i * 26} k="faint" koko={7}>
            {nimi}
          </T>
          <rect className={`piirros__${tila}`} x={140} y={50 + i * 26} width={64} height={14} />
        </g>
      ))}
    </svg>
  );
}

function Arvot() {
  const muuttujat = ['color/ink', 'color/paper', 'space/16', 'type/display'];
  return (
    <svg viewBox="0 0 240 150">
      <rect className="piirros__muste" x={20} y={36} width={22} height={22} />
      <rect className="piirros__harmaa" x={20} y={64} width={22} height={22} />
      <rect className="piirros__pohja" x={20} y={92} width={22} height={22} />
      <T x={50} y={52} k="display" koko={16}>
        Aa
      </T>
      <T x={50} y={80} k="meta" koko={7}>
        16
      </T>
      {nuoli(76, 75)}
      <rect className="piirros__pohja" x={104} y={22} width={120} height={106} />
      <line className="piirros__hius" x1={104} y1={40} x2={224} y2={40} />
      <T x={112} y={34} k="meta" koko={7}>
        MUUTTUJAT
      </T>
      {muuttujat.map((m, i) => (
        <g key={m}>
          <rect className={i < 2 ? (i === 0 ? 'piirros__muste' : 'piirros__pohja') : 'piirros__kentta'} x={112} y={50 + i * 18} width={8} height={8} />
          <T x={126} y={57 + i * 18} k="koodi" koko={8}>
            {m}
          </T>
        </g>
      ))}
    </svg>
  );
}

function Kirjasto() {
  return (
    <svg viewBox="0 0 240 150">
      <T x={20} y={22} k="meta" koko={8}>
        BUTTON
      </T>
      <rect className="piirros__katko" x={20} y={30} width={96} height={96} />
      <Painike x={30} y={42} w={76} />
      <Painike x={30} y={64} w={76} tila="pohja" />
      <Painike x={30} y={86} w={76} tila="katko" />
      <rect className="piirros__haalea" x={30} y={110} width={40} height={2} />
      <T x={130} y={22} k="meta" koko={8}>
        LISTROW
      </T>
      <rect className="piirros__katko" x={130} y={30} width={90} height={96} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <line className="piirros__hius" x1={138} y1={48 + i * 26} x2={212} y2={48 + i * 26} />
          <rect className="piirros__muste" x={138} y={56 + i * 26} width={8} height={3} />
          <rect className={i === 1 ? 'piirros__muste' : 'piirros__haalea'} x={152} y={56 + i * 26} width={40} height={i === 1 ? 3 : 2} />
        </g>
      ))}
    </svg>
  );
}

function Kytkenta() {
  const rivit = ['<Button size="m">', '  Ota yhteyttä', '</Button>'];
  return (
    <svg viewBox="0 0 240 150">
      <T x={20} y={36} k="meta" koko={8}>
        FIGMA
      </T>
      <rect className="piirros__katko" x={20} y={44} width={76} height={70} />
      <Painike x={30} y={72} w={56} />
      <circle className="piirros__muste" cx={96} cy={79} r={3} />
      <path className="piirros__viiva" d="M99 79 H125" />
      <circle className="piirros__muste" cx={128} cy={79} r={3} />
      <T x={132} y={36} k="meta" koko={8}>
        KOODI
      </T>
      <rect className="piirros__pohja" x={128} y={44} width={96} height={70} />
      {rivit.map((rivi, i) => (
        <T key={rivi} x={136} y={66 + i * 14} k="koodi" koko={8}>
          {rivi}
        </T>
      ))}
    </svg>
  );
}

function Make() {
  return (
    <svg viewBox="0 0 240 150">
      <rect className="piirros__pohja" x={16} y={30} width={74} height={40} />
      <T x={24} y={46} k="koodi" koko={7}>
        @pokela/
      </T>
      <T x={24} y={58} k="koodi" koko={7}>
        components
      </T>
      <rect className="piirros__pohja" x={16} y={80} width={74} height={40} />
      <T x={24} y={96} k="koodi" koko={7}>
        Guidelines.md
      </T>
      <rect className="piirros__haalea" x={24} y={104} width={50} height={2} />
      <rect className="piirros__haalea" x={24} y={110} width={36} height={2} />
      {nuoli(96, 75)}
      <rect className="piirros__pohja" x={124} y={18} width={100} height={114} />
      <T x={132} y={32} k="meta" koko={7}>
        FIGMA MAKE
      </T>
      <rect className="piirros__paikka" x={132} y={40} width={84} height={30} />
      <rect className="piirros__muste" x={132} y={78} width={60} height={3} />
      <rect className="piirros__kentta" x={132} y={88} width={84} height={12} />
      <Painike x={132} y={106} w={40} />
      {osoitin(176, 108)}
    </svg>
  );
}

function Paluu() {
  return (
    <svg viewBox="0 0 240 150">
      <T x={16} y={30} k="meta" koko={8}>
        MAKE
      </T>
      <path className="piirros__katko" d="M40 44 C70 44, 70 96, 100 96" />
      <circle className="piirros__pohja" cx={40} cy={44} r={4} />
      <path className="piirros__katko" d="M16 96 H144" />
      {[112, 128, 144].map((x) => (
        <circle key={x} className="piirros__pohja" cx={x} cy={96} r={4} />
      ))}
      <T x={16} y={116} k="meta" koko={8}>
        MAIN
      </T>
      <T x={128} y={116} k="faint" koko={7} keski>
        TARKISTUKSET
      </T>
      <rect className="piirros__katko" x={160} y={58} width={64} height={76} />
      <rect className="piirros__kentta" x={172} y={66} width={40} height={8} rx={4} />
      <rect className="piirros__paikka" x={168} y={82} width={48} height={22} />
      <rect className="piirros__haalea" x={168} y={112} width={34} height={2} />
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
  lahtotilanne: Lahtotilanne,
  lahde: Lahde,
  koodi: Koodi,
  arvot: Arvot,
  kirjasto: Kirjasto,
  kytkenta: Kytkenta,
  make: Make,
  paluu: Paluu,
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
