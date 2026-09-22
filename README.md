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
| **CV tulostuu, ei lataudu** | Sivustolla ei ole CV-PDF:ää eikä sellaista tehdä: se olisi toinen kopio samasta sisällöstä ja eriytyisi sivusta heti kun jompaakumpaa muokataan. Tietoa-sivu **on** CV, ja `styles/print.css` tekee siitä paperille kelpaavan — selain tuottaa PDF:n samasta lähteestä (`content/cv/fi.ts`), joten se ei voi vanhentua. Kaksi kohtaa jotka olisivat rikkoneet tulosteen hiljaa: `.reveal` on `opacity: 0` kunnes osio on selattu näkyviin, ja tumma teema tulostaisi valkoisen tekstin valkoiselle paperille koska selain ei tulosta taustoja. Molemmat pakotetaan tulostuksessa. |
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
✓ Ei kovakoodattuja arvoja — 23 arvoa tarkistettu, 22 kirjattua poikkeusta
✓ Test Files 13 passed · Tests 59 passed
```

Lisäksi CI ajaa erikseen `npm run check:figma`, joka tarvitsee verkon:

```
✓ Figma synkassa — 8/8 komponenttia kytketty, 8 osoitetta ja niiden propertyt tarkistettu (Pokela — Design System)
  · 1 apukomponenttia ei vaadi kytkentää: Nav / Link
  · Muuttujia ei tarkisteta: Figman variables-rajapinta vaatii Enterprise-tason.
