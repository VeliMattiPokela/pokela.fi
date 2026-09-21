/**
 * Pokela — tokenit Figmaan
 * ==================================================================
 * Figman muuttujat generoidaan sivuston omasta `tokens.json`:sta.
 * Kyse ei ole mukavuudesta vaan siitä, miten eriytymä estetään:
 *
 * Figman muuttujien REST-API on Enterprise-tason ominaisuus, eikä
 * sitä ole käytettävissä. Koodin ja Figman arvoja ei siis voi
 * verrata automaattisesti. Vertailun sijaan suunta käännetään —
 * kun Figma *generoidaan* koodista, eriytymä ei ole asia jonka
 * tarkistus löytää, vaan asia jota ei voi syntyä.
 *
 * Ajo on idempotentti: muuttujat etsitään nimellä, luodaan jos
 * puuttuvat ja päivitetään jos ovat. Mitään ei poisteta — plugin
 * ei saa tuhota työtä jota se ei tehnyt.
 *
 * Verkkohaku tehdään ui.html:ssä: plugin-sandboxissa ei ole fetchiä.
 */

/* Riviväli ja välistys: CSS:ssä kerroin ja em, Figmassa vain
   pikseli. Arvo lasketaan siksi kullekin breakpointille erikseen —
   ks. laskenta alempana. */
const MODES = ['base', 'sm', 'md', 'lg'];

const px = (value) => (typeof value === 'string' ? parseFloat(value) : value);
const round = (value) => Math.round(value * 100) / 100;

/**
 * Fonttiperhe CSS-pinosta. tokens.json:ssa arvo on koko
 * font-family-määrittely — `var(--font-bodoni, 'Bodoni Moda'), Georgia,
 * serif` — koska fallbackin on oltava var():n sisällä. Figmaan kelpaa
 * vain perheen nimi, ja se on pinon ensimmäinen lainattu nimi.
 */
const familyOf = (stack) => {
  const quoted = /'([^']+)'/.exec(stack);
  return quoted ? quoted[1] : stack.split(',')[0].trim();
};

const hexToRgb = (hex) => {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.slice(0, 2), 16) / 255,
    g: parseInt(clean.slice(2, 4), 16) / 255,
    b: parseInt(clean.slice(4, 6), 16) / 255,
    a: 1,
  };
};

/**
 * Väriskooppi nimestä. Pinta, teksti ja viiva ovat eri asioita;
 * ilman skooppeja jokainen väri tarjoutuisi jokaiseen kohtaan.
 */
const colorScopes = (name) => {
  if (name === 'line' || name === 'line-strong') return ['STROKE_COLOR'];
  if (name === 'ink') return ['SHAPE_FILL', 'TEXT_FILL'];
  if (/^(ink|invert-ink|invert-faint|code-ink|code-muted|code-faint)/.test(name)) return ['TEXT_FILL'];
  if (name === 'paper' || name === 'paper-alt' || name === 'code-surface') return ['FRAME_FILL'];
  return ['FRAME_FILL', 'SHAPE_FILL'];
};

