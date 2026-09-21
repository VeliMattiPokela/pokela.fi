/**
 * Code Connect -templatet (`*.figma.ts`) importoivat virtuaalisen
 * `figma`-moduulin, jonka Code Connectin ajoympäristö tarjoaa. Ilman
 * tätä viittausta `npx tsc --noEmit` kaatuisi moduuliin jota ei ole
 * levyllä.
 *
 * Viittaus on erillisessä tiedostossa eikä tsconfigin `types`-listassa
 * tarkoituksella: `types` korvaisi automaattisen @types-haun, jolloin
 * @types/node ja @types/react putoaisivat pois.
 *
 * `-no-require`-variantti siksi, että oletusversio julistaa globaalin
 * `require`-funktion ja rikkoo @types/noden oman tyypityksen.
 */
/// <reference types="@figma/code-connect/figma-types-no-require" />
