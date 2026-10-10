// url=https://www.figma.com/design/PVyeKV6J1Rzyj2VL4X27FR/Pokela--Design-System?node-id=298-3037
// component=Tabs

/**
 * Code Connect — Tabs.
 * ---------------------------------------------------------------
 * Välilehdet sovellusnäkymiin (päätökset 22 ja 28).
 *
 * Figmassa Tabs on rivi Tabs / Tab -instansseja. Tab on
 * alikomponentti (nimessä " / "), kuten Nav / Link, joten sillä ei
 * ole omaa kytkentää. Sen propertyt kääntyvät Tabin propseiksi:
 *
 *   label                → `label`
 *   showCount + count    → `count`
 *   State=disabled       → `disabled`
 *   State=hover / focus  → CSS:n tiloja, eivät käänny propsiksi
 *   Selected=true        → Tabsin `defaultValue` (valinta on rivin
 *                          tilaa, ei yksittäisen välilehden)
 *
 * Välilehtien määrä vaihtelee, joten esimerkki näyttää rakenteen
 * eikä lue jokaista instanssia.
 */

import figma from 'figma';

export default {
  id: 'Tabs',
  imports: ["import Tabs from '@/components/Tabs';", "import Tab from '@/components/Tab';"],
  example: figma.code`<Tabs label="Asetukset" defaultValue="tiimi">
  <Tab value="yleiset" label="Yleiset">…</Tab>
  <Tab value="tiimi" label="Tiimi" count={4}>…</Tab>
  <Tab value="arkisto" label="Arkisto" disabled>…</Tab>
</Tabs>`,
};
