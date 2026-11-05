import type { Johdetut } from './fi';

/**
 * Case 03:n johdetut tekstit englanniksi (päätös 60). Tarkistusten ja
 * prosessin tekstit käännetään tunnisteen mukaan: lähde on suomeksi
 * lib/checks.ts:ssä ja content/prosessi.ts:ssä, ja check:kielet
 * vaatii jokaiselle tunnisteelle käännöksen.
 */
const johdetut: Johdetut = {
  artefaktit: {
    otsikko: '{n} places to check the work',
    avaa: 'Open',
    tehty: 'Done',
    eiJulkinen: 'not public yet',
    tulossa: 'Coming',
    figmaTiedosto: 'Figma file',
    kytkennat: 'Code Connect mappings',
    storybook: 'Components, tokens and states in the browser. The same code this page uses.',
    figma: 'The same library in Figma: components, variants and tokens.',
    codeConnect: 'Definitions that tell Figma which code component matches what.',
    codeConnectTila: '{n} mappings, published to Figma. They show in Dev Mode, which needs a Figma account',
    repo: 'The whole site, tokens, build and checks.',
  },
  tarkistukset: {
    tarkistaa: 'Checks',
    avaa: 'Open',
    sulje: 'Close',
    lapi: 'Passed',
    paivays: 'en-GB',
    sivusto: 'Building the site',
    sivustoKuvaus: 'This page is the result.',
    kuvaputki: 'Images and videos',
    build: 'Build',
    oletusryhma: 'Checks',
    alleSekunnin: 'under a second',
    /* Tulosrivit ovat skriptien suomenkielistä tulostetta, joten
       englanninkielinen sivu näyttää vain nimen ja keston. */
    naytaTulos: false,
  },
  ketju: {
    tulossa: 'Coming',
    tarkistus: 'Check',
    tarkistukset: 'Checks',
  },
};

export default johdetut;

/** Tarkistusten tekstit tunnisteittain (lib/checks.ts). */
export const tarkistukset: Record<string, { title: string; huomaa: string; proves: string; items?: string[] }> = {
  tokens: {
    title: 'Tokens',
    huomaa: 'Catches a color or measure that changes in code but not in Figma.',
    proves: 'The comparison runs at every screen size.',
  },
  stories: {
    title: 'Stories',
    huomaa: 'Catches a component missing a Storybook story, the dark theme or the mobile size.',
    proves: '',
  },
  'code-connect': {
    title: 'Code Connect',
    huomaa: 'Catches a Figma component that isn’t linked to a code component.',
    proves: '',
  },
  hardcoded: {
    title: 'Hardcoded values',
    huomaa: 'Catches a color or measure written straight into a style, bypassing the tokens.',
    proves: 'The same applies to font weights.',
  },
  favicon: {
    title: 'Favicon',
    huomaa: 'Catches a theme color that changes while the favicon doesn’t.',
    proves: 'Ensures the favicon matches the theme colors. The same calculation produces the favicon and checks it, so they can’t drift apart.',
  },
  kuvat: {
    title: 'Images',
    huomaa: 'Catches an image that is missing, has the wrong shape or has no slot.',
    proves: 'Ensures the site’s images match the source images and the content’s aspect ratios, and that the folder has no images without a slot. The image list is generated from the source images. The same calculation creates the list and checks it.',
  },
  suhteet: {
    title: 'Aspect ratios',
    huomaa: 'Catches an aspect ratio that differs between cropping, styles and content.',
    proves: 'Ensures aspect ratios are the same in image cropping, the site’s styles and the content. The ratios are read from the same table the cropping uses. Figma’s part is checked in the Figma check (05).',
  },
  figma: {
    title: 'Figma',
    huomaa: 'Catches a component or variant that is in code but not in the Figma library.',
    proves: 'The library content is read directly from Figma. The check also ensures that',
    items: [
      'the page templates’ grids match the layout tokens',
      'aspect ratios are the same in Figma and in image processing',
      'the page templates’ texts match the published page.',
    ],
  },
  paketti: {
    title: 'Packages',
    huomaa: 'Catches an npm package that has changed without a version bump.',
    proves: 'The published package is compared byte by byte with what the code would produce. When a change is merged, the new version is published to npm automatically.',
  },
  docs: {
    title: 'Documentation',
    huomaa: 'Catches documentation that refers to a file or command that no longer exists.',
    proves: 'Every check must also be documented. Parts that can be derived from code are generated automatically and checked against their source.',
  },
  saavutettavuus: {
    title: 'Accessibility',
    huomaa: 'Catches an accessibility error in a component, such as too little contrast or a missing name for screen readers.',
    proves: 'Every Storybook story is rendered in a browser and checked automatically with axe. An error stops the change.',
  },
  strings: {
    title: 'Texts',
    huomaa: 'Catches text written into a component, bypassing the dictionary.',
    proves: '',
  },
  kielet: {
    title: 'Language versions',
    huomaa: 'Catches a Finnish text that changes or is added without the English version following.',
    proves: 'Both languages have the same structure, the same images and the same links. Every English text is tied to the Finnish version it was written from.',
  },
};

/** Tarkistusryhmien nimet (CHECK_GROUPS). */
export const ryhmat: Record<string, string> = {
  ydin: 'Design system',
  tuote: 'The site’s own checks',
};

/** Prosessin lenkit numeroittain (content/prosessi.ts). */
export const ketju: Record<number, { otsikko: string; teksti: string }> = {
  0: {
    otsikko: 'Starting point',
    teksti:
      'A company usually already has code and Figma files. First, the differences between them are listed automatically. Then a person decides, one by one, which side is right, and the decision is recorded. Existing differences can stay, but no new ones appear.',
  },
  1: {
    otsikko: 'One source',
    teksti:
      'Colors, typography, spacing and motion are recorded in one file, and everything else reads its values from there. Values are never copied by hand.',
  },
  2: {
    otsikko: 'Components in code',
    teksti:
      'A component is built once, in code. Storybook shows it in the browser in all its states, and it is the same code the finished product uses.',
  },
  3: {
    otsikko: 'Values to Figma',
    teksti:
      'The values go to Figma through a plugin. When they change, the designer runs the plugin, and colors, text styles and spacing update in one go.',
  },
  4: {
    otsikko: 'Library to Figma',
    teksti:
      'Components are built in Figma once, with the same names and states as in code. The library can’t be generated, but it can be built with AI from the code. After that, the designer uses the same parts that are already built.',
  },
  5: {
    otsikko: 'Mappings',
    teksti:
      'Every Figma component is linked to its code. Developers see the right code directly in Figma.',
  },
  6: {
    otsikko: 'AI prototypes with real parts',
    teksti:
      'Tokens and components are published as npm packages, and Figma Make uses them. Guidelines say when to use what. That way a prototype made in Figma Make uses the same components as the product.',
  },
  7: {
    otsikko: 'Back to the product',
    teksti:
      'A change made in Figma Make comes back into the product’s code as a pull request. It goes through the same checks as any other change and is then released to the product.',
  },
};
