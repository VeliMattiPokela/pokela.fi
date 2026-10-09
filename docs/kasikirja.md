# Käsikirja

Miten pokela.fi:n prosessi toimii käytännössä. Lyhyt yleiskuva on
`README.md`:ssä, päätökset perusteluineen `paatokset.md`:ssä ja kokeilujen
tulokset `docs/loki.md`:ssä.

## Rakenteen periaatteet

| Periaate | Mitä |
|---|---|
| **Yksi rivi** | Etusivun listarivi, työlistan kärkirivi ja avautuva rivi ovat sama `.list-row`. Erot ovat modifioijia: `--numbered`, `--m`, `--expandable`. `Accordion` on oma komponenttinsa vain siksi että se on `<button>` eikä linkki — CSS on yhteinen. **Figmassa sama asia tarkoittaa sisäkkäisyyttä:** `Accordion` sisältää `ListRow`-instanssin, ei kopiota. Code Connect lukee sisällön sieltä (`findInstance('ListRow')`). |
| **Inline-meta** | `.meta` on inline-elementti, joten sen rivilaatikon korkeuden määrää säiliön strut. Jos säiliö ei ole flex tai grid, käytä `display: flex` — muuten meta saa leipätekstin rivivälin. Osui kolmesti: navin `<li>`, `.work__also`, ja `<p class="meta">`:n marginaali. |
| **Omat ikonit** | Ikonikirjastoa ei käytetä — systeemi piirtää kuusi merkkiään itse (`components/Icon.tsx`). Ruudukko on 16×16, viiva `--hairline`, päätteet tylpät koska `--radius` on 0, väri aina `currentColor`. Merkit olivat ennen tekstiä (`↗`, `✕`, `+`), jolloin ne riippuivat siitä mitä fontin osajoukossa sattui olemaan: Figmassa `↗` ei löytynyt Archivosta lainkaan. Kun merkit ovat omia, sana `icon` on myös oikea — `sign` ja `indicator` olivat kiertoilmauksia. Teemanvaihto pysyy sanana: se ei ole toiminto vaan tila, ja tila luetaan. |
| **Yksi lukumitta** | `--measure: 62ch` on ainoa. Se kelpaa myös 14 pikselin tekstille, koska `ch` skaalautuu fonttikoon mukana — sama luku tarkoittaa suunnilleen samaa merkkimäärää joka koossa. Mitattuna leipäteksti saa 63 merkkiä riville, mikä osuu klassiseen 45–75:n haarukkaan. Sivustolla oli välillä viisi eri `ch`-arvoa, mutta mittaus osoitti ettei kolme niistä ollut lukumittoja lainkaan: kuvateksti on sidottu kuvaan ja roolirivi on taittovarmistus. Ne ovat nyt pikseleinä ja kirjattuina poikkeuksina. **`ch` ei sovi harvennettuun tekstiin:** se ei tunne `letter-spacing`iä, joten roolirivin `68ch` lupasi 68 merkkiä kun riville mahtui 35. |
| **CV tulostuu, ei lataudu** | Sivustolla ei ole CV-PDF:ää eikä sellaista tehdä: se olisi toinen kopio samasta sisällöstä ja eriytyisi sivusta heti kun jompaakumpaa muokataan. Tietoa-sivu **on** CV, ja `styles/print.css` tekee siitä paperille kelpaavan — selain tuottaa PDF:n samasta lähteestä (`content/cv/fi.ts`), joten se ei voi vanhentua. Kaksi kohtaa jotka olisivat rikkoneet tulosteen hiljaa: `.reveal` on `opacity: 0` kunnes osio on selattu näkyviin, ja tumma teema tulostaisi valkoisen tekstin valkoiselle paperille koska selain ei tulosta taustoja. Molemmat pakotetaan tulostuksessa. |
| **Nimeäminen** | Tokenit puhuvat materiaalista (`paper`, `ink`, `rule`, `bleed`, `measure`), komponentit käytöstä (`ListRow`, `Media`, `Button`). Jos komponentin nimi vaatii selityksen, se on väärä nimi. |

## Sivun teksti

Ääni on mutkaton, asiallinen ja rennon toteava: kuin kokenut tekijä
kertoisi kollegalle mitä teki ja miten se meni. Sivu ei myy, ei opeta
alaa eikä todista mitään.

- Kerro mitä tehtiin ja mitä siitä seurasi, ei mitä design systemeille
  yleensä tapahtuu.
- Yksi asia lausetta kohden. Ei siteerattavia aforismeja eikä
  "ei X vaan Y" -rakennetta: kerro se Y suoraan.
- Ei absoluutteja ("ainoa", "jokainen") eikä muiden tapojen vähättelyä.
  Koodi ensin on yksi tapa, Figma ensin toinen.
- Arkikieltä sisäpiirin sanojen tilalle: "tarkistus", ei "vartija";
  "vastaavat toisiaan", ei "synkassa".
- Rajat ja epävarmuus kerrotaan ohimennen, ilman dramatiikkaa.
- Ajatusviivoja korkeintaan yksi kappaleessa.

Prosessiketjun tekstit (`content/prosessi.ts`) näkyvät myös Figmassa.
Kun niitä muuttaa, Figman tekstit päivitetään samalla, muuten
`check:figma` punastuu.

## Synkkatarkistus

CI ajaa jokaisen tarkistuksen omana askeleenaan jokaisessa pull
requestissa, ja `npm run build` ajaa verkottomat (`check:sync`).
Eriytymä pysäyttää putken, ja raportti kertoo mikä eriytyi ja miten se
korjataan. `check:figma` ja `check:paketti` tarvitsevat verkon, joten ne
ajetaan vain CI:ssä.

Jokainen tarkistus on syntynyt virheestä, joka pääsi läpi ennen sitä
(päätös 8). Casesivun lista (`lib/checks.ts`) kertoo saman lyhyesti
sokeine kohtineen.

**Buildin aikajana.** `npm run build` ajaa `scripts/ajo.mjs`:n, joka ajaa
`check:sync`-ketjun tarkistukset ja kuvaputken, kirjaa kunkin keston ja
yhteenvetorivin tiedostoon `.ajo/ajo.json` ja käynnistää sitten
Next.js:n. Case 03 näyttää kirjauksen aikajanana (lohko `ajo`, yleinen
`Timeline`-komponentti), joten
sivu kertoo sen buildin, joka sen rakensi. Kaatunut vaihe pysäyttää
buildin, joten aikajanalla ei voi olla punaista vaihetta. CI ajaa saman
skriptin Sivuston build -askeleena (päätös 17).

**1. Tokenit** (`scripts/check-tokens.mjs`) — `tokens.css` ja
`tokens.json` sanovat samaa: värit, tyyppi- ja riviväliasteikko
jokaisella breakpointilla, välistys, layout, reunat ja motion.

**2. Storyt** (`scripts/check-stories.mjs`) — jokaisella komponentilla on
story, ja siinä vähintään tumma teema ja mobiilikoko. Poikkeuksen syy on
valinta kolmesta, ja skripti tarkistaa sen: `palvelinkomponentti`
(tiedosto tai sen import käyttää `node:fs`:ää), `katettu-muualla`
(kattava sivu on olemassa ja viittaa komponenttiin) tai `ei-näkyvää`
(JSX:ssä ei näkyvää elementtiä). Syy oli ennen vapaa teksti, ja sen
varjolla casesivun 12 lohkoa jäivät renderöimättä testissä.

**3. Kovakoodatut arvot** (`scripts/check-hardcoded.mjs`) — jokainen
kovakoodattu mitta ja väri on token tai kirjattu `EXEMPT`-listaan
syineen. Muuten asteikon viereen kasvaa yksi kiire kerrallaan toinen,
kirjoittamaton asteikko.

**4. Favicon** (`scripts/check-favicon.mjs`) — favicon lasketaan
tokeneista (`scripts/build-favicon.mjs`), ja tarkistus vertaa samalla
funktiolla levyyn tavu tavulta. Korjaus: `npm run build:favicon`. Raja:
ei arvioi, onko merkki hyvä.

