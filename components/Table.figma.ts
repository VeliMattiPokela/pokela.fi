// url=https://www.figma.com/design/PVyeKV6J1Rzyj2VL4X27FR/Pokela--Design-System?node-id=304-256
// component=Table

/**
 * Code Connect — Table.
 * ---------------------------------------------------------------
 * Taulukko sovellusnäkymiin (päätökset 22 ja 30).
 *
 * Kartoitus:
 *   State=default   → rivit `rows`-propsissa
 *   State=empty     → `rows={[]}` ja `empty`-teksti
 *
 * Otsikkosolu Table / Header on alikomponentti (nimessä " / "), kuten
 * Tabs / Tab, joten sillä ei ole omaa kytkentää. Sen propertyt
 * kääntyvät sarakkeen propseiksi:
 *
 *   label                       → `header`
 *   Sort=unsortable             → ei `sortable`
 *   Sort=none                   → `sortable`
 *   Sort=ascending / descending → Tablen `defaultSort`
 *   Align=end                   → `numeric`
 *
 * Sarakkeet ja rivit ovat dataa, joten esimerkki näyttää rakenteen
 * eikä lue jokaista solua.
 */

import figma from 'figma';

const rows = figma.selectedInstance.getEnum('State', {
  default: 'jasenet',
  empty: '[]',
});
const empty = figma.selectedInstance.getEnum('State', {
  default: '',
  empty: '\n  empty="Ei jäseniä. Kutsu ensimmäinen jäsen tiimiin."',
});

export default {
  id: 'Table',
  imports: ["import Table from '@/components/Table';"],
  example: figma.code`<Table
  caption="Tiimin jäsenet"
  columns={[
    { key: 'nimi', header: 'Nimi', sortable: true },
    { key: 'rooli', header: 'Rooli', muted: true, sortable: true },
    { key: 'muutoksia', header: 'Muutoksia', numeric: true, sortable: true },
  ]}
  rows={${rows}}
  rowKey={(r) => r.id}
  defaultSort={{ key: 'nimi', direction: 'ascending' }}${empty}
/>`,
};
