import manifesti from '@/content/media.generated.json';

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

type Rajaus = {
  koko: string;
  media: string | null;
  suhde: number;
  leveydet: number[];
  leveys: number;
  korkeus: number;
};

type Merkinta =
  | { tyyppi: 'kuva' | 'vertailu'; osat: Record<string, Rajaus[]> }
  | { tyyppi: 'video'; leveys: number; korkeus: number };

const KUVAT = manifesti.paikat as unknown as Record<string, Merkinta>;

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

/**
 * Video.
 *
 * Ei automaattitoistoa. Kaksi syytä: automaattitoisto vaatisi
 * asiakaskomponentin jotta `prefers-reduced-motion` voidaan lukea,
 * ja liikkuva kuva jota ei voi pysäyttää on saavutettavuusongelma
 * siinäkin tapauksessa että se on mykkä. Julistekuva näkyy heti,
 * katsoja päättää lähteekö se liikkeelle.
 *
 * `preload="metadata"` lataa vain otsakkeet — koko tiedosto haetaan
 * vasta jos katsoja painaa toistoa.
 */
function Video({ id, leveys, korkeus, caption }: {
  id: string;
  leveys: number;
  korkeus: number;
  caption?: string;
}) {
  return (
    <video
      className="media-fill"
      controls
      preload="metadata"
      playsInline
      poster={`/kuva/${id}-juliste.webp`}
      width={leveys}
      height={korkeus}
      aria-label={caption ?? ''}
    >
      <source src={`/kuva/${id}.webm`} type="video/webm" />
      <source src={`/kuva/${id}.mp4`} type="video/mp4" />
    </video>
  );
}

export default function Media({
  id,
  ratio = '4:3',
  caption,
  sizes = '100vw',
  priority = false,
}: {
  id?: string;
  ratio?: Ratio;
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
      <div className={`${luokka} media--kuva`}>
        <Video id={id!} leveys={merkinta.leveys} korkeus={merkinta.korkeus} caption={caption} />
      </div>
    );
  }

  const osat = id ? rajaukset(id) : null;

  if (!osat) {
    return (
      <div className={luokka} role="img" aria-label={caption ?? ''}>
        {caption ? <span className="meta meta--s">{caption}</span> : null}
      </div>
    );
  }

  /* Tarkin media-ehto ensin: selain ottaa ensimmäisen osuvan. Lista
     on lähteessä pienimmästä suurimpaan, joten se käännetään. */
  const jarjestetyt = [...osat].reverse();
  const perus = osat[0];

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
