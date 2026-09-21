// url=https://www.figma.com/design/PVyeKV6J1Rzyj2VL4X27FR/Pokela--Design-System?node-id=27-3
// component=LogoRow

/**
 * Code Connect — LogoRow.
 * ---------------------------------------------------------------
 * Asiakaslogorivi. Ainoa propsi on otsikko; logot tulevat
 * content/logos.ts:stä, joten suunnittelija ei valitse niitä.
 *
 * Figmassa logot on rakennettu samalla tavalla kuin CSS:ssä: kuva on
 * maski ja väri tulee --ink-muted-muuttujasta. Siksi ne toimivat
 * myös tummassa teemassa, toisin kuin suoraan sijoitettu musta PNG.
 *
 * Huom: Oikotien ja Colliersin logotiedostot ovat laatikoita eivätkä
 * sanamerkkejä. Se näkyy sekä sivustolla että Figmassa — vika on
 * tiedostossa, ja se on kirjattu README:n avoimiin kohtiin.
 */

import figma from 'figma';

const label = figma.selectedInstance.getString('label');

export default {
  id: 'LogoRow',
  imports: ["import LogoRow from '@/components/LogoRow';"],
  example: figma.code`<LogoRow${figma.helpers.react.renderProp('label', label)} />`,
};
