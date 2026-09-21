import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Nav from './Nav';
import fi from '@/content/dictionaries/fi';

/**
 * Navi. Aktiivinen kohta merkitään musteen täydellä sävyllä ja
 * 1 px alleviivauksella — ei värillä.
 */
const meta = {
  title: 'Osiot/Nav',
  component: Nav,
  parameters: {
    /* Täysleveä: hoitaa oman sivupaddinginsa .bleed-utilitylla. */
    bleed: true,
    nextjs: { appDirectory: true, navigation: { pathname: '/fi/tyot/' } },
    docs: {
      description: {
        component: [
          'Mobiilissa linkit siirtyvät koko ruudun valikkoon. Avausnappi on kaksi',
          'hiusviivaa, ei hampurilaisikonia — ikonikirjastoja ei käytetä.',
          '',
          'Valikko sulkeutuu Escillä ja reitin vaihtuessa, lukitsee taustan vierityksen',
          'ja siirtää fokuksen sulkunappiin.',
          '',
          '**Teemanvaihto on tekstinappi**, ei kuvake. Kierto on Auto → Vaalea → Tumma.',
          'Ilman valintaa `data-theme` puuttuu kokonaan, jolloin `light-dark()` seuraa',
          'käyttöjärjestelmää.',
        ].join('\n'),
      },
    },
  },
  args: { locale: 'fi', dict: fi },
} satisfies Meta<typeof Nav>;

export default meta;
type Story = StoryObj<typeof meta>;

/** "Työt" on aktiivinen: musteen täysi sävy + alleviivaus. */
export const Oletus: Story = {};

export const Tumma: Story = { globals: { theme: 'dark' } };

/** Mobiilissa vain tunnus, teemanvaihto ja valikkonappi. */
export const Mobiili: Story = { globals: { viewport: { value: 'base' } } };
