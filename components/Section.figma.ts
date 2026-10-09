// url=https://www.figma.com/design/PVyeKV6J1Rzyj2VL4X27FR/Pokela--Design-System?node-id=256-28
// component=Section

/**
 * Code Connect — Section (pattern).
 * ---------------------------------------------------------------
 * `Asettelu`: `stacked` (otsikko ja sivutieto rivinä, sisältö alla)
 * tai `aside` (otsikko vasemmalla, sisältö oikealla). Sisältö on
 * koodissa `children`; Figmassa se on piirretty esimerkiksi.
 */

import figma from 'figma';

const layout = figma.selectedInstance.getEnum('Asettelu', {
  stacked: 'stacked',
  aside: 'aside',
});

export default {
  id: 'Section',
  imports: ["import Section from '@/components/Section';"],
  example: figma.code`<Section title="Osion otsikko"${figma.helpers.react.renderProp('layout', layout)}>
  {/* sisältö */}
</Section>`,
};
