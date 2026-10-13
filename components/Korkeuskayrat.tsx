'use client';

import { useEffect, useRef } from 'react';

/**
 * Korkeuskayrat: etusivun viivateos.
 *
 * Vaakasuuntaiset korkeuskäyrät piirretään SVG-poluiksi koodissa
 * kiinteällä siemenellä, joten kuvio on joka kerta sama eikä
 * kuvatiedostoa ole. Viivat ovat `--ink`-värisiä, joten teos seuraa
 * teemaa. Ks. päätös 35.
 *
 * Liike:
 * - Saapuminen: viivat piirtyvät ylhäältä alas, kun HeroIntron kansi
 *   alkaa asettua (`hero-intro:asettuu`). Jos intro ei ole käynnissä
 *   (toinen käynti istunnossa, sivu vieritetty), viivat ovat valmiina
 *   paikallaan, samoin kuin nimi.
 * - Levossa kuvio ajelehtii hyvin hitaasti.
 * - Painettaessa osoitin tai sormi avaa linssin, jonka ympäri viivat
 *   väistävät menemättä ristiin. Pelkkä osoittimen vienti ei tee
 *   mitään, ettei teos ole levoton.
 *
 * `prefers-reduced-motion`: kuvio on paikallaan, eikä mikään edellä
 * mainituista liiku. Animaatio pyörii vain, kun teos on näkyvissä.
 */
export default function Korkeuskayrat({ label }: { label: string }) {
  const juuri = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const teos = juuri.current!;
    const kangas = svg.current!;
    const html = document.documentElement;
    const vahemman = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const intro = !vahemman && html.classList.contains('hero-intro-auki');

    let W = 0, H = 0, askel = 10, aika = 0, nakyvissa = true, edellinen = 0, kehys = 0;
    let piirretty = !intro;
    let viivat: { el: SVGPathElement; y0: number; siirto: Float32Array }[] = [];
    const osoitin = { x: -1e4, y: -1e4, voima: 0, tavoite: 0 };

    function rakenna() {
      W = teos.clientWidth; H = teos.clientHeight;
      kangas.setAttribute('viewBox', `0 0 ${W} ${H}`);
      kangas.replaceChildren();
      const vali = W < 600 ? 11 : 14;
      askel = W < 600 ? 6 : 10;
      const pisteita = Math.ceil(W / askel) + 2;
      viivat = [];
      for (let i = 0; i < Math.ceil((H + 120) / vali); i++) {
        const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        el.setAttribute('pathLength', '1');
        /* Ennen piirtymistä viivat ovat piilossa (koko pituus väliä). */
        if (!piirretty) {
          el.style.strokeDasharray = '1 1';
          el.style.strokeDashoffset = '1';
        }
        kangas.append(el);
        viivat.push({ el, y0: -60 + i * vali, siirto: new Float32Array(pisteita) });
      }
      paivita(true);
    }

    /* Käyrän korkeus: tasainen nousu, hidas aalto, kohina ja kaksi
       kumpua. Samat ainekset kuin aiemmassa herokuvassa. */
    function korkeus(x: number, y0: number, t: number) {
      const s = Math.max(W, 900), X = x / s, Y = y0 / s;
      return y0
        + 26 * Math.sin(X * 5.2 + 0.6 + Y * 1.4)
        + 34 * kohina(X * 3.1, Y * 2.2, t)
        + 12 * kohina(X * 9, Y * 6, t * 1.7)
        - 64 * kumpu(X, Y, 0.62, (0.45 * H) / s, 0.16, 0.18)
        + 40 * kumpu(X, Y, 0.18, (0.3 * H) / s, 0.12, 0.14);
    }

    function paivita(kaikki: boolean) {
      const r2 = 150 * 150, nosto = 1.5 * osoitin.voima;
      for (const v of viivat) {
        let d = '', liikkui = kaikki || aika > 0;
        for (let j = 0; j < v.siirto.length; j++) {
          const x = j * askel;
          let y = korkeus(x, v.y0, aika);
          /* Linssi on jatkuva siirtokenttä: nolla osoittimen kohdalla,
             suurin säteen päässä. Viivat väistävät menemättä ristiin. */
          const dx = x - osoitin.x, dy = y - osoitin.y, e2 = dx * dx + dy * dy;
          const tavoite = e2 < r2 * 6 ? nosto * dy * Math.exp(-e2 / r2) : 0;
          const ennen = v.siirto[j];
          v.siirto[j] += (tavoite - ennen) * 0.09;
          if (Math.abs(v.siirto[j] - ennen) > 0.01) liikkui = true;
          y += v.siirto[j];
          d += (j ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
        }
        if (liikkui) v.el.setAttribute('d', d);
      }
    }

    function piirra() {
      if (piirretty) return;
      piirretty = true;
      viivat.forEach((v, i) => {
        v.el.style.strokeDasharray = '';
        v.el.style.strokeDashoffset = '';
        v.el.animate(
          [{ strokeDasharray: '1 1', strokeDashoffset: 1 }, { strokeDasharray: '1 1', strokeDashoffset: 0 }],
          { duration: 1800, delay: 150 + i * 38, easing: 'cubic-bezier(.6,.05,.25,1)', fill: 'backwards' },
        );
      });
    }

    function kierros(nyt: number) {
      kehys = requestAnimationFrame(kierros);
      if (!nakyvissa) { edellinen = nyt; return; }
      const dt = Math.min(50, nyt - (edellinen || nyt));
      edellinen = nyt;
      osoitin.voima += (osoitin.tavoite - osoitin.voima) * 0.06;
      aika += dt * 0.000035;
      paivita(false);
    }

    /* Linssi vain painettaessa. Kosketuksessa pystysuora pyyhkäisy
       vierittää sivua (touch-action: pan-y), ja selain peruu
       painalluksen. */
    const kohta = (e: PointerEvent) => {
      const b = teos.getBoundingClientRect();
      osoitin.x = e.clientX - b.left; osoitin.y = e.clientY - b.top;
    };
    const alas = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      kohta(e); osoitin.tavoite = 1; teos.setPointerCapture(e.pointerId);
    };
    const liike = (e: PointerEvent) => { if (osoitin.tavoite) kohta(e); };
    const irti = () => { osoitin.tavoite = 0; };

    let ajastin = 0;
    const koko = () => {
      clearTimeout(ajastin);
      ajastin = window.setTimeout(() => { if (teos.clientWidth !== W || teos.clientHeight !== H) rakenna(); }, 120);
    };

    const nakyma = new IntersectionObserver(([e]) => { nakyvissa = e.isIntersecting; });
    rakenna();
    window.addEventListener('resize', koko);
    document.addEventListener('hero-intro:asettuu', piirra);
    document.addEventListener('hero-intro:valmis', piirra);
    /* Varmistus samaan tapaan kuin HeroIntrossa: viivat eivät jää
       piiloon, vaikka intron tapahtuma ei koskaan tulisi. */
    const varmistus = window.setTimeout(piirra, 6000);

    if (!vahemman) {
      nakyma.observe(teos);
      kehys = requestAnimationFrame(kierros);
      teos.addEventListener('pointerdown', alas);
      teos.addEventListener('pointermove', liike);
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((t) => teos.addEventListener(t, irti));
    }

    return () => {
      cancelAnimationFrame(kehys);
      clearTimeout(ajastin);
      clearTimeout(varmistus);
      nakyma.disconnect();
      window.removeEventListener('resize', koko);
      document.removeEventListener('hero-intro:asettuu', piirra);
      document.removeEventListener('hero-intro:valmis', piirra);
      teos.removeEventListener('pointerdown', alas);
      teos.removeEventListener('pointermove', liike);
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((t) => teos.removeEventListener(t, irti));
    };
  }, []);

  return (
    <div ref={juuri} className="korkeuskayrat" role="img" aria-label={label}>
      <svg ref={svg} className="korkeuskayrat__viivat" aria-hidden="true" />
    </div>
  );
}

