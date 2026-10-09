// url=https://www.figma.com/design/PVyeKV6J1Rzyj2VL4X27FR/Pokela--Design-System?node-id=276-174
// component=Radio

/**
 * Code Connect — Radio.
 * ---------------------------------------------------------------
 * Radiopainike sovellusnäkymiin (päätös 22). Ympyrä on systeemin
 * ainoa pyöreä muoto (päätös 24).
 *
 * Kartoitus:
 *   Checked=true         → `defaultChecked`
 *   State=disabled       → `disabled`
 *   State=hover / focus  → CSS:n tiloja
 *   State=error          → ryhmän tila (ChoiceGroupin `error`)
 *   label, showHint + hint → `label`, `hint`
 *
 * `name` ja `value` eivät ole Figmassa: ne ovat lomakkeen dataa, eivät
 * ulkoasua, joten esimerkki näyttää paikan niille.
 */

import figma from 'figma';

const checked = figma.selectedInstance.getEnum('Checked', {
  false: undefined,
  true: true,
});
const disabled = figma.selectedInstance.getEnum('State', {
  default: undefined,
  hover: undefined,
  focus: undefined,
  error: undefined,
  disabled: true,
});

const label = figma.selectedInstance.getString('label');
const hint = figma.selectedInstance.getBoolean('showHint') ? figma.selectedInstance.getString('hint') : undefined;

export default {
  id: 'Radio',
  imports: ["import Radio from '@/components/Radio';"],
  example: figma.code`<Radio name="ryhma" value="arvo"${figma.helpers.react.renderProp(
    'label',
    label,
  )}${figma.helpers.react.renderProp('hint', hint)}${figma.helpers.react.renderProp(
    'defaultChecked',
    checked,
  )}${figma.helpers.react.renderProp('disabled', disabled)}/>`,
};
