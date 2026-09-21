import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CaseBlock from './CaseBlock';

/**
 * Casesivut kootaan lohkoista. Tämä tiedosto näyttää ne kaikki
 * erikseen — aiemmin yhtäkään ei ollut koskaan renderöity testissä
 * eikä tarkistettu saavutettavuuden osalta, vaikka jokainen muu
 * komponentti käy sen läpi.
 *
 * Puuttuminen oli piilossa väärän poikkeusperustelun takana:
 * `CaseBlocks.tsx`illa luki "lohkot ovat omia komponenttejaan", mikä
 * ei pitänyt paikkaansa. Kone ei voi todentaa proosaa.
 *
 * Kolme lohkoa puuttuu tästä: `artefacts`, `checks` ja `component`
 * lukevat tiedostojärjestelmää build-aikana eivätkä voi ajaa
 * selaimessa. Ne ovat CaseBlockDerived.tsx:ssä.
 */
const meta = {
  title: 'Osiot/CaseBlock',
  component: CaseBlock,
  parameters: {
    bleed: true,
    docs: {
      description: {
        component: [
          'Yhdeksän lohkoa, joista casesivu kootaan. Uusi case ei tuo mukanaan uutta',
          'layoutia — se on lista näitä.',
          '',
          'Lohko piirtää sen mitä sille annetaan. Ne kolme jotka lukevat totuuden',
          'tiedostojärjestelmästä (artefaktit, tarkistukset, komponenttinäkymä) ovat',
          'erillään, koska `node:fs` ei toimi selaimessa.',
        ].join('\n'),
      },
    },
  },
  args: { locale: 'fi' as const, slug: 'colliers' },
} satisfies Meta<typeof CaseBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tekstiosio: valinnainen iso väite + nimettyjä kappaleita. */
export const Teksti: Story = {
  args: {
    block: {
      kind: 'text',
      label: 'Lähtötilanne',
      lead: 'Vanha palvelu oli vanhentunut kolmella tavalla yhtä aikaa.',
      items: [
        { h: 'Haku', p: 'Asuntoja selattiin listana, jossa ei ollut karttaa eikä suodattimia.' },
        { h: 'Vuokraus', p: 'Hakemus tehtiin PDF-lomakkeella, joka lähetettiin sähköpostilla.' },
      ],
    },
  },
};

/** Yksittäinen kuva. */
export const Kuva: Story = {
  args: { block: { kind: 'media', media: { ratio: '4:3', caption: 'Asuntohaku, karttanäkymä' } } },
};

/** Kuvapari, esim. luuranko → julkaisu. */
export const Kuvapari: Story = {
  args: {
    block: {
      kind: 'pair',
      label: 'Ennen ja jälkeen',
      items: [
        { ratio: '4:3', caption: 'Luurankoversio', label: 'Viikko 1' },
        { ratio: '4:3', caption: 'Julkaistu näkymä', label: 'Viikko 24' },
      ],
    },
  },
};

/** Käännetty väitepalkki. Yksi per case. */
export const Vaitepalkki: Story = {
  args: {
    block: {
      kind: 'band',
      title: 'Design ja toteutus samoissa käsissä.',
      body: 'Kun sama ihminen piirtää ja koodaa, käännösvaihetta ei ole — eikä sitä kohtaa jossa idea vesittyy.',
    },
  },
};

/** Kolme kuvaa otsikoin. */
export const Kolmikko: Story = {
  args: {
    block: {
      kind: 'trio',
      label: 'Mitä rakensin',
      title: 'Kolme näkymää, yksi järjestelmä',
      items: [
        { media: { ratio: '4:5', caption: 'Haku' }, h: 'Asuntohaku', p: 'Kartta ja suodattimet samassa näkymässä.' },
        { media: { ratio: '4:5', caption: 'Kohde' }, h: 'Kohdesivu', p: 'Pohjakuva, hinta ja vapautumispäivä yhdellä silmäyksellä.' },
        { media: { ratio: '4:5', caption: 'Hakemus' }, h: 'Verkkovuokraus', p: 'Hakemus loppuun ilman liitteitä.' },
      ],
    },
  },
};

/** Numeroitu vastuualuelista. */
export const Vastuulista: Story = {
  args: {
    block: {
      kind: 'scope',
      label: 'Rooli',
      title: 'Mistä vastasin',
      body: 'Kuuden kuukauden projekti, jossa design ja front end olivat samoissa käsissä.',
      items: ['Konseptointi ja käyttäjäpolut', 'Visuaalinen suunnittelu', 'Front end -toteutus', 'Sisällönhallinnan mallinnus'],
    },
  },
};

/** Numeroitu putki, ei linkkejä. */
export const Putki: Story = {
  args: {
    block: {
      kind: 'steps',
      label: 'Putki',
      title: 'Viisi askelta, jokainen avattavissa',
      body: 'Ketju kulkee tokeneista Figman komponenttiin.',
      items: [
        { h: 'Tokenit', p: 'CSS-muuttujat, light ja dark. Yksi tiedosto.' },
        { h: 'Komponentti koodissa', p: 'Lukee tokenit, ei kovakoodattuja arvoja.' },
        { h: 'Story', p: 'Dokumentaatio ja tilat. Syntyy komponentista.' },
      ],
    },
  },
};

/** Kaksi rinnakkaista vaihtoehtoa. */
export const Vaihtoehdot: Story = {
  args: {
    block: {
      kind: 'choices',
      label: 'Kaksi tapaa aloittaa',
      title: 'Asiakkaan prosessi ratkaisee',
      items: [
        { h: 'Koodi ensin', p: 'Nopein reitti. Ei käännösvaihetta.', note: 'Toimii kun tiimi on pieni.' },
        { h: 'Figma ensin', p: 'Organisaatio pääsee mukaan.', note: 'Useimman asiakkaan todellisuus.' },
      ],
    },
  },
};

/** Täydennettävä kohta. Näkyy vain kehityksessä, ei koskaan tuotannossa. */
export const Taydennettava: Story = {
  args: { block: { kind: 'todo', text: 'Asiakkaan sitaatti puuttuu' } },
};

export const Tumma: Story = { ...Vaitepalkki, globals: { theme: 'dark' } };

/** Mobiilissa kolmikko pinoutuu ja kuvapari menee allekkain. */
export const Mobiili: Story = { ...Kolmikko, globals: { viewport: { value: 'base' } } };
