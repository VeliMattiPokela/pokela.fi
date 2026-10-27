// url=https://www.figma.com/design/PVyeKV6J1Rzyj2VL4X27FR/Pokela--Design-System?node-id=219-10
// component=Video

/**
 * Code Connect — Video.
 * ---------------------------------------------------------------
 * Video kuvapaikassa. Media piirtää tämän, kun paikkaan on pudotettu
 * video kuvan sijaan; kuvasuhde tulee Median laatikosta.
 *
 * `Tila` on taukonapin asu: `toistaa` näyttää "Pysäytä", `tauolla`
 * "Toista". Koodissa se on alkutila, jonka selain muuttaa kun katsoja
 * painaa nappia tai on pyytänyt vähemmän liikettä (päätös 11).
 */

import figma from 'figma';

const tila = figma.selectedInstance.getEnum('Tila', {
  toistaa: 'toistaa',
  tauolla: 'tauolla',
});

/* Esitys: täysi rajaa videon paikkaansa, levy näyttää puhelinruudun
   kokonaisena levyn keskellä (Pivon ruutuvideot). */
const esitys = figma.selectedInstance.getEnum('Esitys', {
  taysi: 'taysi',
  levy: 'levy',
});

export default {
  id: 'Video',
  imports: ["import Video from '@/components/Video';"],
  example: figma.code`<Video id="etusivu-hero" leveys={1920} korkeus={1080}${figma.helpers.react.renderProp(
    'tila',
    tila,
  )}${figma.helpers.react.renderProp('esitys', esitys)} />`,
};
