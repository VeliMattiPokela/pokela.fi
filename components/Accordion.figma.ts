// url=https://www.figma.com/design/PVyeKV6J1Rzyj2VL4X27FR/Pokela--Design-System?node-id=27-436
// component=Accordion

/**
 * Code Connect — Accordion.
 * ---------------------------------------------------------------
 * Avautuva rivi. Figmassa tämä komponentti *sisältää* ListRow-
 * instanssin — riviä ei ole kopioitu. Siksi sisältö luetaan
 * sisäkkäisestä instanssista `findInstance('ListRow')`:lla eikä
 * tämän komponentin omista propertyistä: jos ne olisivat omia,
 * sama asia olisi kahdessa paikassa ja ne ehtisivät ajautua erilleen.
 *
 * Koodissa tämä on oma komponenttinsa, koska se on <button> eikä <a>.
 * Avaustila, paneeli ja "vain yksi auki" -ryhmälogiikka eivät kuulu
 * linkkiin. CSS on silti yhteinen: `.list-row.list-row--expandable`.
 *
 * Kartoitus:
 *   ListRow-instanssin number/title/description/meta → propsit
 *   State=open                                       → `open`
 *   State=hover                                      → CSS:n tila
 *   Breakpoint                                       → @media-katko
 */

import figma from 'figma';

/* Rivi on sisäkkäinen instanssi, ei tämän komponentin omaa sisältöä.
   findInstance palauttaa myös virhekahvan, jos kerrosta ei löydy —
   siksi kaventaminen ennen lukua. */
const row = figma.selectedInstance.findInstance('ListRow');
const str = (name: string) => ('getString' in row ? row.getString(name) : '');

const number = str('number');
const title = str('title');
const description = str('description');
const meta = str('meta');

const open = figma.selectedInstance.getEnum('State', {
  closed: false,
  hover: false,
  open: true,
});

export default {
  id: 'Accordion',
  imports: ["import { Accordion } from '@/components/Accordion';"],
  example: figma.code`<Accordion${figma.helpers.react.renderProp(
    'number',
    number,
  )}${figma.helpers.react.renderProp('title', title)}${figma.helpers.react.renderProp(
    'description',
    description,
  )}${figma.helpers.react.renderProp('meta', meta)}${figma.helpers.react.renderProp(
    'open',
    open,
  )} onToggle={onToggle} labels={labels}>
  {children}
</Accordion>`,
  metadata: { nestable: true },
};
