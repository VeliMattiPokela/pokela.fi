import type { Ratio } from '@/components/Media';

/**
 * Casen sisältömalli.
 *
 * Sama rakenne joka casella, jotta datan lähteen voi vaihtaa CMS:ään
 * koskematta sivuun. Lohkotyyppejä on tarkoituksella vähän — jokainen
 * vastaa yhtä Design Systemin komponenttia.
 */

export type MediaSlot = {
  ratio: Ratio;
  caption: string;
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
