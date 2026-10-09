# pokela.fi

Veli-Matti Pokelan portfolio, joka on samalla toimiva näyte prosessista:
miten koodi, design system, Figma ja AI (Figma Make) saadaan yhdeksi
design-dev-prosessiksi, jossa koodi on ainoa lähde ja eriytyminen pysäyttää
buildin.

Prosessi on kuvattu yhtenä ketjuna, lenkit 0–7, tiedostossa
`content/prosessi.ts`. Sama ketju näkyy sivun casessa 03 ja Figman
Pystytys-sivulla. Koodipohjaa ei ole tarkoitus kopioida asiakkaalle
sellaisenaan: siirrettävä asia on menetelmä ja sen pystyttäminen.

**Stack:** Next.js (App Router, static export) · TypeScript · Storybook ·
**Kielet:** fi (en rakenteessa valmiina) · **Julkaisu:** Netlify

## Mistä lukea lisää

| Dokumentti | Mitä |
|---|---|
| `docs/kasikirja.md` | Miten kaikki toimii: tarkistukset, paketit, Figma Make, vaihe 0, kuvat, avoimet kohdat |
| `paatokset.md` | Mitä on päätetty ja miksi |
| `docs/loki.md` | Kokeilut ja niiden tulokset |
| `figma-plugin/README.md` | Figman muuttujat `tokens.json`:sta |
| `guidelines/` | Figma Maken ohjeet |

## Komennot

```bash
npm run dev              # sivusto, localhost:3000
npm run storybook        # design system, localhost:6006
npm run check            # synkkatarkistus + tyypit + storytestit
npm run test:stories     # storyt selaimessa + axe-saavutettavuustarkistus
npm run build            # synkkatarkistus + staattinen export → out/
npm run build-storybook  # → storybook-static/
npm run check:hardcoded  # kovakoodatut arvot tyyleissä
npm run figma:check      # Code Connect -kytkennät (dry run, vaatii tokenin)
npm run figma:publish    # kytkennät Figmaan (vaatii FIGMA_ACCESS_TOKENin)
npm run paketti          # tokenit ja komponentit npm-paketeiksi → packages/
npm run paketti:julkaise # julkaisee npm:ään version, jota siellä ei ole (CI, NPM_TOKEN)
```

Storytestit ajetaan oikeassa selaimessa, joten Chromium asennetaan kerran:

```bash
npx playwright install chromium
```

Binääri menee jaettuun välimuistiin (`~/Library/Caches/ms-playwright`,
noin 570 MB) — ei projektikansioon. CI välimuistittaa sen.

## Rakenne

| Polku | Mitä |
|---|---|
| `styles/tokens.css` | **Ainoa paikka jossa arvo määritellään.** Jokainen väri on pari (`-l` / `-d`); teemanvaihto vain osoittaa toiseen arvoon eikä sisällä yhtään värilitteraalia. |
| `tokens.json` | Sama arvo koneluettavana. `/system` ja Storybookin Perusta-sivut lukevat tämän. |
| `styles/base.css` | Primitiivit: grid, typografia, napit, focus, kuvasuhteet. |
| `styles/components/` | Komponenttikohtaiset tyylit, yksi tiedosto per komponentti. |
| `components/` | React-komponentit ja niiden storyt vierekkäin. |
| `content/` | Sisältö datana kielittäin — casejen, CV:n ja töiden teksti. |
| `content/prosessi.ts` | Prosessin ketju 0–7. Case 03 ja Figman Pystytys-sivu lukevat tämän. |
| `lib/i18n.ts` | Julkaistut ja suunnitellut kielet, polkujen slugit. |
| `scripts/` | Synkkatarkistukset ja generaattorit. |
| `vitest.config.mts` | Storyt testeinä: Vitest + Playwright + axe. |
| `lib/source.ts` | Lukee lähdetiedostot kokonaan build-aikana casesivun komponenttinäkymään. |
| `lib/highlight.ts` | Yksivärinen syntaksikorostus musteasteikolla (Shiki, build-aikainen). |
| `components/*.figma.ts` | Code Connect: mikä koodikomponentti vastaa mitä Figma-komponenttia. |
| `figma-plugin/` | Generoi Figman muuttujat `tokens.json`:sta. Ks. sen oma README. |
| `portfolio-pokela/` | Alkuperäinen design-paketti: brändiohje, sivupohjat, casejen rungot. Lähde, ei koodia — **ei ole repossa** (`.gitignore`), koska se sisältää asiakaskaappauksia eikä koodi käytä sitä. |

## Tarkistukset lyhyesti

`npm run build` ajaa synkkatarkistukset, ja CI ajaa ne jokaisessa pull
requestissa omina askelinaan. Lisäksi CI ajaa kaksi verkkoa tarvitsevaa
tarkistusta: `check:figma` (Figma-tiedosto rajapinnan yli) ja
`check:paketti` (npm:n paketit vs. repo). Jokainen tarkistus, mitä se
todistaa ja mitä se ei näe, on kuvattu käsikirjassa ja näkyy myös case 03:n
listalla, joka luetaan `lib/checks.ts`:stä.

Uusi tarkistus lisätään vasta kun oikea virhe on päässyt läpi
(`paatokset.md`, päätös 8).

## Sivukartta

```
/                    → /fi/ (Netlify-ohjaus)
/fi/                 Etusivu
/fi/tyot/            Työlistaus — 3 kärkeä + aiempi työ avautuvana
/fi/tyot/colliers        Case 01
/fi/tyot/blokbook        Case 02
/fi/tyot/tama-sivusto    Case 03
/fi/system/          Design system elävänä
/fi/tietoa/          Info / CV
```

Aiemmat projektit (Pivo, Elisa Aisti, OP Vahinkoapuri) eivät saa omia
sivuja — ne avautuvat työlistauksella. Kaksi kärkeä saavat huomion,
vanhat tuovat uskottavuuden.

## Säännöt jotka rikkoutuvat helpoimmin

- **Ei aksenttiväriä.** Korostus on musta/valkoinen-käännös. Väri sivulle
  tulee työn kuvista. Ainoa poikkeus on virheen tilaväri `--danger`
  (päätös 22).
- **Ei kortteja.** Ei kehyksiä, varjoja eikä sävytettyjä pintoja sisällön
  ympärillä. Erottelu tehdään hiusviivalla tai käännetyllä pinnalla.
- **Ei keskitettyä tekstiä.** Poikkeus: käännetyt lausuntapalkit ja
  ennen/jälkeen-lohkot.
- **Ei keksittyjä lukuja.** Puuttuva tieto merkitään puuttuvaksi
  (`null` → "Täydennetään"), ei täytetä arvauksella.

Loput: `portfolio-pokela/brand-brief.md`.
