// url=https://www.figma.com/design/PVyeKV6J1Rzyj2VL4X27FR/Pokela--Design-System?node-id=12-28
// component=Button
// source=styles/base.css

/**
 * Code Connect — Button.
 * ---------------------------------------------------------------
 * Koodissa ei ole `Button.tsx`:ää eikä sellaista kirjoitettu tätä
 * kytkentää varten. Nappi on luokkasopimus (`.btn`, `.btn--primary`)
 * styles/base.css:ssä, ja se on tarkoituksellista: sivuston napeista
 * suurin osa on `<a>` eikä `<button>`, ja sama luokka toimii
 * molemmilla ilman `as`-propia.
 *
 * Siksi kytkentä osoittaa tyylitiedostoon (`// source=`) eikä
 * komponenttiin, ja Dev Mode näyttää merkkauksen luokkineen. Sama
 * luokkalista toimii `<a href="…">`-elementillä sellaisenaan.
 *
 * Kartoitus:
 *   Variant → luokkapari, esim. `btn btn--ghost`
 *   State   → vain `disabled` on merkkausta; :hover ja :focus-visible
 *             ovat CSS:n tiloja eivätkä käänny attribuutiksi
 *   label   → napin teksti
 *   showIcon → nuoli napin perässä. Koodissa se on oma <Icon>, ei
 *             merkki tekstissä: `.btn`:n `gap: --space-8` on sitä
 *             varten. Figmassa sama väli on itemSpacing 8.
 *
 * Akseli on `Variant` eikä `type`, koska nappi emittoi jo
 * `type="button"` — kaksi eri asiaa samalla nimellä olisi Dev Modessa
 * sekaannus. Koodi kutsuu näitä muutenkin varianteiksi
 * (components/Button.stories.tsx → `Variantit`).
 */

import figma from 'figma';

const label = figma.selectedInstance.getString('label');

const classes = figma.selectedInstance.getEnum('Variant', {
  primary: 'btn btn--primary',
  ghost: 'btn btn--ghost',
  text: 'btn btn--text',
});

const icon = figma.selectedInstance.getBoolean('showIcon', {
  true: ' <Icon name="arrow-right" />',
  false: '',
});

const disabled = figma.selectedInstance.getEnum('State', {
  default: '',
  hover: '',
  focus: '',
  disabled: ' disabled',
});

export default {
  id: 'Button',
  imports: [],
  example: figma.code`<button type="button" className="${classes}"${disabled}>${label}${icon}</button>`,
  metadata: { nestable: true },
};
