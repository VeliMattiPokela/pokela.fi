// url=https://www.figma.com/design/PVyeKV6J1Rzyj2VL4X27FR/Pokela--Design-System?node-id=21-29
// component=Footer

/**
 * Code Connect — Footer.
 * ---------------------------------------------------------------
 * Kuten Navilla, suunnitteluaikaisia propseja ei ole: footer on sama
 * joka sivulla ja saa sisältönsä sanakirjasta. `Breakpoint` on
 * @media-katko, ei propsi.
 *
 * Yksi ero Figman ja selaimen välillä on kirjattu komponenttiin:
 * `LinkedIn ↗` -nuolta ei ole Archivossa. Selain putoaa
 * järjestelmäfonttiin automaattisesti; Figmassa sama putoaminen on
 * tehty käsin (nuolimerkki on Interillä), jotta tiedosto näyttää sen
 * mitä selain näyttää eikä tyhjää laatikkoa.
 */

import figma from 'figma';

export default {
  id: 'Footer',
  imports: ["import Footer from '@/components/Footer';"],
  example: figma.code`<Footer dict={dict} />`,
};
