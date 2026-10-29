# Päätökset

Vaiheen 0.2 lopputuote: mitä päätettiin, miksi, ja milloin.

Syöte tulee inventaariosta (`npm run inventaario`), joka kertoo missä koodi ja
Figma eroavat ottamatta kantaa kumpi on oikeassa. Kannanotto tehdään tässä.

**Ero ei ole sama asia kuin eriytymä.** Inventaario ei voi tietää kumpaa se
katsoo, ja siinä se on oikeassa — ero voi olla

- **eriytymä**, jolloin toinen puoli on vanhentunut ja se korjataan, tai
- **käännös**, jolloin molemmat ovat oikeassa omassa välineessään ja ero
  kirjataan tarkoitukselliseksi.

Alla olevista kolmesta kaksi on käännöksiä. Työkalu joka pakottaisi voittajan
jokaiseen eroon olisi tuottanut tässä kaksi väärää korjausta kolmesta.

---

## 1. `Grid` ja `Reveal` eivät tule Figmaan

**Ero:** molemmat ovat koodissa ja npm-paketissa, mutta Figman kirjastossa ei
ole kumpaakaan.

**Päätös:** jäävät pois. Ei ole eriytymä.

**Perustelu:** molemmat toteuttavat asian jonka Figma ilmaisee toisin.

`Grid` on 12 sarakkeen asettelu. Figmassa se on *layout grid*, tiedoston oma
ominaisuus — komponentti olisi rinnakkainen toteutus samasta asiasta ja
suunnittelija joutuisi valitsemaan kumpaa käyttää. Koodissa komponentti
tarvitaan, koska Reactissa ei ole vastaavaa sisäänrakennettua.

`Reveal` on liikettä. Figman komponentti ei ilmaise selausriippuvaista
käytöstä, ja liike on jo kuvattu `motion`-tokeneissa.

**Seuraus:** `check:figma` vaatii kytkennän jokaiselle **Figman** kirjaston
komponentille muttei edellytä että jokainen koodin komponentti on Figmassa.
Epäsymmetria oli jo olemassa; nyt sillä on perustelu.

**Suljettu 6.10.2026:** sarakemäärittely *on* Figmassa layout gridinä, ja
gridit on sidottu muuttujiin. `check:figma` vertaa nyt jokaisen sivupohjan
gridin `layout.columns`, `layout.gutter` ja `layout.pagePadding` -tokeneihin
sillä moodilla jonka kehyksen nimi kertoo. Kuusi gridiä, kaikki täsmäävät.

Huomionarvoista: rajapinta palauttaa gridin **ratkaistut** arvot, joten tämä
on tarkistettavissa vaikka muuttujia itseään ei voi lukea.

*Päätetty 6.10.2026 — Veli-Matti Pokela*

---

## 2. Kuvasuhteiden lähde on `scripts/kuvat.mjs`

**Ero:** sama viisi kuvasuhdetta on neljässä paikassa.

| Paikka | Mitä siellä on |
|---|---|
| `scripts/kuvat.mjs` (`SUHTEET`) | numeeriset suhteet **ja** breakpointit |
| `styles/base.css` (`.media-*`) | samat luvut CSS:nä |
| `components/Media.tsx` (`Ratio`) | pelkät nimet |
| Figma, `Media`-komponentti | pelkät nimet varianttina |

**Päätös:** `SUHTEET` on lähde. Muut kolme johdetaan siitä tai tarkistetaan
sitä vastaan.

**Perustelu:** vain `SUHTEET` sisältää sekä luvut että breakpointit, eikä
sitä voi johtaa muista. Kaksi muuta sisältävät pelkät nimet, ja `base.css`:n
luvut ovat sama tieto toisessa muodossa. Lisäksi `SUHTEET` on se joka
oikeasti rajaa tiedostot levylle — jos se on väärässä, kuva on väärä
riippumatta siitä mitä muut sanovat.

**Tämä on eriytymä, ei käännös.** Neljän paikan pitää sanoa samaa.

**Suljettu 6.10.2026:** neljäs paikka on nyt katettu. `check:figma` vertaa
Figman `Media`-komponentin `Ratio`-variantin `SUHTEET`-taulun avaimiin
molempiin suuntiin. Laajennus meni `check:figma`:an eikä `check:suhteet`:iin,
koska se tarvitsee verkon eikä saa kuulua `check:sync`-ketjuun.

*Päätetty 6.10.2026 — Veli-Matti Pokela*

---

## 3. `ListRow`in boolean-propertyt jäävät Figmaan, eivät tule koodiin

**Ero:** Figmassa `ListRow`illa on `showDescription`, `showMeta`,
`showNumber`, `showIcon`. Koodissa ei ole yhtäkään — siellä päätellään siitä
onko propsi annettu.

**Päätös:** molemmat pysyvät ennallaan. Ei ole eriytymä.

**Perustelu:** Figman komponentti-instanssissa ei ole "määrittelemätöntä"
arvoa. Valinnaisuus ilmaistaan näkyvyyskytkimellä, joten boolean on siellä
ainoa tapa. Reactissa `description?: string` on idiomaattinen, ja
`showDescription` olisi rinnakkainen tila joka voi olla ristiriidassa
sisällön kanssa — `showDescription={true}` ilman kuvausta.

Molemmat ovat oikein omassa välineessään. Käännös tehdään Code Connectissa,
ja `components/ListRow.figma.ts` sanoo sen itse: *"Kartoitus on
tarkoituksella kapea, koska koodi ja Figma eivät ole sama asia."*

**Seuraus:** ei muutoksia. Päätös kirjataan jottei joku myöhemmin "korjaa"
eroa pois.

*Päätetty 6.10.2026 — Veli-Matti Pokela*

---

## 4. Alias-lohkoja ei generoida

**Ehdotus:** `tokens.css`:n kolme teemalohkoa (51 riviä, sama 17 nimen lista
kolmesti) generoitaisiin värilistasta sen sijaan että ne kirjoitetaan käsin.

**Päätös:** ei tehdä.

**Perustelu:** luulin että se sulkee aukon. Testattu: ei sulje. Poistin yhden
alias-rivin kustakin kolmesta lohkosta, ja `check:tokens` kaatui joka kerta ja
kertoi minkä rivin. Kaikki 51 riviä ovat jo tarkistuksen alla, molempiin
suuntiin.

Jäljelle jäisi siis vain vähemmän näppäilyä — ja rivejä kirjoitetaan kerran
uutta väritokenia kohden, mikä on harvoin.

Hinta olisi suurempi kuin hyöty: `tokens.css` on ladottu käsin, ja osittainen
generointi tekisi tiedostosta puoliksi käsin ja puoliksi koneella
kirjoitetun ilman näkyvää rajaa. Sama syy jolla hylättiin tavu tavulta
toistava generaattori.

**Vertailukohta:** `check:suhteet` hyväksyttiin vakuutuksena *hiljaista* vikaa
vastaan — kuva rajataan väärin eikä mikään kaadu. Tässä vika on äänekäs.

*Päätetty 6.10.2026 — Veli-Matti Pokela*

---

## 5. Tokenien uudelleenjärjestelyä ei tehdä

**Ehdotus:** `tokens.json` järjesteltäisiin uudelleen moodipohjaiseksi — yksi
token, arvot moodeittain, komposiitit viittauksina, selitykset
`$description`-kenttiin.

**Päätös:** ei tehdä. Luonnos jää talteen, mutta sitä ei toteuteta ilman uutta
syytä.

**Perustelu:** kaikki kolme alkuperäistä perustetta ovat poistuneet.

| Peruste | Tila |
|---|---|
| Make kit tarvitsee kulutettavan paketin | **poistunut** — paketti on julkaistu ja toimii nykyisellä rakenteella |
| 51 riviä kolminkertaista käsityötä | **poistunut** — ks. päätös 4 |
| Sama luku kahdesti typografiassa | **poistunut** — ks. alla |

Typografian kahdennus on todellinen: `type.display-xl.size` ja
`typeScale.display-xl.lg` ovat molemmat `136px`. Mutta **ne eivät voi eriytyä
hiljaa.** Molemmat verrataan samaan CSS-arvoon, joten toisen muuttaminen
kaataa tarkistuksen. Testattu muuttamalla `typeScale`ä ja CSS:ää yhdessä ja
jättämällä `type.size` jälkeen: `check:tokens` kaatui.

Se on siis redundanssia, ei riskiä.

`$modes`-lohko jäi paikalleen (vaiheen 5 ainoa toteutettu osa) — siellä ovat
`viewport.values` ja `minWidth`, ja kaksi lukijaa käyttää niitä.

**Jos tähän joskus palataan**, syy on oltava uusi: esimerkiksi toinen alusta
(iOS, Android) joka tarvitsee tokenit muodossa jota nykyinen rakenne ei anna.
Siistiys ei ole syy.

*Päätetty 6.10.2026 — Veli-Matti Pokela*

---

## 6. Make kittiä ei julkaista Loihteen organisaatiolle

**Ehdotus:** kit julkaistaisiin organisaation käyttöön, jolloin se olisi
saatavilla kaikissa Loihteen Make-tiedostoissa.

**Päätös:** ei julkaista.

**Perustelu:** julkaisu on jakelua, ei toiminnallisuutta — kit toimii omassa
Make-tiedostossa täsmälleen samoin julkaisematta. Eikä sille ole yleisöä:
tämä on yhden portfolion design system, eikä kukaan Loihteella rakenna
prototyyppejä Pokelan paletilla.

Lisäksi se veisi henkilökohtaisen projektin työnantajan jaettuun
työkaluvalikoimaan, näkyviin koko organisaatiolle. Sama omistajuuskysymys
kuin Figma-tiedoston kohdalla, mutta aktiivisempana.

Ainoa asia jonka siitä oppisi on **lisääkö julkaiseminen kitkaa** —
hyväksyntäkierros, versiointi, oikeudet. Se tieto saadaan asiakkaan kanssa
silloin kun se on oikeasti edessä; adminin ajan pyytäminen henkilökohtaisen
projektin julkaisuun pelkän käyttöliittymän opettelemiseksi on huono
vaihtokauppa.

**Mutta asiakasprojektissa tämä askel on tarpeen,** ja se kannattaa tietää
etukäteen:

> Kitin julkaisu organisaatiolle on se tapa jolla asiakkaan suunnittelijat
> saavat sen käyttöönsä, ja **se vaatii heidän Figma-organisaationsa
> adminin.** Riippuvuus on mainittava myyntikeskustelussa, ei löydettävä
> käyttöönoton puolivälistä.

Sama koskee kahta muuta asiaa jotka vaativat asiakkaan adminin: yksityisen
npm-rekisterin scopen luonti ja AI-ominaisuuksien kytkeminen päälle.

*Päätetty 6.10.2026 — Veli-Matti Pokela*

---

## 7. Typografian nimeämisperiaate

> **Päätetty ja toteutettu 7.10.2026.** Ehdotus kirjattiin ensin, koska
> väärin tehty korjaus olisi jättänyt saman ongelman uudella nimellä.

### Löydös

Claude rakensi 7.10.2026 Figmaan `Tietoa`-sivupohjan olemassa olevista
komponenteista. Testi onnistui, mutta 15 tekstisolmua jäi ilman
tekstityyliä. Syy ei ollut Figmassa vaan koodissa.

Komponenttien CSS:ssä on **36 omaa typografiamäärittelyä**. Niistä:

| | |
|---|---|
| 14 | kirjoittaa nimetyn luokan uudelleen sanasta sanaan |
| 6 | asettaa vain koon, vaikka luokka antaisi koon ja rivivälin |
| 16 | kokoaa yhdistelmän jolla ei ole nimeä missään |

`.body-s` on kirjoitettu uudelleen **11 kertaa**. `.display-s` kahdesti.

### Juurisyy

**Nimetyt tyylit eivät ole rajapinta — raakatokenit ovat.** Komponentit
kokoavat typografian tokeneista sen sijaan että käyttäisivät nimettyä
luokkaa. Figma voi peilata vain nimettyjä tyylejä, joten se ei voi peilata
sitä millä ei ole nimeä.

