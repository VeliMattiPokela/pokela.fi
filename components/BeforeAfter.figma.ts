// url=https://www.figma.com/design/PVyeKV6J1Rzyj2VL4X27FR/Pokela--Design-System?node-id=440-45
// component=BeforeAfter

/**
 * Code Connect — BeforeAfter.
 * ---------------------------------------------------------------
 * Ennen / jälkeen -vertailu. Lähteet ja mitat tulevat kuvamanifestista
 * tunnisteen perusteella, joten `Lähde` (kuva / video) on Figmassa
 * esitys eikä propsi: paikkaan pudotettu tiedosto ratkaisee sen, kuten
 * Mediassa.
 *
 * `Tila` on videovertailun taukonapin asu kuten Videossa: `toistaa`
 * näyttää "Pysäytä", `tauolla` "Toista". Koodissa se on alkutila
 * (päätös 11). Kuvaparilla nappia ei ole.
 */

import figma from 'figma';

const tila = figma.selectedInstance.getEnum('Tila', {
  toistaa: 'toistaa',
  tauolla: 'tauolla',
});

const ennen = figma.selectedInstance.getString('Ennen');
const jalkeen = figma.selectedInstance.getString('Jälkeen');
const kuvateksti = figma.selectedInstance.getString('Kuvateksti');

export default {
  id: 'BeforeAfter',
  imports: ["import BeforeAfter from '@/components/BeforeAfter';"],
  example: figma.code`<BeforeAfter id="colliers-runko" beforeLabel="${ennen}" afterLabel="${jalkeen}" alt="${kuvateksti}" caption="${kuvateksti}"${figma.helpers.react.renderProp(
    'tila',
    tila,
  )} />`,
};
