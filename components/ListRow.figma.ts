// url=https://www.figma.com/design/PVyeKV6J1Rzyj2VL4X27FR/Pokela--Design-System?node-id=5-32
// component=ListRow

/**
 * Code Connect — ListRow.
 * ---------------------------------------------------------------
 * Tässä kaksi suuntaa kohtaavat. Figman variantti- ja property-nimet
 * kartoitetaan koodin propseiksi, jolloin Figman Dev Mode näyttää
 * tämän komponentin oikean käyttötavan sen sijaan että se arvaisi
 * rakenteesta.
 *
 * Yksi rivi, kolme käyttöä: perusrivi, numerollinen kärkirivi ja
 * avautuva rivi (<Accordion>, oma komponenttinsa koska se on
 * <button> eikä linkki). Runko on sama `.list-row`.
 *
 * Kartoitus on tarkoituksella kapea, koska koodi ja Figma eivät ole
 * sama asia:
 *
 *   title            → propsi sellaisenaan
 *   Size             → `size` — 'm' on työlistan kärkirivi
 *   showNumber       → koodissa valinnainen `number?`
 *   showDescription  → koodissa yksi valinnainen `description?`
 *   showMeta         → koodissa yksi valinnainen `meta?`
 *   showIcon / icon  → ei kartoitu: koodin ListRow'ssa ei ole ikonia.
 *                      Paikka on Figmassa siksi että Accordion on
 *                      sisäkkäinen ListRow, ja merkki kuuluu sille.
 *   State=hover      → `className="invert"`, eli sama pinta
 *                      staattisena. :hover ja :focus-visible ovat
 *                      CSS:n tiloja, eivät propseja, joten ne eivät
 *                      käänny miksikään.
 *   Breakpoint       → @media-katko, ei propsi. Ei kartoitu.
 *
 * Tiedostomuoto on Code Connect v2:n template, ei vanha
 * parser-pohjainen `.figma.tsx`: v2 ei enää tue framework-parsereita.
 *
 * Julkaisu: `npm run figma:publish` (vaatii FIGMA_ACCESS_TOKENin).
 * Tarkistus ilman julkaisua: `npm run figma:check`.
 */

import figma from 'figma';

const title = figma.selectedInstance.getString('title');

const description = figma.selectedInstance.getBoolean('showDescription', {
  true: figma.selectedInstance.getString('description'),
  false: undefined,
});

const meta = figma.selectedInstance.getBoolean('showMeta', {
  true: figma.selectedInstance.getString('meta'),
  false: undefined,
});

const number = figma.selectedInstance.getBoolean('showNumber', {
  true: figma.selectedInstance.getString('number'),
  false: undefined,
});

const size = figma.selectedInstance.getEnum('Size', {
  s: undefined,
  m: 'm',
});

const className = figma.selectedInstance.getEnum('State', {
  default: undefined,
  hover: 'invert',
  focus: undefined,
});

export default {
  id: 'ListRow',
  imports: ["import ListRow from '@/components/ListRow';"],
  example: figma.code`<ListRow href="/fi/tyot/colliers"${figma.helpers.react.renderProp(
    'size',
    size,
  )}${figma.helpers.react.renderProp('number', number)}${figma.helpers.react.renderProp(
    'title',
    title,
  )}${figma.helpers.react.renderProp('description', description)}${figma.helpers.react.renderProp(
    'meta',
    meta,
  )}${figma.helpers.react.renderProp('className', className)}/>`,
  metadata: { nestable: true },
};
