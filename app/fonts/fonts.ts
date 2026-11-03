import localFont from 'next/font/local';

/* Fontit ovat repossa (OFL, lisenssit tässä kansiossa), jotta build ei
   hae niitä Google Fontsista. Haku kaatoi Vercel-buildin aina välillä
   välimuistin palautuksen jälkeen. Tiedostot ovat samat kuin Googlen
   latin- ja latin-ext-osajoukot yhdeksi tiedostoksi koottuina, ks.
   scripts/fonttitiedostot.py. Muuttujat menevät tokens.css:n
   --font-display / --font-ui taakse. Sivusto ja Storybook tuovat
   fontit tästä. */

/* Bodoni Moda 400/500 */
export const bodoni = localFont({
  src: './BodoniModa.woff2',
  weight: '400 500',
  display: 'swap',
  variable: '--font-bodoni',
  adjustFontFallback: 'Times New Roman',
});

/* Archivo 400/500/600 */
export const archivo = localFont({
  src: './Archivo.woff2',
  weight: '400 600',
  display: 'swap',
  variable: '--font-archivo',
  adjustFontFallback: 'Arial',
});
