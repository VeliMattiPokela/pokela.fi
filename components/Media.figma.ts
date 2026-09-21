// url=https://www.figma.com/design/PVyeKV6J1Rzyj2VL4X27FR/Pokela--Design-System?node-id=19-219
// component=Media

/**
 * Code Connect — Media.
 * ---------------------------------------------------------------
 * Kuvapaikka. `Ratio`-variantti vastaa suoraan koodin `ratio`-propsia.
 *
 * Kuvasuhteista `hero` on ainoa rooli, koska se on ainoa jonka suhde
 * muuttuu breakpointeittain (4:5 → 16:9 → 21:9). Loput on nimetty
 * suhteellaan, jotta listassa ei ole kahta eri logiikkaa.
 *
 * Figmassa `hero` on 21:9, koska variantilla voi olla vain yksi
 * muoto. Mobiilipohjissa instanssi venytetään käsin.
 */

import figma from 'figma';

const ratio = figma.selectedInstance.getEnum('Ratio', {
  hero: 'hero',
  '4:3': '4:3',
  '4:5': '4:5',
  '3:4': '3:4',
  '1:1': '1:1',
});

const caption = figma.selectedInstance.getBoolean('showCaption', {
  true: figma.selectedInstance.getString('caption'),
  false: undefined,
});

export default {
  id: 'Media',
  imports: ["import Media from '@/components/Media';"],
  example: figma.code`<Media${figma.helpers.react.renderProp(
    'ratio',
    ratio,
  )}${figma.helpers.react.renderProp('caption', caption)} />`,
};
