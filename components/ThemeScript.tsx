/**
 * Teeman palautus ennen ensimmäistä maalausta.
 *
 * Ilman tätä sivu välähtäisi vaaleana ennen kuin tallennettu tumma
 * teema ehtii päälle. Skripti on tarkoituksella pieni ja synkroninen,
 * ja se ajetaan <head>issä ennen tyylejä.
 *
 * Ilman tallennettua valintaa data-themeä ei aseteta lainkaan, jolloin
 * tokens.css:n `color-scheme: light dark` seuraa käyttöjärjestelmää.
 */

export const THEME_STORAGE_KEY = 'pokela-theme';

const script = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t)}}catch(e){}})()`;

export default function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
