#!/usr/bin/env node
/**
 * Prosessidemon video käsikirjoituksesta (video/kasikirjoitus.ts).
 *
 *   npm run video              kaikki kohtaukset
 *   npm run video -- storybook yksi kohtaus id:n mukaan
 *
 * Kaksi vaihetta:
 *
 * 1. Tallennus. Playwright avaa kohtauksen sivun 1440×900-näkymässä
 *    2× tarkkuudella ja ottaa pysäytyskuvan jokaisesta tilasta: alku,
 *    osoitin kohteen päällä, klikkauksen jälkeen. Samalla kirjataan
 *    kohteiden paikat, joista syntyy kameran ja osoittimen aikajana.
 *
 * 2. Sommittelu. video/sommittelu.html piirtää aikajanan ruutu
 *    ruudulta (60 fps), ja ffmpeg pakkaa ruudut mp4:ksi. Mikään ei
 *    tapahdu reaaliajassa, joten tulos ei nyi eikä riipu koneen
 *    nopeudesta.
 *
 * Tulokset menevät kansioon .video/ (ei versionhallinnassa).
 */

import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { chromium } from 'playwright';
import ffmpegPolku from 'ffmpeg-static';
import { kohtaukset } from '../video/kasikirjoitus.ts';

const JUURI = resolve(import.meta.dirname, '..');
const ULOS = join(JUURI, '.video');
const STORYBOOK = join(JUURI, 'storybook-static');
const SIVUSTO = join(JUURI, 'out');
const FPS = 60;
const NAKYMA = { width: 1440, height: 900 };

/* Ajoitukset sekunteina. Osoitin lähtee hetken vaiheen alun jälkeen,
   ehtii perille ennen klikkausta, ja uusi tila näkyy heti sen jälkeen. */
const OSOITIN_LAHTEE = 0.1;
const OSOITIN_PERILLA = 1.05;
const KLIKKAUS = 1.2;
/* Linkin odotustila näkyy tämän ajan ennen uutta sivua. */
const SIVUNVAIHTO = 0.8;
const KAMERA_ENINTAAN = 1.4;
const LOPPU = 0.6;
/* Vieritys pysähtyy niin, että kohde jää tämän verran yläreunasta. */
const VIERITYS_YLAREUNA = 96;
const VIERITYS_ENINTAAN = 1.8;
/* Tyhjää kohteen ympärillä, kun kamera rajaa siihen (CSS-pikseleinä). */
const VALJYYS = 48;

const TYYPIT = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.ico': 'image/x-icon',
};

function palvele(kansio) {
  const palvelin = createServer((pyynto, vastaus) => {
    let polku = join(kansio, decodeURIComponent(new URL(pyynto.url, 'http://x').pathname));
    if (existsSync(polku) && statSync(polku).isDirectory()) polku = join(polku, 'index.html');
    if (!polku.startsWith(kansio) || !existsSync(polku)) {
      vastaus.writeHead(404).end();
      return;
    }
    vastaus.writeHead(200, { 'content-type': TYYPIT[extname(polku)] ?? 'application/octet-stream' });
    vastaus.end(readFileSync(polku));
  });
  return new Promise((ok) =>
    palvelin.listen(0, () => ok({ osoite: `http://localhost:${palvelin.address().port}`, palvelin })),
  );
}

function varmistaStorybook() {
  if (existsSync(join(STORYBOOK, 'index.html'))) return;
  console.log('Storybookia ei ole rakennettu, rakennetaan…');
  const ajo = spawnSync('npm', ['run', 'build-storybook', '--', '--quiet'], { cwd: JUURI, stdio: 'inherit' });
  if (ajo.status !== 0) throw new Error('Storybookin rakennus epäonnistui');
}

function varmistaSivusto() {
  if (existsSync(join(SIVUSTO, 'fi', 'index.html'))) return;
  console.log('Sivustoa ei ole rakennettu, rakennetaan…');
  const ajo = spawnSync('npm', ['run', 'build'], { cwd: JUURI, stdio: 'inherit' });
  if (ajo.status !== 0) throw new Error('Sivuston rakennus epäonnistui');
}

async function odotaRauha(sivu) {
  await sivu.waitForLoadState('networkidle');
  for (const kehys of sivu.frames()) {
    await kehys.evaluate(() => document.fonts.ready).catch(() => {});
  }
  await sivu.waitForTimeout(700);
}

