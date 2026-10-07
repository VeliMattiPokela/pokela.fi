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
system.css          .code              code-koko  + code-perhe + taustapalkki
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
