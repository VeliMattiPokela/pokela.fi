import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PreviousWork from './PreviousWork';
import fi from '@/content/dictionaries/fi';
import work from '@/content/work/fi';

/**
 * Aiempi työ. Vanhat projektit eivät saa omia sivuja — ne avautuvat
 * paikallaan, jotta kaksi kärkicasea pitävät huomion.
 */
const meta = {
  title: 'Osiot/PreviousWork',
  component: PreviousWork,
  parameters: {
    /* Täysleveä: hoitaa oman sivupaddinginsa .bleed-utilitylla. */
    bleed: true,
    docs: {
      description: {
        component: [
          'Rivi on listarivin sukulainen: sama viiva, sama käännös, mutta merkkinä + / −',
          'eikä nuolta. Avattu rivi jää käännetyksi, joten tila näkyy myös ilman merkkiä.',
          '',
          '**Vain yksi kerrallaan auki.** Se pitää osion rauhallisena ja tekee vertailusta',
          'mahdotonta — mikä on tarkoitus, koska nämä eivät kilpaile keskenään.',
          '',
          '**Vastuut eroteltu.** Jokaisessa paneelissa on "Vastuullani" ja "Osallistuin"',
          'omina listoinaan. Yksi lista olisi lyhyempi mutta epärehellisempi.',
          '',
          'Toteutus on `<button>` + region eikä `<details>`, koska "vain yksi auki" vaatii',
          'jaetun tilan.',
        ].join('\n'),
      },
    },
  },
  args: { items: work.previous, dict: fi },
} satisfies Meta<typeof PreviousWork>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Suljettuna osio on rauhallinen lista. Klikkaa riviä. */
export const Oletus: Story = {};

export const Tumma: Story = { globals: { theme: 'dark' } };

/** Mobiilissa meta-sarake piilotetaan ja rivi pinoutuu. */
export const Mobiili: Story = { globals: { viewport: { value: 'base' } } };

/**
 * Pivon paneeli sisältää ennen/jälkeen-vertailun — se on ainoa
 * vanha case jossa on omaa todistusaineistoa kuvina.
 */
export const VainPivo: Story = {
  args: { items: work.previous.filter((item) => item.slug === 'pivo') },
};