/* Sivuston osiot ilmestyvät, kun ne vieritetään näkyviin (Reveal).
   Sivu vieritetään kerran läpi, jotta kuvissa ei ole puuttuvia osioita. */
async function esivierita(sivu) {
  await sivu.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((ok) => setTimeout(ok, 60));
    }
    window.scrollTo(0, 0);
  });
  await sivu.waitForTimeout(900);
}

function etsi(sivu, kohde) {
  const juuri = kohde.esikatselu
    ? sivu.locator('#storybook-preview-iframe').contentFrame()
    : sivu;
  return juuri.locator(kohde.valitsin).first();
}

/**
 * Kohteen rajat sivun koordinaateissa. Sisältökohteella rajat
 * lasketaan tekstistä ja kuvista eikä laatikosta, koska Storybookin
 * juuri on koko esikatselun levyinen vaikka komponentit ovat sen
 * vasemmassa reunassa.
 */
async function rajat(sivu, kohde) {
  const elementti = etsi(sivu, kohde);
  if (!kohde.sisalto) return elementti.boundingBox();
  const kehys = await elementti.boundingBox();
  const sisa = await elementti.evaluate((juuri) => {
    const laatikot = [];
    const kulku = document.createTreeWalker(juuri, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    for (let n = kulku.currentNode; n; n = kulku.nextNode()) {
      if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) {
        const r = document.createRange();
        r.selectNodeContents(n);
        laatikot.push(r.getBoundingClientRect());
      } else if (n.nodeType === Node.ELEMENT_NODE && /^(IMG|SVG|BUTTON|INPUT|SELECT|VIDEO|CANVAS)$/i.test(n.tagName)) {
        laatikot.push(n.getBoundingClientRect());
      }
    }
    const nakyvat = laatikot.filter((r) => r.width && r.height);
    const x0 = Math.min(...nakyvat.map((r) => r.left)), y0 = Math.min(...nakyvat.map((r) => r.top));
    const x1 = Math.max(...nakyvat.map((r) => r.right)), y1 = Math.max(...nakyvat.map((r) => r.bottom));
    const juuriR = juuri.getBoundingClientRect();
    return { x: x0 - juuriR.left, y: y0 - juuriR.top, width: x1 - x0, height: y1 - y0 };
  });
  return { x: kehys.x + sisa.x, y: kehys.y + sisa.y, width: sisa.width, height: sisa.height };
}

/** Usean kohteen rajat yhtenä laatikkona. */
async function yhdistetytRajat(sivu, kohteet) {
  const laatikot = await Promise.all([kohteet].flat().map((k) => rajat(sivu, k)));
  const x0 = Math.min(...laatikot.map((r) => r.x)), y0 = Math.min(...laatikot.map((r) => r.y));
  const x1 = Math.max(...laatikot.map((r) => r.x + r.width));
  const y1 = Math.max(...laatikot.map((r) => r.y + r.height));
  return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
}

/** Kameran paikka: keskipiste rajataan niin, ettei näkymän reuna tule kuvaan. */
function kameranPaikka(laatikko, zoomEnintaan) {
  /* Kohde mahtuu kuvaan väljästi: zoom on enintään käsikirjoituksen
     arvo, mutta ei niin suuri, että kohteen reuna leikkautuu. */
  const zoom = laatikko
    ? Math.max(1, Math.min(zoomEnintaan,
        NAKYMA.width / (laatikko.width + 2 * VALJYYS),
        NAKYMA.height / (laatikko.height + 2 * VALJYYS)))
    : zoomEnintaan;
  const w = NAKYMA.width / zoom, h = NAKYMA.height / zoom;
  const cx = laatikko ? laatikko.x + laatikko.width / 2 : NAKYMA.width / 2;
  const cy = laatikko ? laatikko.y + laatikko.height / 2 : NAKYMA.height / 2;
  return {
    x: Math.min(NAKYMA.width - w / 2, Math.max(w / 2, cx)),
    y: Math.min(NAKYMA.height - h / 2, Math.max(h / 2, cy)),
    zoom,
  };
}

