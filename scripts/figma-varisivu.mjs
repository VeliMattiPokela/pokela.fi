/**
 * Figman Väri-sivun taulut ↔ tokens.json
 * ---------------------------------------------------------------
 * Plugin luo väreistä muuttujat, mutta Väri-sivun taulut (siru,
 * nimi, var(--…), hex) on rakennettu käsin. Kun `--danger` tuli
 * (päätös 22), muuttuja syntyi mutta taulu jäi ilman riviä, eikä
 * mikään huomannut: Vellu löysi puutteen itse Figmasta. Muuttujia
 * ei voi lukea rajapinnalla (403), mutta taulun tekstit voi.
 *
 * Sopimus: sivulla "Väri" on kehykset "Light" ja "Dark". Niiden
 * jokainen rivi on kehys, jonka nimi on tokenin nimi, ja jonka
 * tekstit ovat nimi, `var(--nimi)` ja hex. Jokaisella tokens.jsonin
 * värillä on oltava rivi kummassakin, eikä ylimääräisiä saa olla.
 */

const MOODIT = [
  ['Light', 'light'],
  ['Dark', 'dark'],
];

const etsi = (solmu, ehto) => {
  if (!solmu || typeof solmu !== 'object') return null;
  if (ehto(solmu)) return solmu;
  for (const lapsi of solmu.children ?? []) {
    const osuma = etsi(lapsi, ehto);
    if (osuma) return osuma;
  }
  return null;
};

const tekstit = (solmu) =>
  solmu.type === 'TEXT' ? [solmu.characters ?? ''] : (solmu.children ?? []).flatMap(tekstit);

/**
 * @param dokumentti Figman tiedostopuun `document`
 * @param varit tokens.jsonin `color` ({ light: {…}, dark: {…} })
 * @returns {{ drift: {file: string, issue: string}[], riveja: number }}
 */
export function tarkistaVarisivu(dokumentti, varit) {
  const drift = [];
  const sivu = (dokumentti.children ?? []).find((s) => s.name === 'Väri');
  if (!sivu) return { drift: [{ file: 'Figma: Väri', issue: 'sivua ei löydy' }], riveja: 0 };

  let riveja = 0;
  for (const [kehysNimi, moodi] of MOODIT) {
    const kehys = etsi(sivu, (s) => s.type === 'FRAME' && s.name === kehysNimi);
    const file = `Figma: Väri · ${kehysNimi}`;
    if (!kehys) {
      drift.push({ file, issue: 'kehystä ei löydy' });
      continue;
    }
    const odotetut = varit[moodi] ?? {};
    const rivit = new Map((kehys.children ?? []).filter((r) => r.type === 'FRAME').map((r) => [r.name, r]));

    for (const [nimi, hex] of Object.entries(odotetut)) {
      const rivi = rivit.get(nimi);
      if (!rivi) {
        drift.push({ file, issue: `${nimi} puuttuu (tokens.json color.${moodi}.${nimi} = ${hex})` });
        continue;
      }
      riveja++;
      const t = tekstit(rivi).map((s) => s.trim());
      if (!t.includes(`var(--${nimi})`)) drift.push({ file, issue: `${nimi}: rivillä ei ole tekstiä var(--${nimi})` });
      if (!t.some((s) => s.toUpperCase() === hex.toUpperCase())) {
        drift.push({ file, issue: `${nimi}: hex on ${t.find((s) => s.startsWith('#')) ?? '–'}, tokeneissa ${hex}` });
      }
    }
    for (const nimi of rivit.keys()) {
      if (!(nimi in odotetut)) drift.push({ file, issue: `${nimi}: rivi on, mutta tokens.jsonissa ei ole väriä` });
    }
  }
  return { drift, riveja };
}
