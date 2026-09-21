import { createHighlighter, type Highlighter } from 'shiki';
import tokens from '@/tokens.json';

/**
 * Syntaksikorostus ilman väriä.
 * ---------------------------------------------------------------
 * Tavallinen korostus nojaa väriin, mutta tässä systeemissä
 * aksenttivärejä ei ole. Rakenne tehdään kahdella akselilla:
 * musteasteikolla ja kirjainpainolla.
 *
 *   1  --code-ink + 600   rakenteen sanat: export, function, @media
 *   2  --code-ink         nimetyt asiat: komponentti, tyyppi,
 *                         CSS-valitsin, CSS-ominaisuus
 *   3  --code-muted       arvot ja tunnisteet: merkkijonot, luvut,
 *                         propsit, muuttujat, tyyppinimet
 *   4  --code-faint       välimerkit, operaattorit, kommentit
 *
 * Skoopit on poimittu Shikin omasta tokenisoinnista, ei arvattu:
 * `.scratch/scopes2.mjs` tulostaa minkä skoopin mikäkin merkki saa.
 * Ensimmäisessä versiossa `:` ja `?:` osuivat `keyword`-sääntöön ja
 * huusivat yhtä kovaa kuin `export` — siksi `keyword.operator` on
 * nyt erikseen.
 *
 * TextMate-teema valitsee pisimmän osuvan skooppiprefiksin, joten
 * säännöt on kirjoitettu yleisestä tarkkaan.
 *
 * Ajetaan build-aikana: selaimeen menee valmista HTML:ää.
 */

/* Koodipaneelin omat musteet: paneeli on tumma molemmissa teemoissa,
   joten --ink ei kelpaa. Arvot ovat vain välikappaleita, jotka
   vaihdetaan tokeneiksi alla. */
const INK = tokens.color.light['code-ink'];
const MUTED = tokens.color.light['code-muted'];
const FAINT = tokens.color.light['code-faint'];

const monochrome = {
  name: 'pokela-mono',
  type: 'light' as const,
  colors: {
    'editor.background': '#00000000',
    'editor.foreground': MUTED,
  },
  settings: [
    /* --- 3: perustaso. Kaikki mitä ei mainita erikseen. --- */
    { scope: ['source', 'text'], settings: { foreground: MUTED } },

    /* --- 4: välimerkit, operaattorit, kommentit --- */
    { scope: ['punctuation'], settings: { foreground: FAINT } },
    { scope: ['keyword.operator'], settings: { foreground: FAINT } },
    { scope: ['meta.brace'], settings: { foreground: FAINT } },
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: FAINT, fontStyle: 'italic' },
    },

    /* --- 3: arvot ja tunnisteet --- */
    { scope: ['variable'], settings: { foreground: MUTED } },
    { scope: ['variable.argument.css'], settings: { foreground: MUTED } },
    { scope: ['string'], settings: { foreground: MUTED } },
    { scope: ['punctuation.definition.string'], settings: { foreground: MUTED } },
    { scope: ['constant.numeric', 'keyword.other.unit'], settings: { foreground: MUTED } },
    { scope: ['support.constant.property-value'], settings: { foreground: MUTED } },
    { scope: ['support.type.primitive'], settings: { foreground: MUTED } },
    { scope: ['entity.other.attribute-name.tsx'], settings: { foreground: MUTED } },
    { scope: ['support.function.misc.css'], settings: { foreground: MUTED } },

    /* --- 2: nimetyt asiat --- */
    /* Täysi muste mutta normaali paino: nämä erottuvat arvoista
       ilman että kilpailevat avainsanojen kanssa. */
    {
      scope: [
        'entity.name.function',
        'entity.name.type',
        'entity.name.class',
        'entity.name.tag',
        'support.class.component',
      ],
      settings: { foreground: INK },
    },
    {
      scope: [
        'support.type.property-name',
        'entity.other.attribute-name.class.css',
        'entity.other.attribute-name.pseudo-class.css',
        'entity.other.attribute-name.id.css',
        'punctuation.definition.entity.css',
      ],
      settings: { foreground: INK },
    },

    /* --- 1: rakenteen sanat --- */
    {
      scope: ['keyword.control', 'storage', 'storage.type', 'keyword.control.at-rule'],
      settings: { foreground: INK, fontStyle: 'bold' },
    },
    { scope: ['punctuation.definition.keyword.css'], settings: { foreground: INK, fontStyle: 'bold' } },
  ],
};

let highlighter: Highlighter | null = null;

async function get(): Promise<Highlighter> {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: [monochrome],
      langs: ['tsx', 'ts', 'css'],
    });
  }
  return highlighter;
}

/**
 * Palauttaa korostetun HTML:n. Shiki kirjoittaa värit inline-tyyleiksi,
 * joten ne muunnetaan tokeneiksi — muuten korostus jäisi vaaleaksi
 * tummalla pinnalla.
 *
 * `font-style: bold` on TextMaten tapa ilmaista paino; se muunnetaan
 * oikeaksi `font-weight`iksi, koska `font-style: bold` ei ole CSS:ää.
 */
export async function highlight(code: string, lang: 'tsx' | 'ts' | 'css'): Promise<string> {
  const shiki = await get();
  const html = shiki.codeToHtml(code, {
    lang,
    theme: 'pokela-mono',
    transformers: [
      {
        /* Rivinumero data-attribuuttina, ei tekstisolmuna: silloin se
           ei kopioidu koodin mukana leikepöydälle. CSS piirtää sen
           ::before-pseudolla. */
        line(node, line) {
          node.properties['data-line'] = String(line);
        },
      },
    ],
  });

  return html
    .replaceAll(INK, 'var(--code-ink)')
    .replaceAll(MUTED, 'var(--code-muted)')
    .replaceAll(FAINT, 'var(--code-faint)')
    .replaceAll('font-weight:bold', 'font-weight:600')
    .replace(/background-color:[^;"]*;?/g, '')
    /* Shiki erottaa rivit rivinvaihdolla. Kun .line on display: block,
       <pre> renderöi säilytetyn \n:n vielä omana rivinään ja väli
       tuplaantuu. Rivinvaihdot pois — lohkot riittävät. */
    .replace(/<\/span>\n(<span class="line")/g, '</span>$1');
}
