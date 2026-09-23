#!/usr/bin/env node
/**
 * Kuvaputki — postilaatikosta julkaisuun
 * ---------------------------------------------------------------
 * Kolme kansiota, kolme eri roolia:
 *
 *   kuvat/uudet/     Postilaatikko. Pudota tänne mitä tahansa.
 *                    Tyhjenee ajossa. Ei repossa.
 *   kuvat/           Normalisoidut lähteet, yksi per paikka. Repossa.
 *   public/kuva/     Rajatut ja pakatut johdannaiset. Ei repossa,
 *                    vaan generoidaan buildissa.
 *
 * Lähde säilytetään **rajaamattomana**. Rajaus on johdannaisen
 * ominaisuus, ei lähteen: jos kuvasuhde muuttuu sisällössä, uusi
 * rajaus lasketaan samasta lähteestä eikä kuvaa tarvitse hankkia
 * uudelleen. Rajattu lähde olisi tie yhteen suuntaan.
 *
 * Kohdistus on tunnisteella. Tiedosto `kuvat/uudet/colliers-hero.png`
 * menee paikkaan jonka `id` on `colliers-hero`. Paikat luetaan
 * sisällöstä, ei ylläpidetä erikseen — ks. paikat().
 *
 * `hero` saa kolme rajausta, koska sen kuvasuhde vaihtuu
 * breakpointeittain (4:5 → 16:9 → 21:9, styles/base.css). Yksi rajaus
 * olisi joko kirjeenä mobiilissa tai leikkaisi laidat työpöydällä.
 *
 * Aja:  npm run kuvat
 * CI:   npm run check:kuvat
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, extname, join } from 'node:path';
import sharp from 'sharp';

export const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const POSTILAATIKKO = join(root, 'kuvat/uudet');
const LAHTEET = join(root, 'kuvat');
const JULKAISU = join(root, 'public/kuva');
export const MANIFESTI = join(root, 'content/media.generated.json');

/** Lähteen enimmäismitta pitkältä sivulta. Yli menevä on arkistoa. */
const LAHDE_MAX = 2800;

/**
 * Lähteiden tallennusmuoto: häviötön WebP.
 *
 * Häviötön tarkoittaa bitilleen samaa kuvaa kuin PNG, joten
 * uudelleenrajaus ei kasaa pakkausvirhettä — lähde saa olla lähde.
 * Tiedostot ovat mitattuna 32–60 % pienempiä: kahdeksantoista kuvan
 * repo olisi PNG:nä noin 27 MB ja tällä noin 15 MB.
 *
 * Pudotettavan tiedoston muodolla ei ole väliä. Tämä on se muoto
 * johon se muunnetaan kerran, kun se otetaan postilaatikosta.
 */
const LAHDEPAATE = '.webp';

/** Leveysportaat. Karsitaan lähteen mukaan — ei venytetä ylöspäin. */
const PORTAAT = [480, 800, 1200, 1600, 2000, 2800];

/** Kuvasuhteet numeroina. `hero` on kolme, ks. tiedoston alku. */
const SUHTEET = {
  hero: [
    { nimi: 'base', suhde: 4 / 5, media: null },
    { nimi: 'sm', suhde: 16 / 9, media: '(min-width: 600px)' },
    { nimi: 'lg', suhde: 21 / 9, media: '(min-width: 900px)' },
  ],
  '4:3': [{ nimi: 'base', suhde: 4 / 3, media: null }],
  '4:5': [{ nimi: 'base', suhde: 4 / 5, media: null }],
  '3:4': [{ nimi: 'base', suhde: 3 / 4, media: null }],
  '1:1': [{ nimi: 'base', suhde: 1, media: null }],
};

const KUVAPAATTEET = ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.tif', '.tiff', '.heic'];
const VIDEOPAATTEET = ['.mp4', '.mov', '.m4v', '.webm'];

/* ---- paikat sisällöstä ---------------------------------------------
   Syvähaku eikä lohkotyyppien luettelo: uusi lohkotyyppi jossa on
   kuva löytyy automaattisesti. Luetteloitu versio olisi unohtunut
   päivittää, ja puuttuva paikka ei kaada mitään — se vain jäisi
   ilman kuvaa hiljaa.                                              */

