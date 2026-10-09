'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

/**
 * ExplodedView: räjäytyskuva. Kerrokset levyinä 3D-tilassa, päällekkäin
 * tai viuhkana, niin että näkee mistä valmis pinta koostuu.
 *
 * Kerrokset ovat oikeaa HTML:ää, eivät kuvia: teksti pysyy terävänä ja
 * sisältö on samaa koodia kuin muualla. Ei WebGL:ää eikä kirjastoja,
 * pelkät CSS 3D -muunnokset.
 *
 * - Osoitin kääntää pinoa ja erkanee kerroksia.
 * - Elementit, joilla on sama `data-kohde`, syttyvät yhdessä: osoitin
 *   komponentin päällä näyttää sen jokaisessa kerroksessa.
 * - Klikkaus nostaa kerroksen kerrallaan esiin ja lopuksi palauttaa
 *   koko pinon.
 * - Tilassa `auki` vieritys kokoaa kerrokset yhdeksi suoraksi
 *   pinnaksi, kun kuva poistuu näkymän yläreunasta.
 *
 * Silmukka pyörii vain kun jokin liikkuu, ja pysähtyy kun kuva ei näy.
 * Pysyvää liikettä ei ole, joten taukonappia ei tarvita (WCAG 2.2.2).
 * Vähemmän liikettä pyytäneelle pino näkyy paikallaan alkutilassaan.
 *
 * Kuva on koriste, jonka sisältö on muualla sivulla: ruudunlukija lukee
 * vain `label`-kuvauksen. Kerroksiin ei laiteta linkkejä eikä nappeja:
 * ne olisivat näppäimistölle piilotettuja kohteita.
 *
 * `Tila` on Figmassa variantti: `auki` on pino viuhkana, `koottu`
 * kerrokset yhdeksi pinnaksi koottuna. Ks. ExplodedView.figma.ts.
 */
export type ExplodedTila = 'auki' | 'koottu';

