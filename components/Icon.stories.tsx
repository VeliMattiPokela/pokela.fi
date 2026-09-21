import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Icon, { ICON_NAMES, type IconSize } from './Icon';

/**
 * Ikonisto luetaan komponentista (`ICON_NAMES`), ei kirjoiteta tähän.
 * Uusi merkki Icon.tsx:ään ilmestyy tälle sivulle itsestään.
 */
const meta = {
  title: 'Perusta/Ikonit',
  /* Id kiinnitetty ASCII-muotoon kuten muillakin Perusta-sivuilla:
     suorat linkit ovat casen todistusaineistoa, ja generoitu id voi
     muuttua. Tämä sivu asuu components/-kansiossa eikä
     stories/perusta/:ssa, koska sillä on oikea komponentti ja oikeat
     storyt — muut Perusta-sivut ovat pelkkää dokumentaatiota. */
  id: 'perusta-ikonit',
  component: Icon,
  parameters: {
    docs: {
      description: {
        component: [
          'Systeemi ei käytä ikonikirjastoa. Nämä kuusi merkkiä on piirretty itse',
          '16×16-ruudukolle, ja ne käyttävät samaa `--hairline`-viivaa kuin jokainen',
          'reuna sivustolla. Päätteet ovat tylpät ja kulmat terävät, koska `--radius` on 0.',
          '',
          'Viivanpaksuus ei skaalaudu ikonin mukana (`vector-effect: non-scaling-stroke`),',
          'joten hiusviiva on hiusviiva myös 24 pikselin koossa.',
          '',
          'Nuolia on kaksi: `arrow-right` vie sivustolla eteenpäin, `arrow-up-right` ulos.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    name: { options: ICON_NAMES, control: 'select', description: 'Merkki.' },
    size: { options: ['s', 'm', 'l'], control: 'inline-radio', description: '12 / 16 / 24px.' },
    label: { description: 'Nimi ruudunlukijalle. Ilman tätä ikoni on koriste.' },
  },
  args: { name: 'arrow-right', size: 'm' },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Koko ikonisto. */
export const Ikonisto: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-40)' }}>
      {ICON_NAMES.map((name) => (
        <span
          key={name}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-12)' }}
        >
          <Icon name={name} size="l" />
          <span className="meta meta--s">{name}</span>
        </span>
      ))}
    </div>
  ),
};

/** Kolme kokoa. Viiva pysyy samana — vain ruudukko kasvaa. */
export const Koot: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-40)' }}>
      {(['s', 'm', 'l'] as IconSize[]).map((size) => (
        <span
          key={size}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-12)' }}
        >
          <Icon name="plus" size={size} />
          <span className="meta meta--s">{size}</span>
        </span>
      ))}
    </div>
  ),
};

/** Ikoni perii tekstin värin ja istuu perusviivalle. */
export const Tekstissa: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-20)' }}>
      <a href="#" className="btn btn--text" style={{ alignSelf: 'flex-start' }}>
        Katso kaikki työt <Icon name="arrow-right" />
      </a>
      <span className="meta meta--ink">
        LinkedIn <Icon name="arrow-up-right" size="s" />
      </span>
    </div>
  ),
};

export const Tumma: Story = { ...Ikonisto, globals: { theme: 'dark' } };

/** Ikoni on kiinteän kokoinen: mobiilissa rivi taittuu, merkki ei kutistu. */
export const Mobiili: Story = { ...Ikonisto, globals: { viewport: { value: 'base' } } };