```

**1. Tokenit** (`scripts/check-tokens.mjs`) — vertaa `tokens.css`:n ja
`tokens.json`:n värit, tyyppiasteikon ja riviväliasteikon jokaisella
breakpointilla, välistyksen, layoutin, reunat ja motion-arvot.

**2. Storyt** (`scripts/check-stories.mjs`) — jokaisella komponentilla on
story, ja jokaisessa storyssa vähintään tumma teema ja mobiilikoko.
Poikkeus on sallittu, mutta **sen syy ei ole vapaa teksti.**

Aiemmin se oli, ja se osoittautui aukoksi: `CaseBlocks.tsx`illa luki
*"lohkot ovat omia komponenttejaan"*, mikä tarkoitti "nämä on testattu
muualla". Se ei ollut totta — casesivun 12 lohkoa olivat yhden funktion
sisällä eikä yhtäkään ollut koskaan renderöity testissä. Tarkistus
näytti vihreää, koska se tarkisti että perustelu on olemassa, ei että
se on totta.

Syy on nyt valinta kolmesta, ja jokaisella on sääntö jonka skripti ajaa:

| Syy | Mitä skripti tarkistaa |
|---|---|
| `palvelinkomponentti` | Tiedosto tai jokin sen importeista käyttää `node:fs`:ää |
| `katettu-muualla` | Kattava sivu on olemassa **ja** viittaa tähän komponenttiin |
| `ei-näkyvää` | JSX:ssä ei ole yhtään näkyvää elementtiä |

Vapaan tekstin voi yhä kirjoittaa `huom`-kenttään ihmiselle, mutta se
ei korvaa sääntöä.

**3. Kovakoodatut arvot** (`scripts/check-hardcoded.mjs`) — tokenit eivät
hajoa kerralla vaan yksi kiire kerrallaan: joku kirjoittaa
`padding: 13px` koska asteikolla ei satu olemaan 13:a, ja puolen vuoden
päästä asteikon vieressä elää toinen, kirjoittamaton asteikko.
Tarkistus ei kiellä poikkeusta vaan vaatii sille syyn — jokainen
kovakoodattu mitta ja väri on joko token tai kirjattu `EXEMPT`-listaan
perusteluineen.

**4. Favicon** (`scripts/check-favicon.mjs`) — `public/`-kansion
favicon-tiedostot eivät ole käsin piirrettyjä binäärejä vaan johdettuja
artefakteja: `scripts/build-favicon.mjs` laskee ne `tokens.css`:n
käännetystä väriparista (`--invert-surface` / `--invert-ink`) ja
piirtää merkin tämän järjestelmän omana vektorina. Ilman tarkistusta
paletin muutos jättäisi ikonin vanhaan sävyyn — repossa oleva `.ico` ei
kerro mistä se on tullut, eikä kukaan katso selaimen välilehteä
teemanvaihdon jälkeen.

Tarkistus kutsuu samaa `tiedostot()`-funktiota kuin generointi ja
vertaa tuloksen levyyn tavu tavulta. Se ei siis voi laskea eri tavalla
kuin generaattori, ja se havaitsee myös käsin muokatun tiedoston.
Korjaus on `npm run build:favicon`.

**Raja:** tarkistus ei näe onko merkki hyvä. Muoto on koordinaatteina
generaattorissa, ja sen luettavuus 16 pikselissä on arvioitu silmällä.

**5. Kuvat** (`scripts/check-kuvat.mjs`) — kuvat eivät ole repoon
pudotettuja tiedostoja vaan johdettuja artefakteja, samoin kuin
favicon. `scripts/kuvat.mjs` laskee `content/media.generated.json`:n
lähteistä ja sisällössä ilmoitetuista kuvasuhteista; tarkistus kutsuu
samaa funktiota ilman enkoodausta ja vertaa tuloksen levyyn.

Se havaitsee kolme hiljaista eriytymää:

| Vika | Mitä tapahtuisi ilman tarkistusta |
|---|---|
| Kuvasuhde muuttuu sisällössä | Sivu pyytäisi tiedostoja joita ei ole, tai näyttäisi vanhan rajauksen |
| Lähteellä ei ole paikkaa | Kuva olisi repossa muttei näkyisi missään |
| Manifesti puuttuu | Kaikki kuvapaikat palaisivat paikanvaraajiksi |

**Raja:** tarkistus ei arvioi kuvaa. Rajaus on oletuksena keskeltä,
eikä mikään huomaa jos olennainen kohta jää sen ulkopuolelle. Tyhjä
paikka ei ole virhe vaan tila, joten puuttuva kuva ei kaada buildia.

**6. Saavutettavuus** (`npm run test:stories`) — jokainen story
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

**7. Code Connect** (`scripts/check-code-connect.mjs`) — valvoo rajaa
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

**8. Figma** (`scripts/check-figma.mjs`) — ainoa tarkistus joka avaa
Figma-tiedoston. Se varmistaa kolme asiaa: jokaisen kytkennän
`node-id` osoittaa olemassa olevaan komponenttiin ja nimi täsmää,
jokaisella kirjaston komponentilla on kytkentä, ja **jokainen property
ja variantti jonka kytkentä lukee on oikeasti Figmassa**. Viimeinen on
se kohta jonka casesivu kerran lupasi ilman katetta: jos `Size=m`
poistetaan Figmasta tai `showIcon` nimetään uudelleen, ajo pysähtyy ja
kertoo kumpi. Kirjaston sisältö
luetaan Figma-tiedostosta: ylimmän tason komponenttisetti on kirjastoa,
paitsi jos nimessä on ryhmäerotin (`Nav / Link`). Käsin ylläpidettyä
listaa ei siis tarvita.

Ensimmäinen ajo löysi todellisen eriytymän: `LogoRow`-kytkentä osoitti
yhteen varianttiin (`Breakpoint=sm+`) eikä komponenttiin, jolloin koodi
olisi näkynyt Dev Modessa vain sen yhden variantin kohdalla. Neljä muuta
tarkistusta eivät voineet nähdä sitä.

Tämä ajetaan **CI:ssä omana vaiheenaan, ei `check:sync`-ketjussa**:
ketjun on toimittava ilman verkkoa ja ilman salaisuuksia, eikä Figman
katkos saa estää sivuston buildia. Tarvitsee `FIGMA_ACCESS_TOKEN`in
(oikeus: *Files → Read the contents of … files*).

**Code Connect julkaistaan CI:ssä.** `npm run figma:publish` ajetaan
jokaisella mainiin menevällä pushilla, ei pull requesteissa. Ennen tätä
kytkennät olivat repossa mutta Figma ei tiennyt niistä mitään — Dev
Modessa ei näkynyt koodia, vaikka casesivu sanoi "julkaistaan repon
mukana". Nyt väite on totta rakenteeltaan. Oikeus:
*Development → Write and change component code*.

**9. Dokumentaatio** (`scripts/check-docs.mjs`) — dokumentaatio
eriytyy samalla tavalla kuin koodi ja Figma, mutta huomaamattomammin:
väärä luku README:ssä ei kaada mitään. Tarkistus vaatii neljä asiaa:
mainittu polku ja komento on olemassa, jokainen `scripts/check-*.mjs`
on kirjattu kaikkiin kolmeen rekisteriinsä, ja johdettavissa olevat
kohdat vastaavat lähdettään.

Rekisterit ovat:

| Paikka | Mitä se kertoo |
|---|---|
| `README.md` | mitä tarkistus todistaa ihmiselle |
| `.github/workflows/ci.yml` | ajetaanko se oikeasti ennen mergeä |
| `lib/checks.ts` | näkyykö se casesivun listalla |

Jokainen näistä on unohtunut kerran. Viimeisin oli `check-favicon`:
se oli `check:sync`-ketjussa, joten casesivu ilmoitti sen ajossa
olevaksi — mutta CI ei aja ketjua vaan jokaisen tarkistuksen omana
askeleenaan, jotta kaatuva kohta näkyy GitHubin käyttöliittymässä
nimeltä. Askel puuttui, joten tarkistus ei ajanut kertaakaan pull
requestissa. Vihreä CI väitti enemmän kuin se katsoi.

Johdettavat kohdat merkitään luoduksi lohkoksi eikä kirjoiteta käsin:

```
<!-- luotu:LOHKON-NIMI -->   ← tähän väliin generoitu sisältö
<!-- /luotu -->
```

Käytössä olevat lohkot: `figma-kokoelmat` (pluginin README) ja
`perusta-sivut` (Storybookin etusivu).

Lohko generoidaan lähteestä (tässä: pluginin oma spesifikaatio) ja
verrataan tiedostoon. `npm run docs:korjaa` kirjoittaa ne uusiksi.

Proosaa tämä ei voi todentaa. Auditissa 21.9.2026 löytyi kolme
eriytymää joita mikään ei ollut huomannut: Storybookin etusivu lupasi
*"ei matkalla käsityötä"* ja *"ei ikoneita paitsi nuolet"*, ja pluginin
README väitti `Border`-kokoelmassa olevan 4 muuttujaa (5) eikä tuntenut
`Icon`-kokoelmaa lainkaan. Ensimmäinen ajo tällä tarkistuksella kaatui
omaan sääntöönsä: `check-docs` ei ollut itse dokumentoitu.

**Figman muuttujat** eivät ole tarkistuksessa. Ne generoidaan
`tokens.json`:sta (`figma-plugin/`), joten ne *syntyvät* oikein — mutta
generointi on kertaluontoinen ajo. Jos joku muokkaa muuttujaa Figmassa
sen jälkeen, mikään ei huomaa. Sanoin tässä aiemmin että eriytymä on
"rakenteellisesti mahdoton"; se oli liian vahva väite.

**Miksei muuttujia verrata rajapinnan kautta — todennettu 21.9.2026:**
päätepiste `GET /v1/files/:key/variables/local` vastaa, mutta palauttaa

```
403 Invalid scope(s): file_content:read, file_code_connect:write.
    This endpoint requires the file_variables:read scope
