// url=https://www.figma.com/design/PVyeKV6J1Rzyj2VL4X27FR/Pokela--Design-System?node-id=245-38
// component=Timeline

/**
 * Code Connect — Timeline.
 * ---------------------------------------------------------------
 * Figman komponentti on yksi aikajanan kohta; koodissa kohdat
 * kirjoitetaan `Timeline`-listan sisään, koska merkinnät asettuvat
 * listan ruudukkoon.
 *
 * `Variant`: `default` (ohut kisko), `emphasis` (paksu kisko, nostettu
 * kohta) tai `end` (viimeinen kohta). Kiskon venymä (`weight`) on
 * koodissa luku eikä Figman ominaisuus: Figmassa korostetun kohdan
 * kisko on piirretty pitkäksi esimerkiksi.
 */

import figma from 'figma';

const variant = figma.selectedInstance.getEnum('Variant', {
  default: 'default',
  emphasis: 'emphasis',
  end: 'end',
});

export default {
  id: 'Timeline',
  imports: ["import Timeline, { TimelineItem } from '@/components/Timeline';"],
  example: figma.code`<Timeline>
  <TimelineItem label="0.00" title="Otsikko" meta="Sivutieto" description="Kuvaus"${figma.helpers.react.renderProp(
    'variant',
    variant,
  )} />
</Timeline>`,
};