export async function paikat() {
  const moduulit = await Promise.all([
    import(join(root, 'content/cases/fi.ts')),
    import(join(root, 'content/work/fi.ts')),
    import(join(root, 'content/kuvat.ts')),
  ]);

  const loydetyt = new Map();
  const kayty = new Set();

  /* Omistaja ja lohko kulkevat mukana syvyyshaussa, jotta listaus voi
     kertoa MISSÄ paikka on eikä vain että se on olemassa. Pelkkä
     tunniste ei auta ketään joka yrittää nimetä tiedostoa. */
  const kaiva = (solmu, omistaja, lohko) => {
    if (!solmu || typeof solmu !== 'object' || kayty.has(solmu)) return;
    kayty.add(solmu);
    if (Array.isArray(solmu)) return solmu.forEach((x) => kaiva(x, omistaja, lohko));

    const oma = typeof solmu.missa === 'string'
      ? solmu.missa
      : typeof solmu.slug === 'string' && typeof solmu.title === 'string'
        ? solmu.title
        : omistaja;
    const omaLohko = typeof solmu.kind === 'string' && solmu.kind !== 'image'
      ? solmu.kind
      : lohko;

    if (typeof solmu.id === 'string' && typeof solmu.ratio === 'string') {
      if (loydetyt.has(solmu.id)) throw new Error(`Kaksi paikkaa samalla id:llä: ${solmu.id}`);
      loydetyt.set(solmu.id, {
        /* Löytymisjärjestys = sivun järjestys. Manifesti pysyy
           aakkosissa jotta sen diff on luettava, mutta listaus
           näytetään tässä järjestyksessä — kuvateksti "sama rajaus
           kuin vasemmalla" on hyödytön jos pari on eri kohdassa. */
        jarjestys: loydetyt.size,
        id: solmu.id,
        ratio: solmu.ratio,
        caption: solmu.caption ?? '',
        missa: oma ?? '(tuntematon)',
        tarveLeveys: solmu.tarveLeveys,
        lohko: omaLohko ?? 'media',
        vertailu: solmu.kind === 'compare',
        video: solmu.kind === 'video',
      });
    }
    Object.values(solmu).forEach((x) => kaiva(x, oma, omaLohko));
  };

  for (const m of moduulit) Object.values(m).forEach((x) => kaiva(x, undefined, undefined));

  const lista = [...loydetyt.values()];
  for (const p of lista) {
    if (!SUHTEET[p.ratio]) throw new Error(`Paikka ${p.id}: tuntematon kuvasuhde ${p.ratio}`);
  }
  /* Numero on sivujärjestys, ei tunniste. Se näkyy placeholderissa
     ja kelpaa tiedostonimeksi, mutta putki nimeää tiedoston heti
     tunnisteeksi — numero ei jää elämään mihinkään. Ks. numerolla(). */
  for (const paikka of lista) paikka.numero = paikka.jarjestys + 1;

  return lista.sort((a, b) => a.id.localeCompare(b.id));
}

/* ---- lähdetiedostot ------------------------------------------------ */

/** Paikan lähteet levyllä. Vertailupari tarvitsee kaksi. */
export function lahteet(paikka) {
  const nimet = paikka.vertailu ? [`${paikka.id}-ennen`, `${paikka.id}-jalkeen`] : [paikka.id];
  return nimet.map((nimi) => {
    const osuma = readdirSync(LAHTEET, { withFileTypes: true }).find(
      (d) =>
        d.isFile() &&
        !d.name.startsWith('.') &&
        !d.name.endsWith('.json') &&
        d.name.slice(0, d.name.lastIndexOf('.')) === nimi,
    )?.name;
    return { nimi, tiedosto: osuma ? join(LAHTEET, osuma) : null };
  });
}


/* ---- postilaatikko --------------------------------------------------
   Tiedostonimi normalisoidaan kevyesti: pienet kirjaimet, välit ja
   alaviivat viivoiksi, ja lopusta pois selaimen ja Finderin lisäämät
   kaksoiskappalemerkinnät (" 2", "(1)", "-kopio"). Fuzzy-haku
   nimien kesken olisi voinut sijoittaa kuvan väärään paikkaan
   hiljaa, joten tunnistamaton tiedosto raportoidaan eikä arvata.  */

