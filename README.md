# pokela.fi

Portfoliosivusto, joka on samalla oma design system -casensa. Sivusto,
Storybook ja tokenit ovat samassa repossa, ja build tarkistaa että ne
pysyvät synkassa.

**Stack:** Next.js (App Router, static export) · TypeScript · Storybook ·
**Kielet:** fi (en rakenteessa valmiina) · **Julkaisu:** Netlify

---

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
| `lib/i18n.ts` | Julkaistut ja suunnitellut kielet, polkujen slugit. |
| `scripts/` | Synkkatarkistukset. |
| `vitest.config.mts` | Storyt testeinä: Vitest + Playwright + axe. |
| `lib/source.ts` | Lukee lähdetiedostot kokonaan build-aikana casesivun komponenttinäkymään. |
| `lib/highlight.ts` | Yksivärinen syntaksikorostus musteasteikolla (Shiki, build-aikainen). |
| `components/*.figma.ts` | Code Connect: mikä koodikomponentti vastaa mitä Figma-komponenttia. |
| **Yksi rivi** | Etusivun listarivi, työlistan kärkirivi ja avautuva rivi ovat sama `.list-row`. Erot ovat modifioijia: `--numbered`, `--m`, `--expandable`. `Accordion` on oma komponenttinsa vain siksi että se on `<button>` eikä linkki — CSS on yhteinen. **Figmassa sama asia tarkoittaa sisäkkäisyyttä:** `Accordion` sisältää `ListRow`-instanssin, ei kopiota. Code Connect lukee sisällön sieltä (`findInstance('ListRow')`). |
| **Inline-meta** | `.meta` on inline-elementti, joten sen rivilaatikon korkeuden määrää säiliön strut. Jos säiliö ei ole flex tai grid, käytä `display: flex` — muuten meta saa leipätekstin rivivälin. Osui kolmesti: navin `<li>`, `.work__also`, ja `<p class="meta">`:n marginaali. |
| **Omat ikonit** | Ikonikirjastoa ei käytetä — systeemi piirtää kuusi merkkiään itse (`components/Icon.tsx`). Ruudukko on 16×16, viiva `--hairline`, päätteet tylpät koska `--radius` on 0, väri aina `currentColor`. Merkit olivat ennen tekstiä (`↗`, `✕`, `+`), jolloin ne riippuivat siitä mitä fontin osajoukossa sattui olemaan: Figmassa `↗` ei löytynyt Archivosta lainkaan. Kun merkit ovat omia, sana `icon` on myös oikea — `sign` ja `indicator` olivat kiertoilmauksia. Teemanvaihto pysyy sanana: se ei ole toiminto vaan tila, ja tila luetaan. |
| **Yksi lukumitta** | `--measure: 62ch` on ainoa. Se kelpaa myös 14 pikselin tekstille, koska `ch` skaalautuu fonttikoon mukana — sama luku tarkoittaa suunnilleen samaa merkkimäärää joka koossa. Mitattuna leipäteksti saa 63 merkkiä riville, mikä osuu klassiseen 45–75:n haarukkaan. Sivustolla oli välillä viisi eri `ch`-arvoa, mutta mittaus osoitti ettei kolme niistä ollut lukumittoja lainkaan: kuvateksti on sidottu kuvaan ja roolirivi on taittovarmistus. Ne ovat nyt pikseleinä ja kirjattuina poikkeuksina. **`ch` ei sovi harvennettuun tekstiin:** se ei tunne `letter-spacing`iä, joten roolirivin `68ch` lupasi 68 merkkiä kun riville mahtui 35. |
| **Nimeäminen** | Tokenit puhuvat materiaalista (`paper`, `ink`, `rule`, `bleed`, `measure`), komponentit käytöstä (`ListRow`, `Media`, `Button`). Jos komponentin nimi vaatii selityksen, se on väärä nimi. |
| `figma-plugin/` | Generoi Figman muuttujat `tokens.json`:sta. Ks. sen oma README. |
| `portfolio-pokela/` | Alkuperäinen design-paketti: brändiohje, sivupohjat, casejen rungot. Lähde, ei koodia — **ei ole repossa** (`.gitignore`), koska se sisältää asiakaskaappauksia eikä koodi käytä sitä. |

