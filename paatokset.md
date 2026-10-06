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

**Avoinna:** sarakemäärittely (4 / 8 / 12, gutterit) pitäisi olla Figmassa
layout gridinä. Inventaario ei tarkista sitä, eikä kukaan ole varmistanut että
se vastaa `layout.columns`-tokeneita.

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

**Avoinna:** `check:suhteet` kattaa kolme neljästä. Figman variantti jäi
ulkopuolelle, koska tarkistus rakennettiin ennen kuin inventaario paljasti
neljännen paikan. Oikea koti laajennukselle on `check:figma`, joka lukee
Figman komponenttien propertyt jo nyt.

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