Ja yhtä tasoa syvemmällä: **luokat on nimetty paikan mukaan, ei tehtävän
mukaan.** `.about__service-body` kertoo missä se on, ei mitä se tekee — ja
paikan nimi houkuttelee kirjoittamaan kaiken mitä se tarvitsee, koska se ei
kerro mitään siitä mikä on jo olemassa.

Mitattu seuraus: seitsemän eri nimistä luokkaa tekee saman asian.

```css
.about__service-body   { color: var(--ink-muted) }
.case__trio p          { color: var(--ink-muted) }
.case__artefact-body   { color: var(--ink-muted) }
.case__check-body      { color: var(--ink-muted) }
.case__scope-note      { color: var(--ink-muted) }
.cview__fact-value     { color: var(--ink-muted) }
.list-row__description { color: var(--ink-muted) }
```

Kolme luokkaa katoaisi kokonaan, koska nimetty luokka tekee jo kaiken —
myös `margin: 0`. Niistä jää jäljelle vain kommentti, joka kuvaa ongelmaa
jonka luokka ratkaisee:

```css
/* <h3> saisi selaimelta lihavan, jota Bodonista ei ole. */
```

`.display-s` asettaa painon 400:aan. Ongelma oli olemassa vain koska
luokkaa ei käytetty.

### Mikä EI ole vikana

**Arvot eivät voi ajautua erilleen.** Jokainen noista säännöistä käyttää
tokeneita, joten rivivälin muutos muuttuu kaikkialla. `check:tokens` ja
`check:hardcoded` tekevät työnsä oikein.

Vahinko on toinen: tyyppiasteikko ei ole käytössä rajapintana, CSS on
moninkertainen tarpeeseen nähden, ja syntyy yhdistelmiä joilla ei ole nimeä.

### Vaihtoehdot

**A — Käytä nimettyjä luokkia, säilytä BEM-nimet siellä missä jotain jää.**
3 luokkaa poistuu, 7 kutistuu yhteen riviin, 4 säilyy. Pienin muutos, mutta
jättää seitsemän nimeä yhdelle tehtävälle.

**B — Nimetyt luokat + jaettu värimodifioija.** Kuten A, mutta ne seitsemän
korvataan yhdellä nimellä. Systeemissä on jo tämän idean alku: `.meta--ink`
on värimodifioija, sitä ei vain yleistetty.

**C — Typografia ja väri utilityiksi, komponenttiluokat vain asettelulle.**
Suurin muutos, koskee kaikkia komponenttitiedostoja.

### Suositus: B

A ei korjaa juurisyytä — seitsemän nimeä yhdelle tehtävälle jää. C on
uudelleenkirjoitus, eikä siihen ole osoitettua tarvetta.

B on pienin muutos joka korjaa mitatun ongelman, ja se on linjassa sen
kanssa mitä systeemissä jo on.

**Periaate joka pitäisi kirjata samalla:** luokka ansaitsee nimen vain jos
sillä on tehtävä jota olemassa oleva nimi ei kata, ja nimi kuvaa tehtävää
eikä paikkaa.

### Avoin alakysymys

Värimodifioijan nimi. `.meta--ink` on BEM-modifioija; erillinen `.ink-muted`
olisi utility ja nimeäisi itsensä tokenin mukaan. Kaksi eri konventiota, ja
valinta kannattaa tehdä tietoisesti.

### Erillinen päätös: `body-l + paino 500`

Tätä yhdistelmää käytetään neljässä paikassa eikä sillä ole nimeä
koodissa, tokeneissa eikä Figmassa:

```
.about__service-title · .detail__section-title · .case__item-h · .case__trio h4
```

Joko se saa nimen tyyppiasteikkoon, tai ne neljä paikkaa käyttävät
olemassa olevaa tyyliä. Tämä on design system -päätös, ei siivous.

Sama toisin päin: `.btn` on `body-s + paino 500`, ja sillä **on** nimi
Figmassa (`Button`) muttei koodissa.

### Toteutus — mitä tehtiin

**Valittiin B.** `base.css` sai yhden uuden nimetyn tyyppiluokan ja kolme
väriutilityä:

```css
.title                  body-l + paino 500   — oli neljässä paikassa ilman nimeä
.ink .muted .faint      nimetty tokenin mukaan, ei paikan
```

`.meta--ink` poistui ja korvautui `.ink`:llä kahdessatoista paikassa — kaksi
konventiota samalle asialle oli juuri sitä sotkua jota tämä korjaa.

**Ad hoc -typografia 39 → 9.** Jäljelle jääneet ja miksi:

| | Miksi jää |
|---|---|
| `.cv-job__project-name`, `.cv-list__label` | yksi ominaisuus (paino), ei nimetyn tyylin toisto |
| `.btn` | komponentti jolla on `line-height: 1` pystykeskitystä varten — **ei** sama asia kuin muu body-s |
| `body` | globaali elementti |
| 5 koodityypin sääntöä | ks. avoin kohta alla |

**`.label`-luokka luotiin ja poistettiin saman päivän aikana.** Se oli
tarkoitettu `.btn`:lle ja `.cv-list__label`:lle, mutta `.btn`:n riviväli on 1
eikä `--lh-body-s` — ne eivät ole sama tyyli. Yhden käyttäjän nimetty luokka
olisi ollut juuri sitä ylimitoitusta jota tässä vastustetaan.

### Turvaverkko ja mitä se löysi

`scripts/tyylivedos.mjs` ottaa vedoksen siitä mitä selain laskee jokaiselle
tekstielementille: **2552 elementtiä kuudelta sivulta, kymmenen ominaisuutta
kussakin.** Luokkanimen vaihto voi pudottaa tyylin hiljaa, eikä yksikään
tarkistus näe sitä.

Lopputulos: **40 eroa, kaksi lajia, molemmat tarkoitettuja.**

```
lineHeight: 23.1px → 22.4px   ×22   body-s saa oman rivivälinsä (1.6), ei perittyä (1.65)
textWrap:   wrap → balance    ×18   display-luokat tasaavat rivityksen
```

Molemmissa nimetty luokka on **täydellisempi** kuin ad hoc -sääntö jonka se
korvaa. Se on koko muutoksen pointti.

Vedos löysi matkalla myös kaksi omaa virhettäni: `.case__trio`:n `<h4>` ja
`<p>` jäivät ilman luokkaa kun poistin elementtivalitsimen, ja ensimmäisellä
kierroksella `base.css`:n lisäykset olivat vahingossa peruttuina.

### Ensimmäinen yritys oli väärä

Tein 34 kohtaa kaavalla. Se poisti `print.css`:stä kolme **tulostussääntöä**,
kaksi **tilasääntöä** (`.case__artefact--pending .case__artefact-name`) ja
katkaisi yhden kommentin kesken. Kaikki peruttiin.

**Luokka voi olla olemassa ilman ruututyyliä** — tulostuskoukkuna tai
tilavalitsimen ankkurina. Tulostussääntöjen poisto olisi mennyt läpi myös
vedoksesta, koska se mittaa ruutua eikä paperia. Tämä tehtiin lopulta
tiedosto kerrallaan lukien.

### Avoin: koodityypin viisi sääntöä

`code`-typografia esiintyy viidessä säännössä kolmella eri määrittelyllä:

```
system.css          .sys__code         code-koko  + code-perhe + taustapalkki
component-view.css  .code__body pre    code-koko  + code-perhe
component-view.css  .cview__token      body-s     + code-perhe + taustapalkki
component-view.css  .code__path        code-perhe
component-view.css  .cview__note code  code-perhe
```

Kaksi palkkia, kaksi eri kokoa. `code` on `tokens.json`:ssa mutta ei Figman
tekstityyleissä, ja `Button` on Figmassa mutta ei tokeneissa.

**Tätä ei yhtenäistetty**, koska se muuttaisi `.cview__token`:n koon ja
`.code`:n rivivälin — eli se on design-päätös jolla on näkyvä seuraus, ei
siivous. Sekoittaminen mekaaniseen refaktorointiin olisi tehnyt lopputuloksen
mahdottomaksi todentaa.

### Mitä EI pidä tehdä ensin

Ehdotin tarkistusta joka vertaisi `tokens.json`:n `type`-ryhmää Figman
tekstityyleihin. **Se olisi mennyt läpi** — ne täsmäävät 9/10, ja ongelma
on CSS-kerroksessa jota se ei katso.

Tarkistus tulee vasta kun toteutus on korjattu, ja se on eri tarkistus:
*komponentin CSS ei saa asettaa `font-size`, `font-family` tai
`font-weight`:ia; typografia tulee nimetystä luokasta.* Se olisi löytänyt
kaikki 36.

*Päätetty ja toteutettu 7.10.2026 — Veli-Matti Pokela*

---

## 8. Uusi tarkistus vasta kun virhe on päässyt läpi

**Ero:** ei koodin ja Figman välillä, vaan tarkistusten ja niiden hyödyn.
Osa porteista on syntynyt varmuuden vuoksi eikä siksi, että jokin olisi
mennyt rikki.

**Päätös:** uutta tarkistusta tai porttia ei lisätä ennakkoon. Se lisätään
vasta kun oikea virhe on päässyt läpi, ja virhe kirjataan perusteluksi.

**Perustelu:** tarkistus ansaitsee paikkansa löytämällä jotain (päätökset 4
ja 5). Tähän asti kannattaneet ovat kaikki löytäneet oikean virheen:
`check:figma` kytkemättömän komponentin, `check:paketti` npm:n joka oli
jäljessä, luodut tekstit kannen väärät luvut. Vartija joka vartioi
vartijaa ei ole löytänyt mitään — se vain lisää koneistoa jota pitää
selittää.

**Ensimmäinen sovellus:** ketjun (`content/prosessi.ts`) vartijat näytetään
casesivulla, mutta build ei tarkista onko vartija ajossa, eikä otsikko vaadi
johdettua lukua. Kumpikin oli toteutettu ja todennettu, ja kumpikin
poistettiin ennen mergeä tällä perusteella.

**Mitä tämä ei tarkoita:** olemassa olevia tarkistuksia ei pureta. Ne jotka
ovat löytäneet virheen, jäävät.

*Päätetty 7.10.2026 — Veli-Matti Pokela*

---

## 9. Kuvat levyllä, hero reunasta reunaan

**Ero:** ei koodin ja Figman välillä, vaan kuvan ja sivun välillä.
Kuvakaappauksen oma tausta osui suoraan sivun taustaa vasten, ja raja
näytti sattumanvaraiselta. Puhelinkaappaus rajautui 4:5:ksi ja menetti
puolet ruudustaan.

**Päätös:** jokainen casen kuva näytetään oletuksena kokonaisena,
rajaamatta, hillityn taustalevyn (`--badge-surface`) keskellä. Valokuva tai
kuvitus voi täyttää paikkansa asetuksella `{ "esitys": "taysi" }`. Herossa
levyn sävy jatkuu nauhana ruudun reunoihin ja kuva pysyy sivun levyisenä.

**Perustelu:** yksi kehys kaikille kuville antaa sivulle saman rytmin, oli
kuva vaalea, tumma, kapea tai leveä. Laitekehykset hylättiin oletuksena,
koska kaikki kuvat eivät ole ruutukaappauksia. Vahva editorial-reuna
jokaisessa kuvassa olisi raskas ja veisi huomion sisällöltä.

*Päätetty 8.10.2026 mock-kuvan perusteella — Veli-Matti Pokela*

---

## 10. Ulkoasun muutos menee Figmaan samassa muutoksessa

**Ero:** koodin ja Figman välillä. Päätöksen 9 kuvalevy julkaistiin
sivulle, mutta Figman Media-komponentissa ei ollut levyä eikä
sivupohjissa heron nauhaa. `check:figma` oli vihreä.

**Mitä tapahtui:** levy toi Medialle uuden tilan, mutta valinta luettiin
kuvaputken datasta (`kuvat/<nimi>.json`) komponentin propsien ohi. Code
Connect ei tuntenut tilaa, joten tarkistuksella ei ollut mitään
verrattavaa. Prosessi ei ollut rikki, mutta toteutus kiersi sen.