## Synkkatarkistus

Ajetaan `npm run build`issa ja jokaisessa pull requestissa. Jos jokin
eriytyy, putki pysähtyy ja raportti kertoo **mikä** eriytyi.

```
✓ Tokenit synkassa — 102 tokenia tarkistettu (styles/tokens.css ↔ tokens.json)
✓ Storyt kattavat komponentit — 12/17 storylla, 5 kirjattua poikkeusta
✓ Code Connect ehjä — 8/8 kytkentää, Figma-tiedosto PVyeKV6J1Rzyj2VL4X27FR
✓ Ei kovakoodattuja arvoja — 22 arvoa tarkistettu, 22 kirjattua poikkeusta
✓ Test Files 13 passed · Tests 59 passed
```

**1. Tokenit** (`scripts/check-tokens.mjs`) — vertaa `tokens.css`:n ja
`tokens.json`:n värit, tyyppiasteikon ja riviväliasteikon jokaisella
breakpointilla, välistyksen, layoutin, reunat ja motion-arvot.

**2. Storyt** (`scripts/check-stories.mjs`) — jokaisella komponentilla on
story, ja jokaisessa storyssa vähintään tumma teema ja mobiilikoko.
Poikkeus on sallittu mutta se on kirjattava syineen.

**4. Kovakoodatut arvot** (`scripts/check-hardcoded.mjs`) — tokenit eivät
hajoa kerralla vaan yksi kiire kerrallaan: joku kirjoittaa
`padding: 13px` koska asteikolla ei satu olemaan 13:a, ja puolen vuoden
päästä asteikon vieressä elää toinen, kirjoittamaton asteikko.
Tarkistus ei kiellä poikkeusta vaan vaatii sille syyn — jokainen
kovakoodattu mitta ja väri on joko token tai kirjattu `EXEMPT`-listaan
perusteluineen.

**5. Saavutettavuus** (`npm run test:stories`) — jokainen story
renderöidään Chromiumissa ja tarkistetaan axella. Kontrastivirhe,
puuttuva saavutettava nimi tai rikkoutunut otsikkohierarkia kaataa ajon
ja raportti kertoo elementin, mitatun arvon ja vaaditun rajan:

```
FAIL  components/BeforeAfter.stories.tsx > Oletus
Expected the HTML found at $('figcaption') to have no violations:
"Elements must meet minimum color contrast ratio thresholds (color-contrast)"
  Element has insufficient color contrast of 1.64
  (foreground #c9cacb, background #ffffff, font size 14px).
  Expected contrast ratio of 4.5:1
```

Sama ajo havaitsee myös storyt jotka kaatuvat renderöinnissä —
`build-storybook` menee niistä läpi, tämä ei.

**Raja jonka on hyvä tietää:** axe tarkistaa vain konetarkistettavat
säännöt. Se varmistaa että saavutettava nimi on olemassa, ei sitä että
se on oikea; se ei kerro onko ruudunlukijan lukujärjestys mielekäs eikä
toimiiko ennen/jälkeen-jakaja näppäimistöllä järkevästi. Tarkistus estää
regression, se ei korvaa läpikäyntiä.

**3. Code Connect** (`scripts/check-code-connect.mjs`) — valvoo rajaa
koodin ja Figman välillä. Kytkentä joka osoittaa poistettuun
komponenttiin on pahempi kuin puuttuva kytkentä: se näyttää Dev Modessa
koodia jota ei ole. Tarkistus kaatuu jos kytkentä osoittaa **koodin**
komponenttiin jota ei ole, väärään Figma-tiedostoon, tai jos
`IN_FIGMA`-listaan merkitty komponentti on jäänyt kytkemättä.

