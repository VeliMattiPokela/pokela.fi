import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Ikkuna from './Ikkuna';

/**
 * Paikka, jossa työn voi tarkistaa: selainikkuna ja kaaviokuva.
 */
const meta = {
  title: 'Komponentit/Ikkuna',
  component: Ikkuna,
  parameters: {
    docs: {
      description: {
        component: [
          'Pieni selainikkuna, jonka yläpalkissa on osoite ja sisällä työkalun kaaviokuva.',
          'Kuva piirretään koodissa tokeneista, joten se vaihtaa teemaa sivun mukana.',
          'Case 03:n Avaa ja tarkista -osio käyttää tätä.',
        ].join('\n'),
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 560 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    aihe: 'storybook',
    number: '01',
    title: 'Storybook',
    body: 'Komponentit, tokenit ja tilat selaimessa. Sama koodi, jota tämä sivu käyttää.',
    host: 'pokela-storybook.netlify.app',
    note: 'Avaa',
    state: 'julkaistu',
    href: '#',
  },
} satisfies Meta<typeof Ikkuna>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Julkaistu: Story = {};

export const Figma: Story = {
  args: {
    aihe: 'figma',
    number: '02',
    title: 'Figma-tiedosto',
    body: 'Sama kirjasto Figmassa: komponentit, variantit ja tokenit.',
    host: 'figma.com',
  },
};

export const Olemassa: Story = {
  args: {
    aihe: 'code-connect',
    number: '03',
    title: 'Code Connect -kytkennät',
    body: 'Määrittelyt jotka kertovat Figmalle, mikä koodikomponentti vastaa mitä.',
    host: 'Figma Dev Mode',
    note: 'Tehty · julkaistu Figmaan',
    state: 'olemassa',
    href: null,
  },
};

export const Tulossa: Story = {
  args: {
    aihe: 'repo',
    number: '04',
    title: 'Repo',
    body: 'Koko sivusto, tokenit, build ja tarkistukset.',
    host: 'github.com',
    note: 'Tulossa',
    state: 'tulossa',
    href: null,
  },
};

export const Tumma: Story = { globals: { theme: 'dark' } };

export const Mobiili: Story = { globals: { viewport: { value: 'base' } } };
