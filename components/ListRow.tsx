import type { ElementType, ReactNode } from 'react';

export type ListRowProps = {
  /** Työn nimi. */
  title: string;
  /** Järjestysnumero vasempaan laitaan. Valinnainen. */
  number?: string;
  /** Yhden lauseen kuvaus. Valinnainen. */
  description?: string;
  /** Rooli tai vuosi, oikeaan laitaan metana. Valinnainen. */
  meta?: string;
  /** `m` on isompi otsikko ja väljempi rytmi — työlistan kärkirivit. */
  size?: 's' | 'm';
  href: string;
  /**
   * Siirtymä kohdesivulle on kesken: alaviiva piirtyy musteella.
   * Sivustolla tilan asettaa PageProgress klikkauksesta; propsi
   * näyttää sen staattisena (Storybook, Figma).
   */
  pending?: boolean;
  /** Lisäluokka, esim. `invert` kun tila näytetään staattisena. */
  className?: string;
  /**
   * Linkkikomponentti. Oletus on tavallinen `<a>`, jotta komponentti ei
   * ole sidottu mihinkään reititykseen — se on ehto sille että tämä voi
   * elää npm-paketissa. Next.js-sovellus antaa tähän `next/link`:n ja
   * saa reitityksen takaisin. Tyyppi vaatii, että komponentti ottaa
   * vastaan `href`:n.
   */
  as?: ElementType<{ href: string; className?: string; children?: ReactNode }>;
};

/**
 * Listarivi — sivuston tunnuskomponentti.
 *
 * Yksi runko, erot modifioijina: numero, koko (`s`, `m`) ja
 * siirtymätila.
 *
 * Avautuva rivi on <Accordion>: se on <button> eikä linkki, joten se
 * ei mahdu tähän propsiksi ilman että komponentista tulee kaksi
 * komponenttia yhdessä. Se käyttää samaa `.list-row`-runkoa.
 *
 * Hover kääntää pinnan mustaksi. Logiikka on kokonaan CSS:ssä
 * (styles/components/list-row.css), joten komponentti ei tiedä
 * tiloista mitään.
 *
 * `.bleed` hoitaa vaakapaddingin, jotta rivi ulottuu reunaan mutta
 * teksti pysyy .page:n linjassa.
 *
 * Siirtymän aikana (`pending`) alaviiva piirtyy musteella. Rivi
 * merkitsee itsensä `data-siirtyma="oma"`, joten PageProgress ei
 * piirrä sille yläreunan viivaa vaan merkitsee rivin (päätös 41).
 *
 * Linkki tulee `as`-propsina eikä tuontina. Siksi komponentti ei tiedä
 * Next.js:stä mitään ja kelpaa sellaisenaan mihin tahansa projektiin.
 */
export default function ListRow({
  title,
  number,
  description,
  meta,
  size = 's',
  href,
  pending = false,
  className,
  as: Link = 'a',
}: ListRowProps) {
  return (
    <Link
      href={href}
      data-siirtyma="oma"
      className={[
        'list-row bleed',
        number ? 'list-row--numbered' : null,
        size === 'm' ? 'list-row--m' : null,
        pending ? 'list-row--pending' : null,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {number ? <span className="meta list-row__number">{number}</span> : null}
      <span className="list-row__main">
        <span className={`list-row__title ${size === 'm' ? 'display-m' : 'display-s'}`}>{title}</span>
        {description ? <span className="body-s muted list-row__description">{description}</span> : null}
      </span>
      {meta ? <span className="meta list-row__meta">{meta}</span> : null}
    </Link>
  );
}
