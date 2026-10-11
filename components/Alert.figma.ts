// url=https://www.figma.com/design/PVyeKV6J1Rzyj2VL4X27FR/Pokela--Design-System?node-id=301-3145
// component=Alert

/**
 * Code Connect — Alert.
 * ---------------------------------------------------------------
 * Inline-ilmoitus sovellusnäkymiin (päätökset 22 ja 29).
 *
 * Kartoitus:
 *   Tone              → `tone` (info on oletus, joten sitä ei kirjoiteta)
 *   title             → `title`
 *   showBody + body   → `children`
 *   showAction        → `action`; napin teksti on instanssissa, joten
 *                       esimerkki näyttää rakenteen
 *   showClose         → `onDismiss`
 */

import figma from 'figma';

const tone = figma.selectedInstance.getEnum('Tone', {
  info: undefined,
  success: 'success',
  error: 'error',
});

const title = figma.selectedInstance.getString('title');
const body = figma.selectedInstance.getBoolean('showBody') ? figma.selectedInstance.getString('body') : undefined;
const action = figma.selectedInstance.getBoolean('showAction')
  ? ' action={<a className="btn btn--text" href="…">…</a>}'
  : '';
const dismiss = figma.selectedInstance.getBoolean('showClose') ? ' onDismiss={() => {}}' : '';

export default {
  id: 'Alert',
  imports: ["import Alert from '@/components/Alert';"],
  example: figma.code`<Alert${figma.helpers.react.renderProp('tone', tone)}${figma.helpers.react.renderProp(
    'title',
    title,
  )}${action}${dismiss}>
  ${body}
</Alert>`,
};
