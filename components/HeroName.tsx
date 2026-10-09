'use client';

import { useEffect, useRef } from 'react';
import nimi from '@/content/nimi.generated.json';

/**
 * HeroName: etusivun nimi, joka rakentuu fontin ääriviivoista.
 *
 * Saapuessa nimen päälle piirtyvät ensin apuviivat (versaali,
 * x-korkeus, perusviiva), sitten kirjainten ääriviivat, käyräpisteet
 * ja kahvat, ja lopuksi kirjaimet täyttyvät. Levossa nimi on sama
 * kuin tavallinen otsikko. Osoittimen kohdalla linssi näyttää
 * rakenteen ja lähimmän käyräpisteen koordinaatit fontin yksiköissä.
 * Klikkaus avaa koko nimen rakenteen ja toinen sulkee sen.
 *
 * Pisteet ovat Bodoni Modan oikeat ääriviivat samasta fontista jonka
 * sivu lataa (`npm run nimi`, ks. scripts/nimi-glyfit.mjs).
 *
 * Oikea otsikko on aina sivulla: ruudunlukija lukee sen ja sen voi
 * valita. Piirros on sen alla koristeena. Ilman JavaScriptiä tai jos
 * nimessä on merkki jota ääriviivoissa ei ole, näkyy pelkkä otsikko.
 * Vähemmän liikettä pyytäneelle saapuminen jätetään pois. Saapuminen
 * kestää alle viisi sekuntia, joten taukonappia ei tarvita (WCAG
 * 2.2.2, vrt. päätös 11).
 *
 * `Tila` on Figmassa variantti: `levossa` on valmis nimi, `rakenne`
 * koko nimen rakenne auki. Ks. HeroName.figma.ts.
 */
export type Tila = 'levossa' | 'rakenne';

type Piste = [number, number, number];
type Kirjain = { merkki: string; x: number; perusviiva: number };
type Linssipiste = { x: number; y: number; fx: number; fy: number; merkki: string };

const NS = 'http://www.w3.org/2000/svg';
const G = nimi.glyyfit as unknown as Record<string, { leveys: number; viivat: Piste[][] }>;

/* Nousu luetaan l-kirjaimesta: fontin oma nousuarvo on rivivälin
   mitta, ei kirjaimen korkeus. */
const NOUSU = Math.max(...(G.l?.viivat.flat().map((p) => p[1]) ?? [nimi.versaali]));

/** TrueType-ääriviiva SVG-poluksi: toisen asteen käyrät, joissa kahden
    ohjauspisteen väliin jää näkymätön käyräpiste. */
function polku(viiva: Piste[], T: (x: number, y: number) => [number, number]) {
  const n = viiva.length;
  const P = (i: number) => viiva[((i % n) + n) % n];
  const alku = Math.max(0, viiva.findIndex((p) => p[2]));
  const f = (v: number) => v.toFixed(1);
  const [x0, y0] = T(P(alku)[0], P(alku)[1]);
  let d = `M${f(x0)} ${f(y0)}`;
  for (let k = 1; k <= n; k++) {
    const p = P(alku + k);
    if (p[2]) {
      const [x, y] = T(p[0], p[1]);
      d += `L${f(x)} ${f(y)}`;
      continue;
    }
    const q = P(alku + k + 1);
    const [cx, cy] = T(p[0], p[1]);
    const [ex, ey] = q[2] ? T(q[0], q[1]) : T((p[0] + q[0]) / 2, (p[1] + q[1]) / 2);
    if (q[2]) k++;
    d += `Q${f(cx)} ${f(cy)} ${f(ex)} ${f(ey)}`;
  }
  return d + 'Z';
}

function el(nimi: string, attr: Record<string, string | number>, vanhempi?: Element) {
  const e = document.createElementNS(NS, nimi);
  for (const k in attr) e.setAttribute(k, String(attr[k]));
  vanhempi?.appendChild(e);
  return e;
}