**5. Kuvat** (`scripts/check-kuvat.mjs`) — `content/media.generated.json`
vastaa lähteitä ja sisällön kuvasuhteita: muuttunut suhde, lähde jolla
ei ole paikkaa ja puuttuva manifesti kaatavat ajon. Raja: ei arvioi
rajausta, ja tyhjä paikka on tila eikä virhe.

**6. Kuvasuhteet** (`scripts/check-suhteet.mjs`) — sama suhde on kolmessa
paikassa: `scripts/kuvat.mjs` (`SUHTEET`, rajaus ja media-kyselyt),
`styles/base.css` (`.media-*`) ja `components/Media.tsx` (`Ratio`).
Jokainen porras verrataan erikseen. Raja: ei arvioi, onko suhde oikea,
eikä näe luokkanimen muunnosta (`4:3` → `media-4-3`).

**7. Saavutettavuus** (`npm run test:stories`) — jokainen story
renderöidään Chromiumissa ja tarkistetaan axella. Raportti kertoo
elementin, mitatun arvon ja rajan. Raja: vain konetarkistettavat
säännöt, ei lukujärjestystä eikä näppäimistön järkevyyttä.

**8. Code Connect** (`scripts/check-code-connect.mjs`) — kytkentä ei
osoita poistettuun koodin komponenttiin eikä väärään Figma-tiedostoon,
eikä `IN_FIGMA`-listan komponentti ole kytkemättä. Raja: ei avaa
Figmaa, sen tekee `check:figma`.

**9. Figma** (`scripts/check-figma.mjs`) — ainoa tarkistus joka avaa
Figma-tiedoston. Kytkentöjen `node-id`:t ja nimet osuvat, kirjaston
jokaisella komponentilla on kytkentä, ja jokainen property ja variantti
jonka kytkentä lukee on Figmassa. Lisäksi layout gridit vastaavat
tokeneita, Median Ratio-variantit `SUHTEET`-taulua, ja luodut tekstit
sekä sivupohjien tekstit lähdettään (ks. *Figma ja koodi*). Ensimmäinen
ajo löysi `LogoRow`-kytkennän, joka osoitti yhteen varianttiin.
Ajetaan CI:ssä buildin jälkeen, ja se tarvitsee `FIGMA_ACCESS_TOKEN`in
(*Files → Read the contents of … files*). Code Connect julkaistaan
jokaisella mainin pushilla (`npm run figma:publish`, oikeus
*Development → Write and change component code*).

**10. Paketit** (`scripts/check-paketti.mjs`) — npm:n `@pokela/tokens` ja
`@pokela/components` vastaavat tavulleen sitä, mitä repo rakentaisi.
Figma Make lukee npm:ää, ei repoa: 6.10.2026 ohjeet lupasivat Makelle
`ThemeToggle`n, jota npm:n versiossa ei ollut. "Sisältö eroaa, versio
sama" sanotaan erikseen, koska korjaus alkaa versionnostosta (ks.
*npm-paketit → Versio*). Pull requestissa ja mainin alussa se ajetaan
lipulla `--ennen-julkaisua`, joka hyväksyy uudemman, vielä julkaisemattoman
version, koska main julkaisee sen. Julkaisun jälkeen se ajetaan ilman
lippua. Raja: tarkistus itse ei julkaise, eikä tiedä mitä versiota Make
kit osoittaa.

**11. Dokumentaatio** (`scripts/check-docs.mjs`) — mainitut polut ja
komennot ovat olemassa, jokainen `scripts/check-*.mjs` on kirjattu tähän
käsikirjaan, `.github/workflows/ci.yml`:hin ja `lib/checks.ts`:ään, ja
luodut lohkot (`<!-- generated:NIMI -->` … `<!-- /generated -->`)
vastaavat lähdettään: `figma-kokoelmat` (pluginin README) ja
`perusta-sivut` (Storybookin etusivu). Korjaus: `npm run docs:korjaa`.
Syntyi, kun `check-favicon` oli ketjussa mutta ei CI:ssä. Raja: proosaa
se ei todenna.

### Figma ja koodi

**Luodut tekstit.** Figman tekstisolmu, jonka nimi on `generated:<id>`,
saa sisältönsä tiedostosta `scripts/figma-teksti.mjs`: kannen luvut,
prosessin ketju ja tarkistuslista. Lähteet ovat `content/prosessi.ts` ja
`lib/checks.ts`. Kannessa luki kerran 6 · 77 · 9, kun todellisuus oli
7 · 83 · 10.

**Sivupohjien tekstit.** Jokainen näkyvä teksti pohjakehyksessä
(`<Pohja> · <moodi> <leveys>`) on löydyttävä siltä buildatulta sivulta,
jota pohja kuvaa. Pohja ja sivu yhdistetään `scripts/figma-sivupohjat.mjs`:n
`POHJAT`-taulussa, ja pohjan huomautus nimetään `huom:`-alkuiseksi
(päätös 15). Esimerkkiarvo, joka vaihtuu joka buildissa (aikajanan
kestot, kellonajat ja tulosrivit), nimetään `vaihtuu:`-alkuiseksi, ja
sen rakenne tarkistetaan mutta sisältö ei. Raja: sivulle lisättyä
osiota, jota pohjassa ei ole, ei huomata.

**Kun pohjan teksti ei ole sivulla**, `npm run pohjat` (buildin jälkeen)
päättelee suunnan muutoksen diffistä:

| Tilanne | Mitä tapahtuu |
|---|---|
| Sivun teksti muuttui | vanha → uusi kirjoitetaan pohjiin, jos tulos löytyy sivulta |
| Vain luku muuttui | sivun luku kirjoitetaan pohjaan; luvut johdetaan koodista (esim. kytkentöjen määrä), joten diffissä ei ole paria |
| Pohjaa muokattiin Figmassa | ei kirjoiteta yli; raportti näyttää lähimmän sivun rivin, ja muutos viedään koodiin |
| Kumpikin muuttui | ei kirjoiteta, ihminen päättää |

Figman rajapinta on vain luku, joten skripti tuottaa jokaiselle pohjalle
Figmassa ajettavan koodin (`.scratch/pohjat/`). Ensin ilman lippua, jolloin
koodi palauttaa suunnitelman, sitten `npm run pohjat -- --kirjoita`
(päätös 16).

**Yksi Figma, monta committia.** Figmassa on vain nykytila. Kun Figma
päivitetään pull requestissa, vanhempi commit ei enää menisi läpi.
Siksi sopimusta koskevat muutokset (solmujen nimet, luotujen tekstien
lähteet) tehdään omassa pull requestissaan, ja muut avoimet pull
requestit ajetaan uudelleen mergen jälkeen.

**Figman muuttujat** eivät ole tarkistuksessa. Päätepiste
`GET /v1/files/:key/variables/local` vaatii oikeuden `file_variables:read`,
joka on Figman dokumentaation mukaan vain Enterprise-tasolla (kokeiltu
21.9.2026: 403). Muuttujat generoidaan `tokens.json`:sta (`figma-plugin/`),
mutta niiden käsimuokkausta mikään ei huomaa. Sama rajoite koskee
asiakkaan Figmaa vaiheen 0.1 inventaariossa.

## npm-paketit

```bash
npm run paketti
```

Kaksi pakettia hakemistoon `packages/`:

| Paketti | Mitä | Lähde |
|---|---|---|
| `@pokela/tokens` | värit, mitat, typografia | `tokens.json` |
| `@pokela/components` | React-komponentit ja niiden tyylit | `components/` |

### Versio

Numero kertoo paketin käyttäjälle, mitä hänen pitää
tehdä, ei sitä, kuinka iso muutos oli:

