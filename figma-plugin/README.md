# Tokenit Figmaan

Figman muuttujat generoidaan sivuston omasta `tokens.json`:sta.

## Miksi generoidaan eikä verrata

Figman muuttujien REST-API on Enterprise-tason ominaisuus
(*"This API is available to full members of Enterprise orgs"*), eikä
sitä ole käytettävissä. Koodin ja Figman arvoja ei siis voi verrata
automaattisesti — eli tavallinen ratkaisu, synkkatarkistus rajapinnan
yli, ei ole mahdollinen.

Suunta käännetään: kun Figma generoidaan koodista, eriytymä ei ole
asia jonka tarkistus löytää, vaan asia jota ei voi syntyä.

## Käyttö

1. Figma → **Plugins → Development → Import plugin from manifest…**
2. Valitse `figma-plugin/manifest.json`
3. Aja plugin. Se hakee `tokens.json`:n repon mainista GitHubin
   raw-osoitteesta, tai voit liittää sisällön suoraan kenttään.

Oletusosoite on main eikä sivusto, koska main on se lähde, josta
kaikki muukin tehdään, eikä haku silloin riipu siitä, onko sivusto
julkaistu (päätös 27). GitHub lähettää raw-osoitteelle
`Access-Control-Allow-Origin: *`, jota pluginin ikkuna tarvitsee.
Välimuisti viivästää uutta arvoa muutaman minuutin mergen jälkeen.
Sivuston `/tokens.json` toimii yhä, kun domain on käytössä.

Manifestin muutos (sallitut osoitteet) luetaan vasta, kun plugin
tuodaan uudelleen tai Figma käynnistetään: hae muutos koneellesi
ennen ajoa.

Ajo on idempotentti: muuttujat etsitään nimellä, luodaan jos
puuttuvat ja päivitetään jos ovat. Mitään ei poisteta — plugin ei saa
tuhota työtä jota se ei tehnyt.

## Mitä syntyy

<!-- generated:figma-kokoelmat -->
| Kokoelma | Moodit | Muuttujia |
|---|---|---|
| Color | Light, Dark | 18 |
| Typography | base, sm, md, lg | 28 |
| Spacing | Default | 16 |
| Layout | base, sm, md, lg | 6 |
| Border | Default | 5 |
| Icon | Default | 3 |
| Motion | Default | 7 |
<!-- /generated -->

Jokainen muuttuja saa skoopin (ei koskaan `ALL_SCOPES`) ja
WEB-koodisyntaksin `var(--nimi)`, joten Dev Mode näyttää saman nimen
jota koodi käyttää.

## Yksi kohta jossa Figma ja CSS eroavat

CSS:ssä riviväli on yksiköttä (`--lh-display-xl: 0.88`) ja välistys
em-arvo (`--tr-display-xl: -0.02em`). Figma sitoo kumpaankin vain
pikseliarvon — asetettu yksikkö ylikirjoitetaan hiljaa.

Siksi plugin laskee molemmat pikseleiksi **kullekin breakpointille
erikseen**: `kerroin × fonttikoko`. Arvo ei ole käsin kopioitu vaan
johdettu, ja muunnos on merkitty kunkin muuttujan kuvaukseen. Sivuston
Typografia-sivu jakaa arvon takaisin fonttikoolla, joten siellä näkyy
sama luku kuin `tokens.css`:ssä.

## Rajaus

Plugin kirjoittaa muuttujat. Tekstityylit ja komponentit ovat käsin
rakennettuja: ne ovat suunnittelupäätöksiä, eivät arvoja, eikä niitä
kannata generoida.

Kaikkea `tokens.json`:sta ei myöskään käännetä muuttujiksi. Painot
(`--weight-400/500/600`) jäävät pois, koska Figmassa paino ilmaistaan
fontin leikkauksena (*Regular*, *Medium*, *SemiBold*) — numeromuuttuja
olisi toinen totuus samasta asiasta. Sama koskee `--font-code`:a: sen
arvo on järjestelmäpino (`ui-monospace`), jota Figmassa ei ole
perheenä. Breakpointit ovat kokoelmien moodeina, eivät muuttujina.
