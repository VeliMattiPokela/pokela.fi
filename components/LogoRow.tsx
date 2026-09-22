import type { CSSProperties } from 'react';
import { visibleLogos } from '@/content/logos';
import manifesti from '@/content/media.generated.json';

const LOGOT = manifesti.logot as unknown as Record<
  string,
  { muoto: string; leveys: number; korkeus: number }
>;

/**
 * Asiakaslogorivi.
 *
 * Logot ovat mustaa läpinäkyvällä taustalla, joten ne piirretään
 * CSS-maskina: väri tulee tokenista ja logo toimii molemmissa
 * teemoissa. Ilman maskia ne katoaisivat tummalla pinnalla.
 *
 * Leveys lasketaan alkuperäisestä kuvasuhteesta, korkeus on
 * optinen ja annettu per logo (content/logos.ts). Kuvasuhde luetaan
 * kuvamanifestista — se on mitattavissa tiedostosta, joten sitä ei
 * kirjoiteta käsin.
 *
 * Tiedostot ovat johdannaisia: `npm run kuvat` pienentää lähteen
 * näyttökokoon ja pakkaa sen yksikanavaiseksi, koska maskista luetaan
 * vain alfa. Virallinen SVG voittaa PNG:n jos sellainen pudotetaan
 * kansioon `kuvat/logo/`.
 */
export default function LogoRow({ label }: { label: string }) {
  return (
    <div className="logo-row-block">
      <h2 className="meta logo-row__label">{label}</h2>
      <ul className="logo-row">
        {visibleLogos.map((logo) => {
          const mitat = LOGOT[logo.file];
          return (
          <li
            key={logo.file}
            className="logo-row__item"
            title={logo.name}
            style={
              {
                '--logo-src': `url(/kuva/logo/${logo.file}.${mitat.muoto})`,
                '--logo-h': `${logo.height}px`,
                '--logo-w': `${Math.round((mitat.leveys / mitat.korkeus) * logo.height)}px`,
              } as CSSProperties
            }
          >
            <span className="visually-hidden">{logo.name}</span>
          </li>
          );
        })}
      </ul>
    </div>
  );
}
