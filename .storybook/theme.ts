import { create } from 'storybook/theming';
import tokens from '../tokens.json';

/**
 * Storybookin oma käyttöliittymä käyttää samoja tokeneita kuin
 * sivusto. Se ei ole koristelua: jos työkalu näyttää eri brändiltä
 * kuin tuote, katsoja joutuu kääntämään kahden maailman välillä —
 * ja juuri sitä käännöstä tämä case lupaa poistaa.
 *
 * Arvot luetaan tokens.json:sta, joten ne eivät voi jäädä jälkeen.
 */

const light = tokens.color.light;
const dark = tokens.color.dark;

const fontDisplay = "'Bodoni Moda', Georgia, serif";
const fontUi = "'Archivo', Helvetica, Arial, sans-serif";
const fontMono = 'ui-monospace, SFMono-Regular, Menlo, monospace';

export const lightTheme = create({
  base: 'light',
  brandTitle: 'Pokela — design system',
  brandTarget: '_self',

  fontBase: fontUi,
  fontCode: fontMono,

  colorPrimary: light.ink,
  /* Ei aksenttiväriä: "secondary" on se mitä Storybook käyttää
     valintaan ja korostukseen, joten se on muste. */
  colorSecondary: light.ink,

  appBg: light['paper-alt'],
  appContentBg: light.paper,
  appPreviewBg: light.paper,
  appBorderColor: light.line,
  appBorderRadius: 0,

  textColor: light.ink,
  textInverseColor: light['invert-ink'],
  textMutedColor: light['ink-faint'],

  barTextColor: light['ink-faint'],
  barSelectedColor: light.ink,
  barHoverColor: light.ink,
  barBg: light.paper,

  buttonBg: light.paper,
  buttonBorder: light.line,
  booleanBg: light['badge-surface'],
  booleanSelectedBg: light.paper,

  inputBg: light.paper,
  inputBorder: light.line,
  inputTextColor: light.ink,
  inputBorderRadius: 0,
});

export const darkTheme = create({
  base: 'dark',
  brandTitle: 'Pokela — design system',
  brandTarget: '_self',

  fontBase: fontUi,
  fontCode: fontMono,

  colorPrimary: dark.ink,
  colorSecondary: dark.ink,

  appBg: dark['paper-alt'],
  appContentBg: dark.paper,
  appPreviewBg: dark.paper,
  appBorderColor: dark.line,
  appBorderRadius: 0,

  textColor: dark.ink,
  textInverseColor: dark['invert-ink'],
  textMutedColor: dark['ink-faint'],

  barTextColor: dark['ink-faint'],
  barSelectedColor: dark.ink,
  barHoverColor: dark.ink,
  barBg: dark.paper,

  buttonBg: dark.paper,
  buttonBorder: dark.line,
  booleanBg: dark['badge-surface'],
  booleanSelectedBg: dark.paper,

  inputBg: dark.paper,
  inputBorder: dark.line,
  inputTextColor: dark.ink,
  inputBorderRadius: 0,
});

export { fontDisplay, fontUi, fontMono };
