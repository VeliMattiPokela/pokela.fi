# Ohjeet agentille

Projekti ja sen periaatteet: README.md, päätökset: paatokset.md,
käytännöt: docs/kasikirja.md. Kieli on suomi: koodi, kommentit,
commit-viestit ja vastaukset.

## Koodi ja Figma muuttuvat samassa muutoksessa

Jokainen muutos, joka näkyy sivun ulkoasussa, tehdään samassa pull
requestissa myös Figmaan (tiedosto `PVyeKV6J1Rzyj2VL4X27FR`):
komponentin uusi tila, variantti tai esitystapa, sivupohjien muutokset
ja luotujen tekstien muutokset. Vellun ei pidä joutua pyytämään sitä
erikseen.

Uusi tila tehdään komponentin propsiksi ja Code Connectin
(`*.figma.ts`) variantiksi, ei dataan komponentin ohi. Silloin
`check:figma` vaatii saman tilan Figmaan ja menee punaiselle, jos se
puuttuu. Tarkistus vertaa rakennetta, ei pikseleitä: pelkkä tyylin
hienosäätö (väli, varjo) päivitetään Figmaan käsin samassa
muutoksessa. Ks. päätös 10.

## Paketit

`styles/`- tai komponenttimuutos muuttaa @pokela-paketteja. Nosta
`tokens.json`:n `$meta.version` samassa PR:ssä ja anna Vellulle
julkaisukomento; julkaisu vaatii hänen npm-kirjautumisensa.