/**
 * Tiedostonimen ehdokkaat paikan tunnisteeksi, paras ensin.
 *
 * Ensimmäinen on pelkkä siivous: pienet kirjaimet, ääkköset pois,
 * välit ja alaviivat viivoiksi. Toinen poistaa lisäksi lopusta
 * Finderin ja selaimen kaksoiskappalemerkinnän (" 2", "(1)",
 * "-kopio").
 *
 * Järjestys on olennainen. Kaksoiskappalemerkinnän poisto nappaa myös
 * aidon numeron: paikka `colliers-viikko-1` on olemassa, ja oikein
 * nimetty `colliers-viikko-1.png` olisi lyhentynyt muotoon
 * `colliers-viikko` eikä olisi osunut mihinkään. Siksi tarkka nimi
 * kokeillaan ensin ja lyhennystä vasta jos se ei kelvannut.
 */
function nimiehdokkaat(tiedosto) {
  const pohja = tiedosto
    .slice(0, tiedosto.lastIndexOf('.'))
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[\s_]+/g, '-');

  const lyhennetty = pohja.replace(/[-\s]*(kopio|copy|\(\d+\)|\d)$/u, '').replace(/-+$/, '');

  return lyhennetty && lyhennetty !== pohja ? [pohja, lyhennetty] : [pohja];
}

/**
 * Siirtää postilaatikon tiedostot normalisoiduiksi lähteiksi.
 * Kuva skaalataan enintään LAHDE_MAX:iin mutta EI rajata.
 */
/**
 * Numero tiedostonimenä → paikan lähdenimi.
 *
 * Numero on sivujärjestys, ei tunniste. Se on tarkoituksella
 * kertakäyttöinen: tiedosto nimetään heti tunnisteeksi, joten numero
 * ei jää mihinkään elämään. Näin sivun uudelleenjärjestys ei voi
 * muuttaa jo paikallaan olevan kuvan merkitystä.
 *
 * Riski jää silti siihen hetkeen kun katsot sivua ja ajat komennon:
 * jos välissä lisätään kuvapaikka, numero osoittaa toiseen kohtaan.
 * Siksi putki tulostaa mihin numero osui ja minkä kuvatekstin kanssa
 * — väärä osuma on tarkoitus nähdä heti, ei kuukauden päästä.
 *
 * Vertailupari tarvitsee kaksi tiedostoa, joten pelkkä numero ei
 * riitä: `7-ennen` ja `7-jalkeen`.
 */
function numeroon(tiedosto, selita = false) {
  const kanta = tiedosto.slice(0, tiedosto.lastIndexOf('.')).trim().toLowerCase();
  const osuma = /^(\d{1,3})(?:[-\s]*(ennen|jalkeen|jälkeen))?$/u.exec(kanta);
  if (!osuma) return null;

  const paikka = numerolista.find((p) => p.numero === Number(osuma[1]));
  if (!paikka) {
    return selita ? `numero ${osuma[1]} — ei sellaista paikkaa` : null;
  }

  const puoli = osuma[2]?.replace('ä', 'a');

  if (paikka.vertailu && !puoli) {
    return selita
      ? `numero ${osuma[1]} on vertailupari — nimeä ${osuma[1]}-ennen ja ${osuma[1]}-jalkeen`
      : null;
  }

  /* Puoli annettu paikkaan joka ei ole vertailupari: älä hyväksy
     hiljaa. Ilman tätä `19-ennen` olisi mennyt paikkaan 19 ikään kuin
     puolta ei olisi kirjoitettu, ja kuva olisi päätynyt väärään
     kohtaan siinä uskossa että se on pari. */
  if (!paikka.vertailu && puoli) {
    return selita
      ? `numero ${osuma[1]} (${paikka.id}) ei ole vertailupari — jätä "-${puoli}" pois`
      : null;
  }

  return selita ? null : { nimi: puoli ? `${paikka.id}-${puoli}` : paikka.id, paikka };
}

/** Paikkalista numeroiden selvittämistä varten. Asetetaan rakenna():ssa. */
let numerolista = [];

