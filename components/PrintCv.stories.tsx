import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PrintCv from './PrintCv';

/**
 * Tulostusnappi tietoa-sivulla.
 *
 * Sivustolla ei ole CV-PDF:ää. Se olisi toinen kopio samasta
 * sisällöstä ja eriytyisi sivusta heti kun jompaakumpaa muokataan —
 * sama vika jota vastaan koko projekti on rakennettu. Sen sijaan
 * tietoa-sivu tulostuu CV:ksi samasta lähteestä
 * (`content/cv/fi.ts`), ja selain tekee PDF:n jos lukija haluaa.
 *
 * Nappi käyttää `.btn--ghost`-luokkaa eikä tuo omaa ulkoasua. Se on
 * `<button>` eikä linkki, koska se ei vie mihinkään.
 */
const meta = {
  title: 'Komponentit/PrintCv',
  component: PrintCv,
  parameters: {
    docs: {
      description: {
        component: [
          'Tulostustyylit ovat `styles/print.css`. Ne piilottavat navin, footerin ja',
          'napit, tuovat esiin yhteystiedot, pakottavat `.reveal`-osiot näkyviin ja',
          'estävät työsuhteen katkeamisen kesken projektilistan.',
          '',
          'Värit pakotetaan vaaleiksi `tokens.css`:n `@media print` -lohkossa — muuten',
          'tumma teema tulostaisi valkoisen tekstin valkoiselle paperille, koska selain',
          'ei tulosta taustoja.',
        ].join('\n'),
      },
    },
  },
  args: { label: 'Tulosta CV' },
} satisfies Meta<typeof PrintCv>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Oletus: Story = {};

export const Tumma: Story = { globals: { theme: 'dark' } };

/** Mobiilissa nappi on täysleveä, kuten sen pari "Ota yhteyttä". */
export const Mobiili: Story = { globals: { viewport: { value: 'base' } } };
