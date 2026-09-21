import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ComponentView, { CodeBlock, FactList } from './ComponentView';
import ListRow from './ListRow';

/**
 * Välilehdet casesivun komponenttinäkymälle.
 *
 * Sisältö tulee propseina valmiiksi renderöitynä, joten tämä
 * komponentti ei tiedä mistään koodin lukemisesta — se on
 * palvelinpuolen asia (lib/source.ts).
 */
const meta = {
  title: 'Komponentit/ComponentView',
  component: ComponentView,
  parameters: {
    docs: {
      description: {
        component: [
          'Oikea `tablist`: nuolinäppäimet vaihtavat välilehteä, Home ja End hyppäävät',
          'päihin, ja vain valittu välilehti on tab-järjestyksessä (roving tabindex).',
          'Paneeli on fokusoitava, jotta näppäimistökäyttäjä pääsee sisältöön suoraan.',
          '',
          'Valittu välilehti merkitään käännetyllä pinnalla, ei värillä.',
          '',
          '**Kokeile näppäimistöllä:** tabulaattori välilehtiin, sitten nuolet.',
        ].join('\n'),
      },
    },
  },
  args: {
    label: 'Esimerkkikomponentti',
    tabs: [],
  },
} satisfies Meta<typeof ComponentView>;

export default meta;
type Story = StoryObj<typeof meta>;

const DEMO_CODE = `<span class="hl">.list-row:hover {
  background: var(--invert-surface);
  color: var(--invert-ink);
}</span>`;

const tabs = [
  {
    id: 'nakyma',
    label: 'Näkymä',
    content: (
      <>
        <div className="list-rows cview__demo">
          <ListRow title="Colliers Asunnot" meta="Design, front end, CMS" href="#" />
          <ListRow title="Blokbook" meta="Käännetty tila" href="#" className="invert" />
        </div>
        <FactList
          items={[
            { label: 'Tilat', value: 'default · hover · focus-visible · :active' },
            { label: 'Responsiivisuus', value: 'Mobiilissa pinottu, 600 px:stä rivi' },
          ]}
        />
      </>
    ),
  },
  {
    id: 'koodi',
    label: 'Koodi',
    content: (
      <CodeBlock
        path="styles/components/list-row.css"
        html={DEMO_CODE}
        lines={4}
        note="Casesivulla tämä luetaan oikeasta tiedostosta build-aikana. Storyssa se on kiinteä näyte, koska tiedostojärjestelmää ei ole selaimessa."
      />
    ),
  },
  {
    id: 'storybook',
    label: 'Storybook',
    content: <FactList items={[{ label: 'Storyt', value: 'Oletus · Lista · Mobiili · Tumma' }]} />,
  },
];

export const Oletus: Story = {
  args: { tabs },
};

/**
 * Alarivin kolme tilaa: julkaistu (linkki), olemassa mutta ei
 * julkisessa osoitteessa, ja ei vielä olemassa. "Tulossa" ei saa
 * tarkoittaa kahta eri asiaa.
 */
export const ArtefaktiLinkit: Story = {
  args: {
    tabs,
    links: [
      { label: 'Storybook', href: 'https://storybook.js.org', state: 'julkaistu', note: '' },
      {
        label: 'Figma',
        href: null,
        state: 'olemassa',
        note: 'tehty — ei vielä julkisessa osoitteessa',
      },
      { label: 'GitHub', href: null, state: 'tulossa', note: 'tulossa' },
    ],
  },
};

/** Mobiilissa välilehdet rivittyvät, paneeli pysyy samana. */
export const Mobiili: Story = {
  globals: { viewport: { value: 'base' } },
  args: { tabs },
};

export const Tumma: Story = {
  globals: { theme: 'dark' },
  args: { tabs },
};
