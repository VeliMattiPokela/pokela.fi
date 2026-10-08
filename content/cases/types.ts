import type { Esitys, Ratio } from '@/components/Media';

/**
 * Casen sisältömalli.
 *
 * Sama rakenne joka casella, jotta datan lähteen voi vaihtaa CMS:ään
 * koskematta sivuun. Lohkotyyppejä on tarkoituksella vähän — jokainen
 * vastaa yhtä Design Systemin komponenttia.
 */

export type MediaSlot = {
  /**
   * Paikan tunniste, ja samalla tiedoston nimi. Kuva `kuvat/<id>.*`
   * päätyy tähän paikkaan — muuta kohdistusta ei ole.
   *
   * Kenttä on pakollinen, jottei kuvapaikkaa voi lisätä ilman että
   * kuvaputki tietää siitä. Järjestysnumero olisi ajautunut: yhden
   * paikan lisäys keskelle olisi siirtänyt kaikki sen jälkeiset kuvat
   * hiljaa väärään kohtaan.
   */
  id: string;
  ratio: Ratio;
  caption: string;
  /** `taysi` valokuvalle tai kuvitukselle. Oletus `levy`, ks. Media. */
  esitys?: Esitys;
  /** Kuvan alle tuleva merkintä, jos kuvapari tarvitsee sen. */
  label?: string;
};

export type Block =
  /** Tekstiosio: valinnainen iso väite (display-m) + nimettyjä
      kappaleita. Vain lead on display-kokoinen — muuten sivu täyttyisi
      isoista otsikoista. */
  | { kind: 'text'; label: string; lead?: string; items: { h?: string; p: string }[] }
  /** Yksittäinen kuva. */
  | { kind: 'media'; media: MediaSlot }
  /** Kuvapari, esim. skeleton → julkaisu. */
  | { kind: 'pair'; label?: string; items: MediaSlot[] }
  /** Ennen/jälkeen-vertailu yhdessä kehyksessä. Lähteet ovat
      `<id>-ennen` ja `<id>-jalkeen`. Tyhjänä näkyy paikanvaraaja. */
  | {
      kind: 'compare';
      label: string;
      id: string;
      ratio: Ratio;
      caption: string;
      beforeLabel: string;
      afterLabel: string;
      /** Lähteen tarvitsema leveys: lohko on leveämpi kuin työlistan vertailu. */
      tarveLeveys?: number;
    }
  /** Käännetty väitepalkki. Yksi per case. */
  | { kind: 'band'; title: string; body: string }
  /** Kolme kuvaa otsikoin. */
  | { kind: 'trio'; label: string; title: string; items: { media: MediaSlot; h: string; p: string }[] }
  /** Numeroitu vastuualuelista. */
  | { kind: 'scope'; label: string; title: string; body: string; items: string[] }
  /** Avattavat artefaktit (case 03). Tila ja osoitteet johdetaan
      build-aikana (lib/artefacts.ts) — niitä ei kirjoiteta tähän,
      jotta ne eivät voi jäädä jälkeen todellisuudesta. */
  | { kind: 'artefacts'; label: string; note: string }
  /** Synkkatarkistukset. Lista johdetaan package.jsonista
      (lib/checks.ts) — mitä ajetaan, se näkyy. Casetekstiin ei
      kirjoiteta mitä tarkistetaan, koska se väite vanheni kerran jo. */
  /* `title` on pakko sisältää `{n}`: renderöijä korvaa sen ajossa
     olevien tarkistusten määrällä. Ilman placeholderia build kaatuu.
     Luku vanheni kerran käsin kirjoitettuna — otsikko lupasi neljää
     kun niitä oli seitsemän. */
  | { kind: 'checks'; label: string; title: string; note: string }
  /** Prosessi yhtenä ketjuna. Lenkit luetaan content/prosessi.ts:stä
      ja vartijat lib/checks.ts:stä build-aikana, joten casetekstiin
      kirjoitetaan vain otsikko ja johdanto. */
  | { kind: 'ketju'; label: string; title: string; body: string }
  /** Numeroitu putki, ei linkkejä. */
  | { kind: 'steps'; label: string; title: string; body: string; items: { h: string; p: string }[] }
  /** Kaksi rinnakkaista vaihtoehtoa. */
  | { kind: 'choices'; label: string; title: string; items: { h: string; p: string; note: string }[] }
  /** Yksi komponentti neljästä suunnasta. Sisältö luetaan
      lähdekoodista build-aikana, ei kirjoiteta tähän. */
  | { kind: 'component'; label: string; title: string; body: string }
  /** Täydennettävä kohta. Näkyy vain kehityksessä. */
  | { kind: 'todo'; text: string };

export type CaseFact = { label: string; value: string | null };

export type Case = {
  slug: string;
  eyebrow: string;
  title: string;
  /** Otsikko riveittäin, jos se katkaistaan tarkoituksella. */
  titleLines?: string[];
  tagline: string;
  facts: CaseFact[];
  blocks: Block[];
  next: { slug: string; title: string };
};