**Päätös:** uusi tila tehdään aina komponentin propsiksi ja Code Connectin
variantiksi (`esitys` / `Esitys`), jolloin `check:figma` vaatii sen
Figmaan. Jokainen ulkoasuun näkyvä muutos tehdään samassa PR:ssä myös
Figmaan, ilman erillistä pyyntöä. Sääntö on kirjattu agentille
`CLAUDE.md`:hen.

**Perustelu:** päätöksen 8 mukaan sääntö lisätään vasta kun oikea virhe on
päässyt läpi. Tämä on se virhe. Uutta tarkistusta ei lisätty: olemassa
oleva varianttivertailu riittää, kun tila kulkee sen kautta.

*Päätetty 8.10.2026 — Veli-Matti Pokela*

---

## 11. Video toistuu itsestään, taukonappi aina näkyvissä

**Ero:** käsikirjan mukaan videota ei toistettu automaattisesti, ja
videoksi kelpasi vain sisällössä merkitty paikka. Heroon pudotettu mp4
kaatui kuvaputkeen, koska yhtään videopaikkaa ei ollut merkitty.

**Päätös:** jokainen mediapaikka ottaa kuvan tai videon, ja tiedosto
ratkaisee kumpi. Video toistuu mykkänä silmukkana ja siinä on aina
näkyvä taukonappi. Vähemmän liikettä pyytäneelle video alkaa tauolla.
Video on oma komponenttinsa (`Video`) ja Figmassa oma komponenttinsa,
jonka `Tila`-variantit ovat napin kaksi asua.

**Perustelu:** hero-video on tunnelmaa eikä katsottava klippi, eikä
toistonappi pysäytyskuvan päällä sovi heroon. Automaattitoisto jätettiin
alun perin pois kahdesta syystä: liikettä ei voinut pysäyttää, eikä
`prefers-reduced-motion`-asetusta luettu. Taukonappi ja asetuksen
lukeminen selaimessa poistavat molemmat syyt.

*Päätetty 8.10.2026 — Veli-Matti Pokela*

---

## 12. Etusivun nimi rakentuu fontin ääriviivoista

**Ero:** etusivun nimi oli tavallinen otsikko. Heroon haettiin
vuorovaikutteista elementtiä, joka tekee vaikutuksen sivulle tultaessa.
Aiempi 3D-kokeilu oli raskas: kaksi läpäisevää materiaalia,
jälkikäsittelyketju ja piirtosilmukka, joka ei pysähtynyt koskaan.

**Päätös:** nimi on oma komponenttinsa (`HeroName`). Saapuessa nimen päälle
piirtyvät apuviivat, sitten kirjainten ääriviivat, käyräpisteet ja kahvat, ja
lopuksi kirjaimet täyttyvät. Osoittimen kohdalla linssi näyttää rakenteen ja
lähimmän pisteen koordinaatit fontin yksiköissä, ja klikkaus avaa koko nimen
rakenteen. Pisteet ovat Bodoni Modan oikeat ääriviivat samasta fontista jonka
sivu lataa (`npm run nimi` → `content/nimi.generated.json`). Figmassa
komponentilla on `Tila`-variantit `levossa` ja `rakenne`.

**Perustelu:** vertailtiin kolmea prototyyppiä: musteena valuvaa nimeä
(WebGL), painoakselilla elävää nimeä ja rakentuvaa nimeä. Lasiesine
hylättiin jo aiemmin, koska irrallinen muoto tyhjässä tilassa jäi
latteaksi. Rakentuva nimi valittiin, koska se kertoo saman tarinan kuin
koko sivusto: suunnittelusta tulee koodia. Lisäksi se on kevyt: pelkkä SVG
ilman kirjastoja, ja piirtäminen loppuu, kun mikään ei liiku. Oikea otsikko
pysyy sivulla ruudunlukijaa ja valintaa varten. Vähemmän liikettä
pyytäneelle saapuminen jätetään pois. Saapuminen kestää alle viisi
sekuntia, joten taukonappia ei tarvita (WCAG 2.2.2, vrt. päätös 11).
Painoakselilla elävä nimi oli myös hyvä, mutta sille ei ainakaan
toistaiseksi löydy käyttöä, ettei sivu mene liiallisuuksiin.

*Päätetty 8.10.2026 prototyyppien perusteella — Veli-Matti Pokela*

---

## 13. Versionumero kertoo käyttäjälle, mitä tehdä

**Ero:** paketit nousivat yhdessä päivässä 2.2.0:sta 2.4.0:aan pienillä
muutoksilla. Minoria nostettiin jokaisesta näkyvästä muutoksesta, myös
levyn varjokorjauksesta.

**Päätös:** semver paketin käyttäjän näkökulmasta. Tyylin hienosäätö,
korjaus ja sivuston omien komponenttien CSS ovat patch. Minor nousee, kun
pakettiin tulee uusi komponentti, token tai props. Major nousee, kun
jotain poistuu tai muuttuu rikkovasti. Taulukko on käsikirjassa
pakettitarkistuksen kohdalla, ja sääntö on agentille `CLAUDE.md`:ssä.

**Perustelu:** numero ei kerro muutoksen kokoa vaan sen, pitääkö käyttäjän
reagoida. Jo julkaistuja versioita ei muuteta.

*Päätetty 8.10.2026 — Veli-Matti Pokela*

---

## 14. Etusivun nimi on hero, joka asettuu

**Ero:** nimi oli tavallinen otsikko paperin päällä. Vellu halusi
nimiosion toimivan enemmän hero-elementtinä ja saapumisen alkavan
korkeampana palkkina, joka asettuu kompaktiksi.

**Päätös:** nimi ja roolirivi ovat täysleveällä `--badge-surface`-palkilla
(HeroIntro). Istunnon ensimmäisellä käynnillä palkki täyttää ruudun, nimi
rakentuu sen keskellä, ja kun kirjaimet ovat täyttyneet, palkki supistuu
yhdellä liikkeellä omaan kokoonsa. Lopputila on sisällön kokoinen eikä
kiinteä korkeus. Vieritysyritys kesken intron asettaa palkin heti.
Toisella käynnillä, vähemmän liikettä pyytäneelle ja ilman JavaScriptiä
näkyy suoraan lopputila.

**Perustelu:** vertailtiin kahta tapaa: ajastettua introa, joka asettuu
(A), ja vieritystä, joka kutistaa heron (B). A valittiin, koska töihin
pääsee heti intron jälkeen, kun taas B:ssä vieritysmatka on edessä joka
käynnillä. Lopputila on kompakti, koska wow-hetki on liike eikä korkeus.
Lopullinen asettelu on sivulla alusta asti, ja koko ruudun palkki on sen
päällä oleva kerros, joka rajataan pienemmäksi. Siksi mikään ei hyppää
(CLS 0). Liike on `clip-path` ja `transform`, ei korkeuden animointia.
Palkki jatkuu saumatta hero-kuvan nauhaan, joka on samaa pintaa.

*Päätetty 9.10.2026 prototyyppien perusteella — Veli-Matti Pokela*

---

## 15. Sivupohjan teksti on sama kuin sivulla

**Ero:** koodin ja Figman välillä. Sivun tekstit kirjoitettiin uudelleen
(efc4b09), mutta Figman sivupohjiin jäivät vanhat. Etusivupohjassa luki
"Rakennan tuotteita, jotka toimivat myös silloin kun demo on ohi", ja
casesivupohjassa Colliersin kesto oli kuusi kuukautta kahdeksan sijaan.
`check:figma` oli vihreä, ja ero löytyi vasta kun Vellu katsoi pohjaa.

**Mitä tapahtui:** päätös 10 kattoi komponenttien tilat, koska ne
kulkevat Code Connectin kautta. Sivupohjien tekstit eivät kulje minkään
kautta: ne oli kirjoitettu Figmaan käsin, eikä mikään verrannut niitä
sivuun. Sama aukko oli Media-komponentin levy-varianteissa, joissa
kuvateksti ei ollut kytketty `caption`-propertyyn.

**Päätös:** `check:figma` vertaa jokaisen sivupohjan tekstin buildattuun
sivuun (`scripts/figma-sivupohjat.mjs`), ja teksti jota sivulta ei
löydy kaataa ajon. Siksi tarkistus ajetaan CI:ssä buildin jälkeen.
Tekstimuutos ilman Figman päivitystä ei enää mene läpi.

**Perustelu:** päätöksen 8 mukaan tarkistus lisätään vasta kun oikea
virhe on päässyt läpi. Tämä on se virhe, ja se koski viittä pohjaa.
Vertailukohta on buildattu sivu eikä sisältötiedosto, koska pohja
näyttää sen mitä sivulla lukee: koottuja lukuja, tiloja ja kuvatekstejä.
Raja on kirjattu: suunta on Figmasta sivulle, joten sivulle lisätty uusi
osio, jota pohjassa ei ole, ei kaada ajoa.

*Kirjattu 9.10.2026 Vellun huomion pohjalta*

---

## 16. Pohjan teksti päivittyy sivun muutoksesta, Figman muokkaus menee koodiin

**Ero:** päätös 15 teki vanhasta pohjatekstistä punaisen, mutta korjaus
jäi käsityöksi. Sama lause vaihdettiin jokaiseen pohjaan ja leveyteen,
eli 2–4 paikkaan. Tarkistus ei myöskään kertonut, kumpi puoli muuttui:
sivun uusi teksti ja Figmassa tehty muokkaus näyttivät samalta virheeltä.

**Päätös:** `npm run pohjat` (`scripts/pohjat-synkka.mjs`) päättelee
suunnan muutoksen diffistä. Jos sivun teksti muuttui, vanha → uusi
kirjoitetaan pohjiin, kun tulos löytyy sivulta. Jos pohjaa muokattiin
Figmassa, sitä ei kirjoiteta yli, vaan muutos viedään koodiin. Jos
kumpikin muuttui, päättää ihminen. Kirjoitus tehdään Figman Plugin
API:lla, koska REST-rajapinta on vain luku, ja `check:figma` vahvistaa
lopputuloksen.

**Perustelu:** tarkistus ei saa muuttua hidasteeksi. Uutta porttia ei
tullut: tämä on korjaustyökalu olemassa olevalle tarkistukselle. Koodi
pysyy lähteenä, mutta Figman muokkaus ei katoa, kun sitä ei jyrätä.
Testattu 9.10.2026 etusivun pohjilla: kahden lauseen muutos löysi neljä
solmua kahdessa leveydessä, ja sama muutos Figmassa ilman koodimuutosta
raportoitiin Figman muokkaukseksi lähimpine sivun riveineen.

**Raja:** vain tekstit. Pohjien asettelu ja Figmassa lisätyt uudet
näkymät eivät kulje koodiin; se on lenkin 7 (Make → PR → sovellus) työ.

*Kirjattu 9.10.2026 Vellun pyynnöstä*

---

## 17. Sivu näyttää buildin, joka sen rakensi

