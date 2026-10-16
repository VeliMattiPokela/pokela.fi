// url=https://www.figma.com/design/PVyeKV6J1Rzyj2VL4X27FR/Pokela--Design-System?node-id=352-258
// component=Piirros

/**
 * Code Connect — Piirros.
 * ---------------------------------------------------------------
 * Työtapa-sivun viivakuvitus. `Aihe`-variantti vastaa koodin
 * `aihe`-propsia: iso pääkuva (`kypsyminen`), menetelmän kuusi
 * vaihekuvaa ja case 03:n prosessin kahdeksan vaihekuvaa. Figmassa piirros on tuotu samasta SVG:stä, jonka koodi
 * piirtää, ja värit on sidottu muuttujiin.
 */

import figma from 'figma';

const aihe = figma.selectedInstance.getEnum('Aihe', {
  kypsyminen: 'kypsyminen',
  ymmarrys: 'ymmarrys',
  pohja: 'pohja',
  'design-system': 'design-system',
  polut: 'polut',
  data: 'data',
  julkaisu: 'julkaisu',
  lahtotilanne: 'lahtotilanne',
  lahde: 'lahde',
  koodi: 'koodi',
  arvot: 'arvot',
  kirjasto: 'kirjasto',
  kytkenta: 'kytkenta',
  make: 'make',
  paluu: 'paluu',
});

export default {
  id: 'Piirros',
  imports: ["import Piirros from '@/components/Piirros';"],
  example: figma.code`<Piirros aihe="${aihe}" />`,
};
