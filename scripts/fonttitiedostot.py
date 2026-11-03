"""
Kokoaa app/fonts/*.woff2 -tiedostot. Ajetaan käsin vain, kun fontti
tai painot vaihtuvat (pip install fonttools brotli).

Lähde on Google Fontsin repon muuttuva fontti. Optinen koko ja leveys
kiinnitetään oletusarvoon kuten Google tekee, paino jää muuttuvaksi,
ja merkit ja OpenType-ominaisuudet rajataan samoihin kuin Googlen
latin- ja latin-ext-osajoukoissa. Ääriviivat ja leveydet vastaavat
Googlen tiedostoja merkki merkiltä (tarkistettu 2026-11-03).
"""
import os, re, sys, tempfile, urllib.request
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

KANSIO = os.path.join(os.path.dirname(__file__), '..', 'app', 'fonts')
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'
FONTIT = [
    # tiedosto, Googlen perhe, lähde google/fonts-reposta, kiinnitettävät akselit, painoalue
    ('BodoniModa', 'Bodoni+Moda', 'ofl/bodonimoda/BodoniModa%5Bopsz,wght%5D.ttf', ['opsz'], (400, 900)),
    ('Archivo', 'Archivo', 'ofl/archivo/Archivo%5Bwdth,wght%5D.ttf', ['wdth'], (100, 900)),
]
# Googlen osajoukot tuovat myös nämä yhdistelmämerkit
LISA = ['U+0300-0303', 'U+0309', 'U+0323']
OMINAISUUDET = ['ccmp', 'dnom', 'frac', 'liga', 'locl', 'numr', 'pnum', 'rvrn', 'tnum', 'kern', 'mark', 'mkmk']

def hae(url, ua=None):
    pyynto = urllib.request.Request(url, headers={'User-Agent': ua} if ua else {})
    return urllib.request.urlopen(pyynto).read()

for nimi, perhe, lahde, kiinnita, painot in FONTIT:
    css = hae(f'https://fonts.googleapis.com/css2?family={perhe}:wght@400&display=swap', UA).decode()
    alueet = []
    for osa, runko in re.findall(r'/\* (\S+) \*/\s*@font-face \{(.*?)\}', css, re.S):
        if osa in ('latin', 'latin-ext'):
            alueet += [a.strip() for a in re.search(r'unicode-range: (.*?);', runko).group(1).split(',')]
    with tempfile.TemporaryDirectory() as tmp:
        ttf = os.path.join(tmp, 'lahde.ttf')
        open(ttf, 'wb').write(hae(f'https://cdn.jsdelivr.net/gh/google/fonts@main/{lahde}'))
        fontti = instancer.instantiateVariableFont(TTFont(ttf), {**{a: None for a in kiinnita}, 'wght': painot})
        valmis = os.path.join(tmp, 'valmis.ttf')
        fontti.save(valmis)
        asetukset = subset.Options()
        asetukset.flavor = 'woff2'
        asetukset.layout_features = OMINAISUUDET
        asetukset.name_IDs = ['*']
        asetukset.notdef_outline = True
        fontti = subset.load_font(valmis, asetukset)
        rajaaja = subset.Subsetter(asetukset)
        rajaaja.populate(unicodes=subset.parse_unicodes(','.join(alueet + LISA).replace('U+', '')))
        rajaaja.subset(fontti)
        kohde = os.path.join(KANSIO, f'{nimi}.woff2')
        subset.save_font(fontti, kohde, asetukset)
        print(f'{kohde}: {os.path.getsize(kohde)} tavua', file=sys.stderr)
