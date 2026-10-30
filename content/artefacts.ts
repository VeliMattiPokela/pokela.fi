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
  /** Kirjoitettu auki: Vercelin buildissa ei ole .git/configin remotea,
      joten luettu osoite jäi tyhjäksi ja repo näkyi tulossa olevana.
      null = luetaan .git/configista. */
  repo: 'https://github.com/VeliMattiPokela/pokela.fi' as string | null,
} as const;
