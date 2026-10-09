#!/usr/bin/env node
/**
 * Rakentaa npm-paketin komponenteista.
 * ---------------------------------------------------------------
 * Tokenit kertovat Figma Makelle mitkä värit ja mitat ovat oikein.
 * Ne eivät kerro miltä listarivi näyttää. Ilman komponentteja Make
 * piirtää oman versionsa jokaisesta elementistä, ja prototyyppi on
 * oikeanvärinen mutta väärän muotoinen.
 *
 * Lähde on `components/` — samat tiedostot joita sivusto käyttää.
 * Niitä ei kopioida käsin eikä kirjoiteta uudelleen: tiedostot
 * siirretään sellaisenaan ja käännetään. Siksi paketin komponentti ei
 * voi erota siitä jota sivusto ajaa.
 *
 * VIETÄVÄT on käsin valittu lista. Ehto on että komponentti ei tuo
 * mitään sivustokohtaista — ei `@/content`, ei `@/lib`, ei
 * `next/*`. Sen voi tarkistaa koneella, mutta valinta on silti
 * harkintaa: osa riippumattomista komponenteista on silti sivuston
 * ominaisuuksia eikä design systemin osia.
 *
 * Koko hakemisto on `.gitignore`ssa ja syntyy komennolla
 * `npm run paketti`.
 */

import { readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync, existsSync, copyFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { fonttiOsoite } from './fontit.mjs';

export const root = join(dirname(fileURLToPath(import.meta.url)), '..');
export const PAKETTI = join(root, 'packages/components');
const VALIAIKAINEN = join(root, 'packages/.lahde-komponentit');

const NIMI = '@pokela/components';
const TOKENIT = '@pokela/tokens';
const LISENSSI = 'MIT';
const TEKIJA = 'Veli-Matti Pokela';
const VUOSI = 2026;

/** Komponentit jotka paketti vie. Ks. tiedoston alku. */
export const VIETAVAT = ['Icon', 'ListRow', 'Accordion', 'Timeline', 'ExplodedView', 'PageHeader', 'Section', 'Grid', 'Reveal', 'ThemeScript', 'ThemeToggle'];

/**
 * CSS jonka vietävät komponentit tarvitsevat.
 *
 * `base.css` on mukana kokonaan: siinä ovat perusluokat joita
 * komponentit käyttävät (`.page`, `.bleed`, `.meta`, `.grid`,
 * `.reveal`). Sen pilkkominen olisi oma työnsä eikä kuulu tähän.
 */
export const TYYLIT = [
  'styles/base.css',
  'styles/components/icon.css',
  'styles/components/list-row.css',
  'styles/components/accordion.css',
  'styles/components/timeline.css',
  'styles/components/exploded-view.css',
  'styles/components/patterns.css',
];

/**
 * Komponentit jotka EIVÄT lähde, ja miksi. Tämä ei ole dokumentaatiota
 * vaan paketin README:n lähde — jos syy on kirjoitettu vain kommenttiin,
 * se vanhenee ensimmäisenä.
 */
export const ULKOPUOLELLA = [
  ['Media, LogoRow, CaseText, CaseBlock, CaseBlocks, CaseBlockDerived, ListRowShowcase',
   'lukevat sivuston omaa sisältöä (`@/content`, `@/lib`)'],
  ['Nav, Footer', 'tarvitsevat sivuston sanakirjan ja reitityksen'],
  ['BeforeAfter, Video', 'rakentuvat Median varaan, ja Media lukee kuvamanifestia'],
  ['HeroName', 'piirtää sivuston omaa nimeä fontin ääriviivoista (`@/content/nimi.generated.json`)'],
  ['SivuKerroksina', 'kokoaa tämän sivuston räjäytyskuvan sen omista tokeneista ja sisällöstä; yleinen osa on ExplodedView'],
  ['HeroIntro, HeroIntroLiike', 'ovat etusivun intro: sivuston ominaisuus, ei design systemin osa'],
  ['ComponentView, PrintCv',
   'ovat riippumattomia mutta sivuston ominaisuuksia — lähdekoodinäkymä ja CV:n tulostusasu — eivät design systemin osia'],
];

/* ---- vientien poiminta --------------------------------------------- */

/**
 * Lukee komponentin vientilauseet. Kokoomatiedostoa ei kirjoiteta
 * käsin: jos komponenttiin lisätään vienti, se tulee pakettiin
 * ilman että kukaan muistaa päivittää listaa.
 */
export function viennit(lahde) {
  const arvot = [];
  const tyypit = [];
  let oletus = null;

  for (const rivi of lahde.split('\n')) {
    let m = /^export default function ([A-Za-z_$][\w$]*)/.exec(rivi);
    if (m) {
      oletus = m[1];
      continue;
    }
    m = /^export type ([A-Za-z_$][\w$]*)/.exec(rivi);
    if (m) {
      tyypit.push(m[1]);
      continue;
    }
    m = /^export (?:function|const|class) ([A-Za-z_$][\w$]*)/.exec(rivi);
    if (m) arvot.push(m[1]);
  }
  return { oletus, arvot, tyypit };
}

/* ---- rakennus ------------------------------------------------------ */

export function rakenna({ kirjoita = true } = {}) {
  const versio = JSON.parse(readFileSync(join(root, 'tokens.json'), 'utf8')).$meta.version;

  /* 1. lähteet väliaikaiseen hakemistoon, sellaisenaan */
  if (existsSync(VALIAIKAINEN)) rmSync(VALIAIKAINEN, { recursive: true });
  mkdirSync(VALIAIKAINEN, { recursive: true });

  const kokooma = [];
  for (const nimi of VIETAVAT) {
    const polku = join(root, `components/${nimi}.tsx`);
    if (!existsSync(polku)) throw new Error(`components/${nimi}.tsx puuttuu`);
    const lahde = readFileSync(polku, 'utf8');

    /* Sivustokohtainen tuonti paketissa olisi rikki heti. Tämä ei ole
       tyylisääntö vaan se ehto jonka takia komponentti ylipäätään on
       tässä listassa — jos se rikkoutuu, build pysähtyy tähän. */
    const kielletyt = [...lahde.matchAll(/from '(@\/[^']+|next\/[^']+)'/g)].map((m) => m[1]);
    if (kielletyt.length) {
      throw new Error(
        `components/${nimi}.tsx tuo sivustokohtaista: ${kielletyt.join(', ')}\n` +
          `  Joko komponentti irrotetaan niistä tai se poistetaan VIETAVAT-listalta.`,
      );
    }

    copyFileSync(polku, join(VALIAIKAINEN, `${nimi}.tsx`));

    const { oletus, arvot, tyypit } = viennit(lahde);
    const osat = [];
    if (oletus) osat.push(`default as ${nimi}`);
    osat.push(...arvot);
    if (osat.length) kokooma.push(`export { ${osat.join(', ')} } from './${nimi}.js';`);
    if (tyypit.length) kokooma.push(`export type { ${tyypit.join(', ')} } from './${nimi}.js';`);
  }

  writeFileSync(
    join(VALIAIKAINEN, 'index.ts'),
    `/* ${NIMI} — kokooma. Generoitu, ks. scripts/paketti-komponentit.mjs. */\n\n` +
      /* Tyylit tulevat komponenttien mukana: käyttäjän ei tarvitse
         muistaa tuontia, eikä Make kitiin tarvitse lisätä mitään. */
      `import './styles.css';\n\n` +
      `${kokooma.join('\n')}\n`,
  );

  /* 2. käännös — tsc on jo riippuvuutena, erillistä niputtajaa ei tarvita */
  if (existsSync(PAKETTI)) rmSync(PAKETTI, { recursive: true });
  mkdirSync(join(PAKETTI, 'styles'), { recursive: true });

  const tsconfig = join(VALIAIKAINEN, 'tsconfig.json');
  writeFileSync(
    tsconfig,
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          module: 'esnext',
          moduleResolution: 'bundler',
          jsx: 'react-jsx',
          strict: true,
          declaration: true,
          skipLibCheck: true,
          outDir: PAKETTI,
          rootDir: VALIAIKAINEN,
        },
        include: ['*.ts', '*.tsx'],
      },
      null,
      2,
    ),
  );

  if (kirjoita) {
    const tulos = spawnSync('npx', ['tsc', '-p', tsconfig], { cwd: root, encoding: 'utf8' });
    if (tulos.status !== 0) {
      throw new Error(`tsc kaatui:\n${tulos.stdout}${tulos.stderr}`);
    }
  }

  /* 3. tyylit */
  const tyylitiedostot = [];
  for (const suhteellinen of TYYLIT) {
    const nimi = suhteellinen.split('/').pop();
    tyylitiedostot.push(nimi);
    if (kirjoita) copyFileSync(join(root, suhteellinen), join(PAKETTI, 'styles', nimi));
  }

  /* `styles.css` tuo kaiken yhdellä rivillä ja oikeassa järjestyksessä.
     Tokenit tulevat erillisestä paketista, joten ne tuodaan nimellä.
     Fontit ensin: @import url() on sallittu vain tiedoston alussa, ja
     ilman niitä sivu näkyy Georgialla ja Helveticalla. */
  const tyyliKokooma =
    `/* ${NIMI} — kaikki tyylit. Järjestys on merkitsevä. */\n` +
    `@import url('${fonttiOsoite()}');\n` +
    `@import '${TOKENIT}/tokens.css';\n` +
    tyylitiedostot.map((t) => `@import './styles/${t}';`).join('\n') +
    '\n';

  /* 4. oheistiedostot */
  const tiedostot = {
    'styles.css': tyyliKokooma,
    'package.json':
      JSON.stringify(
        {
          name: NIMI,
          version: versio,
          description: `React-komponentit: Pokela Design System. Generoitu tiedostoista components/, ei käsin ylläpidetty.`,
          license: LISENSSI,
          author: TEKIJA,
          type: 'module',
          /* index.js tuo styles.css:n; ilman tätä bundleri pudottaa tuonnin. */
          sideEffects: ['*.css', './index.js'],
          exports: {
            '.': { types: './index.d.ts', import: './index.js' },
            './styles.css': './styles.css',
            './styles/*': './styles/*',
          },
          files: ['*.js', '*.d.ts', 'styles.css', 'styles/', 'guidelines/', 'README.md', 'LICENSE'],
          dependencies: { [TOKENIT]: `^${versio}` },
          peerDependencies: { react: '>=18' },
          repository: {
            type: 'git',
            url: 'git+https://github.com/VeliMattiPokela/pokela.fi.git',
            directory: 'packages/components',
          },
        },
        null,
        2,
      ) + '\n',
    LICENSE: `MIT License

Copyright (c) ${VUOSI} ${TEKIJA}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`,
    'README.md': lueMinut(versio, tyylitiedostot),
  };

  /* 5. Figma Maken ohjeet pakettiin. Kitin ohjeet ovat Maken
     käyttöliittymässä, eikä niihin ole rajapintaa, joten käsin kopioitu
     teksti vanhenisi. Kun ohjeet tulevat paketin mukana, kitin
     setup-ohje voi vain osoittaa niihin, ja paketin päivitys tuo ne. */
  for (const f of readdirSync(join(root, 'guidelines'))) tiedostot[`guidelines/${f}`] = readFileSync(join(root, 'guidelines', f), 'utf8');

  if (kirjoita) {
    mkdirSync(join(PAKETTI, 'guidelines'), { recursive: true });
    for (const [nimi, sisalto] of Object.entries(tiedostot)) {
      writeFileSync(join(PAKETTI, nimi), sisalto);
    }
    rmSync(VALIAIKAINEN, { recursive: true });
  }

  return { versio, komponentit: VIETAVAT, tyylit: tyylitiedostot, kokooma };
}

