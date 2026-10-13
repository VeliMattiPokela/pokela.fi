// url=https://www.figma.com/design/PVyeKV6J1Rzyj2VL4X27FR/Pokela--Design-System?node-id=18-28
// component=Nav

/**
 * Code Connect — Nav.
 * ---------------------------------------------------------------
 * Navilla ei ole yhtään suunnitteluaikaista propsia. Se saa linkit
 * sanakirjasta ja tietää aktiivisen sivun reitistä (`usePathname`),
 * joten suunnittelija ei valitse siitä mitään — hän vain asettaa sen
 * sivun ylälaitaan.
 *
 * Figman `Breakpoint`-variantti ei käänny propsiksi: linkit
 * piiloutuvat @media-kyselyllä alle 600px:n, ei koodin haaralla.
 *
 * `Tila` (perus | tiivis, päätös 36) luetaan, vaikka kumpikin haara
 * on koodissa sama: tila tulee vierityksestä, kuten Switchin hover.
 * Lukeminen on se, mikä pitää variantin Figmassa — check:figma
 * vaatii jokaisen haaran olemassa olevaksi varianttina.
 *
 * Aktiivinen linkki on Figmassa `Nav / Link` -instanssin
 * State-variantti. Sillä ei ole omaa kytkentää, koska koodissa ei ole
 * erillistä linkkikomponenttia — se on `.nav__link` Navin sisällä.
 */

import figma from 'figma';

/* Vieritys asettaa tilan, joten kumpikin haara tuottaa saman koodin. */
figma.selectedInstance.getEnum('Tila', {
  perus: undefined,
  tiivis: undefined,
});

export default {
  id: 'Nav',
  imports: ["import Nav from '@/components/Nav';"],
  example: figma.code`<Nav locale={locale} dict={dict} />`,
};
