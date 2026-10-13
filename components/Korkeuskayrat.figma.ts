// url=https://www.figma.com/design/PVyeKV6J1Rzyj2VL4X27FR/Pokela--Design-System?node-id=331-4
// component=Korkeuskayrat

/**
 * Code Connect — Korkeuskayrat.
 * ---------------------------------------------------------------
 * Etusivun viivateos: vaakasuuntaiset korkeuskäyrät, jotka koodi
 * laskee kiinteällä siemenellä. Figmassa on teoksen levossa oleva
 * asu. Piirtyminen, ajelehtiminen ja painettaessa aukeava linssi ovat
 * liikettä, eikä niitä voi näyttää Figmassa.
 */

import figma from 'figma';

export default {
  id: 'Korkeuskayrat',
  imports: ["import Korkeuskayrat from '@/components/Korkeuskayrat';"],
  example: figma.code`<Korkeuskayrat label=${figma.selectedInstance.getString('label')} />`,
};
