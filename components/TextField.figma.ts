// url=https://www.figma.com/design/PVyeKV6J1Rzyj2VL4X27FR/Pokela--Design-System?node-id=260-146
// component=TextField

/**
 * Code Connect — TextField.
 * ---------------------------------------------------------------
 * Tekstikenttä sovellusnäkymiin (päätös 22).
 *
 * Kartoitus:
 *   State=error     → `error`-propsi; viesti luetaan tekstipropertystä
 *   State=disabled  → `disabled`
 *   State=hover / focus → CSS:n tiloja, eivät käänny propsiksi
 *   Multiline       → `multiline`
 *   label, value    → `label`, `defaultValue`
 *   showOptional + optional → `optional`
 *   showHint + hint → `hint`
 *
 * Virheteksti on Figmassa aina olemassa, mutta näkyy vain virhetilassa.
 * Siksi se luetaan vain silloin kun State on error: muuten jokaisen
 * kentän esimerkkikoodissa olisi virhe.
 */

import figma from 'figma';

const state = figma.selectedInstance.getEnum('State', {
  default: 'default',
  hover: 'default',
  focus: 'default',
  error: 'error',
  disabled: 'disabled',
});

const multiline = figma.selectedInstance.getEnum('Multiline', {
  false: undefined,
  true: true,
});

const label = figma.selectedInstance.getString('label');
const value = figma.selectedInstance.getString('value');
const optional = figma.selectedInstance.getBoolean('showOptional')
  ? figma.selectedInstance.getString('optional')
  : undefined;
const hint = figma.selectedInstance.getBoolean('showHint') ? figma.selectedInstance.getString('hint') : undefined;
const error = state === 'error' ? figma.selectedInstance.getString('error') : undefined;
const disabled = state === 'disabled' ? true : undefined;

export default {
  id: 'TextField',
  imports: ["import TextField from '@/components/TextField';"],
  example: figma.code`<TextField${figma.helpers.react.renderProp('label', label)}${figma.helpers.react.renderProp(
    'defaultValue',
    value,
  )}${figma.helpers.react.renderProp('optional', optional)}${figma.helpers.react.renderProp(
    'hint',
    hint,
  )}${figma.helpers.react.renderProp('error', error)}${figma.helpers.react.renderProp(
    'multiline',
    multiline,
  )}${figma.helpers.react.renderProp('disabled', disabled)}/>`,
};