async function tyhjennaPostilaatikko(kaikkiNimet) {
  if (!existsSync(POSTILAATIKKO)) return { otetut: [], tuntemattomat: [] };

  const otetut = [];
  const tuntemattomat = [];

  for (const tiedosto of readdirSync(POSTILAATIKKO)) {
    if (tiedosto.startsWith('.')) continue;
    const polku = join(POSTILAATIKKO, tiedosto);
    const pate = extname(tiedosto).toLowerCase();
    const ehdokkaat = nimiehdokkaat(tiedosto);
    const numerolla = numeroon(tiedosto);
    const nimi = ehdokkaat.find((e) => kaikkiNimet.has(e)) ?? numerolla?.nimi;

    if (!nimi) {
      tuntemattomat.push({
        tiedosto,
        arvattu: numeroon(tiedosto, true) ?? ehdokkaat.join(' tai '),
      });
      continue;
    }

    if (KUVAPAATTEET.includes(pate)) {
      const kuva = sharp(polku, { failOn: 'error' }).rotate();
      const meta = await kuva.metadata();
      const pitka = Math.max(meta.width, meta.height);
      const kohde = join(LAHTEET, `${nimi}${LAHDEPAATE}`);
      await (pitka > LAHDE_MAX
        ? kuva.resize({ width: meta.width >= meta.height ? LAHDE_MAX : null,
                        height: meta.height > meta.width ? LAHDE_MAX : null })
        : kuva
      )
        .webp({ lossless: true, effort: 6 })
        .toFile(kohde);
      /* Vanha lähde toisella päätteellä pois, ettei kahta jää. */
      for (const vanha of readdirSync(LAHTEET)) {
        if (vanha.slice(0, vanha.lastIndexOf('.')) === nimi && !vanha.endsWith(LAHDEPAATE)) {
          rmSync(join(LAHTEET, vanha));
        }
      }
      otetut.push({ tiedosto, nimi, tyyppi: 'kuva', mitat: `${meta.width}×${meta.height}`, numerolla });
    } else if (VIDEOPAATTEET.includes(pate)) {
      const kohde = join(LAHTEET, `${nimi}.mp4`);
      /* Lähdevideo säilytetään alkuperäisenä koodekkina jos se on jo
         mp4/h264; muuten muunnetaan kerran, jottei arkistoon jää
         muotoa jota selaimet eivät lue. */
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', polku,
        '-c:v', 'libx264', '-crf', '18', '-preset', 'slow', '-pix_fmt', 'yuv420p',
        '-an', '-vf', `scale='min(${LAHDE_MAX},iw)':-2`, kohde]);
      otetut.push({ tiedosto, nimi, tyyppi: 'video', mitat: '', numerolla });
    } else {
      tuntemattomat.push({ tiedosto, arvattu: `tuntematon pääte ${pate}` });
      continue;
    }

    rmSync(polku);
  }

  return { otetut, tuntemattomat };
}

/* ---- johdannaiset --------------------------------------------------- */

/**
 * Mistä kohtaa lähdettä rajataan.
 *
 * Oletus on keskitys, koska se on ennustettava ja sama minkä CSS:n
 * `object-fit: cover` tekisi. Sharpin `attention` valitsisi alueen
 * entropian mukaan, mikä siirsi testikuvassa kohteen pois keskeltä —
 * kuvakaappauksessa se voi leikata juuri sen kohdan jota kuva on
 * tarkoitettu näyttämään.
 *
 * Ohitus: `kuvat/<nimi>.json` sisältöä `{ "rajaus": "top" }`.
 * Sallitut arvot ovat sharpin sijainnit: top, right top, right,
 * right bottom, bottom, left bottom, left, left top, centre.
 */
function rajauskohta(nimi) {
  return asetukset(nimi).rajaus ?? 'centre';
}

/** Alue sharpin extract-muotoon, nimet suomeksi sivutiedostossa. */
function alueeksi({ x = 0, y = 0, leveys, korkeus }) {
  if (!leveys || !korkeus) throw new Error('alue: leveys ja korkeus ovat pakollisia');
  return { left: Math.round(x), top: Math.round(y), width: Math.round(leveys), height: Math.round(korkeus) };
}

/** Lähteen omat asetukset, jos sellaiset on annettu. */
function asetukset(nimi) {
  const sivu = join(LAHTEET, `${nimi}.json`);
  if (!existsSync(sivu)) return {};
  return JSON.parse(readFileSync(sivu, 'utf8'));
}

