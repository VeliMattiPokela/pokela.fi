/**
 * Artefaktien julkiset osoitteet.
 * ---------------------------------------------------------------
 * Yksi paikka, johon osoite lisätään kun jokin julkaistaan. Sen
 * jälkeen linkki ilmestyy sekä casesivun artefaktilistaan että
 * komponenttinäkymän alariviin — kumpaakaan ei tarvitse muistaa
 * päivittää erikseen.
 *
 * `null` = ei vielä julkisessa osoitteessa. Se EI tarkoita samaa
 * kuin "ei ole olemassa": tilan johtaa lib/artefacts.ts
 * tiedostojärjestelmästä.
 *
 * Repon osoite luetaan tarvittaessa suoraan .git/configista, joten
 * se ilmestyy itsestään heti kun remote on olemassa.
 */
export const artefactUrls = {
  storybook: 'https://pokela-storybook.netlify.app' as string | null,
  figma: 'https://www.figma.com/design/PVyeKV6J1Rzyj2VL4X27FR' as string | null,
  codeConnect: null as string | null,
  /** Jätä null: luetaan .git/configista. Täytä vain jos haluat ohittaa. */
  repo: null as string | null,
} as const;