export type ExplodedLayer = {
  /** Kerroksen nimi levyn yläpuolella, esim. "01 Tokenit". */
  name: string;
  /** Mistä kerros tulee, esim. "tokens.json". Valinnainen. */
  source?: string;
  content: ReactNode;
};

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export default function ExplodedView({
  layers,
  label,
  tila = 'auki',
  className,
}: {
  /** Alimmasta ylimpään. Ylin on valmis pinta. */
  layers: ExplodedLayer[];
  /** Kuvan kuvaus ruudunlukijalle. */
  label: string;
  /** Alkutila. `koottu` näyttää valmiin pinnan; klikkaus avaa pinon. */
  tila?: ExplodedTila;
  className?: string;
}) {
  const kehys = useRef<HTMLDivElement>(null);
  const pino = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = kehys.current;
    const el = pino.current;
    if (!hero || !el) return;
    const kerrokset = [...el.querySelectorAll<HTMLElement>('.exploded__layer')];
    const vahemman = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const n = kerrokset.length;

    /* Levyn mitat luetaan CSS:stä, jotta ne ovat yhdessä paikassa. */
    const levyL = el.offsetWidth || 960;
    const levyK = el.offsetHeight || 600;

    /* x, y: osoitin -1…1 jousella. p: 1 = auki, 0 = koottu. */
    const t = {
      x: 0, y: 0, vx: 0, vy: 0, kx: 0, ky: 0,
      p: tila === 'auki' ? 1 : 0,
      auki: tila === 'auki',
      vieritys: 1,
      nakyy: true, raf: 0, edellinen: 0,
      mitta: 1, kapea: false,
    };

    function koko() {
      const r = hero!.getBoundingClientRect();
      t.kapea = r.width < 560;
      /* Vino pino vie enemmän tilaa kuin levy itse. */
      const tarveL = levyL * (t.kapea ? 1.3 : 2.1);
      const tarveK = levyK * (t.kapea ? 2.6 : 2.1);
      t.mitta = Math.min(r.width / tarveL, r.height / tarveK);
      piirra();
    }

    function piirra() {
      const p = t.p;
      const rx = t.kapea ? lerp(0, 58, p) - t.y * 6 * p : lerp(0, 12, p) - t.y * 8 * p;
      const ry = t.kapea ? t.x * 3 * p : lerp(0, 52, p) + t.x * 12 * p;
      const rz = t.kapea ? t.x * 4 * p : lerp(0, -4, p);
      const vali = (t.kapea ? 0.36 : 0.42) * levyL * p * (1 + 0.1 * Math.abs(t.x));
      const r = hero!.getBoundingClientRect();
      const tayttava = Math.min(r.width / levyL, r.height / levyK) * 0.92;
      el!.style.setProperty('--rx', `${rx}deg`);
      el!.style.setProperty('--ry', `${ry}deg`);
      el!.style.setProperty('--rz', `${rz}deg`);
      el!.style.setProperty('--vali', `${vali}px`);
      el!.style.setProperty('--nosto', `${(t.kapea ? 0 : 0.05) * levyK * p}px`);
      el!.style.setProperty('--s', String(lerp(tayttava, t.mitta, p)));
      /* Koottuna alemmat levyt piiloon, ettei niiden reuna näy ylimmän alta. */
      kerrokset.forEach((k, i) => k.classList.toggle('exploded__layer--piilossa', p < 0.02 && i < n - 1));
    }

    const kohde = () => (t.auki ? t.vieritys : 0);

    function vaihe(nyt: number) {
      t.raf = 0;
      const dt = Math.min(50, t.edellinen ? nyt - t.edellinen : 16.7);
      t.edellinen = nyt;
      const f = dt / 16.7;
      const k = 0.07 * f;
      t.vx = (t.vx + (t.kx - t.x) * k) * Math.pow(0.8, f);
      t.vy = (t.vy + (t.ky - t.y) * k) * Math.pow(0.8, f);
      t.x += t.vx * f;
      t.y += t.vy * f;
      t.p += (kohde() - t.p) * Math.min(1, 0.12 * f);
      piirra();
      const lepaa =
        Math.abs(t.vx) + Math.abs(t.vy) + Math.abs(t.kx - t.x) + Math.abs(t.ky - t.y) + Math.abs(kohde() - t.p) <
        0.0005;
      if (t.nakyy && !document.hidden && !lepaa) t.raf = requestAnimationFrame(vaihe);
      else t.edellinen = 0;
    }
    const herata = () => {
      if (!t.raf && t.nakyy) t.raf = requestAnimationFrame(vaihe);
    };
    const asetu = () => {
      t.p = kohde();
      piirra();
    };
    const liiku = vahemman ? asetu : herata;

    const osoitin = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      const r = hero.getBoundingClientRect();
      if (e.clientY < r.top - r.height || e.clientY > r.bottom + r.height) return;
      t.kx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      t.ky = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
      herata();
    };
    const poistu = () => {
      t.kx = 0;
      t.ky = 0;
      herata();
    };

    /* Kohdistus: klikkaus kiertää kerrokset alimmasta ylimpään. Koottu
       pino avautuu ensin, ja kierroksen lopussa palaa alkutilaansa. */
    let aktiivinen = -1;
    function kohdista(i: number) {
      aktiivinen = i;
      el!.classList.toggle('exploded__stack--kohdistus', i >= 0);
      kerrokset.forEach((k, j) => k.classList.toggle('exploded__layer--aktiivinen', j === i));
    }
    const klikkaus = () => {
      if (!t.auki) {
        t.auki = true;
        kohdista(-1);
      } else if (aktiivinen >= n - 1) {
        kohdista(-1);
        if (tila === 'koottu') t.auki = false;
      } else {
        kohdista(aktiivinen + 1);
      }
      liiku();
    };

    const valaise = (e: PointerEvent) => {
      el.querySelectorAll('.exploded--valaistu').forEach((x) => x.classList.remove('exploded--valaistu'));
      const k = (e.target as Element).closest<HTMLElement>('[data-kohde]');
      if (!k) return;
      el.querySelectorAll(`[data-kohde="${k.dataset.kohde}"]`).forEach((x) => x.classList.add('exploded--valaistu'));
    };
    const sammuta = () =>
      el.querySelectorAll('.exploded--valaistu').forEach((x) => x.classList.remove('exploded--valaistu'));

    /* Vieritys kokoaa, kun kuva poistuu yläreunasta. */
    const vieritys = () => {
      const r = hero.getBoundingClientRect();
      const q = Math.max(0, Math.min(1, -r.top / (r.height * 0.7)));
      t.vieritys = 1 - q * q * (3 - 2 * q);
      if (t.auki && tila === 'auki') liiku();
    };

    const nakyvyys = new IntersectionObserver(([e]) => {
      t.nakyy = e.isIntersecting;
      if (t.nakyy) herata();
    });
    nakyvyys.observe(hero);
    const mitat = new ResizeObserver(koko);
    mitat.observe(hero);

    if (!vahemman) {
      window.addEventListener('pointermove', osoitin, { passive: true });
      hero.addEventListener('pointerleave', poistu);
      window.addEventListener('scroll', vieritys, { passive: true });
    }
    hero.addEventListener('click', klikkaus);
    el.addEventListener('pointerover', valaise);
    el.addEventListener('pointerleave', sammuta);

    koko();
    if (!vahemman) vieritys();
    asetu();
    /* Ennen tätä pinolla ei ole mittoja, joten se on piilossa. */
    hero.classList.add('exploded--valmis');

    return () => {
      cancelAnimationFrame(t.raf);
      nakyvyys.disconnect();
      mitat.disconnect();
      window.removeEventListener('pointermove', osoitin);
      hero.removeEventListener('pointerleave', poistu);
      window.removeEventListener('scroll', vieritys);
      hero.removeEventListener('click', klikkaus);
      el.removeEventListener('pointerover', valaise);
      el.removeEventListener('pointerleave', sammuta);
    };
  }, [tila]);

  return (
    <div
      ref={kehys}
      className={['exploded', `exploded--${tila}`, className].filter(Boolean).join(' ')}
      role="img"
      aria-label={label}
    >
      <div className="exploded__stage" aria-hidden="true">
        <div ref={pino} className="exploded__stack">
          {layers.map((layer, i) => (
            <div key={layer.name} className="exploded__layer" style={{ '--i': i } as CSSProperties}>
              <div className="exploded__plate">{layer.content}</div>
              <div className="exploded__name">
                <span className="meta ink">{layer.name}</span>
                {layer.source ? <span className="meta meta--s">{layer.source}</span> : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
