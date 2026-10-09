// url=https://www.figma.com/design/PVyeKV6J1Rzyj2VL4X27FR/Pokela--Design-System?node-id=251-450
// component=ExplodedView

/**
 * Code Connect — ExplodedView.
 * ---------------------------------------------------------------
 * Räjäytyskuva: kerrokset levyinä 3D-tilassa.
 *
 * `Tila` on kuvan kaksi pysähtynyttä asua: `auki` on pino viuhkana,
 * `koottu` kerrokset yhdeksi pinnaksi koottuna. Osoittimen kääntö,
 * kohdistus ja vierityksen kokoaminen ovat liikettä, eikä niitä voi
 * näyttää Figmassa. Kerrosten sisältö on koodissa `layers`-taulukko;
 * Figmassa levyt on piirretty esimerkiksi.
 */

import figma from 'figma';

const tila = figma.selectedInstance.getEnum('Tila', {
  auki: 'auki',
  koottu: 'koottu',
});

export default {
  id: 'ExplodedView',
  imports: ["import ExplodedView from '@/components/ExplodedView';"],
  example: figma.code`<ExplodedView
  label="Sivu purettuna kolmeen kerrokseen"
  layers={[
    { name: '01 Tokenit', source: 'tokens.json', content: <Tokenit /> },
    { name: '02 Komponentit', source: '@pokela/components', content: <Komponentit /> },
    { name: '03 Sivu', source: 'pokela.fi', content: <Sivu /> },
  ]}${figma.helpers.react.renderProp('tila', tila)}
/>`,
};
