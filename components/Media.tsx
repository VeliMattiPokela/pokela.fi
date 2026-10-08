import manifesti from '@/content/media.generated.json';
import Video from './Video';

/**
 * Kuvapaikka.
 *
 * Kaksi tilaa, sama laatikko. Jos paikalla on kuva, tähän tulee kuva;
 * jos ei, raidoitettu paikanvaraaja ja kuvateksti siitä mikä kuva
 * tulee. Kuvasuhde tulee CSS:stä kummassakin tilassa, joten layout ei
 * liiku kun kuva ilmestyy — eikä Figman sivupohja vanhene.
 *
 * Nimi on `Media` eikä `Placeholder`, koska tämä on se paikka johon
 * kuva tulee — raidoitus on sen nykyinen tila, ei sen tarkoitus.
 *
 * Kuvasuhteista `hero` on ainoa rooli: se on ainoa jonka suhde
 * muuttuu breakpointeittain (4:5 → 16:9 → 21:9). Loput ovat
 * kiinteitä muotoja, joten ne on nimetty suhteellaan — muuten
 * listassa olisi kaksi eri logiikkaa.
 *
 * Tiedostot eivät ole tässä vaan `content/media.generated.json`:ssa,
 * jonka `npm run kuvat` kirjoittaa lähteistä. Manifesti importataan
 * eikä lueta levyltä: tämä komponentti renderöidään myös
 * Storybookissa ja selaintesteissä, joissa `node:fs` ei ole olemassa.
 */
export type Ratio = 'hero' | '4:3' | '4:5' | '3:4' | '1:1';

/**
 * Miten kuva istuu paikassaan: `levy` näyttää sen kokonaisena
 * taustalevyn keskellä, `taysi` täyttää paikan rajattuna. Arvo
 * kirjoitetaan sisältöön paikan viereen (kuten `ratio`), ja kuvaputki
 * rajaa sen mukaan. Hero on aina täysi.
 */
export type Esitys = 'levy' | 'taysi';

type Rajaus = {
  koko: string;
  media: string | null;
  suhde: number;
  leveydet: number[];
  leveys: number;
  korkeus: number;
};

type Merkinta =
  | { tyyppi: 'kuva'; esitys: Esitys; osat: Record<string, Rajaus[]> }
  | { tyyppi: 'vertailu'; osat: Record<string, Rajaus[]> }
  | { tyyppi: 'video'; leveys: number; korkeus: number };

const KUVAT = manifesti.paikat as unknown as Record<string, Merkinta>;
const NUMEROT = manifesti.numerot as unknown as Record<string, number>;
const MUODOT = manifesti.muodot as unknown as Record<string, { suhde: string; leveys: number }>;

/**
 * Näytetäänkö paikanvaraajan tunnistemerkintä.
 *
 * Vain kehityksessä. Merkintä on työkalu kuvien hankintaan, ei osa
 * sivua: julkaistussa sivustossa numero laatikon nurkassa näyttäisi
 * keskeneräiseltä silloinkin kun keskeneräisyys on raidoituksesta jo
 * selvää.
 */
const MERKINTA = process.env.NODE_ENV !== 'production';

/**
 * Paikan rajaukset, tai null jos paikka on yhä tyhjä.
 *
 * `osa` on lähteen nimi paikan sisällä. Tavallisella kuvalla se on
 * sama kuin id; vertailuparilla lähteitä on kaksi, `<id>-ennen` ja
 * `<id>-jalkeen`.
 */
export function rajaukset(id: string, osa: string = id): Rajaus[] | null {
  const merkinta = KUVAT[id];
  if (!merkinta || merkinta.tyyppi === 'video') return null;
  return merkinta.osat[osa] ?? null;
}

export const srcset = (nimi: string, r: Rajaus, muoto: string) =>
  r.leveydet.map((w) => `/kuva/${nimi}-${r.koko}-${w}.${muoto} ${w}w`).join(', ');

/** Yksi kuvalähde `<picture>`-elementtiin. */
export function Lahteet({ nimi, r, sizes }: { nimi: string; r: Rajaus; sizes: string }) {
  return (
    <>
      {['avif', 'webp'].map((muoto) => (
        <source
          key={muoto}
          {...(r.media ? { media: r.media } : {})}
          type={`image/${muoto}`}
          srcSet={srcset(nimi, r, muoto)}
          sizes={sizes}
        />
      ))}
    </>
  );
}

