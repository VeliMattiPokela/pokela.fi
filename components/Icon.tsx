/**
 * Ikoni.
 *
 * Systeemi ei käytä ikonikirjastoa — se piirtää omat merkkinsä. Syy on
 * sama kuin kaikessa muussakin täällä: merkin pitää olla samaa kieltä
 * kuin viiva, väli ja typografia, eikä kolmannen osapuolen piirtäjän
 * tulkinta siitä. Käytännön syy tuli kaupan päälle: `↗` ja `✕` olivat
 * ennen tekstimerkkejä, ja ne riippuivat siitä mitä Google Fontsin
 * osajoukossa sattui olemaan. Figmassa nuolta ei löytynyt Archivosta
 * lainkaan.
 *
 * Piirtosäännöt:
 *   ruudukko    16 × 16, kaikki geometria puolikkaalla pikselillä
 *   viiva       --hairline, sama kuin jokainen reuna systeemissä
 *   päätteet    tylpät, kulmat terävät — --radius on 0
 *   väri        currentColor, ei koskaan omaa väriä
 *
 * Koot ovat tokeneita: --icon-s (12) tekstin seassa metan kanssa,
 * --icon-m (16) napin sisällä, --icon-l (24) omana painikkeenaan.
 *
 * Nuoli on kahta lajia eikä yhtä: `arrow-right` vie sivustolla eteen-
 * päin, `arrow-up-right` ulos. Ero on lukijalle sama kuin
 * target="_blank" ruudunlukijalle.
 */

export type IconName =
  | 'arrow-right'
  | 'arrow-up-right'
  | 'plus'
  | 'minus'
  | 'close'
  | 'menu';

export type IconSize = 's' | 'm' | 'l';

/* Polut 16×16-ruudukolla. Yksi merkki = yksi taulukollinen `d`-polkuja,
   jotta jokainen viiva saa saman hiusviivan eikä täyttöä tarvita. */
const PATHS: Record<IconName, string[]> = {
  'arrow-right': ['M2.5 8.5 H13.5', 'M9.5 4.5 L13.5 8.5 L9.5 12.5'],
  'arrow-up-right': ['M3.5 12.5 L12.5 3.5', 'M5.5 3.5 H12.5 V10.5'],
  plus: ['M8.5 2.5 V14.5', 'M2.5 8.5 H14.5'],
  minus: ['M2.5 8.5 H14.5'],
  close: ['M3.5 3.5 L12.5 12.5', 'M12.5 3.5 L3.5 12.5'],
  menu: ['M1 5.5 H15', 'M1 10.5 H15'],
};

export type IconProps = {
  name: IconName;
  size?: IconSize;
  /** Nimi ruudunlukijalle. Ilman tätä ikoni on koriste (aria-hidden). */
  label?: string;
  className?: string;
};

export default function Icon({ name, size = 'm', label, className }: IconProps) {
  return (
    <svg
      className={['icon', `icon--${size}`, className].filter(Boolean).join(' ')}
      viewBox="0 0 16 16"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

/** Ikonien nimet järjestyksessä — dokumentaatiosivut lukevat tästä. */
export const ICON_NAMES = Object.keys(PATHS) as IconName[];