async function tallenna(selain, kohtaus, osoitteet) {
  if (kohtaus.lahde === 'kortti') {
    return {
      kesto: kohtaus.s,
      tunniste: kohtaus.tunniste,
      otsikot: [{ t: 0, teksti: kohtaus.otsikko }],
      kortti: { teksti: kohtaus.teksti },
      kuvat: [],
      kamera: [],
      kursori: [],
    };
  }

  const kansio = join(ULOS, 'kuvat', kohtaus.id);
  rmSync(kansio, { recursive: true, force: true });
  mkdirSync(kansio, { recursive: true });

  const sivu = await selain.newPage({ viewport: NAKYMA, deviceScaleFactor: 2 });
  await sivu.goto(osoitteet[kohtaus.lahde] + kohtaus.polku);
  await odotaRauha(sivu);
  if (kohtaus.lahde === 'sivusto') await esivierita(sivu);

  const kuvat = [];
  const vieritys = () => sivu.evaluate(() => window.scrollY);
  const kuva = async (t0) => {
    const nimi = `${String(kuvat.length).padStart(2, '0')}.png`;
    await sivu.screenshot({ path: join(kansio, nimi) });
    kuvat.push({ src: `/.video/kuvat/${kohtaus.id}/${nimi}`, t0, y: await vieritys() });
  };

  /* Kameran x, y ja zoom ovat näkymän koordinaateissa; vy on sivun
     vierityskohta, jota kuvat seuraavat. */
  const kamera = [{ ...kameranPaikka(null, 1), vy: await vieritys(), t0: 0, t1: 0 }];
  const kursori = [{ x: NAKYMA.width * 0.72, y: NAKYMA.height * 0.78, t0: 0, t1: 0 }];
  const otsikot = [{ t: 0, teksti: kohtaus.otsikko }];

  await kuva(-1);
  let t = 0;
  for (const vaihe of kohtaus.vaiheet) {
    if (vaihe.otsikko) otsikot.push({ t, teksti: vaihe.otsikko });
    if (vaihe.kamera) {
      const laatikko = vaihe.kamera.kohde ? await yhdistetytRajat(sivu, vaihe.kamera.kohde) : null;
      const kesto = Math.min(KAMERA_ENINTAAN, vaihe.s * 0.7);
      kamera.push({ ...kameranPaikka(laatikko, vaihe.kamera.zoom), vy: await vieritys(), t0: t, t1: t + kesto });
    }
    if (vaihe.tee === 'vierita') {
      /* Vieritys kuvataan näkymän korkuisina paloina alku- ja
         loppukohdan väliltä, ja sommittelu liu'uttaa niitä. Navi
         piilotetaan paloista, koska se väistyy vierittäessä alas
         (päätös 37). */
      const alku = await vieritys();
      const laatikko = await etsi(sivu, vaihe.kohde).boundingBox();
      const korkeus = await sivu.evaluate(() => document.documentElement.scrollHeight);
      const loppu = Math.round(Math.min(korkeus - NAKYMA.height, Math.max(0, alku + laatikko.y - VIERITYS_YLAREUNA)));
      const kesto = Math.min(VIERITYS_ENINTAAN, vaihe.s * 0.8);
      const piilotus = await sivu.addStyleTag({ content: '.nav-kehys { visibility: hidden !important; }' });
      for (let y = alku; ; y = Math.min(loppu, y + NAKYMA.height)) {
        await sivu.evaluate((y) => window.scrollTo(0, y), y);
        await sivu.waitForTimeout(250);
        await kuva(t);
        if (y === loppu) break;
      }
      await piilotus.evaluate((n) => n.remove());
      await sivu.waitForTimeout(600);
      kamera.push({ ...kamera.at(-1), vy: loppu, t0: t, t1: t + kesto });
      await kuva(t + kesto);
    }
    if (vaihe.tee === 'klikkaa') {
      const kohde = etsi(sivu, vaihe.kohde);
      const laatikko = await kohde.boundingBox();
      if (!laatikko) throw new Error(`${kohtaus.id}: kohdetta ei löydy: ${vaihe.kohde.valitsin}`);
      const x = laatikko.x + Math.min(laatikko.width / 2, 40);
      const y = laatikko.y + laatikko.height / 2;
      kursori.push({ x, y, t0: t + OSOITIN_LAHTEE, t1: t + OSOITIN_PERILLA, klikkaus: t + KLIKKAUS });

      await sivu.mouse.move(x, y);
      await sivu.waitForTimeout(400);
      await kuva(t + OSOITIN_PERILLA - 0.05);
      const linkki = await kohde.evaluate((n) => !!n.closest('a[href]'));
      const ennen = sivu.url();
      await sivu.mouse.click(x, y);
      if (linkki) {
        /* Sivunvaihto: ensin sivuston oma odotustila (päätös 41),
           sitten uusi sivu, kun osoite on vaihtunut. */
        await sivu.waitForTimeout(300);
        await kuva(t + KLIKKAUS + 0.04);
        await sivu.waitForURL((u) => u.href !== ennen, { timeout: 8000 });
        await odotaRauha(sivu);
        /* Uusi sivu alkaa omasta vierityskohdastaan, joten kamera
           hyppää siihen samalla hetkellä kuin kuva vaihtuu. */
        const hetki = t + KLIKKAUS + SIVUNVAIHTO;
        kamera.push({ ...kamera.at(-1), vy: await vieritys(), t0: hetki, t1: hetki + 0.001 });
        await kuva(hetki);
      } else {
        await odotaRauha(sivu);
        await kuva(t + KLIKKAUS + 0.04);
      }
    }
    t += vaihe.s;
  }
  await sivu.close();

  return {
    kesto: t + LOPPU,
    tunniste: kohtaus.tunniste,
    osoiteteksti: kohtaus.osoiteteksti,
    kuvat,
    kamera,
    kursori,
    otsikot,
  };
}

