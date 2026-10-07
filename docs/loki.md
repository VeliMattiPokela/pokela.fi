# Loki

Kokeilut ja niiden tulokset aikajärjestyksessä. Ohjeet ja nykytila ovat
`docs/kasikirja.md`:ssä; tämä kertoo mistä ne tulivat.

## Figma Make, ensimmäinen ajo, 6.10.2026

Testattu kehotteella *"Build a work index: six projects, each with a title, a
one-line description, and a role on the right."* Make tuotti:

```jsx
import { Col, Grid, ListRow, Reveal } from "@pokela/components";
```

Oikea tuonti, oikeat propsit, `Reveal` osion ympärillä eikä yksittäisen
elementin. Ei yhtään Tailwind-luokkaa, ei väriä, ei pyöristyksiä. Korostettu
rivi oli musta käännös, kuten ohjeissa sanottiin.

**Odottamaton osa:** Make käytti myös oikeita utility-luokkia — `.meta`,
`.meta--ink`, `.display-xl`, `.body-s`, `.list-rows`, `.page`, `.bleed` —
vaikka ohjeissa ei lueteltu yhtäkään niistä. Se luki ne paketin
tyylitiedostosta. Luokkia ei siis tarvitse dokumentoida, kunhan ne ovat
paketissa.

Kaksi virhettä, molemmat nyt ohjeissa:

| Virhe | Sääntö joka lisättiin |
|---|---|
| `<p className="display-xl">` pääotsikkona | luokka ja elementti ovat eri päätös; otsikko on `<h1>` |
| `className="bleed"` ListRowille | `ListRow` lisää sen jo itse |

Ensimmäinen on saavutettavuusvirhe: ruudunlukija ei saa otsikkorakennetta.
Sivustolla axe kaatuisi siihen, Makessa ei kukaan huomaa.

## Figma Make, toinen ajo — muuttuivatko ohjeet tulokseksi

Molemmat säännöt lisättiin ohjeisiin ja sama kehote ajettiin uudelleen:

```diff
- <p className="display-xl">Selected work</p>
+ <h1 className="display-xl">Selected work</h1>

- <ListRow … size="m" className="bleed" />
+ <ListRow … size="m" />
```

Lisäksi muutos jota ei pyydetty: `Reveal` siirtyi osion sisältä sen ympärille.
Sääntö *"wrap sections, not single elements"* oli ollut ohjeissa alusta asti,
ja Make sovelsi sen nyt kirjaimellisesti.

**Tämä on se kohta jossa prosessi eroaa onnekkaasta kehotteesta.** Ensimmäinen
ajo todisti että Make käyttää oikeita komponentteja. Toinen todisti että
ohjeet ohjaavat sitä — muutos tekstissä muutti tulosta, täsmälleen niiltä
kohdin kuin oli kirjoitettu. Ilman tätä ei tiedettäisi onko lopputulos
ohjauksen vai sattuman tulos.
