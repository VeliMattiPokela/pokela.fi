import type { Ratio } from '@/components/Media';

/**
 * Kuvapaikat jotka eivät ole casejen sisällössä.
 *
 * Casejen ja aiempien töiden kuvat asuvat sisältötiedostoissa, koska
 * ne kuuluvat siihen tekstiin. Etusivun ja työlistan kuvapaikat eivät
 * kuulu mihinkään caseen — mutta niiden on silti kuljettava saman
 * putken läpi, jotta ne saavat samat muodot, samat koot, saman
 * järjestysnumeron ja saman tarkistuksen.
 *
 * Nämä olivat pitkään näkymättömiä kuvaputkelle: kuvateksti tuli
 * sanakirjasta ja kuvasuhde kirjoitettiin käyttökohtaan. Sivulla
 * näkyi raidoitettu laatikko jolla ei ollut numeroa eikä tunnistetta,
 * eikä `npm run kuvat` tiennyt niistä mitään. Neljä kuvapaikkaa
 * kahdestakymmenestäneljästä olisi jäänyt täyttämättä ilman että
 * mikään kertoo siitä.
 *
 * Kuvasuhde on nyt tässä eikä käyttökohdassa. Muuten sivu ja putki
 * voisivat olla eri mieltä siitä minkä muotoinen kuva paikkaan tulee.
 */
export type Kuvapaikka = {
  id: string;
  ratio: Ratio;
  caption: string;
  /** Mihin näkymään paikka kuuluu. Näkyy luettelossa. */
  missa: string;
};

export const erilliset: Kuvapaikka[] = [
  {
    id: 'etusivu-hero',
    ratio: 'hero',
    caption: 'Täysleveä kuva 21:9 — työn hero tai valokuva',
    missa: 'Etusivu',
  },
  {
    id: 'etusivu-colliers',
    ratio: '4:3',
    caption: 'Colliers — asuntohaku',
    missa: 'Etusivu',
  },
  {
    id: 'etusivu-blokbook',
    ratio: '4:5',
    caption: 'Blokbook — varausnäkymä',
    missa: 'Etusivu',
  },
  {
    id: 'tyot-storybook',
    ratio: '4:3',
    caption: 'Nosto: Storybook-näkymä',
    missa: 'Työlista',
  },
  {
    id: 'muotokuva',
    ratio: '1:1',
    caption: 'Muotokuva. Tausta poistettu, joten se piirtyy suoraan paperille ilman kehystä.',
    missa: 'Tietoa-sivu',
  },
];

/**
 * Paikan tiedot Medialle. Puuttuva tunniste on kirjoitusvirhe, ei
 * tyhjä paikka — siksi se heittää eikä palauta tyhjää.
 */
export function kuvapaikka(id: string): { id: string; ratio: Ratio; caption: string } {
  const osuma = erilliset.find((k) => k.id === id);
  if (!osuma) throw new Error(`Kuvapaikkaa ei ole: ${id} (content/kuvat.ts)`);
  return { id: osuma.id, ratio: osuma.ratio, caption: osuma.caption };
}