async function kokoa(selain, id, aikajana, osoite) {
  const sivu = await selain.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
  await sivu.goto(`${osoite}/video/sommittelu.html`);
  await sivu.evaluate((a) => window.piirra.alusta(a), aikajana);

  const tiedosto = join(ULOS, `${id}.mp4`);
  const ffmpeg = spawn(ffmpegPolku, [
    '-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-vf', 'scale=1920:1080:flags=lanczos',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart', tiedosto,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });
  const valmis = new Promise((ok, virhe) =>
    ffmpeg.on('close', (koodi) => (koodi === 0 ? ok() : virhe(new Error(`ffmpeg: ${koodi}`)))),
  );

  const ruutuja = Math.round(aikajana.kesto * FPS);
  for (let i = 0; i < ruutuja; i++) {
    await sivu.evaluate((t) => window.piirra.ruutu(t), i / FPS);
    const ruutu = await sivu.screenshot({ type: 'jpeg', quality: 94 });
    if (!ffmpeg.stdin.write(ruutu)) await new Promise((ok) => ffmpeg.stdin.once('drain', ok));
    if (i % FPS === 0) process.stdout.write(`\r${id}: ${Math.round((i / ruutuja) * 100)} %`);
  }
  ffmpeg.stdin.end();
  await valmis;
  await sivu.close();
  console.log(`\r${id}: ${tiedosto}`);
}

/** Kohtaukset peräkkäin yhdeksi videoksi. Jokainen kohtaus alkaa ja
    päättyy pohjaväriin, joten leikkaus ei näy. */
function yhdista(idt) {
  const lista = join(ULOS, 'kohtaukset.txt');
  writeFileSync(lista, idt.map((id) => `file '${id}.mp4'`).join('\n'));
  const tiedosto = join(ULOS, 'demo.mp4');
  const ajo = spawnSync(ffmpegPolku, [
    '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lista,
    '-c', 'copy', '-movflags', '+faststart', tiedosto,
  ], { stdio: 'inherit' });
  if (ajo.status !== 0) throw new Error('Kohtausten yhdistäminen epäonnistui');
  console.log(`demo: ${tiedosto}`);
}

const valitut = process.argv.slice(2);
const ajettavat = valitut.length ? kohtaukset.filter((k) => valitut.includes(k.id)) : kohtaukset;
if (!ajettavat.length) {
  console.error(`Ei kohtausta: ${valitut.join(', ')}. Vaihtoehdot: ${kohtaukset.map((k) => k.id).join(', ')}`);
  process.exit(1);
}

if (ajettavat.some((k) => k.lahde === 'storybook')) varmistaStorybook();
if (ajettavat.some((k) => k.lahde === 'sivusto')) varmistaSivusto();
const storybook = await palvele(STORYBOOK);
const sivusto = await palvele(SIVUSTO);
const repo = await palvele(JUURI);
const selain = await chromium.launch();
try {
  for (const kohtaus of ajettavat) {
    const aikajana = await tallenna(selain, kohtaus, { storybook: storybook.osoite, sivusto: sivusto.osoite });
    await kokoa(selain, kohtaus.id, aikajana, repo.osoite);
  }
  if (!valitut.length) yhdista(ajettavat.map((k) => k.id));
} finally {
  await selain.close();
  storybook.palvelin.close();
  sivusto.palvelin.close();
  repo.palvelin.close();
}
