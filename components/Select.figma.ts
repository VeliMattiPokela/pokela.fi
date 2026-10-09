// url=https://www.figma.com/design/PVyeKV6J1Rzyj2VL4X27FR/Pokela--Design-System?node-id=283-222
// component=Select

/**
 * Code Connect — Select.
 * ---------------------------------------------------------------
 * Valintalista sovellusnäkymiin (päätökset 22 ja 25).
 *
 * Kartoitus:
 *   State=error     → `error`-propsi; viesti luetaan tekstipropertystä
 *   State=disabled  → `disabled`
 *   State=hover / focus → CSS:n tiloja, eivät käänny propsiksi
 *   Filled=true     → `defaultValue` (value-tekstistä)
 *   Filled=false    → `placeholder`
 *   Open            → vuorovaikutusta, ei propsi
 *   label           → `label`
 *   showOptional + optional → `optional`
 *   showHint + hint → `hint`
 *
 * Figma näyttää valitun vaihtoehdon nimen. Koodissa `defaultValue`
 * on vaihtoehdon `value`, joten esimerkin arvo on suuntaa antava.
 *
 * Vaihtoehdot ovat dataa, eivät Figman propertyjä, joten esimerkki
 * näyttää ne muuttujana `options`.
 */

import figma from 'figma';

const state = figma.selectedInstance.getEnum('State', {
  default: 'default',
  hover: 'default',
  focus: 'default',
  error: 'error',
  disabled: 'disabled',
});

const filled = figma.selectedInstance.getEnum('Filled', {
  false: false,
  true: true,
});

const label = figma.selectedInstance.getString('label');
const value = filled ? figma.selectedInstance.getString('value') : undefined;
const placeholder = filled ? undefined : figma.selectedInstance.getString('placeholder');
const optional = figma.selectedInstance.getBoolean('showOptional')
  ? figma.selectedInstance.getString('optional')
  : undefined;
const hint = figma.selectedInstance.getBoolean('showHint') ? figma.selectedInstance.getString('hint') : undefined;
const error = state === 'error' ? figma.selectedInstance.getString('error') : undefined;
const disabled = state === 'disabled' ? true : undefined;

export default {
  id: 'Select',
  imports: ["import Select from '@/components/Select';"],
  example: figma.code`<Select${figma.helpers.react.renderProp('label', label)} options={options}${figma.helpers.react.renderProp(
    'defaultValue',
    value,
  )}${figma.helpers.react.renderProp('placeholder', placeholder)}${figma.helpers.react.renderProp(
    'optional',
    optional,
  )}${figma.helpers.react.renderProp('hint', hint)}${figma.helpers.react.renderProp(
    'error',
    error,
  )}${figma.helpers.react.renderProp('disabled', disabled)}/>`,
};
