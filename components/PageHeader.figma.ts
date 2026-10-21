// url=https://www.figma.com/design/PVyeKV6J1Rzyj2VL4X27FR/Pokela--Design-System?node-id=256-13
// component=PageHeader

/**
 * Code Connect — PageHeader (pattern).
 * ---------------------------------------------------------------
 * `Ingressi`: `ei` tai `on`. Ingressi on aina otsikon alla samassa
 * sarakkeessa; Figmassa variantti näyttää sen paikan. `Otsikko`:
 * `lyhyt` on display-xl, `pitkä` (yli 20 merkkiä) display-l. Koko
 * johdetaan koodissa otsikon pituudesta (päätös 44).
 */

import figma from 'figma';

const ingressi = figma.selectedInstance.getEnum('Ingressi', {
  ei: undefined,
  on: 'Ingressi otsikon alla.',
});

const otsikko = figma.selectedInstance.getEnum('Otsikko', {
  lyhyt: 'Työt',
  pitkä: 'UX engineering – koodipohjainen suunnittelu',
});

export default {
  id: 'PageHeader',
  imports: ["import PageHeader from '@/components/PageHeader';"],
  example: figma.code`<PageHeader title="${otsikko}" meta="Sivutieto"${figma.helpers.react.renderProp('lede', ingressi)} />`,
};
