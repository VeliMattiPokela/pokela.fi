// url=https://www.figma.com/design/PVyeKV6J1Rzyj2VL4X27FR/Pokela--Design-System?node-id=44-79
// component=Icon

/**
 * Code Connect — Icon.
 * ---------------------------------------------------------------
 * Kuusi merkkiä, kolme kokoa: 18 varianttia. Kartoitus on suora,
 * koska Figman akselit ja koodin propsit ovat tässä sama asia —
 * `Name` on `name`, `Size` on `size`.
 *
 * Geometria on kahdessa paikassa (components/Icon.tsx ja Figman
 * vektorit) eikä sitä voi johtaa toisesta: Figmassa ei ole SVG-
 * polkua jota importoida eikä `vector-effect`-vastinetta. Ero on
 * hoidettu niin että kumpikin piirtää saman 16×16-ruudukon ja
 * viivanpaksuus tulee molemmissa hiusviivasta — Figmassa
 * Border/hairline, koodissa `--hairline`. Koordinaatit on Figmassa
 * skaalattu valmiiksi kokoon, koska viewBoxin muunnos paistuisi myös
 * viivanpaksuuteen.
 *
 * Väri ei ole propsi kummassakaan. Koodissa se on `currentColor`,
 * Figmassa instanssin ylikirjoitus: merkin väri luetaan siitä
 * tekstistä jonka vieressä se on. Ks. ListRow'n ja Buttonin
 * variantit.
 */

import figma from 'figma';

const name = figma.selectedInstance.getEnum('Name', {
  'arrow-right': 'arrow-right',
  'arrow-up-right': 'arrow-up-right',
  plus: 'plus',
  minus: 'minus',
  close: 'close',
  menu: 'menu',
});

/* `m` on oletus myös koodissa, joten sitä ei kirjoiteta näkyviin. */
const size = figma.selectedInstance.getEnum('Size', {
  s: 's',
  m: undefined,
  l: 'l',
});

export default {
  id: 'Icon',
  imports: ["import Icon from '@/components/Icon';"],
  example: figma.code`<Icon${figma.helpers.react.renderProp('name', name)}${figma.helpers.react.renderProp(
    'size',
    size,
  )}/>`,
  metadata: { nestable: true },
};