| Nosto | Milloin |
|---|---|
| patch (2.4.0 → 2.4.1) | tyylin hienosäätö, korjaus, uusi CSS-luokka sivuston omalle komponentille |
| minor (2.4 → 2.5) | pakettiin tulee uusi komponentti, token tai props |
| major (2 → 3) | jotain poistuu tai muuttuu niin, että käyttäjän koodi rikkoutuu |

Kahdeksas lokakuuta minoria nostettiin herkästi: levyn varjokorjaus oli
2.3.0, vaikka se oli patch. Ks. päätös 13.

### Tokenit

`scripts/paketti-tokens.mjs` rakentaa `tokens.json`:sta asennettavan
paketin.

**Miksi:** Figma Make osaa lukea design-systeemin vain npm-pakettina. Ilman
tätä se arvaa värit ja mitat itse, ja prototyyppi näyttää siltä miltä malli
kuvittelee — ei siltä mitä koodissa on. Sama paketti kelpaa myös muille
projekteille, ja silloin sivusto ei ole ainoa joka tietää mitä `--ink` on.

**Paketti on kokonaan johdettu, myös sen `package.json`.** Versio tulee
kohdasta `$meta.version`, joten sitä ei tarvitse nostaa kahdessa paikassa,
eikä paketissa voi olla tokenia jota lähteessä ei ole. Hakemisto on
`.gitignore`ssa ja rakennetaan uudelleen joka ajolla — johdannaista ei
säilytetä versionhallinnassa, koska kopio voi vanhentua.

Mitä paketista tulee ulos:

| Tiedosto | Mitä |
|---|---|
| `index.js` | tokenit JavaScript-objekteina |
| `index.d.ts` | tyypit — tuntematon tokenin nimi on käännösvirhe |
| `tokens.css` | CSS-muuttujat, sama tiedosto jota sivusto käyttää |
| `tokens.json` | lähde sellaisenaan, työkaluille |

```js
import tokens, { color, space } from '@pokela/tokens';
import '@pokela/tokens/tokens.css';

color.light.ink;   // '#101112'
space['24'];       // '24px'
```

Tyypeillä on käytännön merkitys: `color.light.muste` ei käänny, koska
sellaista tokenia ei ole. Kirjoitusvirhe löytyy kääntäjältä eikä
selaimesta.

Paketilla ei ole riippuvuuksia. Se on Figma Maken vaatimus — siellä
workspace-riippuvuudet eivät toimi — ja muutenkin oikein, koska tokenit
ovat dataa eivätkä koodia.

### Komponentit

`scripts/paketti-komponentit.mjs` vie seitsemän komponenttia: `Icon`,
`ListRow`, `Accordion`, `Grid`, `Reveal`, `ThemeScript` ja `ThemeToggle`.
Lähde on `components/` — **samat tiedostot joita sivusto ajaa**, ei kopioita. Ne siirretään sellaisenaan ja käännetään
TypeScriptillä, joten paketin komponentti ei voi erota siitä jota sivusto
ajaa.

**Ehto vientiin:** komponentti ei saa tuoda mitään sivustokohtaista — ei
`@/content`, ei `@/lib`, ei `next/*`. Generaattori tarkistaa sen ja
**pysähtyy** jos ehto rikkoutuu. Siksi `ListRow` ottaa linkkikomponentin
propsina:

```jsx
import Link from 'next/link';
<ListRow as={Link} title="Työn nimi" href="/tyot/esimerkki" />
```

Oletuksena se on tavallinen `<a>`. Sivusto antaa Nextin linkin ja säilyttää
reitityksen; paketin käyttäjä antaa oman.

Ulkopuolelle jäävät ja miksi — lista on generaattorissa, ei vain tässä:

| Komponentit | Miksi ei |
|---|---|
| Media, LogoRow, CaseText, CaseBlock, CaseBlocks, CaseBlockDerived, ListRowShowcase | lukevat sivuston omaa sisältöä |
| Nav, Footer | tarvitsevat sanakirjan ja reitityksen |
| BeforeAfter | rakentuu Median varaan |
| ComponentView, PrintCv | riippumattomia, mutta sivuston ominaisuuksia — eivät design systemin osia |

### Lisenssi

**Lisenssi on MIT, ja se koskee vain näitä paketteja.** Paketissa on sivuston
omat väri- ja mitta-arvot, joilla ei ole arvoa muille, joten vapaa lisenssi
ei anna pois mitään — ja ilman lisenssiä npm-paketti on monelle yritykselle
automaattinen ei. Myytävä asia ei ole paketti vaan tämän pystyttäminen
asiakkaan koodipohjaan.

**Repon juuressa ei ole LICENSE-tiedostoa eikä sellaista lisätä.** Repossa on
asiakastyön kuvia ja casetekstejä, joita ei voi lisensoida
ohjelmistolisenssillä.

Paketit on julkaistu julkiseen npm:ään. Main julkaisee ne itse: kun
muutos yhdistetään ja kaikki tarkistukset ovat vihreällä, CI:n vaihe
*Paketit npm:ään* ajaa `npm run paketti:julkaise`
(`scripts/julkaise-paketit.mjs`). Se julkaisee vain version, jota npm:ssä
ei vielä ole, tokenit ensin, ja odottaa kunnes uusi tarball on
ladattavissa. Sen jälkeen `check:paketti` varmistaa, että npm vastaa repoa
tavulleen. Ihmisen osa on versionnosto samassa pull requestissa (ks.
*Versio*). Ks. päätös 20.

Julkaisu tarvitsee repon salaisuuden `NPM_TOKEN`: npm:n granular token,
oikeus *Read and write* paketteihin `@pokela/tokens` ja
`@pokela/components`. Jos se puuttuu tai vanhenee, vaihe kaatuu ja kertoo
syyn, mutta vain silloin kun julkaistavaa on.

Repon juuren `package.json` on `"private": true`, joten koko sivustoa
asiakaskuvineen ei voi julkaista vahingossa.

## Figma Make

Paketit ovat npm:ssä, joten Figma Make osaa lukea ne. Mutta paketti kertoo
Makelle vain *mitä* on olemassa — ei sitä *milloin* mitäkin käytetään. Sen
kertovat ohjeet, ja Figman mukaan ne ratkaisevat tuloksen laadun.

Ohjeet ovat hakemistossa `guidelines/` — **repossa, eivät Figman
käyttöliittymässä.** Tiedostonimet ovat samat kuin Figma Maken omat, joten
kopiointi on tiedosto tiedostolta eikä tulkintaa:

| Tiedosto | Mitä |
|---|---|
| `guidelines/setup.md` | asennus, molemmat paketit, tyylien tuonti |
| `guidelines/tokens.md` | ei aksenttiväriä, ei varjoja, välistysasteikko |
| `guidelines/styles.md` | typografia, ei Tailwind-luokkia, grid |
| `guidelines/components.md` | komponenttien käyttö, `as`-propsi |

Syy on sama kuin kaiken muunkin kohdalla: siellä ne ovat
versioituja ja katselmoitavia, ja muutos niihin näkyy pull requestissa siinä
missä koodimuutos.

Kolme asiaa ohjaavat niiden kirjoittamista:

**Lyhyys on sääntö, ei tyyli.** Figma sanoo suoraan: *"More context isn't
always better. It can confuse the LLM."* <!-- generated:make-sanat -->Kaikki ohjetiedostot ovat yhteensä 1352 sanaa.<!-- /generated -->

**Propseja ei toisteta.** Make lukee paketin TypeScript-tyypit itse. Jos
ohjeissa luettelisi propsit, ne olisivat kopio joka vanhenee — eli juuri se
vika jota koko tämä repo vastustaa.

**Kaikki minkä koodi määrää, on luotu lohko.** Komponenttilista johdetaan
siitä, mitä `@pokela/components` oikeasti vie. Fonttien latauslinkki ja
sallitut painot luetaan layoutin fonttikutsuista, välien määrä
`tokens.json`:sta, ikonien määrä `Icon`ista ja sarakkeet `tokens.css`:stä.
Jos jokin niistä muuttuu, `check:docs` kaatuu. 9.10.2026 käsin kirjoitettu
`setup.md` lupasi version 1.1.0, kun paketti oli 2.5.0, eikä kertonut
fonteista lainkaan.