/**
 * Paljonko lohko tarvitsee leveyttä. Karkea arvio case.css:n
 * grideistä, kaksinkertaisena koska näytöt ovat kaksinkertaisia.
 * Tarkkuutta ei tarvita — kyse on siitä huomataanko että lähde on
 * selvästi liian pieni.
 */
const LOHKOLEVEYS = { media: 2736, compare: 880, pair: 1344, trio: 880 };

/**
 * Leveysportaat yhdelle rajaukselle.
 *
 * Portaita ei venytetä lähdettä suuremmiksi — ylöspäin skaalattu kuva
 * on pelkkää tavua. Lähteen oma leveys otetaan mukaan omana
 * portaanaan jos se jää portaiden väliin: 742 pikselin kuva olisi
 * muuten tarjoiltu vain 480:nä, eli se olisi näytetty pehmeämpänä
 * kuin mitä käytettävissä oli.
 */
function portaat(maxLeveys) {
  const sopivat = PORTAAT.filter((w) => w <= maxLeveys);
  const suurin = sopivat[sopivat.length - 1] ?? 0;
  if (maxLeveys > suurin * 1.05) sopivat.push(maxLeveys);
  return sopivat;
}

/**
 * Rajaa ja pakkaa yhden lähteen kaikkiin kokoihin ja muotoihin.
 *
 * `rajaa: false` säilyttää lähteen oman kuvasuhteen. Vertailupari
 * tarvitsee sen: BeforeAfter varaa tilan kuvan luonnollisista
 * mitoista, ei sisällössä ilmoitetusta suhteesta. Rajattuna
 * puhelinkaappauksesta olisi kadonnut kolmannes ruudusta.
 */
async function teeKuva(nimi, lahde, ratio, { rajaa = true, kirjoita = true } = {}) {
  const omat = asetukset(nimi);
  const sovita = omat.sovita === true;
  const hukat = [];

  /* Alue: taiteellinen rajaus datana, ei tiedostoon poltettuna.
     Puhelinkaappaus on tyypillisesti 0,46-suhteinen, eikä se mahdu
     4:5-laatikkoon kokonaisena eikä rajattuna järkevästi — aihe on
     yleensä yksi paneeli, ei koko ruutu. Alue kertoo mikä osa
     lähteestä on kuva.

     Lähde säilyy koskemattomana: alueen voi muuttaa milloin tahansa,
     ja kuvasuhteen vaihtuessa uusi rajaus lasketaan samasta
     alkuperäisestä. Tiedostoon leikattu rajaus olisi lopullinen.

     Muoto: { "alue": { "x": 0, "y": 300, "leveys": 622, "korkeus": 777 } } */
  const lahdeKuva = () => (omat.alue ? sharp(lahde).extract(alueeksi(omat.alue)) : sharp(lahde));
  const meta = omat.alue
    ? { width: omat.alue.leveys, height: omat.alue.korkeus }
    : await sharp(lahde).metadata();
  const kohta = rajauskohta(nimi);
  const ulos = [];

  const rajaukset = rajaa
    ? SUHTEET[ratio]
    : [{ nimi: 'base', suhde: meta.width / meta.height, media: null }];

  for (const { nimi: koko, suhde, media } of rajaukset) {
    /* Rajattu alue lähteestä: koko leveys tai koko korkeus, kumpi
       mahtuu. Tästä johdetaan suurin mahdollinen leveys. */
    const maxLeveys = rajaa
      ? Math.round(Math.min(meta.width, meta.height * suhde))
      : meta.width;

    const leveydet = portaat(maxLeveys);

    if (kirjoita) {
      for (const w of leveydet) {
        const h = Math.round(w / suhde);
        for (const [muoto, asetus] of [['avif', { quality: 55, effort: 5 }], ['webp', { quality: 78 }]]) {
          await lahdeKuva()
            .resize(
              w,
              h,
              /* `sovita` mahduttaa koko kuvan laatikkoon eikä rajaa
                 mitään. Reunat jäävät läpinäkyviksi, jolloin
                 .media--kuva-laatikon taustaväri näkyy läpi ja seuraa
                 teemaa — taustan polttaminen tiedostoon tekisi
                 vaaleasta reunasta pysyvän myös tummassa teemassa. */
                sovita
                ? { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }
                : { fit: 'cover', position: kohta },
            )
            .toFormat(muoto, asetus)
            .toFile(join(JULKAISU, `${nimi}-${koko}-${w}.${muoto}`));
        }
      }
    }

    ulos.push({
      koko,
      media,
      suhde: Number(suhde.toFixed(4)),
      leveydet,
      leveys: leveydet[leveydet.length - 1],
      korkeus: Math.round(leveydet[leveydet.length - 1] / suhde),
    });

    /* Rajauksen hukka: paljonko lähteestä jää pois. Ei virhe, mutta
       42 % pois leikattua korkeutta on päätös jonka pitää olla
       tiedossa eikä vahinko. */
    if (rajaa && !sovita) {
      const lahdeSuhde = meta.width / meta.height;
      const hukka =
        lahdeSuhde < suhde
          ? 1 - (meta.width / suhde) / meta.height /* korkeutta pois */
          : 1 - meta.height * suhde / meta.width; /* leveyttä pois */
      if (hukka > 0.2) {
        hukat.push({
          nimi,
          koko,
          suunta: lahdeSuhde < suhde ? 'korkeudesta' : 'leveydestä',
          osuus: hukka,
          lahdeSuhde,
          kohdeSuhde: suhde,
          kohta,
        });
      }
    }
  }

  ulos.hukat = hukat;
  ulos.lahdeLeveys = meta.width;
  return ulos;
}