/* ---- kohina ------------------------------------------------------------ */

/* Gradienttikohina (Perlin) kiinteällä siemenellä: sama kuvio joka
   latauksella ja joka koneella. */
const perm = (() => {
  const p = Array.from({ length: 256 }, (_, i) => i);
  let s = 19;
  for (let i = 255; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  return Uint8Array.from({ length: 512 }, (_, i) => p[i & 255]);
})();

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a: number, b: number, t: number) => a + t * (b - a);
function grad(h: number, x: number, y: number, z: number) {
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
  return (h & 1 ? -u : u) + (h & 2 ? -v : v);
}

function kohina(x: number, y: number, z: number) {
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
  x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
  const u = fade(x), v = fade(y), w = fade(z);
  const A = perm[X] + Y, AA = perm[A] + Z, AB = perm[A + 1] + Z;
  const B = perm[X + 1] + Y, BA = perm[B] + Z, BB = perm[B + 1] + Z;
  return lerp(
    lerp(lerp(grad(perm[AA] & 15, x, y, z), grad(perm[BA] & 15, x - 1, y, z), u),
      lerp(grad(perm[AB] & 15, x, y - 1, z), grad(perm[BB] & 15, x - 1, y - 1, z), u), v),
    lerp(lerp(grad(perm[AA + 1] & 15, x, y, z - 1), grad(perm[BA + 1] & 15, x - 1, y, z - 1), u),
      lerp(grad(perm[AB + 1] & 15, x, y - 1, z - 1), grad(perm[BB + 1] & 15, x - 1, y - 1, z - 1), u), v),
    w,
  );
}

const kumpu = (x: number, y: number, cx: number, cy: number, sx: number, sy: number) =>
  Math.exp(-((x - cx) ** 2 / (2 * sx * sx) + (y - cy) ** 2 / (2 * sy * sy)));