**Ohjeet tulevat paketin mukana.** `npm run paketti` kopioi `guidelines/`-
hakemiston pakettiin `@pokela/components/guidelines/`. Kitin oma ohje on
Maken käyttöliittymässä, eikä siihen ole rajapintaa, joten kopio sinne
vanhenee. Siksi kitin `setup.md` vain osoittaa paketin ohjeisiin, ja
paketin päivitys tuo uudet ohjeet.

Sisältö on kieltoja enemmän kuin käskyjä, koska mallin oletukset ovat
vahvoja ja väärään suuntaan: ei aksenttiväriä, ei pyöristyksiä, ei varjoja,
ei ikonikirjastoa, ei muita fonttipainoja kuin ladatut kolme. Ilman niitä
Make tekee sinisen napin pyöristetyillä kulmilla, koska niin se on oppinut
tekemään.

### Make kitin kokoaminen

Figman kuusi askelta. Ohjeet (askel 4) ovat tässä repossa, loput tehdään
Figmassa:

1. Make-tiedosto → Settings → **Create a kit**
2. Lisää npm-paketit: `@pokela/tokens` ja `@pokela/components`
3. Erityisasetuksia ei tarvita: tyylit ja fontit latautuvat komponenttien mukana
4. **Ohjeet** — kitin `setup.md`:hen vain osoitus paketin ohjeisiin, ks. alla; Maken muut kolme oletusohjetta poistetaan
5. Testaa: pyydä Makelta näkymä (esim. "työlista ja aikajana") ja uusi komponentti, ja katso, kysyykö se ensin ja käyttääkö se `PageHeader`- ja `Section`-patterneja (päätös 21)
6. Julkaise kit

Kitin `setup.md` kokonaan:

```md
Read the guidelines that ship with the package before writing any code:
node_modules/@pokela/components/guidelines/setup.md, tokens.md, styles.md
and components.md. They are the current rules; follow them over anything
you assume.
```

Kahden ensimmäisen ajon tulokset: `docs/loki.md`.

## Vaihe 0 — olemassa olevaan taloon

Kaikki tässä repossa kuvattu olettaa puhdasta pöytää: tokenit ovat yhdessä
paikassa, komponenteilla on kytkennät, tarkistukset ovat vihreitä
ensimmäisestä päivästä. **Yksikään yritys ei ole siinä tilassa.**

Tyypillinen lähtötilanne on toinen. Figma-tiedostoja on useita, osa puoliksi
hylättyjä. Sovelluksessa on kolme Button-komponenttia joista kaksi on
kuollutta. Tokeneita on jossain, mutta puolet arvoista on kovakoodattu. Ja
se vaikein: **kukaan ei tiedä kumpi puoli on oikeassa.**

Siksi ketju alkaa nollasta: ennen lenkkejä 1–7 on vaihe 0. Se ei ole käännös eikä siivous. Se on
sovittelu kahden olemassa olevan totuuden välillä.

Vaiheessa on kolme askelta, ja vain kaksi niistä on koneen työtä.

### 0.1 Inventaario ja ero — kone

Luetaan molemmat puolet ja kerrotaan missä ne eroavat. **Ei vielä oteta
kantaa kumpi on oikeassa** — se on seuraavan askeleen tehtävä, ja jos työkalu
ottaa kannan tässä, se on jo päättänyt sen puolesta jonka pitäisi päättää.

Tuloste ei ole pass/fail vaan luettava luettelo: montako väriä kummallakin
puolella, montako täsmää, montako eroaa, mitkä ovat vain toisessa. Sama
typografialle, välistykselle ja komponenteille.

Tämän askeleen oikea mittari ei ole tarkkuus vaan se, kelpaako tuloste
pöydälle asetettavaksi vaiheessa 0.2.

```bash
npm run inventaario
```

**Tämä on toteutettu** (`scripts/inventaario.mjs`). Se lukee Figma-tiedoston
rajapinnan yli ja repon tiedostoista, ja tulostaa luettelon: montako
komponenttia kummallakin puolella, mitkä ovat vain toisessa, mitä propertyjä
ja variantteja Figmassa on, ja montako tokenia koodissa on ryhmittäin.

**Se ei kaadu eikä tuomitse.** Lukeminen on yhteistä `check:figma`:n kanssa
(`scripts/figma-rajapinta.mjs`), mutta tuloste on luetteloa eikä pass/fail.

Ensimmäinen ajo 6.10.2026 löysi kaksi asiaa joita yksikään tarkistus ei
nähnyt:

**Kuvasuhteet ovat neljässä paikassa, eivät kolmessa.** Figman
`Media`-komponentilla on `Ratio = hero | 4:3 | 4:5 | 3:4 | 1:1` — sama tieto
kuin `kuvat.mjs`:ssä, `base.css`:ssä ja `Media.tsx`:ssä. `check:suhteet`
rakennettiin vartioimaan kolmea lähdettä, ja neljäs jäi ulkopuolelle. **Nyt
katettu:** `check:figma` vertaa Figman varianttia `SUHTEET`-tauluun molempiin
suuntiin.

**Ja yksi asia jota ei osattu odottaa.** Sivupohjien layout gridit on sidottu
muuttujiin, ja rajapinta palauttaa myös niiden **ratkaistut** arvot:

```
Etusivu · lg 1440    count 12 · gutterSize 24 · offset 36
Etusivu · base 390   count  4 · gutterSize 16 · offset 20
```

Eli grid on tarkistettavissa `layout.columns`, `layout.gutter` ja
`layout.pagePadding` -tokeneita vastaan **vaikka muuttujia itseään ei voi
lukea.** Enterprise-rajoite ei estä tätä. `check:figma` tekee sen nyt
kuudelle gridille, ja moodi luetaan kehyksen nimestä (`Etusivu · lg 1440`).

Grid on sivuston perusta: jos Figman sarakemäärä eroaa koodista, jokainen
leiska on väärä eikä mikään kaadu.

**Kytkentä voi osoittaa tyylitiedostoon.** Ensimmäinen versio raportista
väitti `Button`in puuttuvan koodista. Se on kytketty — mutta
`styles/base.css`:ään, koska nappi on luokkasopimus (`.btn`) eikä React-
komponentti. Raportti vertasi vain `.tsx`-tiedostoihin. Korjattu: kohde
luetaan kytkennästä ja näytetään.

Mitä se **ei** näe: Figman muuttujia. `file_variables:read` on Figman mukaan
*"Enterprise plan only"*, joten tokeniryhmä raportoidaan vain koodin
puolelta. Kierto on oman pluginin lukutila — Plugin API ei ole saman
rajoitteen takana — mutta se vaatii ihmisen avaamaan Figman, eikä sitä ole
vielä rakennettu.

### 0.2 Kumpi voittaa — ihminen

**Tässä kohtaa palkataan asiantuntija.** Askelta ei voi automatisoida eikä
pidä yrittää.

Koko tämän repon prosessi olettaa että **koodi on totuus**. Olemassa olevassa
talossa se ei ole annettu, ja se voi olla väärin: jos Figma-kirjasto on kypsä
ja sovellus sekava, suunnittelijat ovat oikeassa ja koodi väärässä. Silloin
tarkistukset pakottaisivat Figman vastaamaan huonompaa totuutta.

Päätös tehdään asiaryhmä kerrallaan, ei kerralla:

| Ryhmä | Kysymys |
|---|---|
| Värit | Figman kirjasto vai koodin tokenit? |
| Typografia | kumman skaala jää? |
| Välistys | kumman asteikko? |
| Komponenttien rajapinnat | kumman nimet ja variantit? |
| Nimeäminen | nimetäänkö uudelleen vai ei (ks. alla) |

