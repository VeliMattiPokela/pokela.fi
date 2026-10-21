import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Nav from './Nav';
import { expect, waitFor } from 'storybook/test';
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
    docs: {
      description: {
        component: [
          'Mobiilissa linkit siirtyvät koko ruudun valikkoon. Avausnappi on kaksi',
          'hiusviivaa, ei hampurilaisikonia — ikonikirjastoja ei käytetä.',
          '',
          'Valikko sulkeutuu Escillä ja reitin vaihtuessa, lukitsee taustan vierityksen',
          'ja siirtää fokuksen sulkunappiin.',
          '',
          '**Linkit tulevat propseina**: `links`, `currentPath` ja `as`, kuten ListRow:ssa.',
          'Sivusto antaa ne sanakirjastaan ja Next.js:n reitittimestä (NavRoute).',
          '',
          '**Teemanvaihto on tekstinappi**, ei kuvake. Kierto on Auto → Vaalea → Tumma.',
          'Ilman valintaa `data-theme` puuttuu kokonaan, jolloin `light-dark()` seuraa',
          'käyttöjärjestelmää.',
          '',
          '**Navi väistyy** (päätös 37): alas vieritettäessä se liukuu pois, ylös',
          'vieritettäessä se palaa tiiviinä palkkina sumennetun paperin päällä. Tila',
          'on `data-tila` (perus | tiivis | piilossa) ja Figmassa `Tila`-variantti.',
        ].join('\n'),
      },
    },
  },
  args: {
    brand: fi.meta.siteName,
    brandHref: '/fi/',
    currentPath: '/fi/tyot/',
    links: [
      { href: '/fi/tyot/', label: fi.nav.work },
      { href: '/fi/tyotapa/', label: fi.nav.method },
      { href: '/fi/tietoa/', label: fi.nav.about },
    ],
    contact: {
      label: fi.nav.contact,
      email: fi.footer.email,
      location: fi.footer.location,
      link: { label: fi.footer.linkedin, href: fi.footer.linkedinUrl },
    },
    labels: fi.nav,
  },
} satisfies Meta<typeof Nav>;

export default meta;
type Story = StoryObj<typeof meta>;

/** "Työt" on aktiivinen: musteen täysi sävy + alleviivaus. */
export const Oletus: Story = {};

export const Tumma: Story = { globals: { theme: 'dark' } };

/** Mobiilissa vain tunnus, teemanvaihto ja valikkonappi. */
export const Mobiili: Story = { globals: { viewport: { value: 'base' } } };

/** Ylös vieritettäessä: tiivis palkki sumennetun paperin päällä. */
export const Tiivis: Story = {
  decorators: [
    (Story) => (
      <>
        <Story />
        <div style={{ height: '300vh' }} />
      </>
    ),
  ],
  play: async ({ canvasElement }) => {
    const kehys = canvasElement.querySelector('.nav-kehys')!;
    window.scrollTo(0, 600);
    await waitFor(() => expect(kehys).toHaveAttribute('data-tila', 'piilossa'));
    window.scrollTo(0, 400);
    await waitFor(() => expect(kehys).toHaveAttribute('data-tila', 'tiivis'));
  },
};