**Ero:** prosessin tulokset näkyivät vain CI:n lokissa. Jokainen
tarkistus tulosti valmiiksi luettavan rivin ("7/23 paikkaa täynnä, 16
odottaa kuvaa"), mutta ne hukkuivat muun tulosteen sekaan, eikä
prosessi näkynyt sivun lukijalle lainkaan.

**Päätös:** `npm run build` ajaa `scripts/ajo.mjs`:n, joka kirjaa
vaiheiden keston ja tuloksen ennen Next.js:n buildia. Case 03 näyttää
ne aikajanana. Lähde on sivun oma build, ei CI:n rajapinta: Netlify ja
CI ajavat saman skriptin, ja sivu kertoo sen ajon, jossa se syntyi.
Aikajana on yleinen `Timeline`-komponentti, joka ei tiedä buildeista
mitään: se on paketissa (2.5.0), Code Connectissa ja Figman kirjastossa
`Variant`-ominaisuuksineen (default, emphasis, end). Figman pohjassa
vaihtuvat arvot nimetään `vaihtuu:`-alkuisiksi.

**Perustelu:** tämä ei ole uusi portti vaan näkymä olemassa oleviin.
Aikajana ei voi valehdella onnistumisesta, koska kaatunut vaihe estää
sivun syntymisen. Ensimmäinen ajo näytti asian, jota loki ei tuonut
esiin: kuvaputki vie yli viisi minuuttia, tarkistukset alle sekunnin
kukin.

**Raja:** Figma- ja pakettitarkistus tarvitsevat verkon, joten ne
eivät ole Netlifyn buildissa eivätkä aikajanalla. Sivu sanoo sen.
Next.js:n oman buildin kestoa ei voi kirjata sivulle, joka rakennetaan
juuri silloin.

*Kirjattu 9.10.2026 Vellun pyynnöstä*

## 18. Maken ohjeet tulevat paketin mukana

**Tilanne:** Make kitin ohjeet kirjoitettiin repossa ja kopioitiin käsin
Maken käyttöliittymään. Kumpikin kopio vanheni huomaamatta. `setup.md`
lupasi version 1.1.0, kun paketti oli 2.5.0, eikä kertonut fonteista,
joten Make näytti sivut Georgialla ja Helveticalla. Vellu huomasi sen
kitin kokoamisen aikana, eikä mikään tarkistus.

**Päätös:** ohjeissa jokainen koodin määräämä tosiasia on luotu lohko:
fonttilinkki ja painot layoutista, välien määrä tokeneista, ikonien
määrä `Icon`ista ja sarakkeet `tokens.css`:stä. `check:docs` kaatuu,
jos ne eroavat. Ohjeet kopioidaan pakettiin
`@pokela/components/guidelines/` (2.5.1), ja kitin oma `setup.md` vain osoittaa
niihin. Kitiin ei kopioida sisältöä, joka voi vanhentua.

Tyylit ja fontit latautuvat komponenttien mukana (2.5.2): paketin
`index.js` tuo `styles.css`:n, ja se lataa layoutin fontit Google
Fontsista. Kittiin ei siis lisätä tuontia eikä fonttirivejä, eikä
käyttäjän tarvitse muistaa niitä.

**Raja:** Maken ohjeisiin ei ole rajapintaa, joten kitin yhtä
osoitusriviä ei voi tarkistaa. Se ei kuitenkaan muutu. Toimiiko
osoitus, eli lukeeko Make paketin tiedostoja, on testattava kitissä.
Jos ei lue, neljä tiedostoa kopioidaan kittiin kuten ennen, ja ne
vanhenevat taas.

*Kirjattu 9.10.2026 Vellun pyynnöstä*

---

## 19. Räjäytyskuva on komponentti, ja sen kerrokset ovat sivuston omaa koodia

**Tilanne:** etusivun herolle tehtiin kerrosprototyyppi, jossa sivu on
purettu tokeneiksi, komponenteiksi ja valmiiksi sivuksi CSS 3D:nä
(prototyyppi "Kerroshero" projektin ehdotuksissa). Vellu piti siitä, mutta siirsi sen
etusivulta case-sivulle, kun etusivun heroksi valittiin rakentuva nimi
(päätös 12). Kuva jäi prototyypiksi.

**Päätös:** yleinen osa on `ExplodedView` (paketissa, 2.6.0): kerrokset
levyinä, osoitin kääntää pinoa, klikkaus nostaa kerroksen kerrallaan,
sama `data-kohde` syttyy kaikissa kerroksissa, ja vieritys kokoaa
kerrokset yhdeksi pinnaksi. Figmassa sillä on `Tila`-variantit `auki` ja
`koottu`. Tämän sivuston kuva on `SivuKerroksina`: värit, tyyppi ja välit
luetaan `tokens.json`:sta, komponentit ovat samat ListRow, Media ja Icon
joita sivu käyttää, ja tekstit tulevat sanakirjasta ja työlistasta. Sama
kuva on System-sivun alussa ja case 03:ssa (lohko `kerrokset`).

**Perustelu:** prototyypin levyt olivat käsin kirjoitettua merkintää, joka
olisi vanhentunut ensimmäisestä token-muutoksesta, eli juuri se virhe
jonka sivusto lupaa ratkaista. Prototyypistä poiketen levyillä ei ole
varjoa, koska järjestelmässä ei ole varjoja, eikä pinolla ole jatkuvaa
heiluntaa: liike syntyy vain osoittimesta ja vierityksestä, joten
taukonappia ei tarvita (WCAG 2.2.2) ja silmukka on pysähdyksissä levossa.

*Kirjattu 9.10.2026 Vellun pyynnöstä*

**Lisäys (2.7.0):** Vellu huomasi, ettei kerrosten välinen korostus
näkynyt: luokka vaihtui, mutta korostuksen CSS-sääntö hävisi
spesifisyydessä pohjalle. Korjauksen yhteydessä tokenit liitettiin
mukaan: `data-token` merkitsee tokenin, ja osoitin sen päällä sytyttää
muiden kerrosten elementit, jotka käyttävät sen arvoa. Käyttöä ei
merkitä käsin, vaan se luetaan selaimen lasketusta tyylistä, koska käsin
merkitty liitos vanhenisi samalla tavalla kuin prototyypin levyt.
Siksi badge-surface ei osoita mihinkään levyllä: sitä ei käytetä siellä.
Tyyppinäyte on display-l eikä display-xl, koska sivulevyn nimi on
display-l.

---

## 20. Main julkaisee paketit npm:ään

**Tilanne:** pakettien julkaisu oli ketjun ainoa käsin tehty askel. Muutos
meni mainiin, mutta Figma Make luki npm:stä vanhaa versiota, kunnes Vellu
ajoi julkaisun omalta koneeltaan. `check:paketti` näytti eron punaisena,
mutta ei voinut korjata sitä. Kahdesti julkaisu meni väärin, koska komento
ajettiin haarasta, jossa versio oli vielä vanha, ja kerran kirjautuminen
oli vanhentunut (npm vastasi 404).

**Päätös:** CI:n viimeinen vaihe mainin pushilla on *Paketit npm:ään*
(`scripts/julkaise-paketit.mjs`). Se ajetaan vasta, kun kaikki muut
vaiheet ovat vihreällä, ja julkaisee vain version, jota npm:ssä ei vielä
ole. Pull requestissa `check:paketti --ennen-julkaisua` hyväksyy uudemman,
julkaisemattoman version. Julkaisun jälkeen `check:paketti` ajetaan ilman
lippua. Ihmisen osa on versionnosto (päätös 13), ja sen puuttuminen kaatuu
edelleen: sisältö muuttui, versio sama.

**Raja:** julkaisu tarvitsee repon salaisuuden `NPM_TOKEN`. Jos se puuttuu
tai vanhenee, vaihe kaatuu ja sanoo sen, mutta vasta kun julkaistavaa on.
Kirjautumista ei voi tarkistaa etukäteen.

npm jakaa uuden version tarballin viiveellä, joskus yli viisi minuuttia
(tokens 2.8.0 ja 2.9.0). Julkaisu odottaa sitä noin 12 minuuttia ja
jättää sen jälkeen varoituksen, ei punaista: versio on npm:ssä, joten
julkaisu onnistui. `check:paketti` yrittää latausta vielä viisi kertaa
minuutin välein ja kaatuu vasta, jos tiedosto todella puuttuu.

*Kirjattu 9.10.2026 Vellun pyynnöstä*


## 21. Sivun rakenne on paketissa patterneina, ja Make kysyy ensin

**Tilanne:** pyynnöstä "tee aikajana" Make käytti `Timeline`-komponenttia
oikein, mutta keksi ympärille sivun: yläpalkin, otsikon ja ingressin
sarakkeisiin 9–12, irti otsikosta. Komponentit olivat paketissa, sivun
rakenne ei. Sivustolla sama rakenne kirjoitettiin joka sivulle käsin
luokilla (`page-head`, `section-head`, `case__section`). Lisäksi Makelle
ei kerrottu, tehdäänkö näkymää, uutta komponenttia vai muutosta.

**Päätös:** `PageHeader` ja `Section` (`layout`: `stacked` tai `aside`)
ovat patterneja: ne eivät tuo omaa ulkoasua, vain asettelun. Ne ovat
paketissa (2.8.0), Code Connectissa ja Figmassa omana Patternit-osionaan.
Sivusto käyttää niitä itse (työt, Tietoa, System, casesivujen lohkot),
joten Make ja sivu kokoavat sivun samoista palasista. Kuvavertailu ennen
ja jälkeen: sivut ovat pikselilleen samat, paitsi kytkentämäärä 12 → 14.

Maken ohjeet alkavat yhdellä kysymyksellä, jos pyyntö ei kerro sitä:
näkymä, uusi komponentti vai muutos olemassa olevaan. Näkymä kootaan
vain paketista, ja puuttuva palanen tehdään erikseen ehdotukseksi.
Uusi komponentti tehdään yksin, kaikki tilat näkyvissä ja propsit
paketin tapaan nimettynä, jotta siitä tulee PR ja story. Muutos
näytetään uutena tilana nykyisen vieressä.

**Perustelu:** rajaus "tee vain pyydetty" olisi estänyt kokonaiset
näkymät ja protot, joita Makella halutaan tehdä. Ohjeisiin kirjoitettu
asettelusääntö voi vanhentua; komponentin sisällä oleva asettelu ei.

**Raja:** kysymys on ohje, ei pakko. Toimiiko se, testataan Makessa.
Ohjeet kasvoivat (sanamäärä on luotu lohko käsikirjassa); käsin
kirjoitettu "alle 500 sanaa" oli jo vanhentunut.

## 22. Kirjastossa on sovelluskomponentteja, ja virheellä on oma väri

**Tilanne:** kirjasto oli sivuston kirjasto: Timeline, ListRow, Media
ja muut ovat portfolion palasia. Makella niistä sai vain uusia
portfoliosivuja. Sovellusnäkymään (asetukset, lomake, lista ja sen
tiedot) puuttuivat lomakkeet, palaute ja data, joten Make olisi
keksinyt ne itse.

**Päätös:** kirjastoon tehdään sovelluskomponentteja, joita sivusto ei
käytä. Ne kulkevat saman ketjun läpi kuin muutkin (story, paketti,
Figma, Code Connect, Maken ohjeet) ja ovat samassa Komponentit-ryhmässä
kuin muutkin: ne ovat komponentteja, vaikka sivusto ei käytä niitä. Ensin
ehdotin omaa Sovellus-ryhmää, mutta Vellu linjasi, että komponentti kuuluu
komponentteihin. Ne tehdään
yksi kerrallaan, ja Vellu hyväksyy jokaisen ulkoasun luonnoksesta ennen
toteutusta. Ensimmäinen on `TextField` (2.9.0).

Virhe sai systeemin ainoan tilavärin `--danger` (#B42318 / #FF8A80).
Vaihtoehtona oli mustavalkoinen virhe (2 px musteviiva ja ikoni), mutta
Vellu valitsi värin: virhe erottuu nopeammin, ja mustavalkoista linjaa
saa laajentaa. Aksenttiväriä ei edelleenkään ole: `--danger` on vain
virheelle, aina `alert`-ikonin ja tekstin kanssa.

**Perustelu:** design systemin uskottavuus näkyy siinä, mitä sillä voi
rakentaa. Ketju todistaa myös itsensä: jos se kantaa komponentin, jota
sivusto ei käytä, se ei ole sidottu tähän sivustoon.

**Raja:** sovelluskomponentilla ei ole sivua, joka käyttäisi sitä, joten
sen ainoa todellinen testi on Storybook ja Make. Käytetäänkö niitä
Makessa oikein, nähdään vasta kun sillä tehdään näkymä.

*Kirjattu 9.10.2026 Vellun pyynnöstä*

## 23. CI ei laske samaa kahdesti

**Tilanne:** CI-ajo kesti 5–7 minuuttia, ja siitä noin neljä minuuttia
oli kuvaputki: jokainen AVIF ja hero-video pakattiin joka ajossa
uudelleen, vaikka yksikään lähde ei ollut muuttunut. Lisäksi jokainen
push pull requestiin ajoi koko putken loppuun, vaikka uudempi push oli
jo tullut. 9.10.2026 GitHub ilmoitti tilin Actions-minuuttien olevan
käytetty. Repo on julkinen, ja sen ajojen laskutettava aika on GitHubin
mukaan 0, joten mittari ei täyty tästä reposta, mutta turha laskenta
on silti turhaa.

**Päätös:** kuvaputki tallentaa jokaisen johdannaisen välimuistiin
avaimella, joka lasketaan lähteestä ja asetuksista, ja CI säilyttää
välimuistin ajosta toiseen. Pull requestin uusi push peruu saman PR:n
kesken olevan ajon. Mainin ajoja ei peruta, koska ne julkaisevat.
Yhtään tarkistusta ei poistettu eikä rajattu polkujen mukaan.

**Perustelu:** johdannainen on yhä laskettu lähteestä, ei käsin
säilytetty: muuttunut kuva saa uuden avaimen. Mitattuna paikallisesti
kuvaputki 314 s → alle sekunnin, ja tulos on tavulleen sama kuin ilman
välimuistia. Polkurajausta harkittiin ja hylättiin: lähes jokainen
tarkistus koskee lähes jokaista muutosta, ja rajaus olisi hiljainen
aukko ketjussa. Next.js:n buildivälimuisti hylättiin myös: se säästi
mitattuna 8 sekuntia, saman verran kuin sen lataus maksaa.

**Raja:** ensimmäinen ajo uudella kuvalla tai videolla kestää yhä
täyden ajan. Netlify rakentaa sivun omalla koneellaan ilman tätä
välimuistia.

*Kirjattu 9.10.2026 Vellun pyynnöstä*


## 24. Valinnat: radio on ainoa pyöreä muoto

**Tilanne:** toinen sovelluskomponentti oli valinnat: valintaruutu,
radio ja kytkin. Systeemissä ei ole yhtään pyöristystä (`--radius` on
0). Neliönä radio näyttäisi valintaruudulta, eikä käyttäjä näkisi,
valitaanko vaihtoehdoista yksi vai monta.

**Päätös:** `Checkbox`, `Radio`, `Switch` ja `ChoiceGroup` (2.10.0).
Luonnoksessa radio näytettiin sekä ympyränä että neliönä, ja Vellu
valitsi ympyrän. Se on systeemin ainoa pyöreä muoto. Kaikki muu on
kulmikasta: ruutu, kytkimen kisko ja nuppi. Valittu tila täytetään
musteella kuten ensisijainen nappi, ja hover paksuntaa reunan kuten
tekstikentässä. Virhe kuuluu ryhmälle (`ChoiceGroup`), koska "valitse
yksi" koskee kaikkia vaihtoehtoja. Kytkin on asetus, joka tulee voimaan
heti, joten sitä ei käytetä lomakkeessa, jossa on tallennusnappi.

**Perustelu:** muodon tehtävä on kertoa, miten valitaan. Ympyrä tekee
sen ilman selitystä, ja poikkeus on yksi ja nimetty.

**Raja:** Figmassa virhe on valinnan oma variantti (State=error), koska
instanssin reunaa ei voi värittää ryhmästä käsin. Koodissa se on vain
ryhmän tila, joten Code Connect ei käännä sitä propsiksi.

*Kirjattu 9.10.2026 Vellun hyväksymän luonnoksen pohjalta*

## 25. Valintalista on oma, ei selaimen natiivi

**Tilanne:** kolmas sovelluskomponentti oli valintalista. Natiivi
`<select>` olisi saavutettava ilman työtä, mutta sen auki oleva lista
on käyttöjärjestelmän: pyöristetty, varjostettu ja eri näköinen
jokaisessa selaimessa. Se ei olisi samaa kieltä kuin muu systeemi.

**Päätös:** `Select` (2.11.0). Luonnoksessa näytettiin natiivi ja oma
lista, ja Vellu valitsi oman. Suljettuna se on sama kenttä kuin
`TextField` (`.field__control`), lisänä uusi `chevron-down`-ikoni.
Auki se on musteviivainen lista, jonka rivi on `--tap-min`, aktiivinen
rivi `--paper-alt` ja valittu rivi paino 500 ja uusi `check`-ikoni.
Rakenne on WAI-ARIA APG:n select-only combobox: kenttä on `combobox`,
lista `listbox`, rivit `option`, ja fokus pysyy kentässä
(`aria-activedescendant`). Näppäimistö: nuolet, Home ja End, PageUp ja
PageDown, alkukirjainhaku, Enter ja välilyönti valitsevat, Escape
sulkee muuttamatta, Tab valitsee aktiivisen ja jatkaa. Lista kääntyy
ylös, jos tila alla loppuu, ja vierittää aktiivisen rivin näkyviin.
Korkean kontrastin tilassa aktiivinen rivi saa viivan, koska tausta
katoaa.

**Perustelu:** oma lista on enemmän työtä ja vastuuta kuin natiivi.
Siksi saavutettavuus todennetaan testeillä eikä luoteta tekoon:
tarinoiden play-funktiot ajavat näppäimistön, hiiren ja Tabin, ja axe
tarkistaa myös auki olevan listan.

**Raja:** kosketuslaitteella lista ei ole natiivi pyörä. Rivit ovat
kosketuskokoisia (`--tap-min`), ja lista on kentän levyinen. Haku
kirjoittamalla (vapaa teksti) ei kuulu tähän: se olisi eri komponentti
(combobox autocomplete).

*Kirjattu 9.10.2026 Vellun hyväksymän luonnoksen pohjalta*

## 26. Napilla on kolme kokoa ja ikoninappi

**Tilanne:** neljäs sovelluskomponentti. Sivustolla on yksi napin koko,
44 px. Sovellusnäkymässä se on liian raskas työkaluriville, ja ikonilla
varustetulle sulku- tai lisäysnapille ei ollut muotoa.

**Päätös:** koot `btn--s` (32 px) ja `btn--l` (56 px, teksti
`--text-body`), oletus m ei muutu, ja ikoninappi `btn--icon` (2.12.0).
Vellu hyväksyi luonnoksen. Ikoninappi on neliö, jonka sivu on napin
korkeus, ja sen nimi tulee aina `aria-label`illa. Se on vain primary-
ja ghost-napeille: tekstinapista jäisi pelkkä merkki ilman viivaa.
Tekstinapilla on yksi koko, koska sillä ei ole pintaa, jonka koko
kasvaisi. Nappi pysyy luokkasopimuksena eikä siitä tule
React-komponenttia.

**Perustelu:** s näyttää 32 px, mutta osuma-alue on silti `--tap-min`:
näkymätön `::after`-laajennus ylös ja alas, ikoninapissa joka suuntaan.
Tiivis näkymä ei maksa kosketuskäytettävyyttä. Tarinan testi osoittaa
pisteeseen näkyvän reunan ulkopuolella ja odottaa osuvansa nappiin. Se
löysi ensimmäisessä ajossa virheen: laajennus laskettiin reunaviivan
sisäpuolelta, joten alue oli 42 px eikä 44.

**Raja:** s-nappien väli on vähintään `--space-12`, muuten osuma-alueet
menevät päällekkäin. Laajennus ei ulotu yli, jos napin vanhempi leikkaa
sisältönsä (`overflow: hidden`).

*Kirjattu 10.10.2026 Vellun hyväksymän luonnoksen pohjalta*

## 27. Väri-sivun taulut tarkistetaan, ja plugin saa tokenit verkosta

**Tilanne:** Vellu huomasi 10.10.2026, ettei `--danger` näkynyt Figman
Väri-sivulla, vaikka muuttuja oli olemassa (päätös 22). Taulut on
rakennettu käsin, eikä mikään verrannut niitä tokeneihin. Samalla
Tokenit Figmaan -plugin näytti "Failed to fetch": `/tokens.json`
julkaistaan, mutta Netlify ei lähettänyt CORS-otsaketta, ja pluginin
ikkunan origin on "null", joten selain esti vastauksen.

**Päätös:** `check:figma` vertaa Väri-sivun Light- ja Dark-taulujen
rivejä tokens.jsonin väreihin: jokaisella värillä on rivi, jolla on
`var(--nimi)` ja oikea hex, eikä ylimääräisiä rivejä ole
(scripts/figma-varisivu.mjs). `vercel.json` lähettää `/tokens.json`:lle
otsakkeen `Access-Control-Allow-Origin: *`.

**Perustelu:** päätöksen 8 mukaan tarkistus lisätään vasta, kun virhe
on päässyt läpi. Tämä pääsi. Muuttujia ei voi lukea rajapinnalla
(403), mutta taulun tekstit voi, joten tarkistus katsoo sitä, minkä
ihminen näkee. Tarkistus todennettiin rikkomalla: ilman danger-rivejä
se ilmoittaa kaksi puuttuvaa riviä, ja väärä hex näkyy omana
kohtanaan.

**Raja:** sirun väriä ei tarkisteta, koska sen sidos muuttujaan ei näy
rajapinnalle. Teksti ja hex tarkistetaan.

*Kirjattu 10.10.2026*

**Lisäys:** pokela.fi-domainia ei ole vielä kytketty Netlifyyn, joten
`/tokens.json` ei vastannut lainkaan. Vellun kanssa sovittiin, että
pluginin oletusosoite on mainin tokens.json GitHubin raw-osoitteessa:
se on sama lähde, josta kaikki muukin tehdään, eikä haku riipu
sivuston julkaisusta. Raw-osoite lähettää CORS-otsakkeen itse
(tarkistettu `curl -I`:llä). Sivuston osoite jää sallituksi
vaihtoehdoksi.

## 28. Välilehdet ovat navin viivan kieltä

**Tilanne:** neljäs sovelluskomponentti oli välilehdet. Luonnoksessa
oli kaksi tapaa: A, rivi välilehtiä hiusviivan päällä ja valitulle
musteviiva, ja B, napin kehys jossa valinta on käännetty mustaksi.

**Päätös:** `Tabs` ja `Tab` (2.13.0). Vellu valitsi A:n. Valittu
välilehti saa `--hairline-strong`-viivan tekstin levyisenä rivin
hiusviivan päälle, muut ovat `--ink-muted` ja tummuvat hoverissa. Sama
kieli kuin navin `aria-current`-linkki ja kentän hover-alaviiva.
Lukumäärä (`count`) on Meta/S-koossa ilman välistystä. Rakenne on
WAI-ARIA APG:n Tabs-malli automaattisella aktivoinnilla: `tablist`,
`tab`, `tabpanel`, roving tabindex. Nuolet kiertävät rivin päästä
toiseen, Home ja End vievät päihin, pois käytöstä olevat ohitetaan, ja
paneeli on sarkainjärjestyksessä.

Fokusrengas on välilehden sisällä eikä 2 px sen ulkopuolella kuten
muualla. Kapealla näytöllä rivi vierittyy, ja vierittyvä laatikko
leikkaa ulkopuolisen renkaan. Rengas mahtuu välilehden 8 px:n
sisennykseen, ja sisennys kumotaan rivin negatiivisella marginaalilla,
joten teksti alkaa palstan reunasta. Siksi rivin hiusviiva on taustana
eikä reunana. Figmassa sama tehdään rivillä, joka on kehystä 8 px
leveämpi kummallakin puolella.

**Raja:** B (lohko) jäi pois. Jos näkymänvaihtoon (päivä, viikko,
kuukausi) tarvitaan painavampi kytkin, se on oma komponenttinsa
(segmented control), ei Tabsin variantti. Välilehdet eivät ole
sivunavigaatio: linkit sivuille ovat `Nav`.

*Kirjattu 10.10.2026 Vellun hyväksymän luonnoksen pohjalta*

## 29. Ilmoitus on viiva, ja sävyjä on kolme

**Tilanne:** viides sovelluskomponentti oli inline-ilmoitus.
Luonnoksessa oli kaksi tapaa: A, vasen viiva ilman pintaa, ja B,
hiusviivakehys kuten kentässä.

**Päätös:** `Alert` (2.14.0). Vellu valitsi A:n. Vasen viiva on
`--hairline-strong`, sama paksuus kuin kentän virheviivassa. Otsikko on
Body/S painolla 500, teksti `--ink-muted`, toiminto `.btn--text` tekstin
alla ja sulkunappi oikealla. Sävyjä on kolme: info, success ja error.
Vain error on värillinen: viiva, ikoni ja otsikko ovat `--danger`.
Info ja success erottuvat ikonilla (uusi `info`, alertin neliö
ylösalaisin, ja `check`) ja otsikolla. Virhe on `role="alert"`, muut
`role="status"`. Sulkunappi on näkyvästi 32 px ja osuma-alue
`--tap-min`, kuten `.btn--s` (päätös 26).

**Perustelu:** kehys (B) erottui enemmän, mutta näytti kentältä tai
kortilta. Viiva ei kilpaile sisällön kanssa ja on samaa kieltä kuin
kentän virhe, jonka rinnalla ilmoitus usein on.

**Raja:** varoitussävyä ei ole. Ilman toista tilaväriä se erottuisi
virheestä vain sävyllä, ja `--danger` on varattu virheelle (päätös
22). Toast (ohimenevä ilmoitus) on eri komponentti, ja se tehdään
myöhemmin.

*Kirjattu 11.10.2026 Vellun hyväksymän luonnoksen pohjalta*

## 30. Taulukon otsikot ovat metatekstiä

**Tilanne:** seitsemäs sovelluskomponentti oli taulukko. Luonnoksessa
oli kaksi otsikkotapaa: A, Meta-otsikot ja otsikkorivin alla
hiusviivan paksuinen musteviiva, ja B, Body/S 500 -otsikot ja 2 px
musteviiva.

**Päätös:** `Table` (2.15.0). Vellu valitsi A:n. Rivit erotetaan
hiusviivalla, eikä taulukossa ole pystyviivoja, raitoja eikä pintaa.
Rivi on `--tap-min` hiusviivoineen. Luvut ovat oikealla tasalevyisin
numeroin. Lajiteltava otsikko on nappi `<th>`:n sisällä, ja `<th>`
kertoo järjestyksen `aria-sort`illa. Lajiteltu sarake on musteella, ja
nuoli osoittaa ylös nousevassa ja alas laskevassa järjestyksessä.
Lajittelematon nuoli näkyy haaleana vain hoverissa ja fokuksessa.
Hover korostaa rivin `--paper-alt`illa vain osoittimella. Kun
taulukko ei mahdu, se vierittyy, ensimmäinen sarake pysyy paikallaan
ja laatikosta tulee nimetty alue, johon pääsee sarkaimella. Tila
solussa on ikoni ja teksti, virhe `--danger`.

**Perustelu:** Meta-otsikot ovat ListRow'n ja metatekstin kieltä ja
jäävät taustalle, joten huomio menee dataan. B:n painotetut otsikot
kilpailivat datan kanssa.

**Raja:** rivin valintaa, sivutusta ja solun muokkausta ei ole. Ne
tehdään, jos sovellusnäkymä niitä tarvitsee.

*Kirjattu 11.10.2026 Vellun hyväksymän luonnoksen pohjalta*

## 31. Dialogin verho on paperia

**Tilanne:** kahdeksas sovelluskomponentti oli modaalinen dialogi.
Systeemissä ei ole varjoja, joten dialogin piti erottua sivusta muulla
tavalla. Luonnoksessa oli A, paperin sävyinen verho ja musteen
hiusviivakehys, ja B, tumma verho ja kehyksetön dialogi.

**Päätös:** `Dialog` (2.16.0). Vellu valitsi A:n. Verho on paperia 88 %
peittävyydellä, ja dialogi on paperia hiusviivakehyksellä musteella.
Leveys on enintään 480 px. Otsikko on Body/L 500, teksti Body/S
`--ink-muted`, napit `.btn--s` oikealla vähiten vahingollinen ensin, ja
sulkunappi on oikeassa yläkulmassa. Alle 600 px dialogi on alareunan
arkki: viiva yläreunassa, napit täysleveinä ja ensisijainen ylimpänä.
Toteutus on natiivi `<dialog>` ja `showModal()`: fokus pysyy
dialogissa, Esc ja verhon klikkaus kutsuvat `onClose`a, ja fokus palaa
avanneeseen nappiin. Sulkunappi on DOM:ssa viimeisenä, joten alkufokus
menee ensimmäiseen kenttään tai Peruuta-nappiin.

**Perustelu:** tumma verho (B) olisi tuonut systeemiin uuden värin, ja
tummassa teemassa dialogi olisi pitänyt nostaa `--paper-alt`ille, jotta
se erottuu. Paperiverho toimii samoin molemmissa teemoissa ilman uutta
tokenia, ja kehys on samaa hiusviivaa kuin kentässä.

**Raja:** dialogia ei pinota, eikä siinä ole kokoja. Ei-modaalinen
paneeli (drawer) on eri komponentti, ja se tehdään, jos sitä tarvitaan.

*Kirjattu 11.10.2026 Vellun hyväksymän luonnoksen pohjalta*

## 32. Käyttöliittymää ei selitetä tekstillä

**Tilanne:** sivulla oli ohjeita siitä, miten sitä käytetään:
"Vie osoitin tokenin tai komponentin päälle, niin näet missä sitä
käytetään. Kun vierität ohi, kerrokset painuvat yhdeksi sivuksi."
System-sivun näytteissä luki "vie osoitin päälle", "Avaa napista; Esc
sulkee" ja "Järjestä otsikoista". Vellu piti niitä noloina: käyttäjälle
ei tarvitse selittää kaikkea.

**Päätös:** ohjeet ja toiminnan selitykset poistettiin casesta 03 ja
System-sivulta, myös Figman sivupohjista. Sääntö on kirjattu käsikirjan
kohtaan *Sivun teksti*.

**Perustelu:** käyttöliittymän pitää toimia ilman selitystä. Jos jokin
ei aukea ilman ohjetta, vika on toiminnassa, ja se korjataan siellä.

**Raja:** ruudunlukijan tekstit (`sr-only`, `aria-label`) eivät ole
ohjeita, vaan ne kertovat saman kuin näkyvä käyttöliittymä. Storybookin
kuvaukset ovat kehittäjän dokumentaatiota ja saavat kertoa toiminnasta.

*Kirjattu 13.10.2026 Vellun palautteen pohjalta*

## 33. Viivapiirros piirretään tokenin värillä

**Tilanne:** etusivun herokuvaksi tehtiin viivapiirros: mustat
korkeuskäyrät valkoisella. Kuva on yksi tiedosto, joten tummassa
teemassa se näkyi valkoisena laattana keskellä tummaa sivua.

**Päätös:** Medialla on esitystapa `viiva`. Kuvan lähde on pelkkä
alfakanava, ja Media piirtää sen CSS-maskina `--ink`-värillä, samoin
kuin LogoRow piirtää logot. Rajaus on sama kuin `taysi`-esityksessä.
Esitys kirjoitetaan sisältöön paikan viereen, kuten muutkin esitykset,
ja se on Code Connectin ja Figman Media-komponentin variantti
(`Esitys=viiva`).

**Perustelu:** väri tulee tokenista, joten teemanvaihto toimii ilman
toista tiedostoa ja ilman teemakohtaisia sääntöjä. Kaksi erillistä
kuvaa olisivat kaksi lähdettä, jotka voivat erkaantua toisistaan.

**Raja:** vain kuville, joilla ei saa olla omaa pohjaa. Valokuva ja
kuvakaappaus ovat edelleen `taysi` tai `levy`. Maski ei osaa srcsetiä,
joten jokaisesta rajauksesta ladataan suurin leveys.

*Kirjattu 13.10.2026*

## 34. Krediitit kuluvat pitkiin sessioihin

**Tilanne:** Clauden viikkoraja tuli vastaan 11.10.2026. Selvityksen
mukaan suurin kulu oli yksi sessio, joka teki yhdeksän työtä
peräkkäin 9.–12.10. (noin 170 viestiä). Jokainen vuoro lähettää
mallille koko historian, joten myöhäiset vuorot kantoivat mukanaan
kaikkien aiempien komponenttien työn. Lisäksi ohjeet ohjasivat
lukemaan päätökset ja käsikirjan, yhteensä noin 100 kt, ja sessiot
odottivat CI:tä ja npm-julkaisua sisällään.

**Päätös:** yksi työ per thread, ja thread suljetaan, kun PR on
mainissa. Päätöksistä ja käsikirjasta luetaan vain tehtävän kohdat
otsikoiden perusteella. PR yhdistetään vihreällä ja vuoro lopetetaan
odottamatta npm:ää. Luonnoksessa on yksi suositus ja yksi kuva, kun
valinta on selvä. Säännöt ovat CLAUDE.md:ssä.

**Perustelu:** auki jäävä thread ei kuluta mitään, vaan kulu syntyy
vuoroista, ja vuoron hinta kasvaa historian mukana. Neljässä
viimeisessä luonnoksessa Vellu valitsi suosituksen.

**Raja:** tarkistuksia ei poisteta, eikä visuaalista hyväksyntää
ohiteta. Päätöksille ei tehdä käsin kirjoitettua hakemistoa, koska se
olisi toinen lähde samasta asiasta. Hakemisto saadaan otsikoista.

*Kirjattu 13.10.2026 Vellun päätöksellä*

## 35. Etusivun hero on koodilla piirretty viivateos

**Tilanne:** etusivun herona oli kuvapaikka 19, johon tehtiin
viivapiirros paikanvaraajaksi (päätös 33). Vellu halusi siitä
pysyvän teoksen: samat korkeuskäyrät SVG:nä, piirtyvät ja hieman
interaktiiviset, täysleveänä ruudun reunoihin ja ensimmäisen ruudun
alareunaan.

**Päätös:** etusivulla on komponentti Korkeuskayrat eikä kuvapaikkaa.
Käyrät lasketaan koodissa kiinteällä siemenellä ja piirretään
`--ink`-värisinä hiusviivoina paperille ilman nauhaa. Viivat alkavat
piirtyä, kun HeroIntron kansi asettuu (`hero-intro:asettuu`), joten
nimi on ensin yksin ja viivat jatkavat samaa liikettä. Jos intro jää
väliin, viivat ovat valmiina. Levossa kuvio ajelehtii hyvin hitaasti.
Linssi aukeaa vain painettaessa, ei osoittimen viennistä, ettei teos
ole levoton. Vähemmän liikettä pyytäneelle kuvio on paikallaan.

Intron kansi ja nimipalkki ovat nyt paperia eivätkä `--badge-surface`
(päätös 14): harmaa palkki valittiin jatkumaan herokuvan harmaaseen
nauhaan, ja ilman nauhaa palkin ja teoksen väliin olisi tullut raja.

**Perustelu:** generoitu kuvio on teos eikä paikanvaraaja, ja koodissa
se seuraa teemaa, ruudun leveyttä ja korkeutta ilman kuvatiedostoja.
Pelkkä vienti teki pinnasta levottoman, kun osoitin liikkuu sivulla
muutenkin.

**Raja:** teos on sivuston ominaisuus eikä lähde pakettiin, kuten
HeroIntro. Median viivaesitys jää pakettiin; sen esimerkkikuva on
kuvapaikka `media-viiva` Storybookissa.

*Päätetty 13.10.2026 — Veli-Matti Pokela*

## 36. Display-tyylien riviväli on vähintään 1.05

**Tilanne:** Vellu pyysi varmistamaan, että rivivälit riittävät.
Mitattiin jokaisen tyylin väli ylemmän rivin alavarresta (g, j, p, y)
alemman rivin ylävarteen (b, d, k, l) sivun omalla fontilla kaikilla
leveyksillä. Leipäteksti, meta ja display-m jäivät selvästi plussalle.
display-xl (0.92, lg 0.88), display-l (1, lg 0.96) ja display-s (1)
menivät 0.03–0.15 em päällekkäin: otsikossa, jossa on alavarsia,
kirjaimet olisivat osuneet toisiinsa.

**Päätös:** display-xl, display-l ja display-s käyttävät riviväliä
1.05 kaikilla leveyksillä. lg-tason tiukemmat arvot poistuvat.
display-m pysyy 1.12:ssa.

**Perustelu:** 1.05 on pienin pyöreä arvo, jolla varret eivät osu
millään tyylillä tai leveydellä, joten otsikko pysyy tiiviinä mutta
luettavana. Ääkkösten pisteet voivat yhä osua yläpuolisen rivin
alavarteen, mutta se vaatisi rivivälin noin 1.3:een, mikä hajottaisi
otsikot.

*Päätetty 13.10.2026 — Veli-Matti Pokela*

## 37. Navi väistyy vierityksen tieltä

**Tilanne:** navi oli tavallinen palkki sivun alussa. Se katosi heti
vieritettäessä, ja pitkillä case-sivuilla naviin pääsi vain
vierittämällä alkuun asti. Vellu kysyi, pitäisikö navin olla
modernimpi.

**Päätös:** navi väistyy. Ylälaidassa se on ennallaan. Alas
vieritettäessä se liukuu pois, ja ylös vieritettäessä se palaa
tiiviinä palkkina: pystypadding `--space-12`, paperi 88 % sumennuksen
päällä, hiusviiva alla. Aktiivisen kohdan alleviivaus on yksi viiva,
joka liukuu osoitettuun linkkiin ja palaa aktiiviseen. Fokus tuo
piilossa olevan navin esiin. Figmassa tila on Nav-komponentin
`Tila`-variantti (perus | tiivis), jonka Code Connect lukee.

**Perustelu:** modernius haetaan liikkeestä eikä uudesta ulkoasusta,
joten tyyli pysyy ennallaan: ei varjoa, ei väriä, sama 88 % kuin
dialogin verholla. Vellu hyväksyi luonnoksen
projektin ehdotuskansiosta (nav).

**Raja:** tiivis palkki pitää paikkansa sivun virrassa alamarginaalilla.
Ilman sitä selaimen vierityksen ankkurointi korjasi kutistumisen
vierittämällä ylös, ja navi palasi heti piilotettuaan. Liikkeen
vähentämisen asetuksella liukumia ei ole.

*Kirjattu 13.10.2026 Vellun hyväksynnällä*

## 38. Työtavalla on oma sivu

**Tilanne:** Colliers tehtiin käytännössä UX engineering -työtavalla:
suunnittelu ja toteutus iteroitiin samassa koodissa. Menetelmälle ei
ollut portfoliossa omaa paikkaa, vaikka se on oma kokonaisuutensa ja
liittyy useaan caseen. Lähteenä on Vellun Loihde-webinaari 2025.

**Päätös:** menetelmä saa oman sivun `/tyotapa`, ja navissa on linkki
Töiden jälkeen. Sivulla ovat menetelmän määritelmä, kuusi vaihetta,
mitä se muuttaa, rajat ja caset, joissa sitä on käytetty (Colliers ja
tämä sivusto). Caset linkittävät sivulle leipätekstin maininnasta
(`caseRefs`, `section: 'method'`), ja sivu linkittää caseihin.
Kuvitus on Piirros-komponentti: SVG piirretään koodissa tokenien
väreillä (päätös 33), ja aihe on Code Connectin ja Figman variantti
(`Aihe`).

**Perustelu:** menetelmä on casea laajempi. Colliers on sen sovellus,
ja tämä sivusto on sen jatke, jossa Figma seuraa koodia. Casen osiona
se toistuisi jokaisessa casessa tai jäisi yhden casen alle. Vellu
valitsi kolmesta vedoksesta vaihtoehdon A, jossa sama näkymä kulkee
kuvana rungosta julkaisuun ja jokaisella vaiheella on oma kuvansa.

**Raja:** sivu kuvaa menetelmän, ei myy sitä. Rajat kerrotaan yhtä
näkyvästi kuin hyödyt.

**Lisäys 16.10.2026:** case 03:n "Prosessi vaihe vaiheelta" käyttää
samaa vaiheruudukkoa. Jokaisella kahdeksalla vaiheella on oma
Piirros-aihe (`lahtotilanne` … `paluu`), ja vaihe, joka on vasta
tulossa, piirretään katkoviivoin. Pelkkä teksti tekstin perään ei
kerro prosessista yhtä hyvin kuin kuva (Vellu).

**Lisäys 21.10.2026:** Blokbook lisättiin caseihin, joissa menetelmää
on käytetty. Alun perin se jätettiin pois, koska sen case kertoo
tuotekehityksestä, mutta Vellu suunnitteli senkin suoraan koodiin
samalla menetelmällä.

*Kirjattu 14.10.2026 Vellun hyväksynnällä*

## 39. Otsikoissa ei ole loppupistettä

Vellu 2026-10-14: "otsikoiden loppuun ei tule pistettä". Sivulla oli
otsikoita pisteellä ja ilman, esimerkiksi Työtapa-sivun hyötyjen ja
rajojen otsikot sekä casejen lead- ja nauhaotsikot.

Päätös: mikään otsikko (h1–h6, casen lead, nauhan otsikko) ei pääty
pisteeseen, vaikka se olisi kokonainen lause. Kysymys- ja huutomerkki
saavat jäädä, jos lause niitä vaatii. Leipäteksti, ingressit ja
taglinet ovat lauseita ja saavat pisteen.

Tarkistusta ei lisätty (päätös 8): sääntö on käsikirjassa, ja kaikki
nykyiset otsikot korjattiin samassa muutoksessa koodiin ja Figmaan.


## 40. Pitkä sivu rytmitetään luvuilla ja pinnalla

**Tilanne:** case 03 (Designer portfolio 2026) oli kasvanut noin
12 500 pikseliin ja kahteentoista osioon. Tarkistuksista kerrottiin
neljään kertaan (prosessin vaiheet, tarkistuslista, buildin aikajana,
Ylläpito), linkit Storybookiin, Figmaan ja repoon olivat kahdesti, ja
osoite `/tyot/tama-sivusto` ei kertonut mitään. Kaikki sivut olivat
yhtä tasaista paperia, joten pitkässä sivussa ei ollut lukuja.

**Päätös:**

- Case 03 tiivistetään yhdeksään osioon samassa tarinan kaaressa kuin
  muut caset. Tarkistukset ovat yksi osio: rivillä nimi ja ensimmäinen
  lause, raja ("Ei kata") ja viimeisimmän buildin aikajana avautuvat
  rivistä (`CheckList`, `Accordion`). Ylläpito ja Rajat yhdistyvät
  tarkistuksiin ja lopputulokseen, token-nimien lista jää
  Storybookiin, ja linkit ovat kerran sivun lopussa.
- Osoite on `/fi/tyot/portfolio/`. Vanha osoite ohjataan uuteen
  (`vercel.json`).
- Uusi token `--tint-surface` ja `Section`-komponentin props
  `surface` (`paper` | `tint`, Figmassa variantti `Pinta`). Sävy
  kuuluu luvulle, jossa näytetään mitä rakennettiin: caseissa osiot
  tumman nauhan jälkeen, Työtavan vaiheet ja Systemissä joka toinen
  luku (Typografia, Välistys). Tarina ja perustelut pysyvät paperilla.

**Perustelu:** tieto säilyy, mutta lukija näkee ensin tarinan ja
avaa yksityiskohdat, jos haluaa. Pinnan vaihto luvun eikä osion
kohdalla antaa rytmin ilman että sivu pirstoutuu. Valmis `--paper-alt`
(#FAFAF8) ei erotu valkoisesta, ja `--badge-surface` on liian raskas
isolle pinnalle, joten sävy on oma tokeninsa.

**Raja:** Töitä ja Tietoa ei sävytetty, koska ne ovat lyhyitä.
Etusivulla sävy on vain asiakaslogojen rivillä, joka kulkee reunasta
reunaan työlistan alla. Koko työluku sävytettynä teki sivusta
tunkkaisen, koska etusivulla on jo herokuva ja tumma nauha (Vellu
15.10.2026).

*Kirjattu 15.10.2026 Vellun hyväksynnällä*

## 41. Sivunvaihto näyttää latauksen viivalla

**Tilanne:** Vellu huomasi, että sivunvaihto kesti välillä eikä
käyttäjä nähnyt mitään. Syy on staattinen vienti: Next.js hakee
etukäteen vain näkyvien tai osoittimen alla olevien linkkien
sisällön. Hakematon linkki (kosketus, juuri näkyviin vieritetty rivi,
hidas yhteys) jättää klikkauksen ja uuden sivun väliin tyhjän hetken.
Hitaalla yhteydellä Työt → Portfolio kesti 1,9 s ilman palautetta.

**Päätös:**

- Klikatun ListRow'n alaviiva piirtyy musteella vasemmalta kohti
  oikeaa reunaa, kun kohdesivu latautuu (`pending`-propsi, Figmassa
  `State=pending`). Viiva on siinä, mihin juuri klikattiin, ja käyttää
  rivin omaa viivaa.
- Muille linkeille (navi, tekstilinkit) ruudun yläreunaan tulee sama
  viiva (`PageProgress`, Figmassa `Tila`). Yläreunassa, koska navi voi
  olla vieritettäessä piilossa.
- Kumpikin näkyy vasta 120 ms:n jälkeen, joten nopea sivunvaihto ei
  välähdä. Viiva kasvaa kohti 90 %:a ja sulkeutuu, kun polku vaihtuu.
  Ilman liikettä viiva on paikallaan.
- Ei `loading.tsx`-luurankoa: staattisella sivulla se välähtäisi
  jokaisessa siirtymässä.

**Perustelu:** pelkkä 2 px yläviiva jäi luonnoksessa huomaamatta.
Vaihtoehdoista (vahvempi yläviiva, riviviiva) Vellu valitsi
riviviivan: palaute tulee klikkauskohtaan eikä sivulle tule uutta
elementtiä.

*Kirjattu 15.10.2026 Vellun hyväksynnällä*

## 42. Tarkistukset näytetään kahtena ryhmänä

**Tilanne:** case 03:n tarkistuslistassa Favicon, Kuvat ja Kuvasuhteet
olivat samanarvoisia rivejä kuin Figma tai Paketit. Vellu kysyi, miksi
faviconille on pyhitetty oma vaihe. Vastaus: menetelmä on sama kuin
muissa (johdettu tiedosto lasketaan lähteestä, ja tarkistus käyttää
samaa laskentaa), mutta kohde on tämän sivuston oma eikä sille ole
kirjattu löydöstä (päätös 8). Ryhmittelystä sovittiin jo 7.10.2026
ketjun uudistuksessa.

**Päätös:** tarkistukset näytetään kahtena ryhmänä: *Yleinen ydin*
(tokenit, storyt, Code Connect, kovakoodatut arvot, Figma, paketit,
dokumentaatio, tekstit) ja *Tuotekohtaiset vartijat* (favicon, kuvat,
kuvasuhteet). Ryhmä on `lib/checks.ts`:n kenttä `group`, ja ryhmän
otsikko ja selite tulevat samasta tiedostosta casesivulle, Figman
Lohkot-pohjaan ja Jatkuva kehitys -sivun luotuun tekstiin.

**Raja:** tarkistuksia ei poistettu eikä niiden ajoa muutettu.
Tuotekohtaiset vartijat ajetaan yhä joka buildissa ja lasketaan
otsikon lukuun.

*Kirjattu 16.10.2026 Vellun hyväksynnällä*

## 43. Nav ja Footer ovat paketissa

**Tilanne:** Vellu testasi Make-kittiä ja kysyi, miksei sovelluksessa
ole navigaatiokomponenttia. Nav ja Footer jätettiin paketista pois,
koska ne lukivat sivuston sanakirjaa ja Next.js-reititystä. Make-ohjeet
silti käskivät käyttää `Nav`ia, jota Make ei nähnyt.

**Päätös:** Nav ja Footer saavat sisältönsä propseina. Navin linkit,
nykyinen polku (`currentPath`), tekstit ja linkkikomponentti (`as`,
kuten ListRow:ssa) annetaan sille; Footer saa CTA:n, yhteystiedot ja
alarivit. Sivusto kytkee Navin sanakirjaan ja reitittimeen
`NavRoute`lla, kuten PageProgressRoute kytkee PageProgressin. Molemmat
viedään pakettiin tyyleineen (2.23.0).

**Raja:** ulkoasu ei muuttunut, joten Figman komponentit pysyvät
ennallaan; vain Code Connect -esimerkit vaihtuivat uusiin propseihin.

*Kirjattu 20.10.2026 Vellun hyväksynnällä*

## 44. Pitkä sivun otsikko pienenee pituuden mukaan

**Tilanne:** Työtapa-sivun otsikko "UX engineering – koodipohjainen
suunnittelu" (43 merkkiä) oli display-xl:nä 136 px ja kolmella
rivillä. Vellu: iso ja näyttävä otsikko on pääasiassa hyvä, mutta
pitkä otsikko paisuu liian suureksi.

**Päätös:** sivun otsikon koko johdetaan sen pituudesta. Enintään 20
merkin otsikko on `display-xl`, pidempi `display-l` (sama koko kuin
casejen otsikoissa). `PageHeader` laskee koon itse (`otsikonKoko`),
ja Työtapa-sivun otsikko käyttää samaa funktiota. Kokoa ei aseteta
käsin; `size`-props on vain otsikolle, joka ei ole pelkkää tekstiä.
Figmassa PageHeaderilla on variantti `Otsikko` = lyhyt / pitkä.

**Raja:** uusia tokeneita ei tullut, vain kaksi olemassa olevaa
tyyliä. `check:figma` luki enum-arvoista vain ASCII-alkuiset osat, joten
"pitkä" olisi ohittunut hiljaa; säännöllinen lauseke hyväksyy nyt
kaikki kirjaimet.

*Kirjattu 21.10.2026 Vellun pyynnöstä*

## 45. Design system on case 03:n alasivu

**Tilanne:** navissa oli Työt, Työtapa, Tietoa, System ja Ota
yhteyttä. Vellu koki Työtavan ja Systemin irrallisiksi. Ne kertovat
samasta asiasta, menetelmästä ja sen tuotoksesta, mutta Tietoa oli
niiden välissä, sivut eivät linkittäneet toisiinsa, ja System oli
navin ainoa englanninkielinen sana.

**Päätös:** System poistuu navista, jolloin navissa ovat Työt,
Työtapa, Tietoa ja Ota yhteyttä. Design system siirtyy osoitteeseen
`/tyot/portfolio/system`, ja navi merkitsee siellä Työt aktiiviseksi.
Case 03:n nauha "Yksi design system koodissa, Figmassa ja
AI-työkaluissa" saa linkin "Design system elävänä" (nauhan `link`).
Ketju on siis Työtapa → case 03 → design system: Työtavan "Missä
käytetty" vie jo caseen. Vanhat osoitteet `/system/` ja `/fi/system/`
ohjataan uuteen (`vercel.json`). Räjäytyskuvan pienoisnavi
seuraa oikeaa navia.

**Perustelu:** design system on tämän portfolion tuotos, ei
menetelmän. Menetelmä tuottaa jokaisessa projektissa oman design
systeminsä: Colliersilla se oli Storybookissa, täällä tämä sivu.
Ensin sivu siirrettiin Työtavan alle (`/tyotapa/system`), mutta
Vellun kysymyksestä nähtiin, että case on rehellisempi paikka.

**Raja:** design system on yhä linkin päässä casesta ja Työtavalta
casen kautta, joten POC:n todiste ei katoa, vaikka se ei ole navissa.

*Kirjattu 21.10.2026 Vellun hyväksynnällä*

## 46. Nosto korvaa käännetyt nauhat

**Tilanne:** etusivun ja casejen väitteet olivat käännettyjä nauhoja
reunasta reunaan: tumma laatta, otsikko vasemmalla ja leipäteksti
oikealla. Vellu koki nauhan hyppäävän sivulta liian rajusti esiin ja
toistavan samaa kahden palstan asettelua kuin muut osiot. Väljempi
yhden palstan sävypinta näytti vielä tylsemmältä.

**Päätös:** uusi komponentti Nosto. Taustana on reunasta reunaan
etusivun viivateos (Korkeuskayrat), ja keskellä on paperinen
paneeli, jossa väite, leipäteksti ja valinnainen linkki ovat
keskitettyinä. Etusivu ja kaikki casejen nauhat (`band`) käyttävät
sitä. Kolmesta vaihtoehdosta (paneeli, jättikokoinen typografia,
liukuva nauha) Vellu valitsi paneelin.

**Perustelu:** keskitetty paneeli rikkoo kahden palstan rytmin, ja
viivateos sitoo noston etusivun heroon: sama teos avaa ja päättää
etusivun. Erottuminen tulee teoksesta eikä pelkästä kontrastista.

**Paketti:** Nosto ja Korkeuskayrat siirtyvät @pokela/components-
pakettiin tyyleineen. Korkeuskayrat oli rajattu ulos etusivun omana
teoksena, mutta se ei lue sivuston sisältöä, ja HeroIntro-kytkös on
valinnainen tapahtuma. Näin Make ja muut sovellukset saavat saman
noston kuin sivusto (Vellu: "eikö sitä ole mahdollista sisällyttää").

**Raja:** tausta on koriste, joten se on piilotettu ruudunlukijalta
(Korkeuskayrat ilman `label`ia).

*Kirjattu 21.10.2026 Vellun hyväksynnällä*

---

## 47. Puhelinruudun video istuu levyllä, ja aiemman työn kuvat jaetaan osioihin

**Tilanne:** Pivon caseen tuli kolme ruutuvideota. Kussakin oli eri
laitekehys mustalla pohjalla, ja Median video täytti aina koko
paikan. Kirjautumisen ennen/jälkeen-vertailu olisi jäänyt samaan
kuvariviin videoiden kanssa ilman erotusta.

**Päätös:** videot rajataan pelkkään ruutuun (9:16, ei ääntä), ja
Video saa esityksen `levy`: video näytetään kokonaisena levyn
keskellä samalla tavalla kuin puhelinkaappaus kuvana (päätös 9).
Esitys tulee sisällöstä kuten kuvalla, ja levy on oletus muualla
kuin herossa. Aiemman työn kuvat ovat osioina: otsikollinen osio saa
otsikon ja ingressin, ja otsikoton osio on pelkkä kuvarivi.

**Perustelu:** levy antaa ruutuvideoille saman rajan kuin
kuville, ja kolme eri laitekehystä olisi rikkonut sen. Vellun mukaan
vertailu ja videot tarvitsivat kumpikin selkeän oman osionsa eivätkä
saaneet näyttää yhdeltä riviltä.

*Kirjattu 27.10.2026 Vellun hyväksynnällä*

## 48. Avautuva rivi avautuu liikkeenä

**Tilanne:** avautuva rivi (Accordion) hyppäsi auki ja kiinni
kerralla: rivi kääntyi mustaksi, paneeli ilmestyi ja plus vaihtui
miinukseksi samassa ruudussa. Vellu halusi avautumisesta ja
sulkeutumisesta näyttävämmät.

**Päätös:** käännetty pinta nousee rivin alareunasta, ja tekstin väri
vaihtuu täsmälleen musteen reunalla. Paneeli laskeutuu auki, sisältö
nousee lohko kerrallaan, ja plussan pystyviiva kiertyy miinukseksi.
Sulkeutuminen on lyhyempi: sisältö häivyy, paneeli painuu kiinni ja
muste valuu alas. Kolmesta vaihtoehdosta (Laskos, Musteviiva,
Kohdistus) Vellu valitsi Laskoksen.

**Perustelu:** liike on näyttävä mutta pysyy sivuston rauhallisessa
tyylissä, eikä se tuo paneeliin uutta sisältöä. Siksi sama liike
sopii kaikkiin avautuviin riveihin: Aiempi työ, tarkistuslista ja
System-sivun näytteet.

**Toteutus:** rivin vanha tila jää kloonina rivin päälle ja
leikkautuu pois. Pelkkä taustan animointi vaihtaisi tekstin värin
koko rivillä kerralla. Paneeli pysyy DOMissa sulkeutumisen ajan.
Figman tilat (suljettu, hover, auki) eivät muutu; liike on kirjattu
komponentin kuvaukseen.

**Raja:** vähennetty liike (`prefers-reduced-motion`) avaa ja sulkee
rivin heti, kuten ennen.

*Kirjattu 27.10.2026 Vellun hyväksynnällä*


## 49. Sivusto julkaistaan Vercelistä

**Tilanne:** Netlifyn ilmaiset build-minuutit loppuivat kesken
kuukauden. Kuvaputki laskee videot alusta jokaisessa Netlifyn
buildissa (yli 5 min, ks. päätös 23), koska välimuisti ei säily siellä
ajosta toiseen.

**Päätös:** sivusto julkaistaan Vercelin Hobby-tasolta. `vercel.json`
korvaa Netlifyn asetus- ja ohjaustiedostot: sama build
(`npm run build`), julkaisukansio `out/`, samat ohjaukset ja
`/tokens.json`:n CORS-otsake. Kuvaputken välimuisti on Vercelissä
`node_modules/.cache/`:n alla, koska Vercel säilyttää sen buildista
toiseen. Storybook jää Netlifyyn, koska se julkaistaan käsin ilman
buildia.

**Perustelu:** Hobby-tasolla ei ole build-minuuttikattoa: rajat ovat
45 minuuttia buildia kohden ja 100 julkaisua päivässä. Ylitys pysäyttää
palvelun, se ei tuo laskua. Next.js:n static export toimii Vercelissä
ilman sovitinta.

**Raja:** Hobby on vain ei-kaupalliseen, henkilökohtaiseen käyttöön.
Henkilökohtainen portfolio sopii siihen. Jos sivusta tulee yrityksen
myyntisivu, edessä on Pro-taso (20 $/kk) tai paluu toiseen palveluun.

*Kirjattu 28.10.2026 Vellun pyynnöstä*

## 50. Tarkistuslista kertoo, mitä tarkistus huomaa

**Tilanne:** Vellu ei ymmärtänyt case 03:n tarkistusosiota. Otsikko
lupasi 10 tarkistusta, listassa oli 11 ja viimeisimmän buildin rivillä
luki "10 vaihetta". Jokainen rivi alkoi "Varmistaa, että…", jokaisella
oli tila "Ajossa", ja ryhmät *Yleinen ydin* ja *Tuotekohtaiset
vartijat* (päätös 42) olivat sisäistä termistöä. Sivuston omat
tarkistukset (favicon, kuvat, kuvasuhteet) olivat lukijalle
sivupolku.

**Päätös:** listassa ovat vain design systemin tarkistukset, ja
otsikon luku laskee vain ne. Rivillä kerrotaan, millaisen virheen
tarkistus pysäyttää (`huomaa`, "Huomaa, jos…"), ja tarkka kuvaus ja
raja ovat avattavassa paneelissa. Tila "Ajossa" poistuu. Ajamaton
tarkistus on listan lopussa Tulossa-ryhmässä ilman numeroa, joten
numerot vastaavat otsikon lukua. Sivuston omat tarkistukset näkyvät
vain viimeisimmän ajon aikajanalla omana ryhmänään ("Sivuston omat
tarkistukset"). Siksi `check:sync` ajaa ne viimeisinä. Rivin nimi on
nyt "Viimeisin ajo", eikä siinä ole vaihemäärää.

**Perustelu:** kolme eri lukua samassa osiossa kumosi osion oman
väitteen, ja konkreettinen virhe kertoo lukijalle enemmän kuin
tarkistuksen määritelmä. Päätöksen 42 ryhmittely säilyy
rekisterissä (`group`), mutta casessa se näkyy vain aikajanalla.

**Raja:** Figma- ja pakettitarkistus ajetaan vain pull requestissa,
joten ne eivät näy buildin aikajanalla, vaikka ne ovat listassa.

*Kirjattu 28.10.2026 Vellun pyynnöstä*

**Tarkennus 29.10.2026:** "Viimeisin ajo" näytti kuuluvan
Tulossa-ryhmään, koska se oli listan viimeinen rivi ilman omaa
otsikkoa. Sillä on nyt oma ryhmä *Sivuston päivitys* selitteineen, ja
rivin nimi on "Viimeisin päivitys": "ajo" on kehittäjän sana, ja
lukija ymmärtää päivityksen. Tekstit ovat casen sisällössä
(`paivitys`).