Työ on keskustelua: inventaarion läpikäynti suunnittelun ja kehityksen
kanssa, erimielisyyksien ratkaisu, ja niiden perustelujen kirjaaminen.
Sidosryhmiä on yleensä enemmän kuin kaksi — myös se joka maksaa ja se joka
joutuu elämään päätöksen kanssa.

**Yksi suositus on valmis:** tokenien nimiä ei nimetä uudelleen. Nimien
vaihto koskee jokaista olemassa olevaa tiedostoa ja tekee migraatiosta
riskin, jota kukaan ei halua omistaa. Rakenne saa muuttua, nimet eivät.

Askeleen tulos ei ole mielipide vaan **kirjattu päätös**. Tässä repossa ne
ovat tiedostossa `paatokset.md`: mitä päätettiin, miksi, ja milloin.

**Ero ei ole sama asia kuin eriytymä.** Inventaario ei voi tietää kumpaa se
katsoo, ja siinä se on oikeassa:

- **eriytymä** — toinen puoli on vanhentunut, ja se korjataan
- **käännös** — molemmat ovat oikeassa omassa välineessään, ja ero kirjataan
  tarkoitukselliseksi

Ensimmäisellä kierroksella 6.10.2026 inventaario löysi kolme eroa, ja
**kaksi niistä oli käännöksiä.** `Grid` ja `Reveal` eivät kuulu Figmaan, koska
Figma ilmaisee asettelun ja liikkeen toisin. `ListRow`in boolean-propertyt
kuuluvat Figmaan muttei koodiin, koska Figman instanssissa ei ole
määrittelemätöntä arvoa.

Työkalu joka olisi pakottanut voittajan jokaiseen eroon olisi tuottanut kaksi
väärää korjausta kolmesta. Siksi tämä askel on ihmisen eikä koneen — ja siksi
inventaario ei ota kantaa.

### 0.3 Lähtötaso ja räikkä — kone

**Tämä on toteutettu** (`scripts/lahtotaso.mjs`), ja kytkettynä kolmeen
tarkistukseen: `check:hardcoded`, `check:stories` ja `check:code-connect`.
Ne ovat ne jotka legacy-koodipohjassa räjähtäisivät pahiten — kuvittele 200
komponenttia ja 20 storya.

Tämän repon tarkistukset ovat ehdottomia: nolla rikkomusta tai build kaatuu.
Olemassa olevassa koodipohjassa se tarkoittaa tuhansia virheitä ensimmäisellä
ajolla — ja tarkistus kytketään pois samana päivänä. Tarkistus joka ei voi
olla vihreä ei ole tarkistus.

```bash
npm run lahtotaso:kirjaa   # kirjaa nykytilan kerran
npm run lahtotaso          # näytä paljonko velkaa on maksettu
```

Kirjaus syntyy tiedostoon `lahtotaso.json`, joka **kuuluu versionhallintaan**:
se ei ole johdannainen vaan päätös siitä mitä hyväksyttiin ja milloin.

Build kaatuu vain jos rikkomus on **uusi**:

```
✓ Ei kovakoodattuja arvoja — 25 arvoa tarkistettu, 22 kirjattua poikkeusta,
  2 lähtötasolla (4 → 2, 50 % maksettu)

✗ Kovakoodatut arvot: 1 kohtaa
  UUSI kirjaamaton arvo:
    components/work.css:43    border-radius: 9px
    (4 aiemmin kirjattua rikkomusta ei lasketa — ne ovat lähtötasolla.)
```

**Tunnisteet, ei lukumäärä.** Lähtötaso tallentaa rikkomusten tunnisteet ja
niiden esiintymismäärän, ei kokonaislukua. Muuten yhden korjaaminen ja toisen
lisääminen menisi läpi nollasummana. Tunniste on muotoa
`tiedosto|ominaisuus:arvo` eikä sisällä rivinumeroa — rivit siirtyvät kun
yläpuolelle lisätään koodia, ja koskematon rikkomus näyttäisi silloin uudelta.

**Räikkä kiertyy vain yhteen suuntaan.** Kirjaus hylätään jos nykytila on
kirjattua suurempi:

```
Error: Lähtötasoa ei nosteta: hardcoded oli 2, nyt 5.
```

**Ja se on myös myynnin mittari.** `alku` kirjataan kerran eikä se muutu,
joten edistymisen voi näyttää numerona:

```
  Velan maksu

  hardcoded        ██████████··········   50 %
                   4 → 2   (lähtötaso kirjattu 2026-10-06)
```

Laskeva luku on näyttö siitä että asetelma toimii — räikkä ei ole vain
sietomekanismi vaan se mittari jolla työn tulos osoitetaan.

**Tässä repossa mekanismi on lepotilassa.** Rikkomuksia ei ole, joten
`lahtotaso.json`-tiedostoa ei ole, ja ilman sitä kaikki on uutta — eli
tarkistukset käyttäytyvät täsmälleen kuten ennenkin.

**Räikkä kattaa puuttumisen, ei rikkinäisyyttä.** Tämä on se ratkaisu joka
tekee siitä turvallisen:

| Rikkomus | Räikkä | Miksi |
|---|---|---|
| komponentilla ei ole storya | **kyllä** | perittyä velkaa, maksetaan kun ehditään |
| Figman komponentilla ei ole kytkentää | **kyllä** | sama |
| kytkentä osoittaa poistettuun komponenttiin | **ei** | näyttää Dev Modessa koodia jota ei ole |
| poikkeus jonka sääntö ei päde | **ei** | lista ei vastaa koodia |

Rikkinäinen kytkentä on **väärää tietoa**, ei velkaa. Se oli väärin myös
ensimmäisenä päivänä, eikä sitä korjaa ajan kuluminen. Jos räikkä hyväksyisi
sen, koodipohja voisi kantaa pysyvästi rikkinäistä kytkentää lähtötason
suojassa.

**Lähtötaso ei korvaa `EXEMPT`-listaa.** Ne ovat eri mekanismit eikä toista
pidä venyttää toisen tilalle:

| | Periaate | Mittakaava | Kesto |
|---|---|---|---|
| `EXEMPT` | poikkeus vaatii kirjoitetun syyn | kymmeniä | pysyvä |
| Lähtötaso | vanha velka hyväksytään ilman syytä | tuhansia | tilapäinen |

Neljäätuhatta rikkomusta ei perustella yksitellen. Mutta niitä ei myöskään
hyväksytä pysyvästi.

---

Askel 0.2 on syy miksi tämä ostetaan ihmiseltä eikä ladata GitHubista.
Työkalut voi kopioida; sen päätöksen ohjaamista ei voi.

## Kuvat

Pudota tiedosto `kuvat/uudet/`-kansioon ja aja:

```
npm run kuvat
```

Muuta ei tarvita. Skripti nimeää, siirtää, rajaa, skaalaa ja pakkaa —
eikä koodia tarvitse koskea.

### Mistä tiedät miksi kuva pitää nimetä

**Sivulta.** Kehitystilassa jokaisessa tyhjässä kuvapaikassa lukee
numero, tunniste ja se millainen kuva siihen kuuluu:

```
4   colliers-haku                        4:5 · ≥880 px
AI-HAKU: KIRJOITETTU KUVAUS + TULOKSET
```

Numero on tiedostonimi, muoto ja vähimmäisleveys kertovat millainen
kuva tarvitaan, kuvateksti mitä siinä pitää näkyä. Koko näkymän voi
siis käydä läpi sivulta ilman terminaalia.

`hero` näyttää kaikki kolme kuvasuhdettaan (`4:5 · 16:9 · 21:9`) — se
on samalla varoitus siitä että kuva rajataan kolmeen eri muotoon.
Vertailuparin muoto on `vapaa`, koska sitä ei rajata lainkaan.

Merkinnät näkyvät vain kehityksessä (`Media.tsx` päättää sen
`NODE_ENV`:n perusteella) — julkaistussa sivustossa numero laatikon
nurkassa näyttäisi keskeneräiseltä.

