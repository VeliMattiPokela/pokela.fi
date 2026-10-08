// url=https://www.figma.com/design/PVyeKV6J1Rzyj2VL4X27FR/Pokela--Design-System?node-id=222-548
// component=HeroName

/**
 * Code Connect — HeroName.
 * ---------------------------------------------------------------
 * Etusivun nimi, joka rakentuu fontin ääriviivoista.
 *
 * `Tila` on nimen kaksi pysähtynyttä asua: `levossa` on valmis nimi,
 * `rakenne` koko nimen rakenne auki (apuviivat, ääriviivat, pisteet
 * ja kahvat). Koodissa se on alkutila; saapuminen ja linssi ovat
 * liikettä, eikä niitä voi näyttää Figmassa.
 */

import figma from 'figma';

const tila = figma.selectedInstance.getEnum('Tila', {
  levossa: 'levossa',
  rakenne: 'rakenne',
});

export default {
  id: 'HeroName',
  imports: ["import HeroName from '@/components/HeroName';"],
  example: figma.code`<HeroName lines={['Veli-', 'Matti', 'Pokela']}${figma.helpers.react.renderProp(
    'tila',
    tila,
  )} />`,
};
