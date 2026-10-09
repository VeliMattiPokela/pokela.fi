// url=https://www.figma.com/design/PVyeKV6J1Rzyj2VL4X27FR/Pokela--Design-System?node-id=276-106
// component=Checkbox

/**
 * Code Connect — Checkbox.
 * ---------------------------------------------------------------
 * Valintaruutu sovellusnäkymiin (päätös 22).
 *
 * Kartoitus:
 *   Checked=true          → `defaultChecked`
 *   Checked=indeterminate → `indeterminate`
 *   State=disabled        → `disabled`
 *   State=hover / focus   → CSS:n tiloja, eivät käänny propsiksi
 *   State=error           → ryhmän tila (ChoiceGroupin `error`), ei
 *                           valintaruudun propsi
 *   label, showHint + hint → `label`, `hint`
 */

import figma from 'figma';

const checked = figma.selectedInstance.getEnum('Checked', {
  false: undefined,
  true: true,
  indeterminate: undefined,
});
const indeterminate = figma.selectedInstance.getEnum('Checked', {
  false: undefined,
  true: undefined,
  indeterminate: true,
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
  id: 'Checkbox',
  imports: ["import Checkbox from '@/components/Checkbox';"],
  example: figma.code`<Checkbox${figma.helpers.react.renderProp('label', label)}${figma.helpers.react.renderProp(
    'hint',
    hint,
  )}${figma.helpers.react.renderProp('defaultChecked', checked)}${figma.helpers.react.renderProp(
    'indeterminate',
    indeterminate,
  )}${figma.helpers.react.renderProp('disabled', disabled)}/>`,
};