**Tai terminaalista:**

```
npm run kuvat:lista
```

Luettelo kaikista kuvapaikoista sivun järjestyksessä: numero,
tunniste, kuvasuhde, lohkotyyppi ja mitä kuvan pitää näyttää. ✓
merkitsee täytettyä paikkaa. Sama taulukko on käsikirjan *Avoinna*-
osiossa luotuna lohkona.

Luettelo johdetaan sisällöstä, joten se ei voi kertoa paikoista joita
ei ole eikä unohtaa niitä jotka ovat.

### Miten tiedosto löytää paikkansa

Tiedoston nimi on **numero** — sama joka lukee paikanvaraajassa
sivulla:

```
4.png                       → paikka 4
13-ennen.png / 13-jalkeen   → vertailupari, kaksi tiedostoa
7.png  +  7-mobiili.png     → hero, toinen valinnainen
```

Tämä on ainoa sääntö. Paikka kertoo itse mitä se hyväksyy, jos nimi
ei kelpaa:

```
4-mobiili.png    4 (colliers-haku) hyväksyy: 4
13-mobiili.png   13 (pivo-kirjautuminen) hyväksyy: 13-ennen, 13-jalkeen
7-tabletti.png   7 (blokbook-hero) hyväksyy: 7, 7-mobiili (valinnainen)
``` **Päätteellä ei ole väliä** — pudota png, jpg,
heic tai mitä kamerasta tuleekin; putki muuntaa sen kerran.

Mikään muu ei kelpaa, eikä mitään arvata. `colliers4.png` ja
`colliers-haku.png` jäävät postilaatikkoon ja putki kertoo mitä
nimeksi tarvitaan. Väärä arvaus panisi oikean kuvan väärään kohtaan
ilman että kukaan huomaa.

#### Miksi numero eikä tunniste

Numero on sivujärjestys. Jos kuvapaikka lisätään keskelle, kaikki sen
jälkeiset numerot siirtyvät — ja `7.png` jonka nimesit eilen kuuluisi
tänään eri paikkaan.

Siksi numero on **kertakäyttöinen**: putki nimeää tiedoston heti
tunnisteeksi, joten `kuvat/`-kansio pysyy luettavana eikä numero jää
elämään mihinkään. Tunniste on tyypissä pakollinen
(`content/cases/types.ts`), joten kuvapaikkaa ei voi lisätä ilman että
kuvaputki tietää siitä.

Riski jää siihen hetkeen jolloin katsot sivua ja ajat komennon. Siksi
putki tulostaa mihin numero osui **ja minkä kuvatekstin kanssa**:

```
✓ Postilaatikosta otettu 1:
    4.png  →  kuvat/colliers-haku  2400×3000
      ↳ Colliers Asunnot: AI-haku: kirjoitettu kuvaus + tulokset
```

Väärä osuma on tarkoitus nähdä heti, ei kuukauden päästä.

**Tapoja oli aiemmin viisi:** tunniste, lyhennetty tunniste, numero,
etuliite+numero ja puoli. Neljä viidestä oli olemassa vain koska muita
sallittiin, ja ne törmäsivät toisiinsa — kaksoiskappalemerkinnän
poisto söi paikan `colliers-viikko-1` lopusta numeron, ja etuliitteen
hyväksyminen vaati oman tarkistuksensa ettei `blokbook2` mene paikkaan
2. Yksi sääntö on lyhyempi kuin viisi sääntöä ja niiden
yhteisvaikutukset.

### Kolme kansiota

| Kansi | Rooli | Repossa |
|---|---|---|
| `kuvat/uudet/` | Postilaatikko. Tyhjenee ajossa. | ei |
| `kuvat/` | Normalisoidut lähteet, yksi per paikka | kyllä |
| `public/kuva/` | Rajatut ja pakatut johdannaiset | ei |

Johdannaiset lasketaan joka buildissa, mutta samaa ei lasketa kahdesti.
`kuvat.mjs` tallentaa jokaisen johdannaisen välimuistiin avaimella, joka
lasketaan lähteen tavuista, rajauksesta, mitoista, pakkausasetuksista ja
sharpin ja ffmpegin versioista. Muuttunut kuva saa uuden avaimen ja
lasketaan uudelleen, muut kopioidaan. Ajo poistaa avaimet, joita se ei
käyttänyt. CI säilyttää välimuistin ajosta toiseen. Syy: AVIF-pakkaus
ja videon muunnos veivät noin neljä minuuttia jokaisesta CI-ajosta,
vaikka lähteet eivät muuttuneet (9.10.2026). Välimuistista sama ajo kestää
alle sekunnin, ja tulos on tavulleen sama.

Lähde säilytetään **rajaamattomana**, enintään 2800 px pitkältä
sivulta. Rajaus on johdannaisen ominaisuus, ei lähteen: jos kuvasuhde
muuttuu sisällössä, uusi rajaus lasketaan samasta lähteestä eikä kuvaa
tarvitse hankkia uudelleen. Rajattu lähde olisi tie yhteen suuntaan.

Lähteet tallennetaan **häviöttömänä WebP:nä**. Häviötön tarkoittaa
bitilleen samaa kuvaa kuin PNG, joten uudelleenrajaus ei kasaa
pakkausvirhettä. Mitattuna nykyisistä lähteistä: **3,89 MB → 2,14 MB,
45 % pienempi.**

Yksi asia on hyvä tietää. WebP-häviötön hylkää *täysin läpinäkyvän*
pikselin väriarvon. Tarkistin sen: alfakanava on bitilleen sama ja
näkyvän pikselin väri bitilleen sama kaikissa neljässätoista
lähteessä — ero on vain sellaisen pikselin alla jota ei voi nähdä.
Jos jokin läpinäkyvä alue joskus paljastettaisiin, sen alta ei löydy
vanhaa väriä. Muotokuvan tausta on poistettu tarkoituksella ja logot
ovat maskeja, joten sillä ei ole tässä merkitystä.

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

### Kun lähde ei mahdu paikkaan

Putki kertoo jokaisesta kuvasta paljonko rajaus poistaa ja mistä
suunnasta. Se on **tieto, ei varoitus** — vuotava sommittelu jossa
laitteet jatkuvat reunojen yli on tehokeino, ja varoitus jota ei voi
kuitata on varoitus jonka oppii ohittamaan:

```
Rajaukset:
    7  blokbook-hero    −55 % leveydestä (base) · −24 % korkeudesta (lg)
    4  colliers-haku    −42 % korkeudesta

!  Liian pieni lähde — ota kuva uudelleen leveämpänä:
    4  colliers-haku    lähde on 622 px leveä, paikka tarvitsee noin 880 px
```

Varoituksia on siis yksi laji: liian pieni lähde. Sitä ei voi korjata
skaalaamalla, joten se on aina tekemistä vaativa.

### Esitys: levy tai täysi

Oletuksena kuva näytetään **levyllä**: kokonaisena, rajaamatta,
hillityn taustalevyn (`--badge-surface`) keskellä. Levyssä on
hiusviiva ja terävät kulmat kuten muuallakin sivulla. Kuvalla ei ole
omaa kehystä, vain kevyt varjo, joka seuraa sen muotoa (`drop-shadow`):
läpinäkyvä kuva, kuten pyöristetty laitemockup, ei saa ympärilleen
suorakulmaista laatikkoa. Syy: kuvakaappauksen oma tausta osui ennen suoraan sivun
taustaa vasten ja raja näytti sattumanvaraiselta. Puhelinkaappaus taas
rajautui 4:5:ksi ja menetti puolet ruudustaan. Levyllä jokainen kuva
saa saman rajan ja sivu saman rytmin. Päätetty 8.10.2026 mock-kuvan
perusteella.

```ts
{ id: 'esimerkki', ratio: '4:3', esitys: 'taysi', caption: '…' }
```

