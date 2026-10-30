// url=https://www.figma.com/design/PVyeKV6J1Rzyj2VL4X27FR/Pokela--Design-System?node-id=424-2436
// component=Ikkuna

/**
 * Code Connect — Ikkuna.
 * ---------------------------------------------------------------
 * Paikka, jossa työn voi tarkistaa (case 03, päätös 53). Figmassa
 * kaaviokuva on tuotu samasta SVG:stä, jonka koodi piirtää, ja värit
 * on sidottu muuttujiin.
 *
 * Kartoitus:
 *   Aihe → `aihe`: storybook, figma, code-connect tai repo
 *   Tila → `state`: julkaistu (linkki ja nuoli), olemassa tai tulossa
 *
 * Tekstit ovat instanssissa, joten esimerkki näyttää rakenteen.
 * Casesivulla tiedot ja tila johdetaan lib/artefacts.ts:stä.
 */

import figma from 'figma';

const aihe = figma.selectedInstance.getEnum('Aihe', {
  storybook: 'storybook',
  figma: 'figma',
  'code-connect': 'code-connect',
  repo: 'repo',
});

const tila = figma.selectedInstance.getEnum('Tila', {
  julkaistu: 'julkaistu',
  olemassa: 'olemassa',
  tulossa: 'tulossa',
});

export default {
  id: 'Ikkuna',
  imports: ["import Ikkuna from '@/components/Ikkuna';"],
  example: figma.code`<Ikkuna aihe="${aihe}" state="${tila}" number="01" title="…" body="…" host="…" note="…" href="…" />`,
};
