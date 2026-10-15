// url=https://www.figma.com/design/PVyeKV6J1Rzyj2VL4X27FR/Pokela--Design-System?node-id=376-4145
// component=PageProgress

/**
 * Code Connect — PageProgress.
 * ---------------------------------------------------------------
 * Sivunvaihdon viiva ruudun yläreunassa (päätös 41).
 *
 *   Tila → `state`. Sivustolla tilaa ei anneta: se seuraa
 *          klikkauksia ja polkua. Propsi on staattista näyttöä
 *          varten (Storybook, Figma), kuten ListRow'n `pending`.
 *
 * Next.js-sovellus käyttää kääreen kautta:
 * `<PageProgressRoute />` layoutissa.
 */

import figma from 'figma';

const state = figma.selectedInstance.getEnum('Tila', {
  idle: undefined,
  loading: 'loading',
});

export default {
  id: 'PageProgress',
  imports: ["import PageProgress from '@/components/PageProgress';"],
  example: figma.code`<PageProgress${figma.helpers.react.renderProp('state', state)} />`,
};
