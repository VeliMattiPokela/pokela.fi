import type { CSSProperties } from 'react';
import { visibleLogos } from '@/content/logos';

/**
 * Asiakaslogorivi.
 *
 * Logot ovat mustaa läpinäkyvällä taustalla, joten ne piirretään
 * CSS-maskina: väri tulee tokenista ja logo toimii molemmissa
 * teemoissa. Ilman maskia ne katoaisivat tummalla pinnalla.
 *
 * Leveys lasketaan alkuperäisestä kuvasuhteesta, korkeus on
 * optinen ja annettu per logo (content/logos.ts).
 */
export default function LogoRow({ label }: { label: string }) {
  return (
    <div className="logo-row-block">
      <h2 className="meta logo-row__label">{label}</h2>
      <ul className="logo-row">
        {visibleLogos.map((logo) => (
          <li
            key={logo.file}
            className="logo-row__item"
            title={logo.name}
            style={
              {
                '--logo-src': `url(/assets/logo/${logo.file})`,
                '--logo-h': `${logo.height}px`,
                '--logo-w': `${Math.round((logo.w / logo.h) * logo.height)}px`,
              } as CSSProperties
            }
          >
            <span className="visually-hidden">{logo.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
