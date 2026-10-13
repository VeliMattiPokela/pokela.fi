import type { Esitys, Ratio } from '@/components/Media';

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
  /**
   * Kuinka leveänä kuva piirtyy kahden pikselin näytöllä.
   * Putki varoittaa liian pienestä lähteestä tämän perusteella.
   * Ilman arvoa oletetaan täysleveä, mikä on väärin esimerkiksi
   * muotokuvalle — se on neljä saraketta kahdestatoista.
   */
  tarveLeveys?: number;
  /** `taysi` valokuvalle, `viiva` viivapiirrokselle. Oletus `levy`, ks. Media. */
  esitys?: Esitys;
};

export const erilliset: Kuvapaikka[] = [
  {
    /* Viivaesityksen esimerkki Storybookissa (Media, Viiva). Kuva oli
       ennen etusivun hero; sen korvasi koodilla piirretty
       Korkeuskayrat (päätös 35). Viivat piirretään tokenin värillä,
       joten kuva toimii molemmissa teemoissa. */
    id: 'media-viiva',
    ratio: 'hero',
    caption: 'Korkeuskäyrät viivapiirroksena',
    esitys: 'viiva',
    missa: 'Storybook',
  },
  {
    /* Yksi iso kuva nostoparin tilalla: nauha jatkuu ruudun reunoihin
       ja kuva pysyy keskellä sivun levyisenä, kuten casejen herossa. */
    id: 'etusivu-hero',
    ratio: 'hero',
    caption: 'Valittu työ isona — täysleveä herokuva',
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
    esitys: 'taysi',
    tarveLeveys: 880,
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
