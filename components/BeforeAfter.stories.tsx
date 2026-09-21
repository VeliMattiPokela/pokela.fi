import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import BeforeAfter from './BeforeAfter';

/**
 * Signature-komponentti: ainoa paikka jossa sivustolla on oikeaa
 * interaktiota.
 */
const meta = {
  title: 'Komponentit/BeforeAfter',
  component: BeforeAfter,
  parameters: {
    docs: {
      description: {
        component: [
          '"Jälkeen" on pohjalla ja "Ennen" päällä leikattuna `clip-path: inset()`illa.',
          'Jakaja seuraa osoitinta 1:1 — vedon aikana ei ole transitionia, koska pienikin',
          'viive tuntuu heti rikkinäiseltä.',
          '',
          '**Saavutettavuus.** Jakaja on oikea `<input type="range">`, joten se toimii',
          'näppäimistöllä ja ruudunlukijalla ilman omaa näppäinkäsittelyä. Se on',
          'visuaalisesti piilotettu, ja näkyvä kahva piirretään sen päälle',
          '`pointer-events: none` -tilassa. Kokeile: tabulaattori kenttään, nuolinäppäimet.',
          '',
          '**Kuvasuhde tulee lähteestä.** `width`/`height` ovat alkuperäisen kuvan mitat,',
          'joten `object-fit: cover` ei rajaa mitään pois. Kiinteä kuvasuhde leikkaisi',
          'puhelinkaappauksesta alaosan.',
          '',
          'Tämä on toinen kahdesta paikasta joissa keskitys on sallittu.',
        ].join('\n'),
      },
    },
  },
  args: {
    before: '/assets/screen/pivo-ennen.png',
    after: '/assets/screen/pivo-jalkeen.png',
    beforeLabel: 'Ennen',
    afterLabel: 'Jälkeen',
    width: 742,
    height: 1502,
    alt: 'Pivon kirjautumisnäkymä ennen ja jälkeen saavutettavuuskorjausten',
  },
} satisfies Meta<typeof BeforeAfter>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Oikea tapaus: Pivon kirjautuminen ennen ja jälkeen. */
export const Oletus: Story = {
  args: {
    caption:
      'Vaalea teksti kylläisellä gradientilla ei täyttänyt kontrastivaatimuksia, harvennetut versaalit hidastivat lukemista ja syötetyt merkit näkyivät vain ohuina pisteinä.',
  },
};

/** Ilman kuvatekstiä, kun ympäröivä teksti jo selittää vertailun. */
export const IlmanKuvatekstia: Story = {};

export const Mobiili: Story = {
  globals: { viewport: { value: 'base' } },
  args: {
    caption: 'Sama ele kosketuksella. `touch-action: none` estää sivun vierimisen vedon aikana.',
  },
};

export const Tumma: Story = {
  globals: { theme: 'dark' },
  args: {
    caption:
      'Merkinnät kääntyvät teeman mukana: "Ennen" on käännetyllä pinnalla, "Jälkeen" paperilla.',
  },
};
