// url=https://www.figma.com/design/PVyeKV6J1Rzyj2VL4X27FR/Pokela--Design-System?node-id=276-233
// component=Switch

/**
 * Code Connect — Switch.
 * ---------------------------------------------------------------
 * Kytkin sovellusnäkymiin (päätös 22): asetus, joka tulee voimaan
 * heti.
 *
 * Kartoitus:
 *   Checked=true         → `defaultChecked`
 *   State=disabled       → `disabled`
 *   State=hover / focus  → CSS:n tiloja
 *   label, showHint + hint → `label`, `hint`
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
  disabled: true,
});

const label = figma.selectedInstance.getString('label');
const hint = figma.selectedInstance.getBoolean('showHint') ? figma.selectedInstance.getString('hint') : undefined;

export default {
  id: 'Switch',
  imports: ["import Switch from '@/components/Switch';"],
  example: figma.code`<Switch${figma.helpers.react.renderProp('label', label)}${figma.helpers.react.renderProp(
    'hint',
    hint,
  )}${figma.helpers.react.renderProp('defaultChecked', checked)}${figma.helpers.react.renderProp(
    'disabled',
    disabled,
  )}/>`,
};