**Täysi** täyttää paikan ja rajaa kuvan sen kuvasuhteeseen, kuten
ennen. Valokuvalle tai kuvitukselle, jolla ei ole omaa taustaa.
`sovita` ja `rajaus` alla koskevat vain täyttä esitystä; `alue`
koskee kumpaakin.

Esitys kirjoitetaan sisältöön paikan viereen, kuten `ratio`, eikä
`kuvat/<nimi>.json`:iin. Se on Median `esitys`-propsi ja Figman
`Esitys`-variantti, joten Figma-tarkistus vaatii saman tilan Figmaan.
Ensimmäinen versio luki arvon json-tiedostosta, ohitti propsit ja jäi
Figmasta kokonaan pois huomaamatta (päätös 10).

**Hero** on aina täysi. Sen tausta jatkuu nauhana ruudun reunoihin, ja
kuva pysyy sivun levyisenä (`.media-hero` base.css:ssä).
Vertailuparilla on oma esityksensä.

Puhelinkaappaus on tyypillisesti 0,46-suhteinen eikä se mahdu
4:5-laatikkoon kokonaisena eikä rajattuna järkevästi — kokeiltuna
kumpikin ääripää oli huono: rajaus katkaisi otsikon, sovitus teki
sisällöstä lukukelvottoman pientä.

Kolme vaihtoehtoa, kaikki `kuvat/<nimi>.json`:iin:

```json
{ "alue": { "y": 0.26, "korkeus": 0.58 } }
```

**Alue** on taiteellinen rajaus datana. Se kertoo mikä osa lähteestä
on kuva — yleensä yksi paneeli, ei koko ruutu. Lähde säilyy
koskemattomana, joten alueen voi muuttaa milloin tahansa ja
kuvasuhteen vaihtuessa uusi rajaus lasketaan samasta alkuperäisestä.

Arvot ovat **osuuksia lähteestä (0–1), eivät pikseleitä.** Syy on
yksi: murtoluku ei vanhene. Pikselialue päti vain sille kuvalle jolle
se oli tehty, ja kun kuva vaihdettiin, vanha alue leikkasi
mielivaltaisen palan uudesta — hiljainen korruptio, koska tulos on
kelvollinen kuva eikä mikään kaadu. Se vaati oman leimansa
sivutiedostoon ja oman virheluokkansa; molemmat poistuivat tämän
myötä. Puuttuva `x` ja `y` ovat 0, puuttuva `leveys` ja `korkeus`
loppuun asti.

Murtoluku ei kuitenkaan auta, jos uusi kuva on eri sommitelma: alue
osoittaa yhä samaan kohtaan ruutua. Niin kävi `colliers-haulle`
8.10.2026, kun AI-haun kuvakaappaus vaihdettiin karttanäkymään. Siksi
`npm run kuvat` sanoo nyt kuvan vaihtuessa, jos paikalla on vanha alue,
ja antaa komennon sen poistamiseen. Aluetta ei poisteta automaattisesti,
koska saman näkymän päivitetty kaappaus tarvitsee sen yhä.

```json
{ "sovita": true }
```

**Sovita** mahduttaa koko kuvan laatikkoon eikä rajaa mitään. Reunat
jäävät läpinäkyviksi, jolloin laatikon taustaväri näkyy läpi ja
seuraa teemaa. Taustan polttaminen tiedostoon tekisi vaaleasta
reunasta pysyvän myös tummassa teemassa.

```json
{ "rajaus": "top" }
```

**Rajauskohta** siirtää keskitystä. Oletus on `centre`, koska se on
ennustettava ja sama minkä CSS:n `object-fit: cover` tekisi. Sallitut
arvot ovat sharpin sijainnit: `top`, `right top`, `right`,
`right bottom`, `bottom`, `left bottom`, `left`, `left top`, `centre`.

Neljäs vaihtoehto on vaihtaa paikan kuvasuhde sisällössä. Se on
oikea silloin kun useampi kuva samassa lohkossa on samaa muotoa.

### Liian pieni lähde

Putki varoittaa myös silloin kun lähde on kapeampi kuin mitä paikka
piirtyy kahden pikselin näytöllä. Sitä ei voi korjata skaalaamalla —
kuva näkyy pehmeänä ja se on otettava uudelleen. Arvio tulee
lohkotyypistä (`scripts/kuvat.mjs`, `LOHKOLEVEYS`) tai paikan omasta
`tarveLeveys`-kentästä.

### Hero: valinnainen mobiilikuva

`hero` rajataan kolmeen kuvasuhteeseen — 4:5 puhelimessa, 16:9
tabletissa, 21:9 työpöydällä. Leveästä lähteestä mobiilin 4:5 leikkaa
helposti yli puolet leveydestä.

Sille voi antaa oman kuvan:

```
7.png           pakollinen   → 16:9 ja 21:9
7-mobiili.png   valinnainen  → 4:5
```

**Ilman mobiilikuvaa kaikki kolme lasketaan pääkuvasta, kuten ennenkin.**
Paikka on täysi yhdellä tiedostolla — valinnainen osa ei jätä sitä
vajaaksi eikä tuota varoitusta.

Putki huomauttaa asiasta vain silloin kun sille on tekemistä, eli kun
base-rajaus leikkaa yli viidenneksen eikä omaa mobiilikuvaa ole:

```
Rajaukset:
    7  blokbook-hero    −55 % leveydestä (base) · −24 % korkeudesta (lg)
       ↳ oma mobiilikuva: 7-mobiili
```

Tämä ei poista sitä että hero on kolme kuvasuhdetta. `lg` (21:9)
leikkaa yhä korkeutta 16:9-lähteestä, ja siihen tarvittaisiin kolmas
lähde. Kaksi on hallittavissa; kolme alkaisi olla kuvapankki.

### Video

Sama putki ja samat numeroidut paikat. Paikkaa ei merkitä sisällössä
kuvaksi tai videoksi: pudotettu tiedosto ratkaisee. `mp4`, `mov`, `m4v`
tai `webm` mihin tahansa paikkaan, ja siitä syntyy mp4 (H.264,
`faststart`) ja webm (VP9) sekä julistekuva ensimmäisestä ruudusta.
Ääni poistetaan. Leveys on herossa enintään 1920 px, muualla 1600 px.
Video täyttää paikkansa rajattuna samoin kuin `taysi`-kuva.

Video **toistuu itsestään mykkänä silmukkana**, ja nurkassa on aina
taukonappi. Jos käyttäjä on pyytänyt vähemmän liikettä
(`prefers-reduced-motion`), video alkaa tauolla ja julistekuva näkyy.
`autoPlay`-attribuuttia ei käytetä, koska se lähtisi liikkeelle ennen
kuin asetus ehditään lukea. Ks. päätös 11 ja `components/Video.tsx`.
Figmassa sama komponentti on `Video`, variantteina napin kaksi asua.

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
      valmiina sekä `lg 1440` että `base 390` -koossa, **tietoa**
      `lg 1440` -koossa. Niiden lisäksi on **Lohkot**-pohja molemmissa
      koissa, jossa ovat ne lohkot joita casepohjissa ei ollut.

      <!-- generated:case-lohkot -->16 lohkotyyppiä: text, media, pair, compare, band, trio, scope, artefacts, checks, ajo, ketju, steps, kerrokset, choices, component, todo<!-- /generated -->

      Kaikki paitsi `todo` ovat nyt Figmassa. `todo` näkyy vain
      kehityksessä eikä tule Figmaan koskaan.

      **Avoinna:** kolmen lohkon sisältö johdetaan build-aikana
      (`artefacts`, `checks`, `component`), joten niiden korkeus
      Figmassa vanhenee heti kun tarkistus tai artefakti lisätään.
      Rakenne pätee, korkeus ei. Pohjien tekstit ovat tarkistuksessa
      (`check:figma` vertaa ne buildattuun sivuun), rakenne ja
      korkeus eivät — ks. `lib/checks.ts`:n `blind`-kentät. Tietoa-
      pohjasta puuttuu `base 390`.
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