/** Video: mp4 + webm + julistekuva. */
async function teeVideo(nimi, lahde, { kirjoita = true } = {}) {
  const koko = JSON.parse(
    execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0',
      '-show_entries', 'stream=width,height', '-of', 'json', lahde]).toString(),
  ).streams[0];
  if (!kirjoita) return { leveys: koko.width, korkeus: koko.height };

  const leveys = 1600;
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', lahde,
    '-c:v', 'libx264', '-crf', '23', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-an',
    '-movflags', '+faststart', '-vf', `scale='min(${leveys},iw)':-2`,
    join(JULKAISU, `${nimi}.mp4`)]);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', lahde,
    '-c:v', 'libvpx-vp9', '-crf', '34', '-b:v', '0', '-an',
    '-vf', `scale='min(${leveys},iw)':-2`,
    join(JULKAISU, `${nimi}.webm`)]);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', lahde,
    '-frames:v', '1', '-vf', `scale='min(${leveys},iw)':-2`,
    join(JULKAISU, `${nimi}-juliste.png`)]);
  await sharp(join(JULKAISU, `${nimi}-juliste.png`))
    .webp({ quality: 70 })
    .toFile(join(JULKAISU, `${nimi}-juliste.webp`));
  rmSync(join(JULKAISU, `${nimi}-juliste.png`));
  return { leveys: koko.width, korkeus: koko.height };
}

/* ---- logot ----------------------------------------------------------
   Logot eivät ole sisällön kuvapaikkoja vaan oma rekisterinsä
   (content/logos.ts), mutta sama periaate pätee: lähde repoon,
   johdannainen laskettuna.

   Ne piirretään CSS-maskina, joten vain alfakanava merkitsee — väri
   tulee tokenista. Siksi rasteri pakataan yksikanavaiseksi: väriarvot
   olisivat tavuja joita mikään ei lue.

   Rasteri tehdään näyttökorkeuteen × 4, mikä kattaa 3× näytön ja
   kohtuullisen zoomin. Alkuperäiset olivat 5–8× ylimitoitettuja:
   1480 × 204 pikselin PNG piirrettiin 15 pikselin korkuisena.

   SVG kopioidaan sellaisenaan. Jos `kuvat/logo/<nimi>.svg` on
   olemassa, se voittaa PNG:n — virallinen vektori on aina parempi
   kuin pienennetty rasteri, eikä sitä kannata jäljittää koneella:
   kirjainmuodot vääristyisivät.                                    */

const LOGOKANSIO = join(LAHTEET, 'logo');
const LOGOJULKAISU = join(JULKAISU, 'logo');
const LOGOTARKKUUS = 4;

