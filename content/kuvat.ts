import type { Ratio } from '@/components/Media';

/**
 * Kuvat jotka eivät ole casejen kuvapaikkoja.
 *
 * Casejen ja aiempien töiden kuvat asuvat sisältötiedostoissa, koska
 * ne kuuluvat siihen tekstiin. Muotokuva ei kuulu mihinkään caseen —
 * mutta sen on silti kuljettava saman putken läpi, jotta se saa
 * samat muodot, samat koot ja saman tarkistuksen. Ilman tätä
 * rekisteriä se olisi jäänyt ainoaksi käsin ylläpidetyksi kuvaksi.
 */
export const erilliset: { id: string; ratio: Ratio; caption: string }[] = [
  {
    id: 'muotokuva',
    ratio: '1:1',
    caption: 'Muotokuva. Tausta poistettu, joten se piirtyy suoraan paperille ilman kehystä.',
  },
];