export default function Media({
  id,
  ratio = '4:3',
  caption,
  esitys,
  sizes = '100vw',
  priority = false,
}: {
  id?: string;
  ratio?: Ratio;
  /** Oletus tulee kuvaputken manifestista, joka lukee sen sisällöstä. */
  esitys?: Esitys;
  caption?: string;
  /** Kuinka leveänä kuva piirtyy. Lohko tietää sen, kuva ei. */
  sizes?: string;
  /** Näkyykö kuva heti auetessa. Vain sivun ensimmäiselle. */
  priority?: boolean;
}) {
  const luokka = `media media-${ratio.replace(':', '-')}`;
  const merkinta = id ? KUVAT[id] : undefined;

  if (merkinta?.tyyppi === 'video') {
    return (
      <div className={`${luokka} media--kuva media--video`}>
        <Video id={id!} leveys={merkinta.leveys} korkeus={merkinta.korkeus} caption={caption} />
      </div>
    );
  }

  const osat = id ? rajaukset(id) : null;

  if (!osat) {
    const numero = id ? NUMEROT[id] : undefined;
    const muoto = id ? MUODOT[id] : undefined;
    return (
      /* Ei role="img" eikä aria-label: tässä EI OLE kuvaa. Paikanvaraaja
         on laatikko johon kuva tulee myöhemmin, ja 20 paikkaa 24:stä on
         tällaisia. role="img" kertoisi ruudunlukijalle että sisältöä on
         — ja aria-label lukisi sille kuvauksen kuvasta jota ei ole.
         Näkyvä kuvateksti jää, ja se luetaan tavallisena tekstinä.
         Oikea kuva alempana käyttää <img alt=…>, kuten pitääkin. */
      <div className={luokka}>
        <span className="media__teksti">
          {MERKINTA && numero ? (
            <span className="meta meta--s media__merkinta" aria-hidden="true">
              <span className="media__numero">{numero}</span>
              <span className="media__tunnus">{id}</span>
              {/* Muoto ja vähimmäisleveys kertovat millainen kuva
                  tähän kuuluu — sen näkee silloin kun katsoo paikkaa,
                  eikä sitä tarvitse käydä hakemassa luettelosta. */}
              {muoto ? (
                <span className="media__muoto">
                  {muoto.suhde} · ≥{muoto.leveys} px
                </span>
              ) : null}
            </span>
          ) : null}
          {caption ? <span className="meta meta--s">{caption}</span> : null}
        </span>
      </div>
    );
  }

  /* Tarkin media-ehto ensin: selain ottaa ensimmäisen osuvan. Lista
     on lähteessä pienimmästä suurimpaan, joten se käännetään. */
  const jarjestetyt = [...osat].reverse();
  const perus = osat[0];
  const levy =
    ratio !== 'hero' && merkinta?.tyyppi === 'kuva' && (esitys ?? merkinta.esitys) === 'levy';

  /* Levy: kuva kokonaisena taustalevyn keskellä (ks. esitys() kuvat.mjs).
     Laatikko pysyy samana kuin paikanvaraajalla, joten layout ei liiku;
     vain sen sisältö on kuva levyllä eikä kuva reunasta reunaan. */
  if (levy) {
    return (
      <div className={`${luokka} media--levy`}>
        <picture className="media__levy">
          {jarjestetyt.flatMap((r) =>
            ['avif', 'webp'].map((muoto) => (
              <source key={`${r.koko}-${muoto}`} type={`image/${muoto}`} srcSet={srcset(id!, r, muoto)} sizes={sizes} />
            )),
          )}
          <img
            src={`/kuva/${id}-${perus.koko}-${perus.leveys}.webp`}
            alt={caption ?? ''}
            width={perus.leveys}
            height={perus.korkeus}
            sizes={sizes}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            fetchPriority={priority ? 'high' : undefined}
            className="media__levy-kuva"
          />
        </picture>
      </div>
    );
  }

  return (
    <picture className={`${luokka} media--kuva`}>
      {jarjestetyt.flatMap((r) =>
        ['avif', 'webp'].map((muoto) => (
          <source
            key={`${r.koko}-${muoto}`}
            {...(r.media ? { media: r.media } : {})}
            type={`image/${muoto}`}
            srcSet={srcset(id!, r, muoto)}
            sizes={sizes}
          />
        )),
      )}
      <img
        src={`/kuva/${id}-${perus.koko}-${perus.leveys}.webp`}
        alt={caption ?? ''}
        width={perus.leveys}
        height={perus.korkeus}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : undefined}
        className="media-fill"
      />
    </picture>
  );
}
