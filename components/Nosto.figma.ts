// url=https://www.figma.com/design/PVyeKV6J1Rzyj2VL4X27FR/Pokela--Design-System?node-id=394-87
// component=Nosto

/**
 * Code Connect — Nosto.
 * ---------------------------------------------------------------
 * Sivun tai casen pääväite viivateoksen päällä (päätös 46).
 *
 * Kartoitus:
 *   title       → `title`
 *   body        → `body`
 *   showAction  → `action`; linkin teksti on instanssissa, joten
 *                 esimerkki näyttää rakenteen
 */

import figma from 'figma';

const title = figma.selectedInstance.getString('title');
const body = figma.selectedInstance.getString('body');
const action = figma.selectedInstance.getBoolean('showAction')
  ? ' action={<a className="btn btn--text" href="…">…</a>}'
  : '';

export default {
  id: 'Nosto',
  imports: ["import Nosto from '@/components/Nosto';"],
  example: figma.code`<Nosto${figma.helpers.react.renderProp('title', title)}${figma.helpers.react.renderProp('body', body)}${action} />`,
};
