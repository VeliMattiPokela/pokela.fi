import Link from 'next/link';

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
  /** Lisäluokka, esim. `invert` kun tila näytetään staattisena. */
  className?: string;
};

/**
 * Listarivi — sivuston tunnuskomponentti.
 *
 * Yksi rivi, kolme käyttöä. Sivustolla oli pitkään kolme lähes
 * samanlaista riviä: etusivun listarivi, työlistan kärkirivi ja
 * aiemman työn avautuva rivi. Niillä oli sama viiva, sama käännös ja
 * sama sisältö mutta kolme eri toteutusta, jotka ehtivät jo ajautua
 * erilleen. Nyt runko on yksi ja erot ovat modifioijia.
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
 */
export default function ListRow({
  title,
  number,
  description,
  meta,
  size = 's',
  href,
  className,
}: ListRowProps) {
  return (
    <Link
      href={href}
      className={[
        'list-row bleed',
        number ? 'list-row--numbered' : null,
        size === 'm' ? 'list-row--m' : null,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {number ? <span className="meta list-row__number">{number}</span> : null}
      <span className="list-row__main">
        <span className="list-row__title">{title}</span>
        {description ? <span className="list-row__description">{description}</span> : null}
      </span>
      {meta ? <span className="meta list-row__meta">{meta}</span> : null}
    </Link>
  );
}