Kaksi odottaa ulkopuolista lupaa (Colliersin sitaatti, Microsoftin
logo); loput ovat sinun tiedossasi tai kameran takana.

Kuvapaikat ovat olemassa oikeissa kuvasuhteissa ja kuvatekstit on
kirjoitettu, joten ne kertovat mitä kuvassa pitää näkyä. Layout ei
liiku kun kuva tulee tilalle.

Kuva on pelkkä tiedosto: pudota se `kuvat/uudet/`-kansioon nimellä
`<id>.png` ja aja `npm run kuvat`. Ks. *Kuvat* edellä.

Lähteet: casejen sisältö on `content/cases/fi.ts`, aiemmat työt
`content/work/fi.ts`. Kuvaussuunnitelmat ovat
`portfolio-pokela/*.dc.html`-tiedostoissa.

---

#### Kuvapaikat

Luettelo on luotu sisällöstä: tiedoston nimi on paikan tunniste, ja
`Mitä kuvassa` on sen kuvateksti — eli myös `alt`-teksti, joka kertoo
mitä kuvan pitää näyttää.

<!-- generated:kuvapaikat -->
| | # | Missä | Tunniste | Muoto | Mitä kuvassa |
|---|---|---|---|---|---|
| ✓ | 1 | Colliers Asunnot | `colliers-hero` + `colliers-hero-mobiili` *(valinn.)* | 4:5 · 16:9 · 21:9 · ≥2736 px | Kohdesivu isona — terävä, tarkoituksella rajattu, min. 2800 px leveä |
|  | 2 | Colliers Asunnot | `colliers-runko-ennen` + `colliers-runko-jalkeen` | vapaa · ≥1344 px | Sama näkymä viikolla 1 ja julkaisussa: toimiva runko ja siitä jatkokehitetty valmis ilme. |
| ✓ | 3 | Colliers Asunnot | `colliers-haku` | 4:5 · ≥880 px | AI-haku: kirjoitettu kuvaus + tulokset |
| ✓ | 4 | Colliers Asunnot | `colliers-vuokraus` | 4:5 · ≥880 px | Vuokraa heti -polku, yksi vaihe |
| ✓ | 5 | Colliers Asunnot | `colliers-strapi` | 4:5 · ≥880 px | Strapi-editori sisältöä muokattaessa |
| ✓ | 6 | Blokbook | `blokbook-hero` + `blokbook-hero-mobiili` *(valinn.)* | 4:5 · 16:9 · 21:9 · ≥2736 px | Blokbookin näkymiä puhelimessa: pesutuvan ja saunan vuorot, korttimaksu, oven etäavaus ja chat. |
|  | 7 | Blokbook | `blokbook-asukas` | 4:3 · ≥1344 px | Varaus asukkaan näkökulmasta: vapaat vuorot ja maksu. |
|  | 8 | Blokbook | `blokbook-hallinta` | 4:3 · ≥1344 px | Hallintanäkymä: tilat, vuorot, maksut ja käyttöoikeudet. |
|  | 9 | Blokbook | `blokbook-web` | 3:4 · ≥880 px | Web — varausnäkymä kapeana |
|  | 10 | Blokbook | `blokbook-ios` | 3:4 · ≥880 px | iOS — natiivisovellus, ei laitekehystä |
|  | 11 | Blokbook | `blokbook-android` | 3:4 · ≥880 px | Android — sama näkymä |
| ✓ | 12 | Pivo | `pivo-kirjautuminen-ennen` + `pivo-kirjautuminen-jalkeen` | vapaa · ≥880 px | Kirjautuminen ennen ja jälkeen: vaalea teksti kylläisellä gradientilla ei täyttänyt kontrastivaatimuksia, harvennetut versaalit hidastivat lukemista ja syötetyt merkit näkyivät vain ohuina pisteinä. |
|  | 13 | Elisa Aisti | `aisti-tyopoyta` | 4:3 · ≥2736 px | Päänäkymä: toimipistelista ja kartta työpöydällä |
|  | 14 | Elisa Aisti | `aisti-mobiili` | 4:5 · ≥2736 px | Mobiilikartta ja toimipisteen tila |
|  | 15 | Elisa Aisti | `aisti-tiketti` | 4:3 · ≥2736 px | Tiketti aikaennusteineen |
|  | 16 | OP Vahinkoapuri | `op-aloitus` | 4:3 · ≥2736 px | Ilmoituksen aloitus: mitä tarvitaan ja kauanko kestää |
|  | 17 | OP Vahinkoapuri | `op-vaurio` | 4:5 · ≥2736 px | Vaurionvalitsin: auto ylhäältä, klikattavat osat |
|  | 18 | OP Vahinkoapuri | `op-polku` | 4:3 · ≥2736 px | Mukautuva kysymyspolku |
|  | 19 | Etusivu | `etusivu-hero` + `etusivu-hero-mobiili` *(valinn.)* | 4:5 · 16:9 · 21:9 · ≥2736 px | Täysleveä kuva 21:9 — työn hero tai valokuva |
|  | 20 | Etusivu | `etusivu-colliers` | 4:3 · ≥1580 px | Colliers — asuntohaku |
|  | 21 | Etusivu | `etusivu-blokbook` | 4:5 · ≥880 px | Blokbook — varausnäkymä |
|  | 22 | Työlista | `tyot-storybook` | 4:3 · ≥2736 px | Nosto: Storybook-näkymä |
| ✓ | 23 | Tietoa-sivu | `muotokuva` | 1:1 · ≥880 px | Muotokuva. Tausta poistettu, joten se piirtyy suoraan paperille ilman kehystä. |

7/23 täynnä. Sama luettelo komennolla `npm run kuvat:lista`.
<!-- /generated -->

#### Faktat ja luvat casettain

**01 · Colliers Asunnot**

- [ ] "Mitä tekisin toisin" — yksi rehellinen lause
- [ ] Asiakkaan sitaatti: lause, nimi, titteli — **odottaa lupaa**
- [ ] Mittarit. Teksti sanoo nyt "Mittareita ei ole vielä julkaistu" —
      joko luvut tai lause pois
- [ ] Logo. `kuvat/logo/colliers.webp` on tumma laatikko harmaine
      palkkeineen; muut logorivin merkit ovat läpinäkyviä
      sanamerkkejä. Merkitty `blocked`-tilaan `content/logos.ts`:ssä,
      eli se ei näy rivillä ennen kuin korvataan

**02 · Blokbook**

- [ ] Stack
- [ ] Julkaisuvuosi
- [ ] Taloyhtiöiden määrä (jos saa kertoa)
- [ ] Isännöitsijän tai hallituksen lause
- [ ] "Mitä tekisin toisin"

**03 · Tämä sivusto** — ei puuttuvia faktoja

**04 · Pivo** — kuva valmis

- [ ] Saavutettavuusuudistuksen kriteerit ja saavutettu taso

**05 · Elisa Aisti**

- [ ] Kuinka suuri osa front endistä oli omaa työtä? Nyt lukee
      "Front end -toteutus" ilman rajausta
- [ ] Nykyiset kaappaukset ovat laitemockuppeja — rajattava
      näyttöalueeseen ennen käyttöä

**06 · OP Vahinkoapuri**

- [ ] Onko korvauskäsittelyn nopeutumisesta julkaistavia lukuja?
- [ ] Nykyiset kaappaukset ovat laitemockuppeja — rajattava
      näyttöalueeseen ennen käyttöä

#### Kaikkia koskevat

- [ ] Microsoftin logon käyttölupa — tai jätä pelkkä nimi. Logo on
      `kuvat/logo/microsoft.webp` ja näkyy logorivissä

---

**Lähimpänä valmista:** Blokbook. Kuvat ovat omasta tuotteesta, joten
et tarvitse kenenkään lupaa — ja viisi puuttuvaa faktaa ovat sinun
tiedossasi. Colliers vaatii asiakkaan luvan sitaattiin ja uuden
logotiedoston.
