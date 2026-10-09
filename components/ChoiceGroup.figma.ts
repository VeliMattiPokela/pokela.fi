// url=https://www.figma.com/design/PVyeKV6J1Rzyj2VL4X27FR/Pokela--Design-System?node-id=276-345
// component=ChoiceGroup

/**
 * Code Connect — ChoiceGroup.
 * ---------------------------------------------------------------
 * Valintojen ryhmä sovellusnäkymiin (päätös 22).
 *
 * Kartoitus:
 *   legend               → `legend`
 *   showHint + hint      → `hint`
 *   Error=true + error   → `error`
 *   valinnat             → `children`, Checkboxin, Radion tai Switchin
 *                          omat kytkennät
 *
 * Virheteksti on Figmassa propertyna aina, mutta luetaan vain kun
 * Error on true, kuten TextFieldissä.
 */

import figma from 'figma';

const isError = figma.selectedInstance.getEnum('Error', { false: false, true: true });

const legend = figma.selectedInstance.getString('legend');
const hint = figma.selectedInstance.getBoolean('showHint') ? figma.selectedInstance.getString('hint') : undefined;
const error = isError ? figma.selectedInstance.getString('error') : undefined;

export default {
  id: 'ChoiceGroup',
  imports: ["import ChoiceGroup from '@/components/ChoiceGroup';"],
  example: figma.code`<ChoiceGroup${figma.helpers.react.renderProp('legend', legend)}${figma.helpers.react.renderProp(
    'hint',
    hint,
  )}${figma.helpers.react.renderProp('error', error)}>
  {/* Checkbox, Radio tai Switch */}
</ChoiceGroup>`,
};