/** Kokoelmien rakenne. `css` on nimi jota koodi käyttää. */
function buildSpec(tokens) {
  const spec = [];

  /* ---- Color ---- */
  spec.push({
    collection: 'Color',
    modes: ['Light', 'Dark'],
    variables: Object.keys(tokens.color.light).map((name) => ({
      name,
      type: 'COLOR',
      scopes: colorScopes(name),
      css: `--${name}`,
      values: { Light: hexToRgb(tokens.color.light[name]), Dark: hexToRgb(tokens.color.dark[name]) },
    })),
  });

  /* ---- Typography ---- */
  const typography = [
    {
      name: 'font/display', type: 'STRING', scopes: ['FONT_FAMILY'], css: '--font-display',
      values: Object.fromEntries(MODES.map((m) => [m, familyOf(tokens.font.display)])),
    },
    {
      name: 'font/ui', type: 'STRING', scopes: ['FONT_FAMILY'], css: '--font-ui',
      values: Object.fromEntries(MODES.map((m) => [m, familyOf(tokens.font.ui)])),
    },
  ];

  for (const key of Object.keys(tokens.type)) {
    const entry = tokens.type[key];
    const sizeAt = (mode) => px(tokens.typeScale[key] ? tokens.typeScale[key][mode] : entry.size);
    const lhAt = (mode) =>
      parseFloat(tokens.lineHeightScale[key] ? tokens.lineHeightScale[key][mode] : entry.lineHeight);

    typography.push({
      name: `size/${key}`, type: 'FLOAT', scopes: ['FONT_SIZE'], css: `--text-${key}`,
      values: Object.fromEntries(MODES.map((m) => [m, sizeAt(m)])),
    });
    typography.push({
      name: `line-height/${key}`, type: 'FLOAT', scopes: ['LINE_HEIGHT'], css: `--lh-${key}`,
      /* kerroin × fonttikoko — Figma ei tue yksikötöntä riviväliä */
      values: Object.fromEntries(MODES.map((m) => [m, round(lhAt(m) * sizeAt(m))])),
      description: `CSS: --lh-${key} on yksiköttä. Figma sitoo riviväliin vain pikseliarvon, joten arvo on laskettu kullekin breakpointille: kerroin × fonttikoko.`,
    });
    if (entry.tracking) {
      typography.push({
        name: `tracking/${key}`, type: 'FLOAT', scopes: ['LETTER_SPACING'], css: `--tr-${key}`,
        /* em × fonttikoko — sama rajoite kuin rivivälissä */
        values: Object.fromEntries(MODES.map((m) => [m, round(parseFloat(entry.tracking) * sizeAt(m))])),
        description: `CSS: --tr-${key} on em-arvo. Figma sitoo välistykseen vain pikseliarvon, joten arvo on laskettu kullekin breakpointille: em × fonttikoko.`,
      });
    }
  }
  spec.push({ collection: 'Typography', modes: MODES, variables: typography });

  /* ---- Spacing ---- */
  spec.push({
    collection: 'Spacing',
    modes: ['Default'],
    variables: Object.keys(tokens.space).map((key) => ({
      name: `space/${key}`, type: 'FLOAT', scopes: ['WIDTH_HEIGHT', 'GAP'], css: `--space-${key}`,
      values: { Default: px(tokens.space[key]) },
    })),
  });

  /* ---- Layout ---- */
  const layoutMap = [
    ['page-padding', 'pagePadding', ['WIDTH_HEIGHT', 'GAP']],
    ['gutter', 'gutter', ['WIDTH_HEIGHT', 'GAP']],
    ['section-gap', 'sectionGap', ['WIDTH_HEIGHT', 'GAP']],
    ['columns', 'columns', []],
    ['max-width', 'maxWidth', ['WIDTH_HEIGHT']],
    ['tap-min', 'tapMin', ['WIDTH_HEIGHT']],
  ];
  spec.push({
    collection: 'Layout',
    modes: MODES,
    variables: layoutMap.map(([name, source, scopes]) => {
      const raw = tokens.layout[source];
      const perMode = raw && typeof raw === 'object' && !Array.isArray(raw);
      return {
        name, type: 'FLOAT', scopes, css: `--${name}`,
        values: Object.fromEntries(MODES.map((m) => [m, px(perMode ? raw[m] : raw)])),
      };
    }),
  });

  /* ---- Border ---- */
  spec.push({
    collection: 'Border',
    modes: ['Default'],
    variables: [
      ['hairline', 'hairline', ['STROKE_FLOAT']],
      ['hairline-strong', 'hairlineStrong', ['STROKE_FLOAT']],
      ['radius', 'radius', ['CORNER_RADIUS']],
      ['focus-width', 'focusWidth', ['STROKE_FLOAT']],
      ['focus-offset', 'focusOffset', ['STROKE_FLOAT']],
    ].map(([name, source, scopes]) => ({
      name, type: 'FLOAT', scopes, css: `--${name}`,
      values: { Default: px(tokens.border[source]) },
    })),
  });

  /* ---- Icon ----
     Kolme kokoa. Viivanpaksuutta ei ole täällä eikä pidäkään olla:
     ikoni piirretään Border/hairlinella, samalla viivalla kuin
     jokainen reuna. Skooppi on WIDTH_HEIGHT, joten koot eivät tarjoudu
     välistykseksi. */
  spec.push({
    collection: 'Icon',
    modes: ['Default'],
    variables: Object.keys(tokens.icon).map((key) => ({
      name: `size-${key}`,
      type: 'FLOAT',
      scopes: ['WIDTH_HEIGHT'],
      css: `--icon-${key}`,
      values: { Default: px(tokens.icon[key]) },
    })),
  });

  /* ---- Motion ----
     Figmassa ei ole skooppia kestolle eikä pehmennykselle, joten
     lista on tyhjä: parempi ettei niitä tarjota missään kuin että
     ne tarjottaisiin kaikkialla. */
  const motion = [];
  for (const key of Object.keys(tokens.motion.duration)) {
    motion.push({
      name: `duration/${key}`, type: 'FLOAT', scopes: [], css: `--dur-${key}`,
      values: { Default: px(tokens.motion.duration[key]) },
    });
  }
  for (const key of Object.keys(tokens.motion.easing)) {
    motion.push({
      name: `easing/${key}`, type: 'STRING', scopes: [], css: `--ease-${key}`,
      values: { Default: tokens.motion.easing[key] },
    });
  }
  motion.push({
    name: 'reveal/shift', type: 'FLOAT', scopes: [], css: '--reveal-shift',
    values: { Default: px(tokens.motion.reveal.translate) },
  });
  motion.push({
    name: 'reveal/stagger', type: 'FLOAT', scopes: [], css: '--reveal-stagger',
    values: { Default: px(tokens.motion.reveal.stagger) },
  });
  spec.push({ collection: 'Motion', modes: ['Default'], variables: motion });

  return spec;
}