async function teeLogot({ kirjoita = true } = {}) {
  const { logos } = await import(join(root, 'content/logos.ts'));
  if (kirjoita) mkdirSync(LOGOJULKAISU, { recursive: true });

  const ulos = {};
  for (const logo of logos) {
    const kanta = logo.file;
    const svg = join(LOGOKANSIO, `${kanta}.svg`);
    const rasteri = ['.webp', '.png']
      .map((pate) => join(LOGOKANSIO, `${kanta}${pate}`))
      .find((polku) => existsSync(polku));

    if (existsSync(svg)) {
      const meta = await sharp(svg).metadata();
      if (kirjoita) writeFileSync(join(LOGOJULKAISU, `${kanta}.svg`), readFileSync(svg));
      ulos[kanta] = { muoto: 'svg', leveys: meta.width, korkeus: meta.height };
      continue;
    }

    if (!rasteri) {
      throw new Error(`Logo ${logo.name}: lähdettä ei ole (${kanta}.svg | .webp | .png)`);
    }

    const meta = await sharp(rasteri).metadata();
    const korkeus = Math.min(meta.height, logo.height * LOGOTARKKUUS);
    const leveys = Math.round((meta.width / meta.height) * korkeus);
    if (kirjoita) {
      await sharp(rasteri)
        .resize(leveys, korkeus)
        .extractChannel('alpha')
        .png({ compressionLevel: 9, palette: true })
        .toFile(join(LOGOJULKAISU, `${kanta}.png`));
    }
    ulos[kanta] = { muoto: 'png', leveys: meta.width, korkeus: meta.height };
  }
  return ulos;
}

/* ---- manifesti ------------------------------------------------------
   Pieni JSON jonka komponentti importtaa. Komponentti ei saa lukea
   levyä: se renderöidään myös Storybookissa ja selaintesteissä.    */

/**
 * Laskee manifestin ja valinnaisesti kirjoittaa johdannaiset.
 *
 * `kirjoita: false` lukee vain lähteiden metatiedot — se on sama
 * laskenta ilman enkoodausta, ja siksi tarkistus ei voi päätyä eri
 * tulokseen kuin generointi.
 */
export async function rakenna({ kirjoita = true } = {}) {
  mkdirSync(LAHTEET, { recursive: true });
  if (kirjoita) mkdirSync(JULKAISU, { recursive: true });

  const lista = await paikat();
  numerolista = lista;
  const kaikkiNimet = new Set(lista.flatMap((p) => lahteet(p).map((l) => l.nimi)));
  const posti = kirjoita
    ? await tyhjennaPostilaatikko(kaikkiNimet)
    : { otetut: [], tuntemattomat: [] };

  const manifesti = {};
  const puuttuvat = [];
  const huomiot = [];

  for (const paikka of lista) {
    const omat = lahteet(paikka);
    if (omat.some((l) => !l.tiedosto)) {
      puuttuvat.push(paikka);
      continue;
    }

    if (paikka.video) {
      const { leveys, korkeus } = await teeVideo(paikka.id, omat[0].tiedosto, { kirjoita });
      manifesti[paikka.id] = { tyyppi: 'video', leveys, korkeus };
      continue;
    }

    const osat = {};
    for (const { nimi, tiedosto } of omat) {
      const tulos = await teeKuva(nimi, tiedosto, paikka.ratio, {
        rajaa: !paikka.vertailu,
        kirjoita,
      });

      /* Rajaus leikkaa yli viidenneksen: kerro paljonko ja mistä. */
      for (const h of tulos.hukat) {
        huomiot.push({
          nimi,
          paikka,
          laji: 'rajaus',
          teksti:
            `rajaus poistaa ${Math.round(h.osuus * 100)} % ${h.suunta} ` +
            `(lähde ${h.lahdeSuhde.toFixed(2)}, paikka ${paikka.ratio} = ${h.kohdeSuhde.toFixed(2)}` +
            `${h.koko !== 'base' ? `, ${h.koko}-koko` : ''})`,
        });
      }

      /* Lähde kapeampi kuin mitä paikka piirtyy kahden pikselin
         näytöllä: kuva näkyy pehmeänä eikä mikään muu kerro siitä. */
      const tarve = paikka.tarveLeveys ?? LOHKOLEVEYS[paikka.lohko] ?? 1344;
      if (tulos.lahdeLeveys < tarve * 0.75) {
        huomiot.push({
          nimi,
          paikka,
          laji: 'tarkkuus',
          teksti: `lähde on ${tulos.lahdeLeveys} px leveä, paikka tarvitsee noin ${tarve} px`,
        });
      }

      osat[nimi] = tulos;
    }
    manifesti[paikka.id] = { tyyppi: paikka.vertailu ? 'vertailu' : 'kuva', osat };
  }

  const logot = await teeLogot({ kirjoita });

  /* Numerot kaikille paikoille, myös tyhjille: placeholder tarvitsee
     numeronsa nimenomaan silloin kun kuvaa ei vielä ole. */
  const numerot = Object.fromEntries(lista.map((p) => [p.id, p.numero]));

  /* Lähteet joille ei ole paikkaa: nimi on kirjoitettu väärin tai
     paikka on poistettu sisällöstä. Kumpikin on hiljainen vika —
     tiedosto on olemassa mutta ei näy missään. */
  const tunnetut = new Set(
    lista.flatMap((p) => lahteet(p).map((l) => l.nimi)),
  );
  const orvot = readdirSync(LAHTEET, { withFileTypes: true })
    /* Vain tiedostot: `uudet/` ja `logo/` ovat kansioita, ja
       `<id>.json` on rajausohje eikä lähde. Ilman tyyppisuodatusta
       kansio "logo" olisi tulkittu lähteeksi nimeltä "log", koska
       päätteen katkaisu olettaa pisteen. */
    .filter((d) => d.isFile() && !d.name.startsWith('.') && !d.name.endsWith('.json'))
    .map((d) => (d.name.includes('.') ? d.name.slice(0, d.name.lastIndexOf('.')) : d.name))
    .filter((n) => !tunnetut.has(n));

  return { manifesti: { paikat: manifesti, numerot, logot }, lista, puuttuvat, posti, orvot, huomiot };
}