```

Oikeutta `file_variables:read` ei ole tämän tilin tunnusvalikoimassa —
lista alkaa `current_user:read`istä ja päättyy `webhooks:write`iin eikä
sisällä muuttujia. Sitä ei siis voi rastittaa, joten rajoitus on tilin
tasolla eikä unohdus.

Tämä luki tässä aiemmin muodossa "vaatii Enterprise-tason" ilman että
kukaan oli kokeillut. Lopputulos oli sama, mutta väite oli kuulopuhetta.
Nyt se on kokeiltu.

## Kuvat

Pudota tiedosto `kuvat/uudet/`-kansioon ja aja:

```
npm run kuvat
```

Muuta ei tarvita. Skripti nimeää, siirtää, rajaa, skaalaa ja pakkaa —
eikä koodia tarvitse koskea.

### Miten tiedosto löytää paikkansa

Jokaisella kuvapaikalla on tunniste (`id`) sisällössä, ja se on myös
tiedoston nimi. `colliers-hero.png` menee paikkaan jonka `id` on
`colliers-hero`. Tunniste on tyypissä pakollinen, joten kuvapaikkaa ei
voi lisätä ilman että kuvaputki tietää siitä.

Nimi normalisoidaan kevyesti: isot kirjaumet, välilyönnit, ääkköset ja
Finderin lisäämät kaksoiskappalemerkinnät siivotaan. `Colliers hero
2.png` osuu siis oikeaan paikkaan. Tunnistamatonta tiedostoa **ei
arvata** — se jää postilaatikkoon ja skripti listaa vapaat paikat
kuvateksteineen.

Vertailupari tarvitsee kaksi tiedostoa: `<id>-ennen` ja `<id>-jalkeen`.

Casejen ja aiempien töiden kuvapaikat luetaan sisältötiedostoista.
Kuvat jotka eivät kuulu mihinkään caseen — tällä hetkellä muotokuva —
ovat omassa rekisterissään `content/kuvat.ts`. Ilman sitä muotokuva
olisi jäänyt ainoaksi käsin ylläpidetyksi kuvaksi sivustolla.

### Kolme kansiota

| Kansi | Rooli | Repossa |
|---|---|---|
| `kuvat/uudet/` | Postilaatikko. Tyhjenee ajossa. | ei |
| `kuvat/` | Normalisoidut lähteet, yksi per paikka | kyllä |
| `public/kuva/` | Rajatut ja pakatut johdannaiset | ei |

Lähde säilytetään **rajaamattomana**, enintään 2800 px pitkältä
sivulta. Rajaus on johdannaisen ominaisuus, ei lähteen: jos kuvasuhde
muuttuu sisällössä, uusi rajaus lasketaan samasta lähteestä eikä kuvaa
tarvitse hankkia uudelleen. Rajattu lähde olisi tie yhteen suuntaan.

### Mitä johdannaisista tulee

AVIF ja WebP, leveysportaat 480–2800 px lähteen mukaan. Komponentti
kirjoittaa `<picture>`-elementin, jossa on `srcset`, `sizes` ja
laiska lataus — `sizes` tulee lohkolta, koska lohko tietää kuinka
leveänä kuva piirtyy, kuva ei.

`hero` saa **kolme rajausta**, koska sen kuvasuhde vaihtuu
breakpointeittain (4:5 → 16:9 → 21:9). Yksi rajaus olisi joko kirjeenä
mobiilissa tai leikkaisi laidat työpöydällä.

Mittaustulos Pivon vertailuparista: 501 kt PNG → 22 kt AVIF, **96 %
pienempi**, ilman näkyvää eroa gradientissa tai tekstin reunoissa.

### Rajauskohta

Oletus on keskitys, koska se on ennustettava ja sama minkä CSS:n
`object-fit: cover` tekisi. Jos kuvan olennainen kohta on muualla,
tee lähteen viereen `kuvat/<id>.json`:

```json
{ "rajaus": "top" }
```

Sallitut arvot ovat sharpin sijainnit: `top`, `right top`, `right`,
`right bottom`, `bottom`, `left bottom`, `left`, `left top`, `centre`.

### Video

Sama putki. Pudota `mp4` tai `mov`, ja siitä syntyy mp4 (H.264) ja
webm (VP9) sekä julistekuva. Sisällössä paikan `kind` on `video`.

Videota **ei toisteta automaattisesti**. Automaattitoisto vaatisi
asiakaskomponentin jotta `prefers-reduced-motion` voidaan lukea, ja
liikkuva kuva jota ei voi pysäyttää on saavutettavuusongelma silloinkin
kun se on mykkä. Julistekuva näkyy heti, katsoja päättää lähteekö se
liikkeelle. `preload="metadata"` hakee vain otsakkeet.

### Logot

Logot ovat samalla tavalla johdettuja, lähteet kansiossa
`kuvat/logo/`. Ne piirretään CSS-maskina, joten vain alfakanava
merkitsee — väri tulee tokenista. Siksi rasteri pakataan
yksikanavaiseksi ja pienennetään näyttökorkeuteen × 4, mikä kattaa 3×
näytön ja kohtuullisen zoomin.

Alkuperäiset olivat 5–8-kertaisesti ylimitoitettuja: 1480 × 204
pikselin PNG piirrettiin 15 pikselin korkuisena. **1369 kt → 58 kt,
96 % pienempi**, ilman näkyvää eroa.

Jos `kuvat/logo/<nimi>.svg` on olemassa, se voittaa PNG:n. Virallinen
vektori yrityksen brändisivulta on aina parempi kuin pienennetty
rasteri, eikä sitä kannata jäljittää koneella: kirjainmuodot
vääristyisivät. **Nykyiset kymmenen ovat rasteria** — SVG:t ovat
hankittavissa mutta niiden käyttöoikeus on tapauskohtainen.

Kuvasuhde luetaan manifestista. Se oli ennen käsin `content/logos.ts`:
ssä; `height` on yhä siellä, koska se on optinen päätös eikä
mitattavissa.

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

Kaksi listaa: järjestelmä on sitä mitä voin tehdä itse, sisältö vaatii
sinulta kuvat, faktat ja luvat. **Sisältö on ainoa este julkaisulle.**

### Järjestelmä

- [ ] **Figma-tiedosto on Loihde Factorin organisaatiossa.** Kahdesta
      kysymyksestä toinen on ratkennut 22.9.2026:

      ✓ Organisaatio sallii julkisen katselulinkin, ja se on päällä.
        Todennettu ulkopuolelta: `linkAccess: view`, HTTP 200 ilman
        tunnusta, tiedosto renderöityy ilman kirjautumista.

      Jos tiedosto pitää joskus siirtää omaan tiliin, se on yksi commit:
      `content/artefacts.ts` ja kahdeksan `.figma.ts`:n tiedostoavain.
      `check:figma` osoittaa jokaisen jääneen kohdan yksitellen, joten
      siirto on mekaaninen. Irtisanomisaika on Suomessa 1–2 kuukautta,
      joten aikaa on. Ei syy pidätellä julkaisua.

      **Raja jonka lukija kohtaa:** Code Connect -kytkennät näkyvät vain
      Dev Modessa, jota anonyymi katselija ei saa auki ("Sign up to
      inspect"). Katselulinkki riittää tiedostoon, ei kytkentöihin. Tämä
      lukee nyt myös artefaktilistassa.
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
- [ ] Figma: kirjastossa ovat `ListRow`, `Button`, `Nav`, `Media`, `Footer`,
      `Accordion`, `LogoRow` ja `Icon` sekä gridityyli
      `Grid / Page` (sarakemäärä, väli ja marginaali sidottu muuttujiin,
      joten framen Layout-moodi ratkaisee ne). Seuraavat komponentit
      lisätään samalla kaavalla, ja jokainen lisätään myös
      `scripts/check-code-connect.mjs`:n `IN_FIGMA`-listaan.
- [ ] Figma: sivupohjat **etusivu**, **työlista** ja **casesivu** ovat
      valmiina sekä `lg 1440` että `base 390` -koossa. Niiden lisäksi
      on **Lohkot**-pohja molemmissa koissa, jossa ovat ne lohkot
      joita casepohjissa ei ollut.

      <!-- luotu:case-lohkot -->
      12 lohkotyyppiä: text, media, pair, band, trio, scope, artefacts, checks, steps, choices, component, todo
      <!-- /luotu -->

      Kaikki paitsi `todo` ovat nyt Figmassa. `todo` näkyy vain
      kehityksessä eikä tule Figmaan koskaan.

      **Avoinna:** kolmen lohkon sisältö johdetaan build-aikana
      (`artefacts`, `checks`, `component`), joten niiden korkeus
      Figmassa vanhenee heti kun tarkistus tai artefakti lisätään.
      Rakenne pätee, korkeus ei. Sivupohjat eivät ole tarkistuksessa
      lainkaan — ks. `lib/checks.ts`:n `blind`-kentät.
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
- [ ] Englanninkieliset tekstit — lisää `'en'` `lib/i18n.ts`:n `locales`-listaan kun valmiit.
      Näkyvät tekstit on siirretty sanakirjaan, joten käännös on kirjoitustyötä
      eikä arkeologiaa. Samalla kannattaa tehdä `check:strings`, joka estää
      uudet kovakoodatut tekstit — nyt se olisi vain listannut nykytilan, ja
      poikkeuslista olisi kasvanut kohdassa jossa kone joutuu arvaamaan
      tuotenimen ja käännettävän tekstin eron.

### Sisältö

Yhteensä **18 kuvaa** ja **16 muuta kohtaa**, joista kaksi odottaa
ulkopuolista lupaa (Colliersin sitaatti, Microsoftin logo).

Kuvapaikat ovat olemassa oikeissa kuvasuhteissa ja kuvatekstit on
kirjoitettu, joten ne kertovat mitä kuvassa pitää näkyä. Layout ei
liiku kun kuva tulee tilalle.

Kuva on pelkkä tiedosto: pudota se `kuvat/uudet/`-kansioon nimellä
`<id>.png` ja aja `npm run kuvat`. Ks. *Kuvat* yllä.

**Videota ei ole missään.** `components/Media.tsx` osaa vain kuvan, ja
casejen sisällössä ei ole yhtään videopaikkaa. Jos jokin näistä
kannattaa esittää liikkeenä, se on komponenttimuutos eikä pelkkä
tiedosto.

Lähteet: casejen sisältö on `content/cases/fi.ts`, aiemmat työt
`content/work/fi.ts`. Kuvaussuunnitelmat ovat
`portfolio-pokela/*.dc.html`-tiedostoissa.

---

#### 01 · Colliers Asunnot — 6 kuvaa, 3 faktaa, 1 lupa, 1 logo

| # | Suhde | Mitä |
|---|---|---|
| 1 | hero | Kohdesivu isona — terävä, tarkoituksella rajattu, **min. 2800 px leveä** |
| 2 | 4:3 | Viikko 1: skeleton selaimessa. Screenshot, Git-historia tai varhainen Storybook-näkymä |
| 3 | 4:3 | Sama näkymä julkaistussa palvelussa — **sama rajaus kuin 2** |
| 4 | 4:5 | AI-haku: kirjoitettu kuvaus + tulokset |
| 5 | 4:5 | Vuokraa heti -polku, yksi vaihe |
| 6 | 4:5 | Strapi-editori sisältöä muokattaessa |

- [ ] "Mitä tekisin toisin" — yksi rehellinen lause
- [ ] Asiakkaan sitaatti: lause, nimi, titteli — **odottaa lupaa**
- [ ] Mittarit. Teksti sanoo nyt "Mittareita ei ole vielä julkaistu" —
      joko luvut tai lause pois
- [ ] Logo. `kuvat/logo/colliers.png` on tumma laatikko
      harmaine palkkeineen; muut logorivin merkit ovat läpinäkyviä
      sanamerkkejä. Nykyinen ei istu riviin

#### 02 · Blokbook — 6 kuvaa, 5 faktaa

| # | Suhde | Mitä |
|---|---|---|
| 1 | hero | Varausnäkymä työpöydällä — **oikeaa dataa, ei demosisältöä** |
| 2 | 4:3 | Asukas varaa ja maksaa: vapaat vuorot ja maksu |
| 3 | 4:3 | Isännöinnin hallintanäkymä: tilat, vuorot, maksut, käyttöoikeudet |
| 4 | 3:4 | Web — varausnäkymä kapeana |
| 5 | 3:4 | iOS — natiivisovellus, **ei laitekehystä** |
| 6 | 3:4 | Android — sama näkymä |

- [ ] Stack
- [ ] Julkaisuvuosi
- [ ] Taloyhtiöiden määrä (jos saa kertoa)
- [ ] Isännöitsijän tai hallituksen lause
- [ ] "Mitä tekisin toisin"

#### 03 · Tämä sivusto — valmis

Ei kuvapaikkoja, ei puuttuvia faktoja. Kaikki viisi artefaktia ovat
julkaistuja ja linkitettyjä: Storybook, Figma-tiedosto, Code
Connect -kytkennät, repo ja sivu itse.

- [ ] Poista vanhentunut `todo`-lohko `content/cases/fi.ts`:stä. Se
      pyytää viittä URL-osoitetta, komponenttinäkymän koodia ja
      kytkentöjen määrää — kaikki johdetaan nyt build-aikana. Lohko ei
      renderöidy tuotannossa, joten se ei näy lukijalle, mutta se
      valehtelee lähdekoodissa

#### 04 · Pivo — kuva valmis, 1 fakta

Ennen/jälkeen-kuva on olemassa (`pivo-ennen.png`, `pivo-jalkeen.png`).

- [ ] Saavutettavuusuudistuksen kriteerit ja saavutettu taso

#### 05 · Elisa Aisti — 3 kuvaa, 1 fakta

| # | Suhde | Mitä |
|---|---|---|
| 1 | 4:3 | Toimipistelista ja kartta työpöydällä — päänäkymä |
| 2 | 4:5 | Mobiilikartta ja toimipisteen tila |
| 3 | 4:3 | Tiketti aikaennusteineen |

- [ ] Kuinka suuri osa front endistä oli omaa työtä? Nyt lukee
      "Front end -toteutus" ilman rajausta
- [ ] Nykyiset kaappaukset ovat laitemockuppeja — rajattava
      näyttöalueeseen ennen käyttöä

#### 06 · OP Vahinkoapuri — 3 kuvaa, 1 fakta

| # | Suhde | Mitä |
|---|---|---|
| 1 | 4:3 | Ilmoituksen aloitus: mitä tarvitaan ja kauanko kestää |
| 2 | 4:5 | Vaurionvalitsin: auto ylhäältä, klikattavat osat |
| 3 | 4:3 | Mukautuva kysymyspolku |

- [ ] Onko korvauskäsittelyn nopeutumisesta julkaistavia lukuja?
- [ ] Nykyiset kaappaukset ovat laitemockuppeja — rajattava
      näyttöalueeseen ennen käyttöä

#### Kaikkia koskevat

- [ ] Microsoftin logon käyttölupa — tai jätä pelkkä nimi. Logo on
      `kuvat/logo/microsoft.png` ja näkyy logorivissä

---

**Lähimpänä valmista:** Blokbook. Kuvat ovat omasta tuotteesta, joten
et tarvitse kenenkään lupaa — ja viisi puuttuvaa faktaa ovat sinun
tiedossasi. Colliers vaatii asiakkaan luvan sitaattiin ja uuden
logotiedoston.