async function apply(tokens) {
  const spec = buildSpec(tokens);
  const existingCollections = await figma.variables.getLocalVariableCollectionsAsync();
  let created = 0;
  let updated = 0;
  const lines = [];

  for (const group of spec) {
    let collection = existingCollections.find((c) => c.name === group.collection);
    if (!collection) collection = figma.variables.createVariableCollection(group.collection);

    /* Moodit nimen mukaan: ensimmäinen on aina olemassa, loput
       lisätään puuttuessa. Olemassa olevaa ei nimetä uudelleen
       muuten kuin oletusmoodin osalta. */
    const modeIds = {};
    collection.modes[0].name = group.modes[0];
    modeIds[group.modes[0]] = collection.modes[0].modeId;
    for (const modeName of group.modes.slice(1)) {
      const found = collection.modes.find((m) => m.name === modeName);
      modeIds[modeName] = found ? found.modeId : collection.addMode(modeName);
    }

    const inCollection = {};
    for (const id of collection.variableIds) {
      const variable = await figma.variables.getVariableByIdAsync(id);
      inCollection[variable.name] = variable;
    }

    for (const entry of group.variables) {
      let variable = inCollection[entry.name];
      if (variable) {
        updated++;
      } else {
        variable = figma.variables.createVariable(entry.name, collection, entry.type);
        created++;
      }
      for (const modeName of Object.keys(entry.values)) {
        variable.setValueForMode(modeIds[modeName], entry.values[modeName]);
      }
      variable.scopes = entry.scopes;
      /* Dev Mode näyttää tämän: sama nimi jota koodi käyttää. */
      variable.setVariableCodeSyntax('WEB', `var(${entry.css})`);
      if (entry.description) variable.description = entry.description;
    }

    lines.push(`${group.collection}: ${group.variables.length} muuttujaa, ${group.modes.length} moodia`);
  }

  return `✓ ${created} luotu, ${updated} päivitetty\n\n${lines.join('\n')}`;
}

figma.showUI(__html__, { width: 380, height: 520 });

figma.ui.onmessage = async (message) => {
  if (message.type !== 'tokens') return;
  try {
    const report = await apply(message.tokens);
    figma.ui.postMessage({ type: 'done', report });
  } catch (error) {
    figma.ui.postMessage({ type: 'error', message: error.message });
  }
};