**Raja:** tarkistus ei avaa Figmaa. Se lukee kytkentätiedoston
`node-id`:n muttei varmista että se osoittaa olemassa olevaan
komponenttiin — keksityllä osoitteella tarkistus menee läpi. Sen
sulkee `npm run figma:publish`, joka kysyy osoitteet Figmalta, tai
`check:figma` kun se on kytketty. Myös `IN_FIGMA` on käsin ylläpidetty:
Figmaan lisätty komponentti ei ilmesty siihen itsestään.

**Figman muuttujat** eivät ole tarkistuksessa. Ne generoidaan
`tokens.json`:sta (`figma-plugin/`), joten ne *syntyvät* oikein — mutta
generointi on kertaluontoinen ajo. Jos joku muokkaa muuttujaa Figmassa
sen jälkeen, mikään ei huomaa. Sanoin tässä aiemmin että eriytymä on
"rakenteellisesti mahdoton"; se oli liian vahva väite.

**Miksei muuttujia verrata rajapinnan kautta:** Figman muuttujien REST-API
vaatii Enterprise-tason (*"This API is available to full members of
Enterprise orgs"*). Sitä ei ole käytettävissä, joten vertailun sijaan
Figma generoidaan koodista — mikä on joka tapauksessa vahvempi ratkaisu.

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
  tulee vain työn kuvista.
- **Ei kortteja.** Ei kehyksiä, varjoja eikä sävytettyjä pintoja sisällön
  ympärillä. Erottelu tehdään hiusviivalla tai käännetyllä pinnalla.
- **Ei keskitettyä tekstiä.** Poikkeus: käännetyt lausuntapalkit ja
  ennen/jälkeen-lohkot.
- **Ei keksittyjä lukuja.** Puuttuva tieto merkitään puuttuvaksi
  (`null` → "Täydennetään"), ei täytetä arvauksella.

Loput: `portfolio-pokela/brand-brief.md`.

## Avoinna

- [ ] CV-PDF puuttuu — `/cv/veli-matti-pokela-cv.pdf` on linkitetty mutta tiedostoa ei ole
- [ ] **Figma-tiedosto on Loihde Factorin organisaatiossa.** Kaksi asiaa
      tarkistettava ennen julkaisua: (1) salliiko organisaation asetus
      julkisen katselulinkin — case 03 lepää sen varassa, (2) mitä
      artefaktille tapahtuu jos työsuhde päättyy. Jos kumpikaan ei ratkea,
      kirjasto siirretään omaan tiimiin ja Code Connect jää pois.
- [ ] **Code Connect -osoitteita ei validoida.** `check:code-connect` tarkistaa
      että kytkentätiedosto on olemassa, muttei että sen `node-id` osoittaa
      oikeaan komponenttiin: keksitty osoite menee läpi. Tämä ratkeaa
      `npm run figma:publish`illa, joka kysyy osoitteet Figmalta — se odottaa
      `FIGMA_ACCESS_TOKEN`ia, eli samaa organisaatiokysymystä kuin yllä.
      Omaa tarkistusta ei kannata kirjoittaa: se toimisi vain paikallisesti,
      ei CI:ssä.
- [ ] **Storybookin julkaisu on käsin.** `pokela-storybook.netlify.app` ei ole
      kytketty repoon vaan se julkaistaan CLI:llä:

      ```
      npm run build-storybook
      netlify deploy --prod --no-build --dir=storybook-static
      ```

      `--no-build` on olennainen: ilman sitä Netlify lukee juuren
      `netlify.toml`:n ja ajaa **sivuston** buildin Storybookin
      julkaisun yhteydessä. Syy koko järjestelyyn on sama tiedosto:
      molemmat sivustot tulisivat samasta reposta, ja `netlify.toml`
      pakottaisi niille saman build-komennon. Automatisointi vaatii `NETLIFY_AUTH_TOKEN`in ja
      `NETLIFY_SITE_ID`:n GitHubin secreteiksi — ne ovat sinun tunnuksiasi,
      joten en voi luoda niitä. CI rakentaa Storybookin jo, joten
      julkaisuaskel on yksi rivi lisää `ci.yml`:ään sen jälkeen.
- [ ] Figma-tiedoston nimi on yhä *Document* — Plugin API ei salli nimen
      asettamista, joten se on vaihdettava käsin: **Pokela — Design System**
- [ ] Figma: kirjastossa ovat `ListRow`, `Button`, `Nav`, `Media`, `Footer`,
      `Accordion`, `LogoRow` ja `Icon` sekä gridityyli
      `Grid / Page` (sarakemäärä, väli ja marginaali sidottu muuttujiin,
      joten framen Layout-moodi ratkaisee ne). Seuraavat komponentit
      lisätään samalla kaavalla, ja jokainen lisätään myös
      `scripts/check-code-connect.mjs`:n `IN_FIGMA`-listaan.
- [ ] Figma: sivupohjat **etusivu**, **työlista** ja **casesivu** ovat
      valmiina sekä `lg 1440` että `base 390` -koossa. Casepohjassa on
      viisi yhdestätoista lohkotyypistä — scope, steps, choices,
      artefacts ja component lisätään kun niitä tarvitaan.
- [ ] **Figman perusvariantti ei kohdista perusviivalle.** CSS:ssä
      `.list-row` on `align-items: baseline` joka leveydellä, ja
      mobiilissa numero istuu siksi 13 pikseliä otsikon ylälaidan
      alapuolella. Figman `Breakpoint=base` -varianteissa se on
      ylälaidassa: `counterAxisAlignItems` on asetettu arvoon
      `BASELINE`, mutta Figma ei toteuta sitä tässä sisäkkäisessä
      kehyksessä — `sm+`-varianteissa, joissa auto-layout on
      komponentti itse, se toimii. Kiertotie olisi kiinteä yläpaddingi,
      eli juuri sellainen käsin laskettu luku jota tämä projekti
      välttää. Ero näkyy vain numerossa, ei ikonissa eikä rivin
      korkeudessa (rivit täsmäävät 2 pikselin sisällä).
- [ ] Figmassa ei ole auki olevaa valikkoa, joten `close`-ikonille ei ole
      siellä käyttöpaikkaa. Ikoni on kirjastossa ja koodissa; pohja
      lisätään jos valikko mallinnetaan.
- [ ] Englanninkieliset tekstit — lisää `'en'` `lib/i18n.ts`:n `locales`-listaan kun valmiit
- [ ] Blokbook: stack, julkaisuvuosi, taloyhtiöiden määrä
- [ ] Asiakkaiden sitaatit (Colliers, Blokbook) ja "mitä tekisin toisin"
- [ ] Colliersin logo — nykyinen tiedosto on tumma laatikko varjolla, ei sanamerkki
- [ ] Microsoftin logon käyttölupa — tai pidä pelkkä nimi
- [ ] Oikeat kuvat ja videot; shot listit ovat `portfolio-pokela/*.dc.html`-tiedostoissa

Aiemmista töistä puuttuu (siirretty tänne `content/work/fi.ts`:n `todo`-kentistä,
jotka eivät koskaan renderöityneet sivulle):

- [ ] Pivo: saavutettavuusuudistuksen kriteerit ja saavutettu taso
- [ ] Elisa Aisti: kuinka suuri osa front endistä oli omaa työtä? Nyt sanotaan "osallistuin"
- [ ] OP Vahinkoapuri: onko korvauskäsittelyn nopeutumisesta julkaistavia lukuja?
- [ ] Aistin ja OP:n kaappaukset ovat laitemockuppeja — rajattava näyttöalueeseen ennen käyttöä