function lueMinut(versio, tyylit) {
  return `# ${NIMI}

React-komponentit: **Pokela Design System**, versio ${versio}.

> Generoitu hakemistosta \`components/\` — samoista tiedostoista joita sivusto
> ajaa. Älä muokkaa käsin: muutokset tehdään lähteeseen ja paketti
> rakennetaan uudelleen komennolla \`npm run paketti\`.

## Käyttö

\`\`\`js
import { ListRow, Icon, Accordion, Grid, Col, Reveal } from '${NIMI}';
\`\`\`

Tyylit, \`${TOKENIT}\`:n muuttujat ja fontit (Google Fonts) latautuvat
komponenttien mukana. Erillistä tuontia ei tarvita. Ilman bundleria
tyylit saa myös suoraan: \`${NIMI}/styles.css\`.

## Komponentit

${VIETAVAT.map((k) => `- \`${k}\``).join('\n')}

### Linkit

\`ListRow\` ei ole sidottu mihinkään reititykseen. Oletuksena se renderöi
tavallisen \`<a>\`:n; Next.js-sovellus antaa oman linkkinsä propsina:

\`\`\`jsx
import Link from 'next/link';

<ListRow as={Link} title="Työn nimi" href="/tyot/esimerkki" />
\`\`\`

## Mitä paketissa EI ole

${ULKOPUOLELLA.map(([mitka, miksi]) => `- **${mitka}** — ${miksi}`).join('\n')}

## Tyylit

${tyylit.map((t) => `- \`styles/${t}\``).join('\n')}

Luokat ovat globaaleja, eivät CSS-moduuleja. Se on tarkoituksellista: sama
luokka on myös Figmassa komponentin nimenä, ja hajautettu nimi katkaisisi
yhteyden.

## Lisenssi

${LISENSSI}. Koskee tätä pakettia, ei sitä repoa josta se on generoitu.
`;
}

/* ---- komentorivi --------------------------------------------------- */

if (import.meta.url === `file://${process.argv[1]}`) {
  const { versio, komponentit, tyylit } = rakenna();
  console.log(`\n✓ Paketti rakennettu — ${NIMI} ${versio}`);
  console.log(`  ${komponentit.length} komponenttia, ${tyylit.length} tyylitiedostoa`);
  console.log(`  packages/components/\n`);
}
