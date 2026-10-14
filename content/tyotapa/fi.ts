import type { PiirrosAihe } from '@/components/Piirros';

/**
 * Työtapa-sivu: UX engineering -menetelmä.
 *
 * Lähde on Vellun Loihde-webinaari 2025 ("UX Engineering –
 * Digipalvelun suunnittelu ja koodipohjainen protoilu AI-aikakautena"):
 * vaiheet ja rajat ovat sieltä, ilman webinaarin kuvitteellista
 * esimerkkiprojektia. Ks. päätös 38.
 */
const tyotapa = {
  eyebrow: 'Työtapa · UX engineering',
  title: 'Suunnitellaan koodissa.',
  lede: 'UX engineering yhdistää käyttäjälähtöisen suunnittelun ja front end -toteutuksen. Palvelua suunnitellaan ja iteroidaan toimivana koodina, joten jokainen suunnittelupäätös on samalla valmista koodia ja sitä voi kokeilla heti.',
  facts: [
    { label: 'Mitä', value: 'Käyttäjälähtöinen suunnittelu ja front end' },
    { label: 'Työkalut', value: 'React, TypeScript, Storybook, Git, AI-avustaja' },
    { label: 'Rooli', value: 'UX engineer: design ja toteutus samoissa käsissä' },
    { label: 'Käytössä', value: 'Colliers Asunnot, tämä sivusto' },
  ],
  hero: {
    label: 'Sama näkymä neljässä vaiheessa: runko, design system, data ja julkaistu palvelu.',
    caption: 'Sama näkymä runkona, design systemillä, datalla ja julkaistuna. Koodi ei vaihdu matkalla.',
  },
  stepsTitle: 'Vaiheet',
  steps: [
    {
      aihe: 'ymmarrys',
      h: 'Ymmärrys ensin',
      p: 'Asiakasymmärrys ja yhteinen näkemys syntyvät ennen ensimmäistä koodiriviä. Koodi ei korvaa konseptointia.',
    },
    {
      aihe: 'pohja',
      h: 'Pohja ja brief',
      p: 'Kehitysympäristö ja versionhallinta pystytetään heti. Projektin brief kirjoitetaan README:hen, jotta AI-avustaja tukee työtä samasta kontekstista.',
    },
    {
      aihe: 'design-system',
      h: 'Design system koodiin',
      p: 'Värit, typografia ja komponentit syntyvät suoraan koodiin. Muutos yhdessä paikassa näkyy heti kaikkialla.',
    },
    {
      aihe: 'polut',
      h: 'Näkymät ja polut',
      p: 'Käyttäjäpolut rakennetaan kokonaisina etusivulta loppuun asti, ei yksittäisinä ruutuina.',
    },
    {
      aihe: 'data',
      h: 'Data',
      p: 'Realistinen mock-data tekee palvelusta uskottavan jo ennen rajapintaa. Oikea rajapinta kytketään, kun se on valmis.',
    },
    {
      aihe: 'julkaisu',
      h: 'Julkaisu ja iterointi',
      p: 'Palvelu julkaistaan testiympäristöön, ja sidosryhmät ja käyttäjät kokeilevat sitä omilla laitteillaan. Palaverissa sovitut muutokset ovat valmiina seuraavaan palaveriin, ja sama koodi jatkaa tuotantoon.',
    },
  ] satisfies { aihe: PiirrosAihe; h: string; p: string }[],
  benefitsTitle: 'Mitä se muuttaa',
  benefits: [
    { h: 'Kommentoitava asia toimii.', p: 'Asiakas kommentoi palvelua selaimessa, ei kuvaa palvelusta.' },
    {
      h: 'Mikään ei katoa luovutuksessa.',
      p: 'Suunnittelupäätökset ovat jo koodia, joten niitä ei tulkita uudelleen toteutuksessa.',
    },
    { h: 'Design system pysyy totena.', p: 'Dokumentaatio on sama koodi, joka on tuotannossa.' },
  ],
  limitsTitle: 'Rajat',
  limits: [
    { h: 'Konseptointia ei oikaista.', p: 'Ensin ymmärrys ja yhteinen näkemys, sitten koodi.' },
    {
      h: 'AI:n koodi katselmoidaan.',
      p: 'Se toimii, mutta ei aina ole kestävin ratkaisu. Laatu varmistetaan ennen tuotantoa.',
    },
    {
      h: 'AI:n käyttö sovitaan.',
      p: 'Tietoturva, lisenssit ja datan käsittely arvioidaan organisaation kanssa tapauskohtaisesti.',
    },
    {
      h: 'Testijulkaisu pitää sallia.',
      p: 'Jos asiakkaan ympäristö ei salli sitä, ideoita ei voi kokeilla yhdessä.',
    },
    {
      h: 'Yksi työkalu muiden joukossa.',
      p: 'Kaikki projektit eivät hyödy tästä, ja perinteisille prosesseille on edelleen paikkansa.',
    },
  ],
  casesTitle: 'Missä käytetty',
  /** Nimi ja numero tulevat casesta itsestään, ei kopiona tähän. */
  cases: [
    {
      slug: 'colliers',
      p: 'Klikattava runko oli selaimessa ensimmäisinä viikkoina, ja design system syntyi Storybookiin koodina.',
      meta: 'Koko menetelmä',
    },
    {
      slug: 'tama-sivusto',
      p: 'Menetelmän seuraava askel: koodi on ainoa lähde, ja Figma ja AI-työkalut seuraavat sitä tarkistettuina.',
      meta: 'Jatkokehitys',
    },
  ],
};

export default tyotapa;
export type Tyotapa = typeof tyotapa;
