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
