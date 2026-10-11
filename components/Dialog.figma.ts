// url=https://www.figma.com/design/PVyeKV6J1Rzyj2VL4X27FR/Pokela--Design-System?node-id=307-78
// component=Dialog

/**
 * Code Connect — Dialog.
 * ---------------------------------------------------------------
 * Modaalinen dialogi sovellusnäkymiin (päätökset 22 ja 31).
 *
 * Kartoitus:
 *   title                        → `title`
 *   showDescription + description → `description`
 *   showBody                     → `children`; sisältö on instanssissa,
 *                                  joten esimerkki näyttää rakenteen
 *   napit (avatut instanssit)    → `actions`
 *   Breakpoint                   → @media-katko, ei propsi
 *
 * `open` ja `onClose` ovat sovelluksen tilaa, eivät suunnittelun
 * valintoja, joten ne ovat esimerkissä aina samat.
 */

import figma from 'figma';

const title = figma.selectedInstance.getString('title');
const description = figma.selectedInstance.getBoolean('showDescription')
  ? figma.selectedInstance.getString('description')
  : undefined;
const body = figma.selectedInstance.getBoolean('showBody') ? '\n  <TextField label="…" />' : '';

export default {
  id: 'Dialog',
  imports: ["import Dialog from '@/components/Dialog';"],
  example: figma.code`<Dialog
  open={open}
  onClose={() => setOpen(false)}${figma.helpers.react.renderProp('title', title)}${figma.helpers.react.renderProp(
    'description',
    description,
  )}
  actions={
    <>
      <button className="btn btn--ghost btn--s" onClick={() => setOpen(false)}>Peruuta</button>
      <button className="btn btn--primary btn--s">…</button>
    </>
  }
>${body}
</Dialog>`,
};