export default function HeroName({
  lines,
  tila = 'levossa',
}: {
  /** Nimen rivit. Mobiilissa jokainen on oma rivinsä, työpöydällä ne luetaan yhtenä. */
  lines: readonly string[];
  /** Alkutila. `rakenne` avaa koko nimen rakenteen ilman saapumista. */
  tila?: Tila;
}) {
  const kehys = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const otsikko = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const juuri = kehys.current, piirros = svg.current, h1 = otsikko.current;
    if (!juuri || !piirros || !h1) return;
    if (![...lines.join('')].every((m) => !m.trim() || G[m])) return;

    const vahemman = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, valmis = tila === 'rakenne' || vahemman, ajastin = 0, taytetty = 0, raf = 0, poissa = false;
    let pisteet: Linssipiste[] = [];
    let maara = 0;
    const L = {
      x: 0, y: 0, tx: 0, ty: 0, R: 0, tR: 0, koko: tila === 'rakenne',
      v: null as Element | null, r: null as Element | null, kohde: null as Element | null,
      teksti: null as Element | null, gV: null as Element | null, gR: null as Element | null,
    };

    function rakenna() {
      if (!juuri || !piirros || !h1) return;
      const r = juuri.getBoundingClientRect();
      W = r.width; H = r.height;
      const s = parseFloat(getComputedStyle(h1).fontSize) / nimi.yksikot;
      piirros.setAttribute('viewBox', `0 0 ${W} ${H}`);
      piirros.textContent = '';
      pisteet = [];
      const kirjaimet: Kirjain[] = [];
      const rivit = new Set<number>();
      for (const osa of h1.children) {
        const t = osa.firstChild;
        const merkki = osa.querySelector('.hero-name__pv');
        if (!(t instanceof Text) || !merkki) continue;
        const perusviiva = merkki.getBoundingClientRect().top - r.top;
        rivit.add(Math.round(perusviiva));
        for (let i = 0; i < t.data.length; i++) {
          if (!G[t.data[i]]) continue;
          const rg = document.createRange();
          rg.setStart(t, i);
          rg.setEnd(t, i + 1);
          kirjaimet.push({ merkki: t.data[i], x: rg.getBoundingClientRect().left - r.left, perusviiva });
        }
      }

      const defs = el('defs', {}, piirros);
      const reuna = (id: string, sisa: string, ulko: string) => {
        const g = el('radialGradient', { id }, defs);
        el('stop', { offset: 0.72, 'stop-color': sisa }, g);
        el('stop', { offset: 1, 'stop-color': ulko }, g);
      };
      /* Maskissa väri on alfakanava: valkoinen näkyy, musta ei. */
      reuna('hero-name-sisa', '#fff', '#000');
      reuna('hero-name-ulko', '#000', '#fff');
      const alue = { maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: W, height: H };
      const mV = el('mask', { id: 'hero-name-valmis', ...alue }, defs);
      el('rect', { width: W, height: H, fill: '#fff' }, mV);
      L.v = el('circle', { r: 0, fill: 'url(#hero-name-ulko)' }, mV);
      const mR = el('mask', { id: 'hero-name-rakenne', ...alue }, defs);
      L.r = el('circle', { r: 0, fill: 'url(#hero-name-sisa)' }, mR);

      L.gV = el('g', { class: 'hero-name__valmis' }, piirros);
      L.gR = el('g', { class: 'hero-name__rakenne' }, piirros);
      (L.gR as SVGGElement).style.setProperty('--n', String(kirjaimet.length));

      const apu = el('g', {}, L.gR);
      let ri = 0;
      for (const pv of rivit) {
        for (const [y, nimiT] of [[NOUSU, ''], [nimi.versaali, 'Versaali'], [nimi.xKorkeus, 'x-korkeus'], [0, 'Perusviiva']] as const) {
          const yy = pv - y * s;
          el('line', { x1: 0, y1: yy, x2: W, y2: yy, pathLength: 1, class: y === 0 ? 'hero-name__apu hero-name__apu--pv' : 'hero-name__apu', style: `--d:${ri * 0.08}s` }, apu);
          /* Nimet mahtuvat vain leveälle: kapeassa ne peittäisivät kirjaimet. */
          if (!nimiT || W < 700) continue;
          const tx = el('text', { x: W, y: yy, dy: '-0.5em', 'text-anchor': 'end', class: 'hero-name__nimike', style: `--d:${0.35 + ri * 0.08}s` }, apu);
          tx.textContent = `${nimiT} ${y}`;
        }
        ri++;
      }

      kirjaimet.forEach((k, i) => {
        const g = G[k.merkki];
        const T = (x: number, y: number): [number, number] => [k.x + x * s, k.perusviiva - y * s];
        const d = g.viivat.map((v) => polku(v, T)).join('');
        el('path', { d, class: 'hero-name__tayte', style: `--i:${i}` }, L.gV!);
        const gk = el('g', { class: 'hero-name__kirjain', style: `--i:${i}` }, L.gR!);
        el('rect', { x: k.x, y: k.perusviiva - NOUSU * s, width: g.leveys * s, height: NOUSU * s, class: 'hero-name__laatikko' }, gk);
        el('path', { d, class: 'hero-name__haamu' }, gk);
        el('path', { d, class: 'hero-name__aari', pathLength: 1 }, gk);
        const gp = el('g', { class: 'hero-name__pisteet' }, gk);
        let kahvat = '';
        for (const v of g.viivat) {
          v.forEach((p, j) => {
            const [x, y] = T(p[0], p[1]);
            if (p[2]) {
              pisteet.push({ x, y, fx: p[0], fy: p[1], merkki: k.merkki });
              return;
            }
            for (const q of [v[(j - 1 + v.length) % v.length], v[(j + 1) % v.length]]) {
              const [qx, qy] = T(q[0], q[1]);
              kahvat += `M${x.toFixed(1)} ${y.toFixed(1)}L${qx.toFixed(1)} ${qy.toFixed(1)}`;
            }
          });
        }
        el('path', { d: kahvat, class: 'hero-name__kahva' }, gp);
        /* Pisteet kasvavat kirjaimen mukana: mobiilin pienessä nimessä
           täysikokoiset pisteet peittäisivät kirjaimet. */
        const a = Math.min(5, Math.max(2.5, s * nimi.yksikot * 0.036));
        for (const v of g.viivat) for (const p of v) {
          const [x, y] = T(p[0], p[1]);
          if (p[2]) el('rect', { x: x - a / 2, y: y - a / 2, width: a, height: a, class: 'hero-name__solmu' }, gp);
          else el('circle', { cx: x, cy: y, r: a * 0.42, class: 'hero-name__ohjain' }, gp);
        }
      });
      L.kohde = el('circle', { r: 7, cx: -99, cy: -99, class: 'hero-name__kohde' }, L.gR);
      L.teksti = el('text', { x: -999, y: -99, class: 'hero-name__lukema' }, L.gR);
      maara = kirjaimet.length;
      juuri.classList.add('hero-name--elossa');
      /* HeroIntro keskittää nimen vasta, kun sen lopullinen koko on
         tiedossa. */
      juuri.dispatchEvent(new Event('hero-name:rakennettu', { bubbles: true }));
      if (valmis) kiinnita();
    }

    /* Saapumisen jälkeen rakenne siirtyy linssin taakse. */
    function kiinnita() {
      juuri!.classList.remove('hero-name--saapuu');
      L.gV?.setAttribute('mask', 'url(#hero-name-valmis)');
      L.gR?.setAttribute('mask', 'url(#hero-name-rakenne)');
      if (L.koko) { L.x = L.tx = W / 2; L.y = L.ty = H / 2; L.R = Math.hypot(W, H); }
      paivita();
    }

    function saapuminen() {
      if (valmis) return;
      juuri!.classList.add('hero-name--saapuu');
      /* Sama aikataulu kuin hero-name.css:n saapumisessa. */
      ajastin = window.setTimeout(() => { valmis = true; kiinnita(); }, 2400 + maara * 45);
      /* Kirjaimet ovat lähes täynnä: HeroIntro voi asettua. */
      taytetty = window.setTimeout(
        () => juuri!.dispatchEvent(new Event('hero-name:taytetty', { bubbles: true })),
        1900 + maara * 45,
      );
    }

    const sade = () => Math.max(110, Math.min(220, W * 0.13));
    function paivita() {
      if (valmis && !raf) raf = requestAnimationFrame(askel);
    }
    function askel() {
      raf = 0;
      const tR = L.koko ? Math.hypot(W, H) * 1.5 : L.tR;
      const k = vahemman ? 1 : 0.22;
      L.x += (L.tx - L.x) * k;
      L.y += (L.ty - L.y) * k;
      L.R += (tR - L.R) * (vahemman ? 1 : 0.14);
      for (const c of [L.v, L.r]) {
        c?.setAttribute('cx', L.x.toFixed(1));
        c?.setAttribute('cy', L.y.toFixed(1));
        c?.setAttribute('r', Math.max(0, L.R).toFixed(1));
      }
      /* Lähin käyräpiste saa koordinaattinsa fontin yksiköissä. */
      let paras: Linssipiste | null = null, pd = Infinity;
      if (L.R > 30 && !L.koko) {
        for (const p of pisteet) {
          const d = (p.x - L.x) ** 2 + (p.y - L.y) ** 2;
          if (d < pd) { pd = d; paras = p; }
        }
      }
      if (paras && pd < (L.R * 0.7) ** 2) {
        L.kohde?.setAttribute('cx', String(paras.x));
        L.kohde?.setAttribute('cy', String(paras.y));
        L.teksti?.setAttribute('x', String(paras.x + 12));
        L.teksti?.setAttribute('y', String(paras.y - 10));
        if (L.teksti) L.teksti.textContent = `${paras.merkki}  x ${paras.fx}  y ${paras.fy}`;
      } else {
        L.kohde?.setAttribute('cx', '-99');
        L.teksti?.setAttribute('x', '-999');
      }
      /* Kun linssi on asettunut, piirtäminen loppuu. */
      if (Math.abs(L.tx - L.x) > 0.3 || Math.abs(L.ty - L.y) > 0.3 || Math.abs(tR - L.R) > 0.5) raf = requestAnimationFrame(askel);
    }

    const sijainti = (e: PointerEvent | MouseEvent) => {
      const r = juuri!.getBoundingClientRect();
      L.tx = e.clientX - r.left;
      L.ty = e.clientY - r.top;
      return L.tx >= 0 && L.ty >= 0 && L.tx <= r.width && L.ty <= r.height;
    };
    const liike = (e: PointerEvent) => {
      const sisalla = sijainti(e);
      if (sisalla && L.R < 5) { L.x = L.tx; L.y = L.ty; }
      L.tR = sisalla ? sade() : 0;
      paivita();
    };
    const poistuu = () => { L.tR = 0; paivita(); };
    const klikkaus = (e: MouseEvent) => {
      if (!valmis) return;
      sijainti(e);
      if (L.R < 5) { L.x = L.tx; L.y = L.ty; }
      L.koko = !L.koko;
      if (!L.koko && (e as PointerEvent).pointerType === 'touch') L.tR = 0;
      paivita();
    };

    let koonAjastin = 0, alustettu = false;
    const koko = new ResizeObserver(() => {
      if (!alustettu) return;
      clearTimeout(koonAjastin);
      koonAjastin = window.setTimeout(rakenna, 80);
    });

    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (poissa) return;
      rakenna();
      alustettu = true;
      saapuminen();
      window.addEventListener('pointermove', liike, { passive: true });
      juuri.addEventListener('pointerleave', poistuu);
      juuri.addEventListener('click', klikkaus);
      koko.observe(juuri);
    });

    return () => {
      poissa = true;
      clearTimeout(ajastin);
      clearTimeout(taytetty);
      clearTimeout(koonAjastin);
      cancelAnimationFrame(raf);
      koko.disconnect();
      window.removeEventListener('pointermove', liike);
      juuri.removeEventListener('pointerleave', poistuu);
      juuri.removeEventListener('click', klikkaus);
      juuri.classList.remove('hero-name--elossa', 'hero-name--saapuu');
      piirros.textContent = '';
    };
  }, [lines, tila]);

  return (
    <div ref={kehys} className="hero-name">
      <svg ref={svg} className="hero-name__piirros" aria-hidden="true" />
      {/* Yhdysmerkkiin päättyvän rivin perään ei tule väliä.
          Tyhjä merkki rivin lopussa kertoo piirrokselle rivin
          perusviivan. */}
      <h1 ref={otsikko} className="display-xl hero-name__nimi">
        {lines.map((line, i) => (
          <span key={line} className="hero-name__rivi">
            {line}
            {i < lines.length - 1 && !line.endsWith('-') ? ' ' : ''}
            <i className="hero-name__pv" />
          </span>
        ))}
      </h1>
    </div>
  );
}