/* ---- suoraan ajettaessa --------------------------------------------- */

if (import.meta.url === `file://${process.argv[1]}`) {
  const { manifesti, lista, puuttuvat, posti, huomiot } = await rakenna();
  writeFileSync(MANIFESTI, JSON.stringify(manifesti, null, 2) + '\n');

  if (posti.otetut.length) {
    console.log(`\n✓ Postilaatikosta otettu ${posti.otetut.length}:`);
    for (const o of posti.otetut) {
      console.log(`    ${o.tiedosto}  →  kuvat/${o.nimi}  ${o.mitat}`);
      /* Numerolla pudotettu: näytä mihin se osui ja millä
         kuvatekstillä, jotta väärä numero näkyy heti. */
      if (o.numerolla) console.log(`      ↳ ${o.numerolla.paikka.missa}: ${o.numerolla.paikka.caption}`);
    }
  }

  if (posti.tuntemattomat.length) {
    console.log(`\n!  Tunnistamatta ${posti.tuntemattomat.length} — jätetty postilaatikkoon:`);
    for (const t of posti.tuntemattomat) console.log(`    ${t.tiedosto}   (tulkittu: ${t.arvattu})`);
    console.log('\n   Vapaat paikat:');
    for (const p of puuttuvat) console.log(`    ${p.id.padEnd(22)} ${p.ratio.padEnd(6)} ${p.caption}`);
  }

  if (huomiot.length) {
    console.log(`\n!  Huomioita ${huomiot.length}:`);
    for (const h of huomiot) {
      console.log(`    ${h.paikka.numero}  ${h.nimi}`);
      console.log(`       ${h.teksti}`);
      if (h.laji === 'rajaus') {
        console.log(`       korjaa: kuvat/${h.nimi}.json`);
        console.log(`         { "sovita": true }        koko kuva laatikkoon, ei rajausta`);
        console.log(`         { "rajaus": "top" }       pidä yläosa`);
        console.log(`         { "alue": { "y": 300, "leveys": 622, "korkeus": 777 } }`);
        console.log(`                                   rajaa alue lähteestä`);
        console.log(`       tai vaihda paikan kuvasuhde sisällössä.`);
      } else {
        console.log(`       korjaa: ota kuva uudelleen leveämpänä.`);
      }
    }
  }

  const valmiit = lista.length - puuttuvat.length;
  console.log(`\n✓ Kuvat rakennettu — ${valmiit}/${lista.length} paikkaa täynnä`);
  if (puuttuvat.length) {
    console.log(`  ${puuttuvat.length} paikkaa odottaa kuvaa. Mitkä ja mistä kohtaa sivua:`);
    console.log('  npm run kuvat:lista');
  }
  console.log();
}
